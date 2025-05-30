import { NextFunction, Request, Response } from 'express';


interface ErrorHandlerResponse {
    message: string;
    stack?: string;
}

const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction): void => {
    const statusCode: number = res.statusCode === 200 ? 500 : res.statusCode;
    const response: ErrorHandlerResponse = {
        message: err.message,
    };
    if (process.env.NODE_ENV === 'development') {
        response.stack = err.stack;
    }
    res.status(statusCode).json(response);
    next();
};
    export default errorHandler;