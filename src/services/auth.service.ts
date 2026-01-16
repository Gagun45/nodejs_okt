import { EmailTypeEnum } from "../enums/email-type.enum";
import { RoleEnum } from "../enums/role.enum";
import { ApiError } from "../errors/api-error";
import { tokenRepository } from "../repositories/token.repository";
import { userRepository } from "../repositories/user.repository";
import { ITokenPair, ITokenResponse } from "../types/token.types";
import { SingInDtoType, SingUpDtoType } from "../types/user.types";
import { emailService } from "./email.service";
import { passwordService } from "./password.service";
import { tokenService } from "./token.service";
import { userService } from "./user.service";

export const authService = {
    signUp: async (dto: SingUpDtoType): Promise<ITokenResponse> => {
        const user = await userService.create(dto);
        const { _id: userId, role } = user;
        const tokens = tokenService.generate({
            userId,
            role,
        });
        await tokenRepository.save(tokens, userId);
        await emailService.send(
            EmailTypeEnum.WELCOME,
            "selyanchyn45@gmail.com", // should be user.email
            { name: user.name },
        );
        return { user, tokens };
    },
    signIn: async (dto: SingInDtoType): Promise<ITokenResponse> => {
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
        await tokenRepository.save(tokens, userId);
        return { user, tokens };
    },
    refreshToken: async (
        refreshToken: string,
        userId: string,
        role: RoleEnum,
    ): Promise<{ tokens: ITokenPair }> => {
        //delete token from db
        await tokenRepository.deleteByRefreshToken(refreshToken);

        //generate new token
        const tokens = tokenService.generate({
            userId,
            role,
        });

        //save new token to db
        await tokenRepository.save(tokens, userId);

        //return new token pair
        return { tokens };
    },
};
