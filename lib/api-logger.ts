import { createModuleLogger } from "@/lib/logger";

type Handler<TArgs extends unknown[] = unknown[], TResult = Response> = (...args: TArgs) => Promise<TResult>;

export const withApiLogger = <TArgs extends unknown[], TResult extends Response>(
  moduleName: string,
  action: string,
  handler: Handler<TArgs, TResult>
) => {
  const { logInfo, logError } = createModuleLogger(moduleName);

  return (async (...args: TArgs): Promise<TResult> => {
    logInfo(`${action}: start`);
    try {
      const response = await handler(...args);
      const status = (response as Response | undefined)?.status;
      if (typeof status === "number" && status >= 400) {
        logError(`${action}: error`, { status });
      } else {
        logInfo(`${action}: success`, { status });
      }
      return response;
    } catch (error: any) {
      logError(`${action}: error`, { message: error?.message });
      throw error;
    }
  }) as Handler<TArgs, TResult>;
};
