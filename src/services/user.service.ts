import { QueryFilter } from "mongoose";

import { ApiError } from "../errors/api-error";
import { ITokenPayload } from "../interfaces/token.interfaces";
import {
    IUser,
    SingUpDtoType,
    UpdateUserDtoType,
} from "../interfaces/user.interfaces";
import { userRepository } from "../repositories/user.repository";
import { hashService } from "./hash.service";

export const userService = {
    getAll: async (): Promise<IUser[]> => {
        return await userRepository.getAll();
    },
    create: async (dto: SingUpDtoType): Promise<IUser> => {
        const password = await hashService.hash(dto.password);
        return await userRepository.create({ ...dto, password });
    },
    getById: async (userId: string): Promise<IUser> => {
        const user = await userRepository.getById(userId);
        if (!user) throw new ApiError("User not found", 404);
        return user;
    },
    getOne: async (filter: QueryFilter<IUser>): Promise<IUser> => {
        const user = await userRepository.getOne(filter);
        if (!user) throw new ApiError("User not found", 404);
        return user;
    },
    getOneWithPassword: async (filter: QueryFilter<IUser>): Promise<IUser> => {
        const user = await userRepository.getOneWithPassword(filter);
        if (!user) throw new ApiError("User not found", 404);
        return user;
    },
    getMe: async (payload: ITokenPayload): Promise<IUser> => {
        const user = await userRepository.getById(payload.userId);
        if (!user) throw new ApiError("User not found", 404);
        return user;
    },
    deleteById: async (userId: string): Promise<void> => {
        const deletedUser = await userRepository.deleteById(userId);
        if (!deletedUser) throw new ApiError("User not found", 404);
    },
    deleteMe: async (payload: ITokenPayload): Promise<void> => {
        const deletedUser = await userRepository.deleteById(payload.userId);
        if (!deletedUser) throw new ApiError("User not found", 404);
    },
    updateById: async (
        userId: string,
        dto: UpdateUserDtoType,
    ): Promise<IUser> => {
        const user = await userRepository.updateById(userId, dto);
        if (!user) throw new ApiError("User not found", 404);
        return user;
    },
    updateMe: async (
        payload: ITokenPayload,
        dto: UpdateUserDtoType,
    ): Promise<IUser> => {
        const user = await userRepository.updateById(payload.userId, dto);
        if (!user) throw new ApiError("User not found", 404);
        return user;
    },
    reset: async (): Promise<void> => {
        await userRepository.reset();
    },
};
