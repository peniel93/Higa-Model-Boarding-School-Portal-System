const fs = require('fs');
function check(file) {
  let code = fs.readFileSync(file, 'utf8');
  code = code.replace(/import\s+.*?from\s+['"].*?['"];?/g, '');
  code = code.replace(/export\s+/g, '');
  try {
    new Function(code);
    console.log(file, 'OK');
  } catch(e) {
    console.log(file, 'ERROR:', e.message);
  }
}
check('js/dashboards/registrar.js');
check('js/dashboards/staff.js');
check('js/dashboards/student.js');
