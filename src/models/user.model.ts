import { model, Schema } from "mongoose";

import { RoleEnum } from "../enums/role.enum";
import { IUser } from "../interfaces/user.interfaces";

const userSchema = new Schema<IUser>(
    {
        name: { type: String, required: true },
        age: { type: Number, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true, select: false },
        role: { type: String, enum: RoleEnum, default: RoleEnum.USER },
        phone: { type: String, required: false },
        avatar: { type: String, required: false },
        isVerified: { type: Boolean, default: false },
        isDeleted: { type: Boolean, default: false },
    },
    {
        timestamps: true,
        versionKey: false,
    },
);

export const User = model<IUser>("users", userSchema);
