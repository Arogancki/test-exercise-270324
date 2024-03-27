import { Application } from "express";
import * as bodyParser from "body-parser";
import { helmet, loggerMiddleware } from "../middlewares";
import { Logger } from "pino";

interface ExpressServerFactoryArgs {
    logger: Logger;
    server: Application;
}

export default async function expressServerFactory({ logger, server }: ExpressServerFactoryArgs) {
    server.use(helmet(server));
    server.use(bodyParser.json());
    server.use(bodyParser.urlencoded({ extended: true }));
    server.use(loggerMiddleware(logger));
}
