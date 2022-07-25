import { Request, Response, NextFunction} from "express";
import jwt from "jsonwebtoken";
import errorHandler from "./errorMiddleware.js";

export default async function tokenMiddleware(req: Request, res: Response, next: NextFunction) {
    const authorization = req.headers.authorization;
    const token = authorization?.replace("Bearer ", "").trim();

    if (!token) throw errorHandler.unauthorized("Unauthorized user.");

    jwt.verify(token, process.env.SECRET_JWT, (err, decoded: {id: number}) => {
        if (err) throw errorHandler.unauthorized("Unauthorized user.");
        res.locals.userId = decoded.id;
    });
    next();
}