import { NextFunction, Request, Response } from "express";

import { userService } from "../services/user.service";
import { CreateUserDto, UpdateUserDto } from "../types/user.types";

export const userController = {
    getUsers: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const users = await userService.getUsers();
            res.send(users);
        } catch (error) {
            next(error);
        }
    },
    createUser: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const dto = req.body as CreateUserDto;
            const newUser = await userService.createUser(dto);
            res.status(201).send(newUser);
        } catch (error) {
            next(error);
        }
    },
    getUserById: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = String(req.params.userId);
            const user = await userService.getUserById(userId);
            res.send(user);
        } catch (e) {
            next(e);
        }
    },
    deleteUserById: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = String(req.params.userId);
            await userService.deleteUserById(userId);
            res.sendStatus(204);
        } catch (e) {
            next(e);
        }
    },

    updateUserById: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = String(req.params.userId);
            const dto = req.body as UpdateUserDto;
            const user = await userService.updateUserById(userId, dto);
            res.status(201).send(user);
        } catch (e) {
            next(e);
        }
    },
    resetUsers: async (req: Request, res: Response, next: NextFunction) => {
        try {
            await userService.resetUsers();
            res.send("Users collection reseted");
        } catch (e) {
            next(e);
        }
    },
};
