import jwt from "jsonwebtoken";

import { config } from "../config/config";
import { ActionTokenTypesEnum } from "../enums/action-token-types.enum";
import { ApiError } from "../errors/api-error";
import { IActionToken } from "../interfaces/token-action.interfaces";
import { ITokenPayload } from "../interfaces/token-auth.interfaces";
import { actionTokenRepository } from "../repositories/action-token.repository";

export const actionTokenService = {
    save: async (actionToken: IActionToken): Promise<IActionToken> => {
        return await actionTokenRepository.save(actionToken);
    },
    deleteMany: async (params: Partial<IActionToken>): Promise<void> => {
        return await actionTokenRepository.deleteMany(params);
    },
    findOne: async (
        params: Partial<IActionToken>,
    ): Promise<IActionToken | null> => {
        return await actionTokenRepository.findOne(params);
    },
    verify: async (
        actionToken: string,
        type: ActionTokenTypesEnum,
    ): Promise<ITokenPayload> => {
        return await actionTokenRepository.verify(actionToken, type);
    },
    generate: (payload: ITokenPayload, type: ActionTokenTypesEnum): string => {
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
