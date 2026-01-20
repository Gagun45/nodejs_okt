import { ApiError } from "../errors/api-error";
import { oldPasswordRepository } from "../repositories/old-password.repository";
import { hashService } from "./hash.service";

export const oldPasswordService = {
    assertNotUsedRecently: async (
        userId: string,
        password: string,
    ): Promise<void> => {
        const newHash = await hashService.hash(password);

        const existingPass = await oldPasswordRepository.findOne({
            oldPassword: newHash,
            userId,
        });

        if (existingPass)
            throw new ApiError("Password was already used recently", 400);
    },
    save: async (userId: string, plainPassword: string): Promise<void> => {
        const hashedPassword = await hashService.hash(plainPassword);
        await oldPasswordRepository.save(userId, hashedPassword);
    },
};
