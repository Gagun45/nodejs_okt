import { NextFunction, Request, Response } from "express";

import { userService } from "../services/user.service";
import { CreateUserDto, IUser } from "../types/user.types";
import { parseUserIdOrThrow } from "../validation";

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
            const { name, age } = req.body;
            const newUser = await userService.createUser({ name, age });
            res.status(201).send(newUser);
        } catch (error) {
            next(error);
        }
    },
    getUserById: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = parseUserIdOrThrow(req.params.userId.toString());
            const user = await userService.getUserById(userId);
            res.send(user);
        } catch (e) {
            next(e);
        }
    },
    deleteUserById: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = parseUserIdOrThrow(req.params.userId.toString());
            await userService.deleteUserById(userId);
            res.sendStatus(204);
        } catch (e) {
            next(e);
        }
    },
    putUserById: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = parseUserIdOrThrow(req.params.userId.toString());
            const dto = req.body as CreateUserDto; // validation should be done actually
            const user = await userService.putUserById(userId, dto);
            res.status(201).send(user);
        } catch (e) {
            next(e);
        }
    },
    patchUserById: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = parseUserIdOrThrow(req.params.userId.toString());
            const dto = req.body as Partial<IUser>; // validation should be done actually
            const user = await userService.patchUserById(userId, dto);
            res.status(201).send(user);
        } catch (e) {
            next(e);
        }
    },
    resetUsers: async (req: Request, res: Response, next: NextFunction) => {
        try {
            await userService.resetUsers();
            res.send("users.txt file reseted");
        } catch (e) {
            next(e);
        }
    },
};
