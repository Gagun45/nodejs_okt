import { ApiError } from "../errors/api-error";
import {
    IUser,
    SingUpDtoType,
    UpdateUserDtoType,
} from "../interfaces/user.interfaces";
import { userRepository } from "../repositories/user.repository";
import { ITokenPayload } from "../types/token.types";
import { passwordService } from "./password.service";

export const userService = {
    getAll: async (): Promise<IUser[]> => {
        return await userRepository.getAll();
    },
    create: async (dto: SingUpDtoType): Promise<IUser> => {
        const password = await passwordService.hash(dto.password);
        return await userRepository.create({ ...dto, password });
    },
    getById: async (userId: string): Promise<IUser> => {
        const user = await userRepository.getById(userId);
        if (!user) throw new ApiError("User not found", 404);
        return user;
    },
    getByEmail: async (email: string): Promise<IUser> => {
        const user = await userRepository.getByEmail(email);
        if (!user) throw new ApiError("User not found", 404);
        return user;
    },
    getMe: async (payload: ITokenPayload): Promise<IUser> => {
        const user = await userRepository.getById(payload.userId);
        if (!user) throw new ApiError("User not found", 404);
        return user;
    },
    delete: async (userId: string): Promise<void> => {
        const deletedUser = await userRepository.delete(userId);
        if (!deletedUser) throw new ApiError("User not found", 404);
    },
    deleteMe: async (payload: ITokenPayload): Promise<void> => {
        const deletedUser = await userRepository.delete(payload.userId);
        if (!deletedUser) throw new ApiError("User not found", 404);
    },
    update: async (userId: string, dto: UpdateUserDtoType): Promise<IUser> => {
        const user = await userRepository.update(userId, dto);
        if (!user) throw new ApiError("User not found", 404);
        return user;
    },
    updateMe: async (
        payload: ITokenPayload,
        dto: UpdateUserDtoType,
    ): Promise<IUser> => {
        const user = await userRepository.update(payload.userId, dto);
        if (!user) throw new ApiError("User not found", 404);
        return user;
    },
    reset: async (): Promise<void> => {
        await userRepository.reset();
    },
};
