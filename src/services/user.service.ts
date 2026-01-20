import { DeleteResult, QueryFilter } from "mongoose";

import { config } from "../config/config";
import { ActionTokenTypesEnum } from "../enums/action-token-types.enum";
import { EmailTypeEnum } from "../enums/email-type.enum";
import { ApiError } from "../errors/api-error";
import {
    ForgotPasswordSendType,
    ForgotPasswordSetType,
} from "../interfaces/auth.interfaces";
import { ITokenPayload } from "../interfaces/token.interfaces";
import {
    ChangePasswordDtoType,
    IUser,
    SingUpDtoType,
    UpdateUserDtoType,
} from "../interfaces/user.interfaces";
import { oldPasswordRepository } from "../repositories/old-password.repository";
import { userRepository } from "../repositories/user.repository";
import { actionTokenService } from "./action-token.service";
import { emailService } from "./email.service";
import { hashService } from "./hash.service";
import { oldPasswordService } from "./old-password.service";
import { tokenService } from "./token.service";

export const userService = {
    getAll: async (): Promise<IUser[]> => {
        return await userRepository.getAll();
    },
    create: async (dto: SingUpDtoType): Promise<IUser> => {
        const password = await hashService.hash(dto.password);
        return await userRepository.create({ ...dto, password });
    },
    getById: async (userId: string): Promise<IUser> => {
        const user = await userRepository.getById(userId);
        if (!user) throw new ApiError("User not found", 404);
        return user;
    },
    getByIdWithPassword: async (userId: string): Promise<IUser> => {
        const user = await userRepository.getByIdWithPassword(userId);
        if (!user) throw new ApiError("User not found", 404);
        return user;
    },
    getOne: async (filter: QueryFilter<IUser>): Promise<IUser> => {
        const user = await userRepository.getOne(filter);
        if (!user) throw new ApiError("User not found", 404);
        return user;
    },
    getOneWithPassword: async (filter: QueryFilter<IUser>): Promise<IUser> => {
        const user = await userRepository.getOneWithPassword(filter);
        if (!user) throw new ApiError("User not found", 404);
        return user;
    },
    getMe: async (payload: ITokenPayload): Promise<IUser> => {
        const user = await userRepository.getById(payload.userId);
        if (!user) throw new ApiError("User not found", 404);
        return user;
    },
    deleteById: async (userId: string): Promise<DeleteResult> => {
        const deleteResult = await userRepository.deleteById(userId);
        if (!deleteResult) throw new ApiError("User not found", 404);
        return deleteResult;
    },
    deleteMe: async (payload: ITokenPayload): Promise<DeleteResult> => {
        const deleteResult = await userRepository.deleteById(payload.userId);
        if (!deleteResult) throw new ApiError("User not found", 404);
        return deleteResult;
    },
    updateById: async (
        userId: string,
        dto: UpdateUserDtoType,
    ): Promise<IUser> => {
        const user = await userRepository.updateById(userId, dto);
        if (!user) throw new ApiError("User not found", 404);
        return user;
    },
    updateMe: async (
        payload: ITokenPayload,
        dto: UpdateUserDtoType,
    ): Promise<IUser> => {
        const user = await userRepository.updateById(payload.userId, dto);
        if (!user) throw new ApiError("User not found", 404);
        return user;
    },
    reset: async (): Promise<void> => {
        await userRepository.reset();
    },
    setNewPassword: async (
        userId: string,
        newPassword: string,
    ): Promise<void> => {
        const hashedPassword = await hashService.hash(newPassword);
        await userRepository.updateById(userId, { password: hashedPassword });
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
    },
    verifyUserPassword: async (
        userId: string,
        plainPassword: string,
    ): Promise<void> => {
        const user = await userService.getOneWithPassword({ _id: userId });
        if (!user) throw new ApiError("User not found", 404);
        const isValid = await hashService.compare(plainPassword, user.password);
        if (!isValid) throw new ApiError("Invalid password", 400);
    },
    verifyAccount: async (userId: string): Promise<void> => {
        await userService.updateById(userId, { isVerified: true });
        await actionTokenService.deleteMany({
            userId,
            type: ActionTokenTypesEnum.VERIFY_ACCOUNT,
        });
    },
    forgotPasswordSend: async (dto: ForgotPasswordSendType): Promise<void> => {
        const user = await userService.getOne({ email: dto.email });
        const actionToken = actionTokenService.generate(
            {
                userId: user._id,
            },
            ActionTokenTypesEnum.FORGOT_PASSWORD,
        );
        await actionTokenService.save({
            token: actionToken,
            type: ActionTokenTypesEnum.FORGOT_PASSWORD,
            userId: user._id,
        });
        await emailService.send(
            EmailTypeEnum.FORGOT_PASSWORD,
            config.SMTP_EMAIL, //shoud be user.email
            {
                name: user.name,
                actionToken,
                frontUrl: config.FRONT_URL,
            },
        );
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
};
