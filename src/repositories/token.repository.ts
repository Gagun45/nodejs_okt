import { DeleteResult, QueryFilter } from "mongoose";

import { IToken, ITokenPair } from "../interfaces/token.interfaces";
import { Token } from "../models/token.model";

export const tokenRepository = {
    save: async (tokens: ITokenPair, userId: string): Promise<IToken> => {
        return await Token.create({ ...tokens, userId });
    },
    findOne: async (filter: QueryFilter<IToken>): Promise<IToken | null> => {
        return await Token.findOne(filter);
    },
    findMany: async (filter: QueryFilter<IToken>): Promise<IToken[] | null> => {
        return await Token.find(filter);
    },
    deleteOne: async (filter: QueryFilter<IToken>): Promise<DeleteResult> => {
        return await Token.deleteOne(filter);
    },
    deleteMany: async (filter: QueryFilter<IToken>): Promise<DeleteResult> => {
        return await Token.deleteMany(filter);
    },
};
