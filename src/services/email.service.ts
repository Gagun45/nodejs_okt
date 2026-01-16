import { transporter } from "../config/nodemailer.config";

export const emailService = {
    send: async (context: string): Promise<void> => {
        const to = "selyanchyn45@gmail.com";
        const subject = "Test email";
        await transporter.sendMail({ to, subject, html: context });
    },
};
