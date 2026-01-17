import { model, Schema, Types } from "mongoose";

import { ActionTokenTypesEnum } from "../enums/action-token-types.enum";
import { IActionToken } from "../interfaces/token-action.interfaces";
import { User } from "./user.model";

const actionTokenSchema = new Schema(
    {
        token: { type: String, required: true },
        type: { type: String, required: true, enum: ActionTokenTypesEnum },
        userId: { type: Types.ObjectId, required: true, ref: User },
    },
    {
        timestamps: true,
        versionKey: false,
    },
);

export const ActionToken = model<IActionToken>(
    "action-tokens",
    actionTokenSchema,
);
