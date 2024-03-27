import { Logger } from "pino";
import express, { Router } from "express";
import { Application } from "express";
import middlewaresFactory from "./middlewaresFactory";
import { asValue } from "awilix";
import { DependencyContainer, Types } from "../utils/dependency";
import env from "../configs/env";
import Database from "../utils/helpers/database";
import Lock from "../utils/helpers/lock";

interface ExpressServerFactoryArgs {
    apiRouter: Router;
    logger: Logger;
}

export default async function expressServerFactory({ logger, apiRouter }: ExpressServerFactoryArgs) {
    const application = express();

    const port = env.SERVER_PORT;

    const dependencyContainer = DependencyContainer.getInstance();
    
    (dependencyContainer.resolve(Types.Database) as Database).init();

    dependencyContainer.register<Application>(Types.Server, asValue(application));

    await middlewaresFactory(dependencyContainer.cradle);
    application.use(apiRouter);

    return {
        application,
        listen: () => new Promise((resolve) => {
            application.listen(port, () => {
                logger.info(`Express server has started on port ${port}`);
                resolve(application);
            });
        })
    };
}
