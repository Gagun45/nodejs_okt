const path = require("path");
const fs = require("fs/promises");

const FOLDERS_COUNT = 5;
const FILES_COUNT = 5;
const BASE_FOLDER_PATH = path.join(__dirname, "baseFolder");

// ---FILE/FOLDER ACTIONS--- //
const getFolderPath = (i) => path.join(BASE_FOLDER_PATH, `folder${i}`);
const getFilePath = (dirPath, j) => path.join(dirPath, `text${j}.txt`);

const createFolder = async (dirPath) => {
  await fs.mkdir(dirPath, { recursive: true });
};

const createFilesInFolder = async (dirPath) => {
  for (let j = 1; j <= FILES_COUNT; j++) {
    const filePath = getFilePath(dirPath, j);
    await fs.writeFile(filePath, "");
  }
};

// ---LOGGING-- //
const infoLogger = async () => {
  await logInfoByPath(BASE_FOLDER_PATH);
  for (let i = 1; i <= FOLDERS_COUNT; i++) {
    const dirPath = getFolderPath(i);
    await logInfoByPath(dirPath);
    for (let j = 1; j <= FILES_COUNT; j++) {
      const filePath = getFilePath(dirPath, j);
      await logInfoByPath(filePath);
    }
  }
};

const logInfoByPath = async (targetPath) => {
  const stat = await fs.stat(targetPath);
  const type = stat.isFile() ? "FILE" : "FOLDER";
  console.log(`${targetPath} --- ${type}`);
};

module.exports = {
  FOLDERS_COUNT,
  BASE_FOLDER_PATH,
  getFolderPath,
  createFolder,
  createFilesInFolder,
  infoLogger,
};
