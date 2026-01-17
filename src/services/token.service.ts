import jsonwebtoken from "jsonwebtoken";

import { config } from "../config/config";
import { ActionTokenTypesEnum } from "../enums/action-token-types.enum";
import { TokenTypesEnum } from "../enums/token-types.enum";
import { ApiError } from "../errors/api-error";
import { ITokenPair, ITokenPayload } from "../types/token.types";

export const tokenService = {
    generate: (payload: ITokenPayload): ITokenPair => {
        const accessToken = jsonwebtoken.sign(
            payload,
            config.JWT_ACCESS_SECRET,
            {
                expiresIn: config.JWT_ACCESS_EXPIRATION,
            },
        );
        const refreshToken = jsonwebtoken.sign(
            payload,
            config.JWT_REFRESH_SECRET,
            {
                expiresIn: config.JWT_REFRESH_EXPIRATION,
            },
        );
        return { accessToken, refreshToken };
    },
    verifyToken: (token: string, tokenType: TokenTypesEnum): ITokenPayload => {
        let secretKey = "";
        switch (tokenType) {
            case TokenTypesEnum.ACCESS:
                secretKey = config.JWT_ACCESS_SECRET;
                break;
            case TokenTypesEnum.REFRESH:
                secretKey = config.JWT_REFRESH_SECRET;
                break;
            default:
                throw new Error("Invalid token type");
        }
        return jsonwebtoken.verify(token, secretKey) as ITokenPayload;
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
        return jsonwebtoken.sign(payload, secret, {
            expiresIn,
        });
    },
};
