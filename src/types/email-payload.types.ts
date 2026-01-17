import { EmailTypeEnum } from "../enums/email-type.enum";

export type EmailTypePayload = {
    [EmailTypeEnum.WELCOME]: {
        name: string;
    };
    [EmailTypeEnum.LOGOUT]: {
        name: string;
    };
    [EmailTypeEnum.FORGOT_PASSWORD]: {
        name: string;
        frontUrl: string;
        actionToken: string;
    };
};
