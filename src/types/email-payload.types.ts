import { EmailTypeEnum } from "../enums/email-type.enum";

export type EmailTypePayload = {
    [EmailTypeEnum.WELCOME]: {
        name: string;
    };
};
