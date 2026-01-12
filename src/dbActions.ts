import path from "path";
import fs from "fs/promises";

export const pathToDb = path.join(__dirname, "users.txt");

export const getUsers = async () => {
  const data = await fs.readFile(pathToDb, { encoding: "utf-8" });
  return JSON.parse(data).users;
};

export const getUserById = async (id) => {
  const users = await getUsers();
  const user = users.find((user) => user.id === id);
  return user;
};

export const updateUsers = async (users) => {
  await fs.writeFile(pathToDb, JSON.stringify({ users }));
};

export const resetDb = async () => {
  await fs.writeFile(pathToDb, JSON.stringify({ users: [] }));
};

