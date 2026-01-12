import express, { Request, Response } from "express";

import { path } from "path";

import { getUserById, getUsers, resetDb, updateUsers } from "./dbActions";
import {
    parseUserIdOrThrow,
    validateAgeOrThrow,
    validateNameOrThrow,
} from "./validation";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//reset users.txt file
app.get("/reset", async (req: Request, res: Response) => {
    await resetDb();
    res.send("users.txt reseted");
});

//get all users
app.get("/users", async (req: Request, res: Response) => {
    const users = await getUsers();
    res.send(users);
});

//create new user
app.post("/users", async (req: Request, res: Response) => {
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
        res.status(400).send(e.message);
    }
});

//get single user
app.get("/users/:userId", async (req: Request, res: Response) => {
    try {
        const userId = parseUserIdOrThrow(req.params.userId);
        const user = await getUserById(userId);
        if (!user) return res.status(404).send("User not found");
        res.send(user);
    } catch (e) {
        res.status(400).send(e.message);
    }
});

//update user
app.patch("/users/:userId", async (req: Request, res: Response) => {
    try {
        const userId = parseUserIdOrThrow(req.params.userId);
        const users = await getUsers();
        const existingUser = users.find((user) => user.id === userId);
        if (!existingUser) return res.status(404).send("User not found");
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
        res.status(400).send(e.message);
    }
});

//replace user
app.put("/users/:userId", async (req: Request, res: Response) => {
    try {
        const userId = parseUserIdOrThrow(req.params.userId);
        const users = await getUsers();
        const existingUser = users.find((user) => user.id === userId);
        if (!existingUser) return res.status(404).send("User not found");
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
        res.status(400).send(e.message);
    }
});

//delete user
app.delete("/users/:userId", async (req: Request, res: Response) => {
    try {
        const users = await getUsers();
        const userId = parseUserIdOrThrow(req.params.userId);

        const userIndex = users.findIndex((user) => user.id === userId);
        if (userIndex === -1) {
            return res.status(404).send("User not found");
        }

        users.splice(userIndex, 1);
        await updateUsers(users);
        res.sendStatus(204);
    } catch (e) {
        res.status(400).send(e.message);
    }
});

app.listen(3000, () => {
    // eslint-disable-next-line no-console
    console.log("App running at http://localhost:3000");
});
