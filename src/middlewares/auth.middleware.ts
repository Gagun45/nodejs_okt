import { NextFunction, Request, Response } from "express";

import { TokenTypesEnum } from "../enums/token-types.enum";
import { ApiError } from "../errors/api-error";
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
            if (!accessToken) throw new ApiError("No token provided", 401);

            const payload = await tokenService.verify(
                accessToken,
                TokenTypesEnum.ACCESS,
            );
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
            const jwtPayload = await tokenService.verify(
                refreshToken,
                TokenTypesEnum.REFRESH,
            );

            res.locals.jwtPayload = jwtPayload;
            res.locals.refreshToken = refreshToken;
            next();
        } catch (e) {
            next(e);
        }
    },
};
