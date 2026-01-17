import { IToken, ITokenPair } from "../interfaces/token.interfaces";
import { Token } from "../models/token.model";

export const tokenRepository = {
    save: async (tokens: ITokenPair, userId: string): Promise<IToken> => {
        return await Token.create({ ...tokens, userId });
    },
    findOne: async (params: Partial<IToken>): Promise<IToken | null> => {
        return await Token.findOne(params);
    },
    deleteOne: async (params: Partial<IToken>): Promise<void> => {
        await Token.deleteOne(params);
    },
    deleteMany: async (params: Partial<IToken>): Promise<void> => {
        await Token.deleteMany(params);
    },
};
