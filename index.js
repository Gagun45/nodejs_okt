const fs = require("fs/promises");
const path = require("path");

const baseFolderPath = path.join(__dirname, "baseFolder");

const foo = async () => {
  await fs.mkdir(baseFolderPath, {
    recursive: true,
  });
  console.log(baseFolderPath);
  for (let i = 1; i < 6; i++) {
    const newDirPath = path.join(baseFolderPath, `folder${i}`);
    await fs.mkdir(newDirPath, {
      recursive: true,
    });
    console.log(newDirPath);

    for (let j = 1; j < 6; j++) {
      const newFilePath = path.join(baseFolderPath, `folder${i}`, `text${j}.txt`);
      await fs.writeFile(newFilePath, "");
      console.log(newFilePath);
    }
  }
};

foo();
