const { createWriteStream } = require('fs');
const { readdir, readFile } = require('fs/promises');
const path = require('path');

async function mergeStyles() {
  try {
    const files = await readdir(path.join(__dirname, 'styles'), { withFileTypes: true });
    const writeStream = createWriteStream(path.join(__dirname, 'project-dist', 'bundle.css'));
    
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

mergeStyles();
