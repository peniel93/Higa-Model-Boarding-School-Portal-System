const fs = require('fs');
const path = require('path');

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Regex replacement: replace db.get with await db.get, db.set with await db.set
  content = content.replace(/(?<!await\s)db\.get\(/g, 'await db.get(');
  content = content.replace(/(?<!await\s)db\.set\(/g, 'await db.set(');

  // Now, heuristics to add async to functions
  let lines = content.split('\n');
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('await db.')) {
      // trace back upwards to find the enclosing function
      let j = i;
      while (j >= 0) {
        let l = lines[j];
        
        // Match function XXX(...)
        if (/\bfunction\s+\w+\s*\(/.test(l) && !l.includes('async')) {
          lines[j] = l.replace(/\bfunction\b/, 'async function');
          break;
        }
        
        // Match export function XXX(...)
        if (/\bexport\s+function\s+\w+\s*\(/.test(l) && !l.includes('async')) {
          lines[j] = l.replace(/\bfunction\b/, 'async function');
          break;
        }

        // Match arrow functions: (...) => { or e => {
        if (/(\([^\)]*\)|\w+)\s*=>\s*\{/.test(l) && !l.includes('async')) {
          lines[j] = l.replace(/(\([^\)]*\)|\w+)\s*=>\s*\{/, 'async $1 => {');
          break;
        }

        // Match object methods like: render() {
        if (/^\s*\w+\s*\([^\)]*\)\s*\{/.test(l) && !l.includes('async') && !l.includes('if') && !l.includes('for') && !l.includes('while') && !l.includes('switch') && !l.includes('catch')) {
          lines[j] = l.replace(/(\b\w+\s*\()/, 'async $1');
          break;
        }
        
        j--;
        if (i - j > 50) break; // Don't look too far up
      }
    }
  }

  content = lines.join('\n');
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Processed', filePath);
}

function walkDir(dir) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    if (isDirectory) {
      walkDir(dirPath);
    } else if (f.endsWith('.js') && f !== 'db.js') {
      processFile(dirPath);
    }
  });
}

walkDir(path.join(__dirname, 'js'));
console.log('Done.');
