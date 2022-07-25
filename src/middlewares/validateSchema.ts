import { ObjectSchema } from "joi";
import { NextFunction, Request, Response } from "express";
import errorHandler from "./errorMiddleware.js";

export default function validateSchemaMiddleware(schema: ObjectSchema) {
    return (req: Request, res: Response, next: NextFunction) => {
        const validation = schema.validate(req.body);
        if (validation.error) throw errorHandler.unprocessableEntity(validation.error.message);

        next();
    };
}