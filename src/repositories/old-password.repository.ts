import { DeleteResult, QueryFilter } from "mongoose";

import { IOldPassword } from "../interfaces/old-password.interfaces";
import { OldPassword } from "../models/old-password.model";

export const oldPasswordRepository = {
    findMany: async (
        params: QueryFilter<IOldPassword>,
    ): Promise<IOldPassword[]> => {
        return await OldPassword.find(params);
    },
    deleteMany: async (
        params: QueryFilter<IOldPassword>,
    ): Promise<DeleteResult> => {
        return await OldPassword.deleteMany(params);
    },
    save: async (
        userId: string,
        hashedPassword: string,
    ): Promise<IOldPassword> => {
        return await OldPassword.create({
            oldPassword: hashedPassword,
            userId,
        });
    },
};
