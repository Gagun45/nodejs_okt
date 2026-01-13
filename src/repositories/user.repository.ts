import { User } from "../models/user.model";
import { CreateUserDto, IUser, UpdateUserDto } from "../types/user.types";

export const userRepository = {
    getUsers: async (): Promise<IUser[]> => {
        return await User.find({});
    },
    createUser: async (dto: CreateUserDto): Promise<IUser> => {
        return await User.create(dto);
    },
    getUserById: async (userId: string): Promise<IUser | null> => {
        return await User.findById(userId);
    },
    deleteUserById: async (userId: string): Promise<void | null> => {
        return await User.findByIdAndDelete(userId);
    },
    updateUserById: async (
        userId: string,
        dto: UpdateUserDto,
    ): Promise<IUser | null> => {
        return await User.findByIdAndUpdate(
            userId,
            { $set: dto },
            { new: true },
        );
    },

    resetUsers: async (): Promise<void> => {
        await User.deleteMany({});
    },
};
