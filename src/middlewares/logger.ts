import expressPino from "express-pino-logger";
import { Logger } from "pino";

export const loggerMiddleware = (logger: Logger) =>
    expressPino({
        logger,
    });
