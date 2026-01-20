import { DeleteResult, QueryFilter } from "mongoose";

import {
    IUser,
    SingUpDtoType,
    UpdateUserDtoType,
} from "../interfaces/user.interfaces";
import { OldPassword } from "../models/old-password.model";
import { Token } from "../models/token.model";
import { ActionToken } from "../models/token-action.model";
import { User } from "../models/user.model";

export const userRepository = {
    getAll: async (): Promise<IUser[]> => {
        return await User.find({});
    },
    create: async (dto: SingUpDtoType): Promise<IUser> => {
        return await User.create(dto);
    },
    getById: async (userId: string): Promise<IUser | null> => {
        return await User.findById(userId);
    },
    getByIdWithPassword: async (userId: string): Promise<IUser | null> => {
        return await User.findById(userId).select("+password");
    },
    getOne: async (filter: QueryFilter<IUser>): Promise<IUser | null> => {
        return await User.findOne(filter);
    },
    getOneWithPassword: async (
        filter: QueryFilter<IUser>,
    ): Promise<IUser | null> => {
        return await User.findOne(filter).select("+password");
    },
    deleteById: async (userId: string): Promise<DeleteResult | null> => {
        return await User.findByIdAndDelete(userId);
    },
    updateById: async (
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
        await Token.deleteMany({});
        await ActionToken.deleteMany({});
        await OldPassword.deleteMany({});
    },
};
