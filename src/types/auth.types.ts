import { TokenPairType } from "./token.types";
import { IUser } from "./user.types";

export interface ISignUpResponse {
    user: IUser;
    tokens: TokenPairType;
}
export interface ISignInResponse {
    user: IUser;
    tokens: TokenPairType;
}
