import { Token } from "../models/token.model";
import { IToken } from "../types/token.types";

export const tokenRepository = {
    create: async (dto: Omit<IToken, "role">) => {
        return await Token.create(dto);
    },
};
