const fs = require('fs');
const path = require('path');
const { pipeline } = require('stream');

console.log(`Режим ввода текста!\nДля выхода из режима нажмите Ctrl + C или введите 'exit':`);

pipeline (
  process.stdin.on('data', (data) => {

    if (data.toString().trim() === 'exit') {
      process.exit();
    }
    
  }),
  fs.createWriteStream(path.join(__dirname, 'text.txt')),
  (err) => {
    if (err) {
      console.log(err.message);
    }
  } 
);