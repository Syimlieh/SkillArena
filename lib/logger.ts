import pino from "pino";

const logger = pino({
  level: process.env.LOG_LEVEL ?? "info",
});

type LogMeta = Record<string, unknown>;

export const createModuleLogger = (moduleName: string) => {
  const child = logger.child({ module: moduleName });
  return {
    logInfo: (message: string, meta?: LogMeta) => (meta ? child.info(meta, message) : child.info(message)),
    logWarn: (message: string, meta?: LogMeta) => (meta ? child.warn(meta, message) : child.warn(message)),
    logError: (message: string, meta?: LogMeta) => (meta ? child.error(meta, message) : child.error(message)),
  };
};

export default logger;
