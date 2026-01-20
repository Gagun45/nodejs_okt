import { config } from "../config/config";
import { ActionTokenTypesEnum } from "../enums/action-token-types.enum";
import { EmailTypeEnum } from "../enums/email-type.enum";
import { RoleEnum } from "../enums/role.enum";
import { ApiError } from "../errors/api-error";
import { ForgotPasswordSetType } from "../interfaces/auth.interfaces";
import {
    IAuthResponse,
    ITokenPair,
    ITokenPayload,
} from "../interfaces/token.interfaces";
import {
    ChangePasswordDtoType,
    SingInDtoType,
    SingUpDtoType,
} from "../interfaces/user.interfaces";
import { oldPasswordRepository } from "../repositories/old-password.repository";
import { actionTokenService } from "./action-token.service";
import { emailService } from "./email.service";
import { hashService } from "./hash.service";
import { oldPasswordService } from "./old-password.service";
import { tokenService } from "./token.service";
import { userService } from "./user.service";

export const authService = {
    signUp: async (dto: SingUpDtoType): Promise<IAuthResponse> => {
        const user = await userService.create(dto);
        const { _id: userId, role } = user;
        const tokens = tokenService.generatePair({
            userId,
            role,
        });
        //create action token
        const verifyToken = actionTokenService.generate(
            {
                userId,
            },
            ActionTokenTypesEnum.VERIFY_ACCOUNT,
        );
        await actionTokenService.save({
            token: verifyToken,
            type: ActionTokenTypesEnum.VERIFY_ACCOUNT,
            userId,
        });
        await tokenService.save(tokens, userId);
        await emailService.send(
            EmailTypeEnum.WELCOME,
            config.SMTP_EMAIL, // should be user.email
            {
                name: user.name,
                actionToken: verifyToken,
                frontUrl: config.FRONT_URL,
            },
        );
        return { user, tokens };
    },

    logout: async (refreshToken: string): Promise<void> => {
        await tokenService.deleteOne({ refreshToken });
    },

    logoutAll: async (jwtPayload: ITokenPayload): Promise<void> => {
        const { userId } = jwtPayload;

        const user = await userService.getById(userId);

        await tokenService.deleteMany({ userId });
        await emailService.send(
            EmailTypeEnum.LOGOUT,
            config.SMTP_EMAIL, // should be user.email
            {
                name: user.name,
            },
        );
    },
    signIn: async (dto: SingInDtoType): Promise<IAuthResponse> => {
        const user = await userService.getOneWithPassword({
            email: dto.email,
        });
        const isPasswordCorrect = await hashService.compare(
            dto.password,
            user.password,
        );
        if (!isPasswordCorrect) throw new ApiError("Invalid credentials", 401);

        const { _id: userId, role } = user;
        const tokens = tokenService.generatePair({
            userId,
            role,
        });
        await tokenService.save(tokens, userId);
        return { user, tokens };
    },
    refreshToken: async (
        refreshToken: string,
        userId: string,
        role: RoleEnum,
    ): Promise<{ tokens: ITokenPair }> => {
        //delete token from db
        await tokenService.deleteOne({ refreshToken });

        //generate new token
        const tokens = tokenService.generatePair({
            userId,
            role,
        });

        //save new token to db
        await tokenService.save(tokens, userId);

        //return new token pair
        return { tokens };
    },
    forgotPasswordSet: async (dto: ForgotPasswordSetType): Promise<void> => {
        const { token, password: newPassword } = dto;
        const type = ActionTokenTypesEnum.FORGOT_PASSWORD;

        // verify crypto
        const jwtPayload = await actionTokenService.verifyJwt(token, type);
        // verify if exists in db
        await actionTokenService.findOne({ token, type });

        const { userId } = jwtPayload;
        const { password: oldPasswordHashed } =
            await userService.getByIdWithPassword(userId);
        const isPasswordsEqual = await hashService.compare(
            newPassword,
            oldPasswordHashed,
        );
        if (isPasswordsEqual)
            throw new ApiError("Password must be different", 400);

        await oldPasswordService.assertNotUsedRecently(userId, newPassword);
        await oldPasswordRepository.save(userId, oldPasswordHashed);

        await userService.setNewPassword(userId, newPassword);

        await actionTokenService.deleteMany({
            userId,
            type: ActionTokenTypesEnum.FORGOT_PASSWORD,
        });
        await tokenService.deleteMany({ userId });
    },
    changePassword: async (
        { newPassword, oldPassword }: ChangePasswordDtoType,
        userId: string,
    ): Promise<void> => {
        await userService.verifyUserPassword(userId, oldPassword);
        if (newPassword === oldPassword)
            throw new ApiError("Password must be different", 400);

        await oldPasswordService.assertNotUsedRecently(userId, newPassword);
        await oldPasswordService.save(userId, oldPassword);

        await userService.setNewPassword(userId, newPassword);
        await tokenService.deleteMany({ userId });
    },
};
