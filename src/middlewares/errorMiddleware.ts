import { NextFunction, Request, Response } from "express";

const serviceErrorToStatusCode = {
    unauthorized: 401,
    forbidden: 403,
    not_found: 404,
    conflict: 409,
    unprocessable_entity: 422
};

export function errorHandlerMiddleware(error: {type: string, message: string}, req: Request, res: Response, next: NextFunction) {
    console.log("err ",error);
    if(error.type) {
        return res.status(serviceErrorToStatusCode[error.type]).send(error.message);
    }
    
    return res.sendStatus(500);
}

function unauthorized(message: string) {
    return {type: "unauthorized", message};
}

function forbidden(message : string) {
    return {type: "forbidden", message};
}

function conflict(message : string) {
    return {type: "conflict", message};
}

function notFound(message : string) {
    return {type: "not_found", message};
}

function unprocessableEntity(message : string){
    return {type: "unprocessable_entity", message};
}

const errorHandler = {
    errorHandlerMiddleware,
    unauthorized,
    forbidden,
    conflict,
    notFound, 
    unprocessableEntity
}

export default errorHandler;