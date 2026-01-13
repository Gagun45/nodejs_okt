/* eslint-disable no-console */
import { NextFunction, Request, Response } from "express";

import { ApiError } from "../errors/api-error";

export const errorMiddleware = (
    error: Error | ApiError,
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    console.error(error);

    if (error instanceof ApiError) {
        res.status(error.status).json({ message: error.message });
    } else {
        res.status(500).json({ message: "Internal Server Error" });
    }
};
