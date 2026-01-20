import { NextFunction, Request, Response } from "express";

export const fileMiddleware = {
    isFileValid: () => {
        return (req: Request, res: Response, next: NextFunction) => {
            try {
                // TODO file middleware validation
                next();
            } catch (e) {
                next(e);
            }
        };
    },
};
