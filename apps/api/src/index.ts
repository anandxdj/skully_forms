import http from "node:http";
import { logger } from "@repo/logger";
import { closeDb } from "@repo/database";
import { app as expressApplication } from "./server";

import { env } from "./env";

const SHUTDOWN_TIMEOUT_MS = 15_000;

async function init() {
  const server = http.createServer(expressApplication);
  const PORT: number = env.PORT ? +env.PORT : 8000;

  server.listen(PORT, () => {
    logger.info(`http server is running on PORT ${PORT}`);
  });

  let shuttingDown = false;
  const shutdown = async (signal: string) => {
    if (shuttingDown) return;
    shuttingDown = true;
    logger.info(`[shutdown] received ${signal}, draining connections...`);

    const forceExit = setTimeout(() => {
      logger.error("[shutdown] graceful drain timed out, forcing exit");
      process.exit(1);
    }, SHUTDOWN_TIMEOUT_MS);
    forceExit.unref();

    await new Promise<void>((resolve) => {
      server.close((err) => {
        if (err) logger.error(`[shutdown] http server close error: ${err.message}`);
        resolve();
      });
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
