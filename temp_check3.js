const fs = require('fs');
let code = fs.readFileSync('js/dashboards/registrar.js', 'utf8');
const lines = code.split('\n');
const chunk = lines.slice(1250, 1310).join('\n');
try {
  new Function('const sections = {}; ' + chunk);
  console.log('OK');
} catch(e) {
  console.log(e);
}
