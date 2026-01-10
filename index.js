const fs = require("fs/promises");
const path = require("path");

const FOLDERS_COUNT = 5;
const FILES_COUNT = 5;

const logInfoByPath = async (targetPath) => {
  const stat = await fs.stat(targetPath);
  const type = stat.isFile() ? "FILE" : "FOLDER";
  console.log(`${targetPath} --- ${type}`);
};

const main = async () => {
    //creating baseFolder
  const baseFolderPath = path.join(__dirname, "baseFolder");
  await fs.mkdir(baseFolderPath, {
    recursive: true,
  });
  await logInfoByPath(baseFolderPath);

  //creating subfolders and files
  for (let i = 1; i <= FOLDERS_COUNT; i++) {
    //creating subfolders
    const newDirPath = path.join(baseFolderPath, `folder${i}`);
    await fs.mkdir(newDirPath, {
      recursive: true,
    });
    await logInfoByPath(newDirPath);

    //creating files
    const fileCreatePromises = Array.from({length: FILES_COUNT}, (_,j)=>{
        const newFilePath = path.join(newDirPath, `text${j+1}.txt`)
        return fs.writeFile(newFilePath, '').then(()=>logInfoByPath(newFilePath))
    })
    await Promise.all(fileCreatePromises)
  }
};

main();
