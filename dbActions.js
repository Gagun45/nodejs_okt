const path = require("path");
const fs = require("fs/promises");

const pathToDb = path.join(__dirname, "users.txt");

const getUsers = async () => {
  const data = await fs.readFile(pathToDb, { encoding: "utf-8" });
  return JSON.parse(data).users;
};

const getUserById = async (id) => {
  const users = await getUsers();
  const user = users.find((user) => user.id === id);
  return user;
};

const updateUsers = async (users) => {
  await fs.writeFile(pathToDb, JSON.stringify({ users }));
};

const resetDb = async () => {
  await fs.writeFile(pathToDb, JSON.stringify({ users: [] }));
};

module.exports = {
  getUsers,
  updateUsers,
  resetDb,
  getUserById
};
