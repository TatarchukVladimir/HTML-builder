const path = require('path');
const { createWriteStream } = require('fs')
const { mkdir, rm, readdir, copyFile, readFile, writeFile } = require('fs/promises');

async function createDir() {
  try {
    await rm(path.join(__dirname, 'project-dist'), { recursive: true, force: true });
    await mkdir(path.join(__dirname, 'project-dist'), { recursive: true });
  } catch(err) {
    console.log('Error: ' + err.message);
  }
}

async function buildHtml() {
  const template = await readFile(path.join(__dirname, 'template.html'), 'utf-8');
  let newHtml = template;
  const files = await readdir(path.join(__dirname, 'components'), {withFileTypes: true});
  const filesContentObj = new Map();

  for (let item of files) {

    if (item.isFile() && path.extname(item.name) === '.html') {
      const file = await readFile(path.join(__dirname, 'components', item.name), 'utf8');
      filesContentObj.set(path.parse(item.name).name, file);
    }

  }

  for (let key of filesContentObj.keys()) {
    newHtml = newHtml.replace(`{{${key}}}`, filesContentObj.get(key));
  }

  await writeFile(path.join(__dirname, 'project-dist', 'index.html'), newHtml);  
}

async function copyAssets(from, to) {
  const files = await readdir(from, { withFileTypes: true });

  for (let item of files) {

    if (item.isFile()) {
      await copyFile(path.join(from, item.name), path.join(to, item.name));
    } else if (item.isDirectory()) {
      await mkdir(path.join(to, item.name), { recursive: true });
      copyAssets(path.join(from, item.name), path.join(to, item.name));
    }

  }
}

async function mergeStyles() {
  try {
    const files = await readdir(path.join(__dirname, 'styles'), { withFileTypes: true });
    const writeStream = createWriteStream(path.join(__dirname, 'project-dist', 'style.css'));
    
    for (let item of files) {
      
      if (item.isFile() && path.extname(item.name) === '.css') { 
        const file = await readFile(path.join(__dirname, 'styles', item.name), 'utf8');
        writeStream.write(file + '\n');
      }

    }

  } catch(err) {
    console.log('Error: ' + err.message);
  }
}

async function buildPage() {
  try {
    const fromAssets = path.join(__dirname, 'assets');
    const toAssets = path.join(__dirname, 'project-dist', 'assets'); 

    await createDir();
    await buildHtml();
    await copyAssets(fromAssets, toAssets);
    await mergeStyles();
  } catch(err) {
    console.log('Error: ' + err.message);
  }
}

buildPage();