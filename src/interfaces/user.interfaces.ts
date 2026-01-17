import { RoleEnum } from "../enums/role.enum";

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
    createdAt: Date;
    updatedAt: Date;
}

export type SingUpDtoType = Pick<IUser, "name" | "age" | "email" | "password">;
export type SingInDtoType = Pick<IUser, "email" | "password">;
export type UpdateUserDtoType = Partial<IUser>;
export type ForgotPasswordSendType = Pick<IUser, "email">;
export type ForgotPasswordSetType = Pick<IUser, "password"> & {
    token: string;
};
