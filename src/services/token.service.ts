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
    findOne: async (params: Partial<IAuthToken>): Promise<IAuthToken> => {
        const res = await tokenRepository.findOne(params);
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
    generatePair: (payload: ITokenPayload): ITokenPair => {
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
    verifyJwt: async (
        token: string,
        tokenType: TokenTypesEnum,
    ): Promise<ITokenPayload> => {
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
