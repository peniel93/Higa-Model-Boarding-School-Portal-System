const { JSDOM } = require('jsdom');
const fs = require('fs');

const html = fs.readFileSync('index.html', 'utf8');

const dom = new JSDOM(html, {
  url: 'http://localhost/',
  runScripts: 'dangerously',
  resources: 'usable'
});

dom.window.onerror = function(msg, source, lineno, colno, error) {
  console.error('JSDOM Error:', msg, source, lineno, colno, error);
};

dom.window.addEventListener('unhandledrejection', (event) => {
  console.error('JSDOM Unhandled Rejection:', event.reason);
});

setTimeout(() => {
  console.log('JSDOM test complete. Checking window.appRoute:', typeof dom.window.appRoute);
  if (typeof dom.window.appRoute !== 'function') {
    console.error('appRoute is not defined! Something crashed before it could be assigned.');
  }
  process.exit(0);
}, 2000);
