import { model, Schema, Types } from "mongoose";

import { IOldPassword } from "../interfaces/old-password.interfaces";
import { User } from "./user.model";

const oldPasswordSchema = new Schema<IOldPassword>(
    {
        oldPassword: { type: String, required: true },
        userId: { type: Types.ObjectId, required: true, ref: User },
    },
    {
        timestamps: true,
        versionKey: false,
    },
);

export const OldPassword = model<IOldPassword>(
    "old-passwords",
    oldPasswordSchema,
);
