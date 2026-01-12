import fs from "fs/promises";
import path from "path";

import { IUser } from "../types/user.types";

const pathToDb = path.join(process.cwd(), "users.txt");

export const fsService = {
    read: async (): Promise<IUser[]> => {
        const data = await fs.readFile(pathToDb, { encoding: "utf-8" });
        return JSON.parse(data).users;
    },
    write: async (users: IUser[]) => {
        await fs.writeFile(pathToDb, JSON.stringify({ users }));
    },
    reset: async (): Promise<void> => {
        await fs.writeFile(pathToDb, JSON.stringify({ users: [] }));
    },
};
