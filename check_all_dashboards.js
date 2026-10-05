const fs = require('fs');
const vm = require('vm');

function checkFile(filePath) {
  let code = fs.readFileSync(filePath, 'utf8');
  code = code.replace(/import\s+.*?from\s+['\"].*?['\"];?/g, '');
  code = code.replace(/export\s+/g, '');
  try {
    new vm.Script(code);
    console.log(filePath, 'SYNTAX OK');
  } catch(e) {
    console.log(filePath, 'SYNTAX ERROR:', e);
  }
}

checkFile('js/dashboards/manager.js');
checkFile('js/dashboards/principal.js');
checkFile('js/dashboards/registrar.js');
checkFile('js/dashboards/staff.js');
checkFile('js/dashboards/student.js');
checkFile('js/dashboards/teacher.js');
