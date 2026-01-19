import { NextFunction, Request, Response } from "express";

import {
    ForgotPasswordSendType,
    ForgotPasswordSetType,
} from "../interfaces/auth.interfaces";
import { ITokenPayload } from "../interfaces/token.interfaces";
import { IActionTokenPayload } from "../interfaces/token-action.interfaces";
import {
    ChangePasswordDtoType,
    SingInDtoType,
    SingUpDtoType,
} from "../interfaces/user.interfaces";
import { authService } from "../services/auth.service";
import { userService } from "../services/user.service";

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
            res.status(200).json(result);
        } catch (e) {
            next(e);
        }
    },
    forgotPasswordSend: async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const dto = req.body as ForgotPasswordSendType;
            await userService.forgotPasswordSend(dto);
            res.sendStatus(204);
        } catch (e) {
            next(e);
        }
    },
    forgotPasswordSet: async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const dto = req.body as ForgotPasswordSetType;
            const result = await userService.forgotPasswordSet(dto);
            res.status(201).json(result);
        } catch (e) {
            next(e);
        }
    },
    verifyAccount: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { userId } = res.locals.jwtPayload as IActionTokenPayload;
            await userService.verifyAccount(userId);
            res.status(201).json({ message: "User verified success" });
        } catch (e) {
            next(e);
        }
    },
    logout: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const refreshToken = res.locals.refreshToken as string;
            await authService.logout(refreshToken);
            res.status(200).json({ message: "Logout sucess" });
        } catch (e) {
            next(e);
        }
    },
    logoutAll: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const jwtPayload = res.locals.jwtPayload as ITokenPayload;
            await authService.logoutAll(jwtPayload);
            res.status(200).json({ message: "Logout from all devices sucess" });
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
    changePassword: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const dto = req.body as ChangePasswordDtoType;
            const { userId } = res.locals.jwtPayload as ITokenPayload;
            const result = await userService.changePassword(dto, userId);
            res.status(201).json(result);
        } catch (e) {
            next(e);
        }
    },
};
