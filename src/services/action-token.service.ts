import jwt from "jsonwebtoken";

import { config } from "../config/config";
import { ActionTokenTypesEnum } from "../enums/action-token-types.enum";
import { ApiError } from "../errors/api-error";
import { ITokenPayload } from "../interfaces/token-auth.interfaces";
import { actionTokenRepository } from "../repositories/action-token.repository";
import { IActionTokenDB } from "../types/action-token.types";

export const actionTokenService = {
    save: async (actionToken: IActionTokenDB): Promise<IActionTokenDB> => {
        return await actionTokenRepository.save(actionToken);
    },
    deleteManyByParams: async (
        params: Partial<IActionTokenDB>,
    ): Promise<void> => {
        return await actionTokenRepository.deleteManyByParams(params);
    },
    verify: async (
        actionToken: string,
        type: ActionTokenTypesEnum,
    ): Promise<ITokenPayload> => {
        const existingToken = await actionTokenRepository.findByParams({
            token: actionToken,
            type,
        });
        if (!existingToken) throw new ApiError("Action token invalid", 400);
        return await actionTokenRepository.verify(actionToken, type);
    },
    generateActionToken: (
        payload: ITokenPayload,
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
