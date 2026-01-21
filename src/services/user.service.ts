import { UploadedFile } from "express-fileupload";
import { DeleteResult, QueryFilter, UpdateQuery } from "mongoose";

import { config } from "../config/config";
import { ActionTokenTypesEnum } from "../enums/action-token-types.enum";
import { EmailTypeEnum } from "../enums/email-type.enum";
import { FileItemTypeEnum } from "../enums/file-item-type.enum";
import { ApiError } from "../errors/api-error";
import { ForgotPasswordSendType } from "../interfaces/auth.interfaces";
import { ITokenPayload } from "../interfaces/token.interfaces";
import { IUser, SingUpDtoType } from "../interfaces/user.interfaces";
import { userRepository } from "../repositories/user.repository";
import { actionTokenService } from "./action-token.service";
import { emailService } from "./email.service";
import { hashService } from "./hash.service";
import { s3Service } from "./s3.service";

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
        params: UpdateQuery<IUser>,
    ): Promise<IUser> => {
        const updatedUser = await userRepository.updateById(userId, params);
        if (!updatedUser) throw new ApiError("User not found", 404);
        return updatedUser;
    },
    updateMe: async (
        payload: ITokenPayload,
        params: UpdateQuery<IUser>,
    ): Promise<IUser> => {
        const updatedUser = await userRepository.updateById(
            payload.userId,
            params,
        );
        if (!updatedUser) throw new ApiError("User not found", 404);
        return updatedUser;
    },
    uploadAvatar: async (
        payload: ITokenPayload,
        file: UploadedFile,
    ): Promise<IUser> => {
        const { userId } = payload;
        const { avatar: oldAvatar } = await userService.getById(userId);
        const avatar = await s3Service.uploadFile(
            file,
            FileItemTypeEnum.USER,
            userId,
        );
        const updatedUser = await userService.updateById(userId, { avatar });

        if (oldAvatar) await s3Service.deleteFile(oldAvatar);
        return updatedUser;
    },
    resetAvatar: async (payload: ITokenPayload): Promise<IUser> => {
        const { userId } = payload;
        const { avatar } = await userService.getById(userId);
        if (avatar) await s3Service.deleteFile(avatar);
        const updatedUser = await userService.updateById(userId, {
            $unset: { avatar: 1 },
        });
        return updatedUser;
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
};
