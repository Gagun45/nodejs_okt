import { RoleEnum } from "../enums/role.enum";
import { IUser } from "./user.interfaces";

export interface IAuthResponse {
    tokens: ITokenPair;
    user: IUser;
}

export interface ITokenPayload {
    userId: string;
    role: RoleEnum;
}
export interface ITokenPair {
    accessToken: string;
    refreshToken: string;
}

export interface IToken {
    _id: string;
    accessToken: string;
    refreshToken: string;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
}
