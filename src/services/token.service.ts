import jsonwebtoken from "jsonwebtoken";

import { config } from "../config/config";
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
};
