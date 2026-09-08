import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { STLLoader } from '../assets/vendor/three-r180/STLLoader.js';

const read = file => readFileSync(file, 'utf8');
const sha = data => createHash('sha256').update(data).digest('hex');
const models = JSON.parse(read('assets/toby/stl/manifest.json'));
const article = read('_posts/2015-12-19-toby-the-robo-dog.md');
const baseline = JSON.parse(read('test/toby-article.json'));
const site = process.env.SITE_DIR || '_site';
const base = process.env.SITE_BASEURL ?? '/blog';

test('seven original pinned models have distinct, verified binary geometry', () => {
  assert.equal(models.length, 7);
  assert.equal(new Set(models.map(m => m.sha256)).size, 7);
  for (const model of models) {
    assert.match(model.source, /^https:\/\/raw\.githubusercontent\.com\/jameshih\/Virtual-Robotics\/c1e94f7eff626c218e73162bd1c1a5e374654b01\//);
    const bytes = readFileSync(model.file);
    assert.equal(bytes.length, model.bytes, model.id);
    assert.equal(sha(bytes), model.sha256, model.id);
    assert.equal(bytes.readUInt32LE(80), model.triangles);
    assert.equal(bytes.length, 84 + model.triangles * 50);
    const geometry = new STLLoader().parse(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength));
    const position = geometry.getAttribute('position');
    assert.equal(position.count, model.triangles * 3);
    assert.ok(position.array.every(Number.isFinite));
    geometry.computeBoundingBox();
    geometry.computeBoundingSphere();
    assert.ok(geometry.boundingSphere.radius > 0 && Number.isFinite(geometry.boundingSphere.radius));
    for (const axis of ['x', 'y', 'z']) assert.ok(geometry.boundingBox.max[axis] > geometry.boundingBox.min[axis]);
    geometry.dispose();
  }
});

test('vendored Three.js and Lucide files match pinned manifests and resolve locally', () => {
  const root = 'assets/vendor/three-r180/';
  const files = JSON.parse(read(root + 'manifest.json'));
  assert.equal(files.length, 5);
  for (const file of files) {
    assert.match(file.source, /\/0af9729d0c143a86a1d725d6e2c3ad83301f3f34\//);
    const content = readFileSync(root + file.file);
    assert.equal(sha(content), file.sha256);
    const upstream = /^(STLLoader|OrbitControls)\.js$/.test(file.file)
      ? content.toString().replace("from './three.module.min.js'", "from 'three'") : content;
    assert.equal(sha(upstream), file.upstream_sha256);
    if (file.file.endsWith('.js')) {
      for (const match of content.toString().replace(/\/\*[\s\S]*?\*\//g, '').matchAll(/\bfrom\s*["']([^"']+)["']/g)) {
        assert.ok(match[1].startsWith('./'), match[1]);
        assert.ok(readFileSync(root + match[1]));
      }
    }
  }
  assert.match(read(root + 'LICENSE'), /MIT License/);
  const iconsRoot = 'assets/vendor/lucide-0.468.0/';
  const icons = JSON.parse(read(iconsRoot + 'manifest.json'));
  assert.equal(icons.length, 6);
  assert.deepEqual(icons.map(icon => icon.file).sort(), ['LICENSE', 'maximize.svg', 'rotate-ccw.svg', 'rotate-cw.svg', 'zoom-in.svg', 'zoom-out.svg']);
  for (const icon of icons) {
    assert.match(icon.source, /^https:\/\/raw\.githubusercontent\.com\/lucide-icons\/lucide\/f12b0de177fbc2a6795e99be065887e72b237123\//);
    assert.equal(sha(readFileSync(iconsRoot + icon.file)), icon.sha256);
    if (icon.file.endsWith('.svg')) assert.equal(sha(readFileSync(site + '/' + iconsRoot + icon.file)), icon.sha256);
  }
  assert.match(read(iconsRoot + 'LICENSE'), /ISC License/);
  assert.match(read(iconsRoot + 'LICENSE'), /Feather \(MIT\)/);
});

test('all article prose, code and other media are unchanged', () => {
  const content = article.replace(/^stl_viewer: true\n/m, '')
    .replace(/{% include stl-viewer\.html [^%]+%}/g, '');
  assert.equal(sha(content), baseline.articleWithoutSTLBlocksSha256);
  for (const url of [...baseline.images, ...baseline.otherIframes]) assert.ok(article.includes(url), url);
  for (const model of models) {
    assert.ok(article.includes(`{% include stl-viewer.html model="${model.id}" label="${model.label}" %}`));
  }
});

test('no remaining blocked solid embeds anywhere in the blog', () => {
  for (const file of readdirSync('_posts')) {
    assert.doesNotMatch(read('_posts/' + file), /viewscreen\.githubusercontent\.com|view\/solid/);
  }
});

test('built page serves seven accessible previews, original downloads and modules under baseurl', () => {
  const html = read(site + '/toby-the-robo-dog.html');
  assert.equal((html.match(/<figure class="stl-viewer"/g) || []).length, 7);
  assert.equal((html.match(/role="status"/g) || []).length, 7);
  assert.equal((html.match(/aria-busy="false"/g) || []).length, 7);
  assert.equal((html.match(/class="stl-viewer__help visually-hidden"/g) || []).length, 7);
  const controls = [...html.matchAll(/<button type="button" data-action="([^"]+)"([^>]*)>(.*?)<\/button>/g)];
  assert.equal(controls.length, 35);
  for (const [, action, attributes, content] of controls) {
    assert.match(attributes, /aria-label="[^"]+"/);
    assert.match(attributes, /title="[^"]+"/);
    assert.match(content, /^<img [^>]+alt="" aria-hidden="true"\s*\/?>$/);
    const icon = { left: 'rotate-ccw', right: 'rotate-cw', in: 'zoom-in', out: 'zoom-out', reset: 'maximize' }[action];
    assert.ok(content.includes(`src="${base}/assets/vendor/lucide-0.468.0/${icon}.svg"`));
  }
  for (const model of models) {
    const url = `${base}/${model.file}`;
    assert.ok(html.includes(`data-stl-src="${url}"`));
    assert.ok(html.includes(`href="${url}" download`));
    assert.ok(html.includes(`aria-labelledby="${model.id}-caption"`));
    assert.ok(html.includes(`id="${model.id}-help"`));
    assert.equal(sha(readFileSync(site + '/' + model.file)), model.sha256);
  }
  assert.ok(html.includes(`src="${base}/assets/js/stl-viewer.js"`));
  assert.ok(html.includes(`href="${base}/assets/stl-viewer.css"`));
  assert.doesNotMatch(html, /viewscreen\.githubusercontent\.com|frame-ancestors|Content-Security-Policy/i);
  for (const url of baseline.otherIframes) assert.ok(html.includes(url));
  assert.doesNotMatch(read(site + '/index.html'), /stl-viewer\.(js|css)/);
});
