import { EmailTypeEnum } from "../enums/email-type.enum";

export const emailConstants = {
    [EmailTypeEnum.WELCOME]: {
        subject: "Welcome to out platform",
        template: "welcome",
    },
    [EmailTypeEnum.LOGOUT]: {
        subject: "Logout from all devices",
        template: "logout",
    },
};
