const fs = require('fs');
const path = require('path');

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // Revert .map(async u => { back to .map(u => {
  content = content.replace(/\.map\(\s*async\s+([a-zA-Z0-9_]+)\s*=>/g, '.map($1 =>');
  
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
console.log('Done fixing.');
