import { customErrors } from "../errors/errors";
import { userRepository } from "../repositories/user.repository";
import { CreateUserDto, IUser, UpdateUserDto } from "../types/user.types";

export const userService = {
    getUsers: async (): Promise<IUser[]> => {
        return await userRepository.getUsers();
    },
    createUser: async (dto: CreateUserDto): Promise<IUser> => {
        return await userRepository.createUser(dto);
    },
    getUserById: async (userId: string): Promise<IUser> => {
        const user = await userRepository.getUserById(userId);
        if (!user) throw customErrors.notFound("User");
        return user;
    },
    deleteUserById: async (userId: string): Promise<void> => {
        const deletedUser = await userRepository.deleteUserById(userId);
        if (!deletedUser) throw customErrors.notFound("User");
    },
    updateUserById: async (
        userId: string,
        dto: UpdateUserDto,
    ): Promise<IUser> => {
        const user = await userRepository.updateUserById(userId, dto);
        if (!user) throw customErrors.notFound("User");
        return user;
    },
    resetUsers: async (): Promise<void> => {
        await userRepository.resetUsers();
    },
};
