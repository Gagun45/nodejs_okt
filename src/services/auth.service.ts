import { ApiError } from "../errors/api-error";
import { tokenRepository } from "../repositories/token.repository";
import { userRepository } from "../repositories/user.repository";
import { ISignInResponse, ISignUpResponse } from "../types/auth.types";
import { SingInDtoType, SingUpDtoType } from "../types/user.types";
import { passwordService } from "./password.service";
import { tokenService } from "./token.service";
import { userService } from "./user.service";

export const authService = {
    signUp: async (dto: SingUpDtoType): Promise<ISignUpResponse> => {
        const user = await userService.create(dto);
        const { _id: userId, role } = user;
        const tokens = tokenService.generate({
            userId,
            role,
        });
        await tokenRepository.create({ ...tokens, userId });
        return { user, tokens };
    },
    signIn: async (dto: SingInDtoType): Promise<ISignInResponse> => {
        const user = await userRepository.getByEmail(dto.email);
        if (!user) throw new ApiError("User not found", 404);
        const isPasswordCorrect = await passwordService.compare(
            dto.password,
            user.password,
        );
        if (!isPasswordCorrect) throw new ApiError("Invalid credentials", 401);

        const { _id: userId, role } = user;
        const tokens = tokenService.generate({
            userId,
            role,
        });
        await tokenRepository.create({ ...tokens, userId });
        return { user, tokens };
    },
};
