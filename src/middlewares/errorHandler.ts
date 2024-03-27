import boom from "boom";
import { Request, Response, NextFunction } from "express";
import { Logger } from "pino";

export function getErrorHandler(logger: Logger) {
    return (err: any, req: Request, res: Response, next: NextFunction) => {
        let boomError;
        if (err.isBoom) {
            boomError = err;
        } else if (err.isJoi) {
            boomError = boom.badRequest(err.details.map((d: { message: string }) => d.message).join(", "));
        } else {
            boomError = boom.internal("Internal Server Error");
            logger.error(err);
            logger.error(err.stack);
        }

        return res.status(boomError.output.statusCode).json(boomError.output.payload);
    };
}
