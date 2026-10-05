const fs = require('fs');
const vm = require('vm');
let code = fs.readFileSync('js/dashboards/registrar.js', 'utf8');
code = code.replace(/import\s+.*?from\s+['\"].*?['\"];?/g, '');
code = code.replace(/export\s+/g, '');
try {
  new vm.Script(code);
  console.log('registrar.js SYNTAX OK');
} catch(e) {
  console.log('registrar.js SYNTAX ERROR:', e);
}
