import { NextFunction, Request, Response } from "express";

import { TokenTypesEnum } from "../enums/token-types.enum";
import { ApiError } from "../errors/api-error";
import { tokenRepository } from "../repositories/token.repository";
import { tokenService } from "../services/token.service";

export const authMiddleware = {
    checkAccessToken: async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const header = req.headers.authorization;
            const accessToken = header && header.split("Bearer ")[1];
            if (!accessToken) {
                throw new ApiError("No token provided", 401);
            }
            const payload = tokenService.verifyToken(
                accessToken,
                TokenTypesEnum.ACCESS,
            );
            const pair = await tokenRepository.findByParams({ accessToken });
            if (!pair) throw new ApiError("Token is not valid", 401);
            res.locals.jwtPayload = payload;
            next();
        } catch (e) {
            next(e);
        }
    },
};
