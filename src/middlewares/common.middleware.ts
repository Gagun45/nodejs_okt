import { NextFunction, Request, Response } from "express";
import { ObjectSchema } from "joi";
import { isObjectIdOrHexString } from "mongoose";

import { ApiError } from "../errors/api-error";

export const commonMiddleware = {
    isIdValid: (key: string) => {
        return (req: Request, res: Response, next: NextFunction) => {
            try {
                if (!isObjectIdOrHexString(String(req.params[key]))) {
                    throw new ApiError("Invalid ID", 400);
                }
                next();
            } catch (e) {
                next(e);
            }
        };
    },
    validateBody: (schema: ObjectSchema) => {
        return (req: Request, res: Response, next: NextFunction) => {
            try {
                const { error, value } = schema.validate(req.body, {
                    stripUnknown: true,
                });
                if (error) throw new ApiError("Invalid request body", 400);
                req.body = value;
                next();
            } catch (e) {
                next(e);
            }
        };
    },
};
