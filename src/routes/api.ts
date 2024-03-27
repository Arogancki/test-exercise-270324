import { notFound } from "../middlewares/notFound";
import { getErrorHandler } from "../middlewares/errorHandler";
import { Router } from "express";
import { Logger } from "pino";

interface IRouterArgs {
    characterRouter: Router;
    logger: Logger;
}

export default function createApiRouter({ logger, characterRouter }: IRouterArgs) {
    const router = Router();

    router.use("/api/v1/character", characterRouter);

    router.use("*", notFound);
    router.use(getErrorHandler(logger));

    return router;
}
