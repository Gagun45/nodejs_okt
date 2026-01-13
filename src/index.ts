/* eslint-disable no-console */
import express, { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";

import { config } from "./config/config";
import { ApiError } from "./errors/api-error";
import { userRouter } from "./routers/user.router";

const app = express();

const { APP_HOST, APP_PORT, MONGO_URI } = config;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/users", userRouter);

app.use(
    (
        error: Error | ApiError,
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        if (error instanceof ApiError) {
            res.status(error.status).send(error.message);
        } else res.status(500).send(error.message);
    },
);

process.on("uncaughtException", (error) => {
    console.error("uncaughtException", error.message, error.stack);
    process.exit(1);
});

app.listen(APP_PORT, () => {
    mongoose.connect(MONGO_URI!);
    console.log(`App running at http://${APP_HOST}:${APP_PORT}`);
});
