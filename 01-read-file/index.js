const fs = require('fs');
const path = require('path');
const { pipeline } = require('stream');

pipeline (
  fs.createReadStream(path.join(__dirname, 'text.txt'), 'utf-8'),
  process.stdout,
  (err) => {
    if (err) {
      console.log(err.message);
    }
  } 
);
