import { NextFunction, Request, Response } from "express";

import { ActionTokenTypesEnum } from "../enums/action-token-types.enum";
import { TokenTypesEnum } from "../enums/token-types.enum";
import { ApiError } from "../errors/api-error";
import { getBearerToken } from "../helpers/helper";
import { VerifyAccountType } from "../interfaces/auth.interfaces";
import { actionTokenService } from "../services/action-token.service";
import { tokenService } from "../services/token.service";

export const authMiddleware = {
    checkAccessToken: async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const accessToken = getBearerToken(req);
            if (!accessToken) throw new ApiError("No token provided", 401);

            const payload = await tokenService.verifyJwt(
                accessToken,
                TokenTypesEnum.ACCESS,
            );
            await tokenService.findOne({ accessToken });
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
            const jwtPayload = await tokenService.verifyJwt(
                refreshToken,
                TokenTypesEnum.REFRESH,
            );

            await tokenService.findOne({ refreshToken });

            res.locals.jwtPayload = jwtPayload;
            res.locals.refreshToken = refreshToken;
            next();
        } catch (e) {
            next(e);
        }
    },
    checkLogoutRefreshToken: async (
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
            res.locals.refreshToken = refreshToken;
            next();
        } catch (e) {
            next(e);
        }
    },
    checkVerifyAccountToken: async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            //extract token
            const { token } = req.body as VerifyAccountType;
            const type = ActionTokenTypesEnum.VERIFY_ACCOUNT;

            //validate token
            const jwtPayload = await actionTokenService.verifyJwt(token, type);

            await actionTokenService.findOne({ token, type });

            res.locals.jwtPayload = jwtPayload;
            res.locals.actionToken = token;
            next();
        } catch (e) {
            next(e);
        }
    },
};
