const fs = require('fs');
const vm = require('vm');
let code = fs.readFileSync('js/dashboards/registrar.js', 'utf8');
code = code.replace(/import\s+.*?from\s+['"].*?['"];?/g, '');
code = code.replace(/export\s+/g, '');
const lines = code.split('\n');

function check(end) {
  try {
    const chunk = lines.slice(0, end).join('\n');
    new vm.Script(chunk);
    return true;
  } catch(e) {
    if (e.message.includes('missing ) after argument list')) return false;
    return true;
  }
}

let low = 0;
let high = lines.length;
let ans = high;
while(low <= high) {
  let mid = Math.floor((low + high) / 2);
  if (!check(mid)) {
    ans = mid;
    high = mid - 1;
  } else {
    low = mid + 1;
  }
}
console.log('Error at line', ans);
console.log(lines[ans-1]);
