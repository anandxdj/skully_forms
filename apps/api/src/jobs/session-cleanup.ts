import { logger } from "@repo/logger";
import { purgeExpiredSessions } from "@repo/services/auth";

const ONE_DAY_MS = 24 * 60 * 60 * 1000;
const INITIAL_DELAY_MS = 60 * 1000; // first run a minute after boot

/**
 * Schedules a daily session-table purge. Deletes expired sessions and sessions
 * that have been revoked for longer than 7 days. Idempotent: only one timer
 * is created per process. Cancellation is supported for graceful shutdown.
 */
export function startSessionCleanupJob(): { stop: () => void } {
  const run = async () => {
    try {
      const removed = await purgeExpiredSessions();
      if (removed > 0) {
        logger.info(`[session-cleanup] purged ${removed} session row(s)`);
      }
    } catch (err) {
      logger.error(`[session-cleanup] failed: ${(err as Error)?.message ?? err}`);
    }
  };

  const kickoff = setTimeout(() => {
    void run();
  }, INITIAL_DELAY_MS);
  kickoff.unref();

  const daily = setInterval(() => {
    void run();
  }, ONE_DAY_MS);
  daily.unref();

  return {
    stop: () => {
      clearTimeout(kickoff);
      clearInterval(daily);
    },
  };
}
