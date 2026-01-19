import { QueryFilter } from "mongoose";

import { IOldPassword } from "../interfaces/old-password.interfaces";
import { OldPassword } from "../models/old-password.model";

export const oldPasswordRepository = {
    findMany: async (
        params: QueryFilter<IOldPassword>,
    ): Promise<IOldPassword[]> => {
        return await OldPassword.find(params);
    },
    save: async (userId: string, password: string): Promise<IOldPassword> => {
        return await OldPassword.create({ oldPassword: password, userId });
    },
};
