import nodemailer from "nodemailer";

import { config } from "./config";

export const transporter = nodemailer.createTransport({
    service: "gmail",
    from: "No reply",
    auth: {
        user: config.SMTP_EMAIL,
        pass: config.SMTP_PASSWORD,
    },
});
