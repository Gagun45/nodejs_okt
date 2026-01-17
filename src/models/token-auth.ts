import { model, Schema, Types } from "mongoose";

import { IAuthToken } from "../types/token.types";
import { User } from "./user.model";

const tokenSchema = new Schema(
    {
        accessToken: { type: String, required: true },
        refreshToken: { type: String, required: true },
        userId: { type: Types.ObjectId, required: true, ref: User },
    },
    {
        timestamps: true,
        versionKey: false,
    },
);

export const AuthToken = model<IAuthToken>("tokens", tokenSchema);
