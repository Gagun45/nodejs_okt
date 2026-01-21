import { config } from "../config/config";
import {
    IUser,
    IUserListQuery,
    PublicResDtoType,
    UserListResponseType,
} from "../interfaces/user.interfaces";

export const userPresenter = {
    toPublicResDto: (entity: IUser): PublicResDtoType => ({
        name: entity.name,
        age: entity.age,
        avatar: entity.avatar
            ? `${config.AWS_S3_ENDPOINT}/${entity.avatar}`
            : undefined,
        email: entity.email,
        isVerified: entity.isVerified,
        role: entity.role,
        phone: entity.phone,
    }),
    toListResDto: (
        data: IUser[],
        total: number,
        query: IUserListQuery,
    ): UserListResponseType => ({
        data: data.map(userPresenter.toPublicResDto),
        total,
        ...query,
    }),
};
