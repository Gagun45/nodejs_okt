import { Token } from "../models/token.model";
import { IToken } from "../types/token.types";

export const tokenRepository = {
    create: async (dto: Omit<IToken, "role">): Promise<IToken> => {
        return await Token.create(dto);
    },
    findByParams: async (params: Partial<IToken>): Promise<IToken | null> => {
        return await Token.findOne(params);
    },
};
