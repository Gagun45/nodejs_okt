import jsonwebtoken from "jsonwebtoken";

import { config } from "../config/config";
import { TokenTypesEnum } from "../enums/token-types.enum";
import { ApiError } from "../errors/api-error";
import {
    IAuthResponse,
    ITokenPair,
    ITokenPayload,
} from "../interfaces/token-auth.interfaces";
import { tokenRepository } from "../repositories/token.repository";

export const tokenService = {
    findByAccessToken: async (accessToken: string): Promise<IAuthResponse> => {
        const res = await tokenRepository.findByAccessToken(accessToken);
        if (!res) throw new ApiError("Token not valid", 401);
        return res;
    },
    findByRefreshToken: async (
        refreshToken: string,
    ): Promise<IAuthResponse> => {
        const res = await tokenRepository.findByRefreshToken(refreshToken);
        if (!res) throw new ApiError("Token not valid", 401);
        return res;
    },
    save: async (tokens: ITokenPair, userId: string) => {
        await tokenRepository.save(tokens, userId);
    },
    deleteByRefreshToken: async (refreshToken: string) => {
        await tokenRepository.deleteByRefreshToken(refreshToken);
    },
    deleteByUserId: async (userId: string) => {
        await tokenRepository.deleteByUserId(userId);
    },
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
    verify: async (
        token: string,
        tokenType: TokenTypesEnum,
    ): Promise<ITokenPayload> => {
        //check if token exists in db. If not - throw error
        await tokenService.findByAccessToken(token);

        //jwt verifying
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
};
