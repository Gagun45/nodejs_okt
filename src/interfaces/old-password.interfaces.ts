import { Types } from "mongoose";

export interface IOldPassword {
    oldPassword: string;
    userId: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}
