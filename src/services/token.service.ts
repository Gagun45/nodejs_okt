import jsonwebtoken from "jsonwebtoken";

import { config } from "../config/config";
import { TokenTypesEnum } from "../enums/token-types.enum";
import { ApiError } from "../errors/api-error";
import {
    IAuthToken,
    ITokenPair,
    ITokenPayload,
} from "../interfaces/token-auth.interfaces";
import { tokenRepository } from "../repositories/token.repository";

export const tokenService = {
    findByParams: async (params: Partial<IAuthToken>): Promise<IAuthToken> => {
        const res = await tokenRepository.findByParams(params);
        if (!res) throw new ApiError("Token not valid", 401);
        return res;
    },
    save: async (tokens: ITokenPair, userId: string) => {
        await tokenRepository.save(tokens, userId);
    },
    deleteOne: async (params: Partial<IAuthToken>) => {
        await tokenRepository.deleteOne(params);
    },
    deleteMany: async (params: Partial<IAuthToken>) => {
        await tokenRepository.deleteMany(params);
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
        switch (tokenType) {
            case TokenTypesEnum.ACCESS:
                await tokenService.findByParams({ accessToken: token });
                break;
            case TokenTypesEnum.REFRESH:
                await tokenService.findByParams({ refreshToken: token });
                break;
            default:
                throw new ApiError("Invalid token type", 400);
        }

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
