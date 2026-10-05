const fs = require('fs');
function findError(file) {
  let code = fs.readFileSync(file, 'utf8');
  code = code.replace(/import\s+.*?from\s+['"].*?['"];?/g, '');
  code = code.replace(/export\s+/g, '');
  const lines = code.split('\n');
  for (let i = 0; i < lines.length; i++) {
    try {
      new Function(lines.slice(0, i + 1).join('\n'));
    } catch(e) {
      if (e.message !== 'Unexpected end of input' && !e.message.includes('Unexpected token')) {
        console.log(file, 'Error near line', i + 1, e.message);
        break;
      }
    }
  }
}
findError('js/dashboards/staff.js');
findError('js/dashboards/registrar.js');
