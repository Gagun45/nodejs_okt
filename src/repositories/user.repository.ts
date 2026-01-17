import {
    IUser,
    SingUpDtoType,
    UpdateUserDtoType,
} from "../interfaces/user.interfaces";
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
    getOneByParams: async (params: Partial<IUser>): Promise<IUser | null> => {
        return await User.findOne(params);
    },
    getOneByParamsWithPassword: async (
        params: Partial<IUser>,
    ): Promise<IUser | null> => {
        return await User.findOne(params).select("+password");
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
        await Token.deleteMany({});
        await ActionToken.deleteMany({});
    },
};
