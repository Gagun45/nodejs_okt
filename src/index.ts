/* eslint-disable no-console */
import express, { NextFunction, Request, Response } from "express";

import { ApiError } from "./errors/api-error";
import { userRouter } from "./routers/user.router";

const app = express();

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

app.listen(3000, () => {
    console.log("App running at http://localhost:3000");
});
