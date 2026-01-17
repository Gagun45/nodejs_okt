import { model, Schema, Types } from "mongoose";

import { ActionTokenTypesEnum } from "../enums/action-token-types.enum";
import { IActionTokenDB } from "../types/action-token.types";
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

export const ActionToken = model<IActionTokenDB>(
    "action-tokens",
    actionTokenSchema,
);
