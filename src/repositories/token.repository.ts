import { IAuthToken, ITokenPair } from "../interfaces/token-auth.interfaces";
import { AuthToken } from "../models/token-auth";

export const tokenRepository = {
    save: async (tokens: ITokenPair, userId: string): Promise<IAuthToken> => {
        return await AuthToken.create({ ...tokens, userId });
    },
    findOne: async (
        params: Partial<IAuthToken>,
    ): Promise<IAuthToken | null> => {
        return await AuthToken.findOne(params);
    },
    deleteOne: async (params: Partial<IAuthToken>): Promise<void> => {
        await AuthToken.deleteOne(params);
    },
    deleteMany: async (params: Partial<IAuthToken>): Promise<void> => {
        await AuthToken.deleteMany(params);
    },
};
