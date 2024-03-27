import * as jf from "joiful";
import { Response, Request, NextFunction } from "express";
import Validateable from "../classes/validatable";

function validate(payloadType: "body" | "query" | "headers" | "params", validateable: typeof Validateable) {
    return (req: Request, res: Response, next: NextFunction) => {
        const payload = new validateable(req[payloadType]);

        const { error, value } = jf.validate(payload);
        if (error) {
            return next(error);
        }

        req[payloadType] = value;
        return next();
    };
}

export interface IValidator {
    params: (schema: typeof Validateable) => (req: Request, res: Response<any>, next: NextFunction) => void;
    query: (schema: typeof Validateable) => (req: Request, res: Response<any>, next: NextFunction) => void;
    headers: (schema: typeof Validateable) => (req: Request, res: Response<any>, next: NextFunction) => void;
    body: (schema: typeof Validateable) => (req: Request, res: Response<any>, next: NextFunction) => void;
}

export default function validatorFactory() {
    return {
        params: (schema: typeof Validateable) => validate("params", schema),
        query: (schema: typeof Validateable) => validate("query", schema),
        headers: (schema: typeof Validateable) => validate("headers", schema),
        body: (schema: typeof Validateable) => validate("body", schema),
    } as IValidator;
}
