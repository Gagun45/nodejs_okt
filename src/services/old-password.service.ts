import { ApiError } from "../errors/api-error";
import { oldPasswordRepository } from "../repositories/old-password.repository";
import { hashService } from "./hash.service";

export const oldPasswordService = {
    assertNotUsedRecently: async (
        userId: string,
        password: string,
    ): Promise<void> => {
        const oldPasswords = await oldPasswordRepository.findMany({ userId });
        for (const { oldPassword } of oldPasswords) {
            const matched = await hashService.compare(password, oldPassword);
            if (matched)
                throw new ApiError("Password was already used recently", 400);
        }
    },
    save: async (userId: string, password: string): Promise<void> => {
        const hashedPassword = await hashService.hash(password);
        await oldPasswordRepository.save(userId, hashedPassword);
    },
};
