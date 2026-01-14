/* eslint-disable no-console */
import express from "express";
import mongoose from "mongoose";

import { config } from "./config/config";
import { errorMiddleware } from "./middlewares/error.middleware";
import { authRouter } from "./routers/auth.router";
import { userRouter } from "./routers/user.router";

const app = express();

const { APP_HOST, APP_PORT, MONGO_URI } = config;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/users", userRouter);
app.use("/auth", authRouter);

app.use(errorMiddleware);

process.on("uncaughtException", (error) => {
    console.error("uncaughtException", error.message, error.stack);
    process.exit(1);
});

app.listen(APP_PORT, () => {
    mongoose.connect(MONGO_URI!);
    console.log(`App running at http://${APP_HOST}:${APP_PORT}`);
});
