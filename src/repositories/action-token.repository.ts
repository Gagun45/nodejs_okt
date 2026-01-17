import { ActionToken } from "../models/action-token.model";
import { IActionTokenDB } from "../types/action-token.types";

export const actionTokenRepository = {
    save: async (actionToken: IActionTokenDB): Promise<IActionTokenDB> => {
        return await ActionToken.create({ ...actionToken });
    },
};
