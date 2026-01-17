import { config } from "../config/config";
import { ActionTokenTypesEnum } from "../enums/action-token-types.enum";
import { EmailTypeEnum } from "../enums/email-type.enum";
import { RoleEnum } from "../enums/role.enum";
import { ApiError } from "../errors/api-error";
import { actionTokenRepository } from "../repositories/action-token.repository";
import { tokenRepository } from "../repositories/token.repository";
import { userRepository } from "../repositories/user.repository";
import {
    ITokenPair,
    ITokenPayload,
    ITokenResponse,
} from "../types/token.types";
import {
    ForgotPasswordSendType,
    SingInDtoType,
    SingUpDtoType,
} from "../types/user.types";
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
            config.SMTP_EMAIL, // should be user.email
            { name: user.name },
        );
        return { user, tokens };
    },
    logout: async (refreshToken: string): Promise<void> => {
        if (!refreshToken) throw new ApiError("Refresh token is missing", 401);
        await tokenRepository.deleteByRefreshToken(refreshToken);
    },
    forgotPasswordSend: async (dto: ForgotPasswordSendType): Promise<void> => {
        const user = await userService.getByEmail(dto.email);
        const actionToken = tokenService.generateActionToken(
            {
                role: user.role,
                userId: user._id,
            },
            ActionTokenTypesEnum.FORGOT_PASSWORD,
        );
        await actionTokenRepository.save(
            actionToken,
            user._id,
            ActionTokenTypesEnum.FORGOT_PASSWORD,
        );
        await emailService.send(
            EmailTypeEnum.FORGOT_PASSWORD,
            config.SMTP_EMAIL, //shoud be user.email
            {
                name: user.name,
                actionToken,
                frontUrl: "qweqwe",
            },
        );
    },
    logoutAll: async (jwtPayload: ITokenPayload): Promise<void> => {
        const { userId } = jwtPayload;

        const user = await userRepository.getById(userId);
        if (!user) throw new ApiError("User not found", 404);

        await tokenRepository.deleteByUserId(userId);
        await emailService.send(
            EmailTypeEnum.LOGOUT,
            config.SMTP_EMAIL, // should be user.email
            {
                name: user.name,
            },
        );
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
