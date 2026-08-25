import fs from 'node:fs';

const html = fs.readFileSync('index.html', 'utf8');
const required = ['<!doctype html>', '<html lang="fa" dir="rtl">', '<meta charset="utf-8">', 'name="viewport"', '<main class="main" id="home">', 'id="productGrid"', 'role="dialog"', 'aria-modal="true"'];
const missing = required.filter((token) => !html.includes(token));
const duplicateIds = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]).filter((id, index, ids) => ids.indexOf(id) !== index);
const externalScripts = [...html.matchAll(/<script\b[^>]*\bsrc="(https?:[^"]+)"/gi)].map((match) => match[1]);

if (missing.length || duplicateIds.length || externalScripts.length) {
  if (missing.length) console.error(`Missing required HTML tokens: ${missing.join(', ')}`);
  if (duplicateIds.length) console.error(`Duplicate IDs: ${[...new Set(duplicateIds)].join(', ')}`);
  if (externalScripts.length) console.error(`External scripts are not expected: ${externalScripts.join(', ')}`);
  process.exit(1);
}

console.log('HTML structure checks passed.');
