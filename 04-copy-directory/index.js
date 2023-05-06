const { mkdir, rm, readdir, copyFile } = require('fs/promises');
const path = require('path');

const currentDirPath = path.join(__dirname, 'files');
const copyDirPath = path.join(__dirname, 'files-copy');

async function createDir() {
  try {
    await rm(copyDirPath, { recursive: true, force: true });
    await mkdir(copyDirPath, { recursive: true });

    copyFiles(currentDirPath, copyDirPath);
  } catch(err) {
    console.log(`Error: ${err.message}`)
  }
}

async function copyFiles(from, to) {
  const files = await readdir(from, { withFileTypes: true });
  
  for (let item of files) {

    if (item.isFile()) {
      await copyFile(path.join(from, item.name), path.join(to, item.name));
    } else if (item.isDirectory()) {
      await mkdir(path.join(to, item.name), { recursive: true });
      copyFiles(path.join(from, item.name), path.join(to, item.name));
    }

  }

}

createDir();
