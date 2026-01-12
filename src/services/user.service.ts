import { ApiError } from "../errors/api-error";
import { userRepository } from "../repositories/user.repository";
import { CreateUserDto, IUser } from "../types/user.types";

export const userService = {
    getUsers: async (): Promise<IUser[]> => {
        return await userRepository.getUsers();
    },
    createUser: async (dto: Partial<IUser>): Promise<IUser> => {
        return await userRepository.createUser(dto);
    },
    getUserById: async (userId: number): Promise<IUser> => {
        const user = await userRepository.getUserById(userId);
        if (!user) throw new ApiError("User not found", 404);
        return user;
    },
    deleteUserById: async (userId: number): Promise<void> => {
        await userRepository.deleteUserById(userId);
    },
    putUserById: async (userId: number, dto: CreateUserDto): Promise<IUser> => {
        return await userRepository.putUserById(userId, dto);
    },
    patchUserById: async (
        userId: number,
        dto: Partial<IUser>,
    ): Promise<IUser> => {
        return await userRepository.patchUserById(userId, dto);
    },
    resetUsers: async (): Promise<void> => {
        await userRepository.resetUsers();
    },
};
