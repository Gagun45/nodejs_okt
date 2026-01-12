import express, { NextFunction, Request, Response } from "express";

import { getUserById, getUsers, resetDb, updateUsers } from "./dbActions";
import { ApiError } from "./errors/api-error";
import {
    parseUserIdOrThrow,
    validateAgeOrThrow,
    validateNameOrThrow,
} from "./validation";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//reset users.txt file
app.get("/reset", async (req: Request, res: Response, next: NextFunction) => {
    try {
        await resetDb();
        res.send("users.txt reseted");
    } catch (e) {
        next(e);
    }
});

//get all users
app.get("/users", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await getUsers();
        res.send(users);
    } catch (e) {
        next(e);
    }
});

//create new user
app.post("/users", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await getUsers();

        const { name, age } = req.body;
        validateNameOrThrow(name);
        validateAgeOrThrow(age);

        const newId = (users[users.length - 1]?.id ?? 0) + 1;
        const newUser = { id: newId, name, age };

        users.push(newUser);

        await updateUsers(users);

        res.status(201).send(newUser);
    } catch (e) {
        next(e);
    }
});

//get single user
app.get(
    "/users/:userId",
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = parseUserIdOrThrow(req.params.userId);
            const user = await getUserById(userId);
            if (!user) throw new ApiError("User not found", 404);
            res.send(user);
        } catch (e) {
            next(e);
        }
    },
);

//update user
app.patch(
    "/users/:userId",
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = parseUserIdOrThrow(req.params.userId);
            const users = await getUsers();
            const existingUser = users.find((user) => user.id === userId);
            if (!existingUser) throw new ApiError("User not found", 404);
            const { name, age } = req.body;
            if (name !== undefined) {
                validateNameOrThrow(name);
                existingUser.name = name;
            }
            if (age !== undefined) {
                validateAgeOrThrow(age);
                existingUser.age = age;
            }
            await updateUsers(users);
            res.send(existingUser);
        } catch (e) {
            next(e);
        }
    },
);

//replace user
app.put(
    "/users/:userId",
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = parseUserIdOrThrow(req.params.userId);
            const users = await getUsers();
            const existingUser = users.find((user) => user.id === userId);
            if (!existingUser) throw new ApiError("User not found", 404);
            const { name, age } = req.body;
            if (name === undefined || age === undefined)
                return res
                    .status(400)
                    .send("Provide both name and age field please");

            validateNameOrThrow(name);
            validateAgeOrThrow(age);

            existingUser.name = name;
            existingUser.age = age;

            await updateUsers(users);
            res.send(existingUser);
        } catch (e) {
            next(e);
        }
    },
);

//delete user
app.delete(
    "/users/:userId",
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const users = await getUsers();
            const userId = parseUserIdOrThrow(req.params.userId);

            const userIndex = users.findIndex((user) => user.id === userId);
            if (userIndex === -1) throw new ApiError("User not found", 404);

            users.splice(userIndex, 1);
            await updateUsers(users);
            res.sendStatus(204);
        } catch (e) {
            next(e);
        }
    },
);

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
    // eslint-disable-next-line no-console
    console.log("App running at http://localhost:3000");
});
