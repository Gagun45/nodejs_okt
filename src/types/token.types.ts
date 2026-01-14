import { RoleEnum } from "../enums/role.enum";
import { IUser } from "./user.types";

export interface ITokenResponse {
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

export interface ITokenDB {
    accessToken: string;
    refreshToken: string;
    userId: string;
}
