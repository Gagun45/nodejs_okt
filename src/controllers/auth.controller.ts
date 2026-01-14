import { NextFunction, Request, Response } from "express";

import { authService } from "../services/auth.service";
import { ITokenPayload } from "../types/token.types";
import { SingInDtoType, SingUpDtoType } from "../types/user.types";

export const authController = {
    signUp: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const dto = req.body as SingUpDtoType;
            const result = await authService.signUp(dto);
            res.status(201).json(result);
        } catch (e) {
            next(e);
        }
    },
    singIn: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const dto = req.body as SingInDtoType;
            const result = await authService.signIn(dto);
            res.status(201).json(result);
        } catch (e) {
            next(e);
        }
    },
    refreshToken: async (req: Request, res: Response, next: NextFunction) => {
        try {
            // refreshToken and jwtPayload are set in middleware
            const refreshToken = res.locals.refreshToken as string;
            const jwtPayload = res.locals.jwtPayload as ITokenPayload;

            const result = await authService.refreshToken(
                refreshToken,
                jwtPayload.userId,
                jwtPayload.role,
            );
            res.status(201).json(result);
        } catch (e) {
            next(e);
        }
    },
};
