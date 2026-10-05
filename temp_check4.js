const fs = require('fs');
const lines = fs.readFileSync('js/dashboards/registrar.js', 'utf8').split('\n');
for (let i = 1250; i < 1310; i++) {
  const line = lines[i];
  let depth = 0;
  for (let j = 0; j < line.length; j++) {
    if (line[j] === '$' && line[j+1] === '{') { depth++; j++; }
    else if (line[j] === '}') { depth--; }
  }
  if (depth > 0) {
    console.log('Line ' + (i+1) + ' might have unclosed ${:', line);
  }
}
