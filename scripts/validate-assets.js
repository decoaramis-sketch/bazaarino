import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'manifest.json'), 'utf8'));
const refs = [
  ...[...html.matchAll(/(?:href|src)="(?!https?:|#|data:)([^"]+)"/g)].map((match) => match[1]),
  ...manifest.icons.map((icon) => icon.src),
];

const missing = refs.filter((ref) => !fs.existsSync(path.join(root, ref.replace(/^\.\//, ''))));
if (missing.length) {
  console.error(`Missing assets: ${missing.join(', ')}`);
  process.exit(1);
}

console.log('All local assets referenced by HTML and manifest exist.');
