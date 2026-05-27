import http from "node:http";
import { logger } from "@repo/logger";
import { closeDb } from "@repo/database";
import { app as expressApplication } from "./server";
import { startSessionCleanupJob } from "./jobs/session-cleanup";

import { env } from "./env";

const SHUTDOWN_TIMEOUT_MS = 15_000;
const DRAIN_POLL_MS = 250;

async function init() {
  const server = http.createServer(expressApplication);
  const PORT: number = env.PORT ? +env.PORT : 8000;

  server.listen(PORT, () => {
    logger.info(`http server is running on PORT ${PORT}`);
  });

  // Background jobs.
  const sessionCleanup = startSessionCleanupJob();

  let shuttingDown = false;
  const shutdown = async (signal: string) => {
    if (shuttingDown) return;
    shuttingDown = true;
    logger.info(`[shutdown] received ${signal}, draining connections...`);

    // Hard ceiling. If we can't drain inside this window we exit hot.
    const forceExit = setTimeout(() => {
      logger.error("[shutdown] graceful drain timed out, forcing exit");
      process.exit(1);
    }, SHUTDOWN_TIMEOUT_MS);
    forceExit.unref();

    // Stop background timers immediately so they don't open new DB queries
    // while we're trying to drain.
    sessionCleanup.stop();

    // Stop accepting new connections. server.close() resolves when ALL
    // existing connections close on their own. We help it along by closing
    // idle ones explicitly, then poll until in-flight requests finish.
    server.close((err) => {
      if (err) logger.error(`[shutdown] http server close error: ${err.message}`);
    });
    server.closeIdleConnections?.();

    // Poll until no live HTTP sockets remain (or the force-exit fires).
    await new Promise<void>((resolve) => {
      const check = () => {
        server.getConnections((err, count) => {
          if (err || !count) return resolve();
          setTimeout(check, DRAIN_POLL_MS).unref();
        });
      };
      check();
    });

    try {
      await closeDb();
    } catch (err) {
      logger.error(`[shutdown] db pool close error: ${(err as Error).message}`);
    }

    logger.info("[shutdown] drain complete");
    process.exit(0);
  };

  process.on("SIGTERM", () => void shutdown("SIGTERM"));
  process.on("SIGINT", () => void shutdown("SIGINT"));

  process.on("unhandledRejection", (reason) => {
    logger.error(`[unhandledRejection] ${(reason as Error)?.stack ?? String(reason)}`);
  });
  process.on("uncaughtException", (err) => {
    logger.error(`[uncaughtException] ${err.stack ?? err.message}`);
    void shutdown("uncaughtException");
  });
}

init().catch((err) => {
  logger.error(`Error starting http server`, { err });
  process.exit(1);
});
