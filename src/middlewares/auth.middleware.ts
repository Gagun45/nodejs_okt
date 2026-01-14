import { NextFunction, Request, Response } from "express";

import { TokenTypesEnum } from "../enums/token-types.enum";
import { ApiError } from "../errors/api-error";
import { tokenRepository } from "../repositories/token.repository";
import { tokenService } from "../services/token.service";
import { getBearerToken } from "../utils/helper";

export const authMiddleware = {
    checkAccessToken: async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const accessToken = getBearerToken(req);
            if (!accessToken) {
                throw new ApiError("No token provided", 401);
            }
            const payload = tokenService.verifyToken(
                accessToken,
                TokenTypesEnum.ACCESS,
            );
            const pair = await tokenRepository.findByAccessToken(accessToken);
            if (!pair) throw new ApiError("Token is not valid", 401);
            res.locals.jwtPayload = payload;
            next();
        } catch (e) {
            next(e);
        }
    },
    checkRefreshToken: async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            //extract token
            const refreshToken = getBearerToken(req);
            if (!refreshToken) {
                throw new ApiError("No token provided", 401);
            }

            //validate token
            const jwtPayload = tokenService.verifyToken(
                refreshToken,
                TokenTypesEnum.REFRESH,
            );

            //check if token exists in db
            const existingToken =
                await tokenRepository.findByRefreshToken(refreshToken);
            if (!existingToken) throw new ApiError("Token invalid", 401);

            res.locals.jwtPayload = jwtPayload;
            res.locals.refreshToken = refreshToken;
            next();
        } catch (e) {
            next(e);
        }
    },
};
