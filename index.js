const {
  FOLDERS_COUNT,
  BASE_FOLDER_PATH,
  getFolderPath,
  createFolder,
  createFilesInFolder,
  infoLogger,
} = require("./helper");

const main = async () => {
  await createFolder(BASE_FOLDER_PATH);

  for (let i = 1; i <= FOLDERS_COUNT; i++) {
    const dirPath = getFolderPath(i);
    await createFolder(dirPath);
    await createFilesInFolder(dirPath);
  }

  await infoLogger();
};

main();
