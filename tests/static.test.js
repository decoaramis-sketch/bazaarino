import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const html = fs.readFileSync('index.html', 'utf8');
const app = fs.readFileSync('app.js', 'utf8');
const sw = fs.readFileSync('sw.js', 'utf8');

test('HTML exposes the main rendering targets and accessible form labels', () => {
  assert.match(html, /id="productGrid"/);
  assert.match(html, /<label class="sr-only" for="search">/);
  assert.match(html, /<label for="sellName">/);
  assert.match(html, /role="dialog"/);
});

test('inline handlers and unsafe DOM sinks are not used', () => {
  assert.doesNotMatch(html, /\son[a-z]+=/i);
  assert.doesNotMatch(app, /\.innerHTML\s*=/);
  assert.doesNotMatch(app, /document\.write\s*\(/);
});

test('rendering uses createElement and textContent to prevent product XSS', () => {
  assert.match(app, /function createProductCard/);
  assert.match(app, /document\.createElement\('article'\)/);
  assert.match(app, /title\.textContent = product\.name/);
  assert.match(app, /sellerName\.textContent = `فروشنده: \$\{product\.seller\}`/);
  assert.match(app, /t\.textContent = normalizeText\(msg\)/);
});

test('sell form validation rejects empty and oversized names', () => {
  assert.match(app, /const MAX_SELL_NAME_LENGTH = 80/);
  assert.match(app, /if \(!name\) return \{ valid: false/);
  assert.match(app, /name\.length > MAX_SELL_NAME_LENGTH/);
});


test('product sorting and empty states are implemented without mutating source data', () => {
  assert.match(html, /data-action="sort-products"/);
  assert.match(app, /function parseLocalizedNumber/);
  assert.match(app, /function safeSortProducts/);
  assert.match(app, /function createEmptyState/);
  assert.match(app, /grid\.replaceChildren\(createEmptyState\(\)\)/);
  assert.match(app, /const source = Array\.isArray\(list\) \? \[\.\.\.list\] : \[\]/);
});

test('localStorage cart data is normalized before use', () => {
  assert.match(app, /function safeCartCount/);
  assert.match(app, /Number\.isSafeInteger\(number\) && number >= 0 && number <= 999/);
  assert.match(app, /return 0;/);
});

test('service worker claims clients and ignores non-GET or cross-origin requests', () => {
  assert.match(sw, /self\.skipWaiting\(\)/);
  assert.match(sw, /self\.clients\.claim\(\)/);
  assert.match(sw, /event\.request\.method !== 'GET'/);
  assert.match(sw, /origin !== self\.location\.origin/);
});
