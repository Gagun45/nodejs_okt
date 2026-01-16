import { Token } from "../models/token.model";
import { ITokenDB, ITokenPair, ITokenResponse } from "../types/token.types";

export const tokenRepository = {
    save: async (tokens: ITokenPair, userId: string): Promise<ITokenDB> => {
        return await Token.create({ ...tokens, userId });
    },
    findByRefreshToken: async (
        refreshToken: string,
    ): Promise<ITokenResponse | null> => {
        return await Token.findOne({ refreshToken });
    },
    findByAccessToken: async (
        accessToken: string,
    ): Promise<ITokenResponse | null> => {
        return await Token.findOne({ accessToken });
    },
    deleteByRefreshToken: async (refreshToken: string) => {
        return await Token.deleteOne({ refreshToken });
    },
    deleteByUserId: async (userId: string) => {
        return await Token.deleteMany({ userId });
    },
};
