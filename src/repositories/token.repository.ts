import { AuthToken } from "../models/token-auth";
import { IAuthResponse, IAuthToken, ITokenPair } from "../types/token.types";

export const tokenRepository = {
    save: async (tokens: ITokenPair, userId: string): Promise<IAuthToken> => {
        return await AuthToken.create({ ...tokens, userId });
    },
    findByRefreshToken: async (
        refreshToken: string,
    ): Promise<IAuthResponse | null> => {
        return await AuthToken.findOne({ refreshToken });
    },
    findByAccessToken: async (
        accessToken: string,
    ): Promise<IAuthResponse | null> => {
        return await AuthToken.findOne({ accessToken });
    },
    deleteByRefreshToken: async (refreshToken: string) => {
        return await AuthToken.deleteOne({ refreshToken });
    },
    deleteByUserId: async (userId: string) => {
        return await AuthToken.deleteMany({ userId });
    },
};
