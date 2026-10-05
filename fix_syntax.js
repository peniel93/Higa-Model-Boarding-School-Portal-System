const fs = require('fs');
const path = require('path');

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  content = content.replace(/addEventListenerasync\s*\(/g, 'addEventListener(');
  // Also any other `async (` that might have been erroneously added if it's not a function definition?
  // Let's just fix addEventListenerasync specifically because that's what we broke.
  
  if (original !== content) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Fixed', filePath);
  }
}

function walkDir(dir) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    if (isDirectory) {
      walkDir(dirPath);
    } else if (f.endsWith('.js')) {
      processFile(dirPath);
    }
  });
}

walkDir(path.join(__dirname, 'js'));
console.log('Done fixing syntax errors.');
