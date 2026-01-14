import jsonwebtoken from "jsonwebtoken";

import { config } from "../config/config";
import { TokenTypesEnum } from "../enums/token-types.enum";
import { TokenPairType, TokenPayloadType } from "../types/token.types";

export const tokenService = {
    generate: (payload: TokenPayloadType): TokenPairType => {
        const accessToken = jsonwebtoken.sign(
            payload,
            config.JWT_ACCESS_SECRET,
            {
                expiresIn: "30m",
            },
        );
        const refreshToken = jsonwebtoken.sign(
            payload,
            config.JWT_REFRESH_SECRET,
            {
                expiresIn: "10d",
            },
        );
        return { accessToken, refreshToken };
    },
    verifyToken: (
        token: string,
        tokenType: TokenTypesEnum,
    ): TokenPayloadType => {
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
        return jsonwebtoken.verify(token, secretKey) as TokenPayloadType;
    },
};
