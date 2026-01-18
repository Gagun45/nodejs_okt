import jwt from "jsonwebtoken";

import { config } from "../config/config";
import { ActionTokenTypesEnum } from "../enums/action-token-types.enum";
import { ApiError } from "../errors/api-error";
import { ITokenPayload } from "../interfaces/token.interfaces";
import {
    IActionToken,
    IActionTokenPayload,
} from "../interfaces/token-action.interfaces";
import { actionTokenRepository } from "../repositories/action-token.repository";

export const actionTokenService = {
    save: async (actionToken: IActionToken): Promise<IActionToken> => {
        return await actionTokenRepository.save(actionToken);
    },
    deleteMany: async (params: Partial<IActionToken>): Promise<void> => {
        return await actionTokenRepository.deleteMany(params);
    },
    findOne: async (params: Partial<IActionToken>): Promise<IActionToken> => {
        const existingToken = await actionTokenRepository.findOne(params);
        if (!existingToken) throw new ApiError("Token invalid", 401);
        return existingToken;
    },
    verify: async (
        actionToken: string,
        type: ActionTokenTypesEnum,
    ): Promise<ITokenPayload> => {
        return await actionTokenRepository.verify(actionToken, type);
    },
    generate: (
        payload: IActionTokenPayload,
        type: ActionTokenTypesEnum,
    ): string => {
        let secret = "";
        let expiresIn = 0;
        switch (type) {
            case ActionTokenTypesEnum.FORGOT_PASSWORD:
                secret = config.JWT_FORGOT_PASSWORD_SECRET;
                expiresIn = config.JWT_FORGOT_PASSWORD_EXPIRATION;
                break;
            default:
                throw new ApiError("Invalid token type", 400);
        }
        return jwt.sign(payload, secret, {
            expiresIn,
        });
    },
};
