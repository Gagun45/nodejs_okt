import { EmailTypeEnum } from "../enums/email-type.enum";

export const emailConstants = {
    [EmailTypeEnum.WELCOME]: {
        subject: "Welcome to out platform",
        template: "welcome",
    },
};
