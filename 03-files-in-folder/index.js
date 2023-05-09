const { stat } = require('fs');
const { readdir } = require('fs/promises');
const path = require('path');

const folderPath = path.join(__dirname, 'secret-folder');

readdir(folderPath, { withFileTypes: true }).then(

  (result) => {

    for (let item of result) {

      if (item.isFile()) {
        const fileName = path.parse(item.name).name;
        const fileExtension = path.extname(item.name).slice(1);

        stat(path.join(folderPath, item.name), (err, stats) => {
          console.log(`${fileName} - ${fileExtension} - ${stats.size / 1024}kb`)  
        });
      }

    }

  }

);
