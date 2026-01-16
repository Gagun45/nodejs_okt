import nodemailer from "nodemailer";
import hbs from "nodemailer-express-handlebars";

import { config } from "./config";
import { hbsOptions } from "./hbs.config";

export const transporter = nodemailer
    .createTransport({
        service: "gmail",
        from: "No reply",
        auth: {
            user: config.SMTP_EMAIL,
            pass: config.SMTP_PASSWORD,
        },
    })
    .use("compile", hbs(hbsOptions));
