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

export type CreateUserDtoType = Pick<
    IUser,
    "name" | "age" | "email" | "password"
>;
export type UpdateUserDtoType = Partial<CreateUserDtoType>;
