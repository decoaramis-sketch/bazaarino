import fs from 'node:fs';

const files = ['index.html', 'app.js', 'style.css', 'sw.js', 'manifest.json', 'package.json', 'README.txt', ...fs.readdirSync('scripts').map((file) => `scripts/${file}`), ...fs.readdirSync('tests').map((file) => `tests/${file}`)];
const invalid = files.filter((file) => !fs.readFileSync(file, 'utf8').endsWith('\n'));
if (invalid.length) {
  console.error(`Files must end with a newline: ${invalid.join(', ')}`);
  process.exit(1);
}
console.log('Format checks passed.');
