import { transporter } from "../config/nodemailer.config";
import { emailConstants } from "../constants/email.constants";
import { EmailTypeEnum } from "../enums/email-type.enum";
import { ApiError } from "../errors/api-error";
import { EmailTypePayload } from "../types/email-payload.types";

export const emailService = {
    send: async <T extends EmailTypeEnum>(
        type: T,
        to: string,
        context: EmailTypePayload[T],
    ): Promise<void> => {
        try {
            const { subject, template } = emailConstants[type];
            const options = { to, subject, template, context };
            await transporter.sendMail(options);
        } catch {
            throw new ApiError("Failed to send email", 500);
        }
    },
};
