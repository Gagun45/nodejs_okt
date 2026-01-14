import { NextFunction, Request, Response } from "express";

import { authService } from "../services/auth.service";
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
};
