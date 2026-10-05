const fs = require('fs');
const path = require('path');

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // 1. addEventListener("...", () =>
  content = content.replace(/addEventListener\([^,]+,\s*\(\)\s*=>/g, match => {
    return match.replace('() =>', 'async () =>');
  });

  // 2. addEventListener("...", (e) =>
  content = content.replace(/addEventListener\([^,]+,\s*\([a-zA-Z_]+\)\s*=>/g, match => {
    return match.replace(/\([a-zA-Z_]+\)\s*=>/, function(m) { return 'async ' + m; });
  });

  // 3. addEventListener("...", e =>
  content = content.replace(/addEventListener\([^,]+,\s*[a-zA-Z_]+\s*=>/g, match => {
    // wait, this can be tricky. Let's capture the event var name.
    return match.replace(/([a-zA-Z_]+)\s*=>/, 'async $1 =>');
  });

  // Also need to fix object methods that have await but no async. 
  // We can just rely on the previous script which tried to do this but caused addEventListenerasync.
  // Did it succeed on other functions? Let's fix specific forms like `onsubmit = (e) =>`
  
  content = content.replace(/\.onsubmit\s*=\s*\([a-zA-Z_]+\)\s*=>/g, match => {
    if (match.includes('async')) return match;
    return match.replace(/\([a-zA-Z_]+\)\s*=>/, 'async $&');
  });
  
  content = content.replace(/\.onclick\s*=\s*\(\)\s*=>/g, match => {
    if (match.includes('async')) return match;
    return match.replace(/\(\)\s*=>/, 'async () =>');
  });
  
  if (original !== content) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Fixed async callbacks in', filePath);
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
console.log('Done.');
