import { RoleEnum } from "../enums/role.enum";

export interface IToken {
    accessToken: string;
    refreshToken: string;
    userId: string;
    role: RoleEnum;
}

export type TokenPayloadType = Pick<IToken, "role" | "userId">;
export type TokenPairType = Pick<IToken, "accessToken" | "refreshToken">;
