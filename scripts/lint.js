import fs from 'node:fs';

const checks = [
  { file: 'index.html', pattern: /\son[a-z]+=/i, message: 'Inline event handlers are not allowed.' },
  { file: 'app.js', pattern: /\.innerHTML\s*=/, message: 'Use safe DOM APIs instead of innerHTML assignments.' },
  { file: 'app.js', pattern: /document\.write\s*\(/, message: 'document.write is not allowed.' },
  { file: 'app.js', pattern: /eval\s*\(/, message: 'eval is not allowed.' },
];

let failed = false;
for (const check of checks) {
  const source = fs.readFileSync(check.file, 'utf8');
  if (check.pattern.test(source)) {
    console.error(`${check.file}: ${check.message}`);
    failed = true;
  }
}

if (failed) process.exit(1);
console.log('Lint checks passed.');
