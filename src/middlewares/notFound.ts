import boom from "boom";
import { Request, Response } from "express";

export function notFound(req: Request, res: Response) {
    const { output } = boom.notFound("API Route not found");

    return res.status(output.statusCode).json(output.payload);
}
