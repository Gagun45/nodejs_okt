import { NextFunction, Request, Response } from "express";

export const tokenMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const authHeader = req.headers.authorization;
        console.log(authHeader);
        next();
    } catch (e) {
        next(e);
    }
};
