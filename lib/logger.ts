import pino from "pino";

const isProd = process.env.NODE_ENV === "production";

const logger = pino({
  level: process.env.LOG_LEVEL ?? (isProd ? "info" : "debug"),
  ...(isProd
    ? {}
    : {
        transport: {
          target: "pino-pretty",
          options: {
            colorize: true,
            translateTime: "SYS:standard",
            ignore: "pid,hostname",
          },
        },
      }),
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
