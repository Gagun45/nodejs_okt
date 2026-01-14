import { User } from "../models/user.model";
import {
    CreateUserDtoType,
    IUser,
    UpdateUserDtoType,
} from "../types/user.types";

export const userRepository = {
    getAll: async (): Promise<IUser[]> => {
        return await User.find({});
    },
    create: async (dto: CreateUserDtoType): Promise<IUser> => {
        return await User.create(dto);
    },
    getById: async (userId: string): Promise<IUser | null> => {
        return await User.findById(userId);
    },
    delete: async (userId: string): Promise<void | null> => {
        return await User.findByIdAndDelete(userId);
    },
    update: async (
        userId: string,
        dto: UpdateUserDtoType,
    ): Promise<IUser | null> => {
        return await User.findByIdAndUpdate(
            userId,
            { $set: dto },
            { new: true },
        );
    },

    reset: async (): Promise<void> => {
        await User.deleteMany({});
    },
};
