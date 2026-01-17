import { actionTokenRepository } from "../repositories/action-token.repository";
import { IActionTokenDB } from "../types/action-token.types";

export const actionTokenService = {
    save: async (actionToken: IActionTokenDB): Promise<IActionTokenDB> => {
        return await actionTokenRepository.save(actionToken);
    },
};
