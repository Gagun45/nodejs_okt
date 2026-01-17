import { ActionTokenTypesEnum } from "../enums/action-token-types.enum";
import { ActionToken } from "../models/action-token.model";
import { IActionTokenDB } from "../types/action-token.types";

export const actionTokenRepository = {
    save: async (
        token: string,
        userId: string,
        type: ActionTokenTypesEnum,
    ): Promise<IActionTokenDB> => {
        return await ActionToken.create({ token, userId, type });
    },
};
