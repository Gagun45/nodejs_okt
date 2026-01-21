import { config } from "../config/config";
import { IPublicResDto, IUser } from "../interfaces/user.interfaces";

export const userPresenter = {
    toPublicResDto: (entity: IUser): IPublicResDto => ({
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
};
