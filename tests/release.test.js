import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const html = fs.readFileSync('index.html', 'utf8');
const app = fs.readFileSync('app.js', 'utf8');
const manifest = JSON.parse(fs.readFileSync('manifest.json', 'utf8'));

test('manifest contains required PWA metadata', () => {
  assert.equal(manifest.name, 'کالاپیدا');
  assert.equal(manifest.display, 'standalone');
  assert.equal(manifest.dir, 'rtl');
  assert.ok(manifest.icons.some((icon) => icon.src === 'icon.svg' && icon.type === 'image/svg+xml'));
});

test('all declared UI actions have handlers', () => {
  const actions = [...html.matchAll(/data-action="([^"]+)"/g)].map((match) => match[1]);
  for (const action of new Set(actions)) {
    assert.match(app, new RegExp(`action === '${action}'`), `${action} is declared in HTML but not handled in app.js`);
  }
});

test('no unsafe javascript URLs or external scripts are present', () => {
  assert.doesNotMatch(html, /javascript:/i);
  assert.doesNotMatch(html, /<script\b[^>]*src="https?:/i);
});

