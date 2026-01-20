import jwt from "jsonwebtoken";
import { DeleteResult, QueryFilter } from "mongoose";
import ms from "ms";

import { config } from "../config/config";
import { ActionTokenTypesEnum } from "../enums/action-token-types.enum";
import { ApiError } from "../errors/api-error";
import {
    IActionToken,
    IActionTokenPayload,
} from "../interfaces/token-action.interfaces";
import { actionTokenRepository } from "../repositories/action-token.repository";

export const actionTokenService = {
    save: async (actionToken: IActionToken): Promise<IActionToken> => {
        return await actionTokenRepository.save(actionToken);
    },
    deleteMany: async (
        filter: QueryFilter<IActionToken>,
    ): Promise<DeleteResult> => {
        return await actionTokenRepository.deleteMany(filter);
    },
    findOne: async (
        filter: QueryFilter<IActionToken>,
    ): Promise<IActionToken> => {
        const existingToken = await actionTokenRepository.findOne(filter);
        if (!existingToken) throw new ApiError("Token invalid", 401);
        return existingToken;
    },
    verifyJwt: async (
        actionToken: string,
        type: ActionTokenTypesEnum,
    ): Promise<IActionTokenPayload> => {
        return await actionTokenRepository.verifyJwt(actionToken, type);
    },
    generate: (
        payload: IActionTokenPayload,
        type: ActionTokenTypesEnum,
    ): string => {
        let secret = "";
        let expiresIn: ms.StringValue;
        switch (type) {
            case ActionTokenTypesEnum.FORGOT_PASSWORD:
                secret = config.JWT_FORGOT_PASSWORD_SECRET;
                expiresIn =
                    config.JWT_FORGOT_PASSWORD_EXPIRATION as ms.StringValue;
                break;
            case ActionTokenTypesEnum.VERIFY_ACCOUNT:
                secret = config.JWT_VERIFY_ACCOUNT_SECRET;
                expiresIn =
                    config.JWT_VERIFY_ACCOUNT_EXPIRATION as ms.StringValue;
                break;
            default:
                throw new ApiError("Invalid token type", 400);
        }
        return jwt.sign(payload, secret, {
            expiresIn,
        });
    },
};
