import { DeleteResult, QueryFilter, UpdateQuery } from "mongoose";

import { OrderEnum } from "../enums/order.enum";
import { UserListOrderByEnum } from "../enums/user-list-order.enum";
import {
    IUser,
    IUserListQuery,
    SingUpDtoType,
} from "../interfaces/user.interfaces";
import { OldPassword } from "../models/old-password.model";
import { Token } from "../models/token.model";
import { ActionToken } from "../models/token-action.model";
import { User } from "../models/user.model";

export const userRepository = {
    getUsers: async (query: IUserListQuery): Promise<[IUser[], number]> => {
        const { limit, page, order, orderBy, search } = query;

        const filterObj: QueryFilter<IUser> = {};
        if (search) {
            filterObj.name = { $regex: search, $options: "i" };
        }

        const skip = limit * (page - 1);

        const sortObj: Record<string, 1 | -1> = {};
        switch (orderBy) {
            case UserListOrderByEnum.NAME:
                sortObj.name = order === OrderEnum.DESC ? -1 : 1;
                break;
            case UserListOrderByEnum.AGE:
                sortObj.age = order === OrderEnum.DESC ? -1 : 1;
                break;
            default:
                sortObj.createdAt = -1;
        }
        return await Promise.all([
            User.find(filterObj).sort(sortObj).limit(limit).skip(skip),
            User.countDocuments(filterObj),
        ]);
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
        params: UpdateQuery<IUser>,
    ): Promise<IUser | null> => {
        return await User.findByIdAndUpdate(userId, params, { new: true });
    },

    reset: async (): Promise<void> => {
        await User.deleteMany({});
        await Token.deleteMany({});
        await ActionToken.deleteMany({});
        await OldPassword.deleteMany({});
    },
};
