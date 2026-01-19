import { config } from "../config/config";
import { ActionTokenTypesEnum } from "../enums/action-token-types.enum";
import { EmailTypeEnum } from "../enums/email-type.enum";
import { RoleEnum } from "../enums/role.enum";
import { ApiError } from "../errors/api-error";
import {
    IAuthResponse,
    ITokenPair,
    ITokenPayload,
} from "../interfaces/token.interfaces";
import { SingInDtoType, SingUpDtoType } from "../interfaces/user.interfaces";
import { actionTokenService } from "./action-token.service";
import { emailService } from "./email.service";
import { hashService } from "./hash.service";
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
};
