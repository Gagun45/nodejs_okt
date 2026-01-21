import { NextFunction, Request, Response } from "express";
import { UploadedFile } from "express-fileupload";

import { ITokenPayload } from "../interfaces/token.interfaces";
import {
    SingUpDtoType,
    UpdateUserDtoType,
} from "../interfaces/user.interfaces";
import { userPresenter } from "../presenters/user.presenter";
import { userService } from "../services/user.service";

export const userController = {
    getAll: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const users = await userService.getAll();
            const presentedUsers = users.map((user) =>
                userPresenter.toPublicResDto(user),
            );
            res.send(presentedUsers);
        } catch (error) {
            next(error);
        }
    },
    create: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const dto = req.body as SingUpDtoType;
            const newUser = await userService.create(dto);
            const response = userPresenter.toPublicResDto(newUser);
            res.status(201).send(response);
        } catch (error) {
            next(error);
        }
    },
    getById: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = String(req.params.userId);
            const user = await userService.getById(userId);
            const response = userPresenter.toPublicResDto(user);
            res.send(response);
        } catch (e) {
            next(e);
        }
    },
    getMe: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const payload = res.locals.jwtPayload as ITokenPayload;
            const user = await userService.getMe(payload);
            const response = userPresenter.toPublicResDto(user);
            res.send(response);
        } catch (e) {
            next(e);
        }
    },
    delete: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = String(req.params.userId);
            await userService.deleteById(userId);
            res.sendStatus(204);
        } catch (e) {
            next(e);
        }
    },
    deleteMe: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const payload = res.locals.jwtPayload as ITokenPayload;
            await userService.deleteMe(payload);
            res.sendStatus(204);
        } catch (e) {
            next(e);
        }
    },

    update: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = String(req.params.userId);
            const dto = req.body as UpdateUserDtoType;
            const updatedUser = await userService.updateById(userId, dto);
            const response = userPresenter.toPublicResDto(updatedUser);

            res.status(201).send(response);
        } catch (e) {
            next(e);
        }
    },
    updateMe: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const payload = res.locals.jwtPayload as ITokenPayload;
            const dto = req.body as UpdateUserDtoType;
            const updatedUser = await userService.updateMe(payload, dto);
            const response = userPresenter.toPublicResDto(updatedUser);
            res.status(201).send(response);
        } catch (e) {
            next(e);
        }
    },
    uploadAvatar: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const jwtPayload = res.locals.jwtPayload as ITokenPayload;
            const avatar = req.files?.avatar as UploadedFile;
            const updatedUser = await userService.uploadAvatar(
                jwtPayload,
                avatar,
            );
            const response = userPresenter.toPublicResDto(updatedUser);
            res.status(201).json(response);
        } catch (e) {
            next(e);
        }
    },
    resetAvatar: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const jwtPayload = res.locals.jwtPayload as ITokenPayload;
            const updatedUser = await userService.resetAvatar(jwtPayload);
            const response = userPresenter.toPublicResDto(updatedUser);
            res.status(201).json(response);
        } catch (e) {
            next(e);
        }
    },
    reset: async (req: Request, res: Response, next: NextFunction) => {
        try {
            await userService.reset();
            res.send("Users collection reseted");
        } catch (e) {
            next(e);
        }
    },
};
