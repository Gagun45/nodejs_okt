import dotenv from "dotenv";
import ms from "ms";

dotenv.config();

export const config = {
    APP_PORT: process.env.APP_PORT || 3001,
    APP_HOST: process.env.APP_HOST!,
    MONGO_URI: process.env.MONGO_URI!,
    JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET!,
    JWT_ACCESS_EXPIRATION: process.env.JWT_ACCESS_EXPIRATION as ms.StringValue,

    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET!,
    JWT_REFRESH_EXPIRATION: process.env
        .JWT_REFRESH_EXPIRATION as ms.StringValue,
    JWT_FORGOT_PASSWORD_SECRET: process.env.JWT_FORGOT_PASSWORD_SECRET!,
    JWT_FORGOT_PASSWORD_EXPIRATION: process.env
        .JWT_FORGOT_PASSWORD_EXPIRATION as ms.StringValue,
    JWT_VERIFY_ACCOUNT_SECRET: process.env.JWT_VERIFY_ACCOUNT_SECRET!,
    JWT_VERIFY_ACCOUNT_EXPIRATION: process.env
        .JWT_VERIFY_ACCOUNT_EXPIRATION as ms.StringValue,
    FRONT_URL: process.env.FRONT_URL!,
    SMTP_EMAIL: process.env.SMTP_EMAIL!,
    SMTP_PASSWORD: process.env.SMTP_PASSWORD!,
};
