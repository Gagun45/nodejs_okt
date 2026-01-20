import { IUser } from "./user.interfaces";

export type ForgotPasswordSendType = Pick<IUser, "email">;
export type ForgotPasswordSetType = { newPassword: string };
