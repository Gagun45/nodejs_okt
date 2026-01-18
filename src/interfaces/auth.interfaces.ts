import { IUser } from "./user.interfaces";

export type ForgotPasswordSendType = Pick<IUser, "email">;
export type ForgotPasswordSetType = Pick<IUser, "password"> & {
    token: string;
};

export type VerifyAccountType = { token: string };
