import dotenv from "dotenv";

import { hoursToSeconds, minutesToSeconds } from "../utils/helper";

dotenv.config();

export const config = {
    APP_PORT: process.env.APP_PORT || 3001,
    APP_HOST: process.env.APP_HOST!,
    MONGO_URI: process.env.MONGO_URI!,
    JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET!,
    JWT_ACCESS_EXPIRATION: minutesToSeconds(
        process.env.JWT_ACCESS_EXPIRATION_IN_MINUTES!,
    ), //convert to number of seconds
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET!,
    JWT_REFRESH_EXPIRATION: hoursToSeconds(
        process.env.JWT_REFRESH_EXPIRATION_IN_HOURS!,
    ), //convert to number of seconds
    JWT_FORGOT_PASSWORD_SECRET: process.env.JWT_FORGOT_PASSWORD_SECRET!,
    JWT_FORGOT_PASSWORD_EXPIRATION: hoursToSeconds(
        process.env.JWT_FORGOT_PASSWORD_EXPIRATION_IN_HOURS!,
    ), //convert to number of seconds
    FRONT_URL: process.env.FRONT_URL!,
    SMTP_EMAIL: process.env.SMTP_EMAIL!,
    SMTP_PASSWORD: process.env.SMTP_PASSWORD!,
};
