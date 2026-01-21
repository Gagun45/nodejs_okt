import { OrderEnum } from "../enums/order.enum";
import { RoleEnum } from "../enums/role.enum";
import { UserListOrderByEnum } from "../enums/user-list-order.enum";

export interface IUser {
    _id: string;
    name: string;
    age: number;
    email: string;
    password: string;
    role: RoleEnum;
    isVerified: boolean;
    isDeleted: boolean;
    phone?: string;
    avatar?: string;
    createdAt: Date;
    updatedAt: Date;
}

export type SingUpDtoType = Pick<IUser, "name" | "age" | "email" | "password">;
export type SingInDtoType = Pick<IUser, "email" | "password">;
export type UpdateUserDtoType = Partial<IUser>;
export type ChangePasswordDtoType = {
    oldPassword: string;
    newPassword: string;
};

export interface IPublicResDto {
    age: number;
    email: string;
    isVerified: boolean;
    avatar: string | undefined;
    phone: string | undefined;
    name: string;
    role: RoleEnum;
}

export interface IUserListQuery {
    limit: number;
    page: number;
    search?: string;
    order?: OrderEnum;
    orderBy?: UserListOrderByEnum;
}

export interface IUserListResponse {
    data: IPublicResDto[];
    total: number;
}
