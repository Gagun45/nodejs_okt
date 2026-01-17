import jwt from "jsonwebtoken";

import { config } from "../config/config";
import { ActionTokenTypesEnum } from "../enums/action-token-types.enum";
import { ApiError } from "../errors/api-error";
import { ActionToken } from "../models/action-token.model";
import { IActionTokenDB } from "../types/action-token.types";
import { ITokenPayload } from "../types/token.types";

export const actionTokenRepository = {
    save: async (actionToken: IActionTokenDB): Promise<IActionTokenDB> => {
        return await ActionToken.create({ ...actionToken });
    },
    findByParams: async (
        params: Partial<IActionTokenDB>,
    ): Promise<IActionTokenDB | null> => {
        return await ActionToken.findOne({ ...params });
    },
    deleteManyByParams: async (
        params: Partial<IActionTokenDB>,
    ): Promise<void> => {
        await ActionToken.deleteMany({ ...params });
    },

    verify: async (
        actionToken: string,
        type: ActionTokenTypesEnum,
    ): Promise<ITokenPayload> => {
        let secret = "";
        switch (type) {
            case ActionTokenTypesEnum.FORGOT_PASSWORD:
                secret = config.JWT_FORGOT_PASSWORD_SECRET;
                break;
            default:
                throw new ApiError("Invalid action token type", 400);
        }
        return jwt.verify(actionToken, secret) as ITokenPayload;
    },
};
