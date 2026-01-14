import { customErrors } from "../errors/errors";
import { userRepository } from "../repositories/user.repository";
import {
    CreateUserDtoType,
    IUser,
    UpdateUserDtoType,
} from "../types/user.types";

export const userService = {
    getAll: async (): Promise<IUser[]> => {
        return await userRepository.getAll();
    },
    create: async (dto: CreateUserDtoType): Promise<IUser> => {
        return await userRepository.create(dto);
    },
    getById: async (userId: string): Promise<IUser> => {
        const user = await userRepository.getById(userId);
        if (!user) throw customErrors.notFound("User");
        return user;
    },
    delete: async (userId: string): Promise<void> => {
        const deletedUser = await userRepository.delete(userId);
        if (!deletedUser) throw customErrors.notFound("User");
    },
    update: async (userId: string, dto: UpdateUserDtoType): Promise<IUser> => {
        const user = await userRepository.update(userId, dto);
        if (!user) throw customErrors.notFound("User");
        return user;
    },
    reset: async (): Promise<void> => {
        await userRepository.reset();
    },
};
