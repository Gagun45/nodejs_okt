import jwt from "jsonwebtoken";
import { DeleteResult, QueryFilter } from "mongoose";

import { config } from "../config/config";
import { ActionTokenTypesEnum } from "../enums/action-token-types.enum";
import { ApiError } from "../errors/api-error";
import { ITokenPayload } from "../interfaces/token.interfaces";
import { IActionToken } from "../interfaces/token-action.interfaces";
import { ActionToken } from "../models/token-action.model";

export const actionTokenRepository = {
    save: async (actionToken: IActionToken): Promise<IActionToken> => {
        return await ActionToken.create(actionToken);
    },
    findOne: async (
        filter: QueryFilter<IActionToken>,
    ): Promise<IActionToken | null> => {
        return await ActionToken.findOne(filter);
    },
    deleteMany: async (
        filter: QueryFilter<IActionToken>,
    ): Promise<DeleteResult> => {
        return await ActionToken.deleteMany(filter);
    },

    verifyJwt: async (
        actionToken: string,
        type: ActionTokenTypesEnum,
    ): Promise<ITokenPayload> => {
        try {
            let secret = "";
            switch (type) {
                case ActionTokenTypesEnum.FORGOT_PASSWORD:
                    secret = config.JWT_FORGOT_PASSWORD_SECRET;
                    break;
                case ActionTokenTypesEnum.VERIFY_ACCOUNT:
                    secret = config.JWT_VERIFY_ACCOUNT_SECRET;
                    break;
                default:
                    throw new ApiError("Invalid action token type", 400);
            }
            return jwt.verify(actionToken, secret) as ITokenPayload;
        } catch {
            throw new ApiError("Token invalid", 401);
        }
    },
};
