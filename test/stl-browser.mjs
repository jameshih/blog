// Uses an existing Chrome + Playwright installation; never downloads a browser.
import assert from 'node:assert/strict';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { createHash } from 'node:crypto';

const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const url = process.env.STL_TEST_URL || 'http://127.0.0.1:4009/blog/toby-the-robo-dog';
const output = resolve(process.env.STL_TEST_OUTPUT || '/tmp/blog-9-browser');
mkdirSync(output, { recursive: true });
const models = JSON.parse(readFileSync('assets/toby/stl/manifest.json'));
const baseline = JSON.parse(readFileSync('test/toby-article.json'));
const browser = await chromium.launch({
  executablePath: process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: true,
  chromiumSandbox: true,
  ignoreDefaultArgs: ['--enable-unsafe-swiftshader', '--unsafely-disable-devtools-self-xss-warnings']
});
const sourceFiles = [
  '_includes/stl-viewer.html', 'assets/stl-viewer.css',
  'assets/js/stl-viewer.js', 'assets/js/stl-viewer-scene.js',
  'assets/vendor/lucide-0.468.0/manifest.json', 'assets/vendor/three-r180/manifest.json',
  'assets/toby/stl/manifest.json', '_posts/2015-12-19-toby-the-robo-dog.md'
];
const sourceSha256 = Object.fromEntries(sourceFiles.map(file => [file, createHash('sha256').update(readFileSync(file)).digest('hex')]));
const report = { url, browser: browser.version(), sourceSha256, viewports: [], failures: [] };

// Observe real WebGL draw calls and pixels immediately after the GPU draws.
// No app state, renderer, geometry, network response or canvas is mocked.
function observeWebGL() {
  window.__stlProof = {};
  window.__stlContexts = new Set();
  const original = WebGL2RenderingContext.prototype.drawArrays;
  WebGL2RenderingContext.prototype.drawArrays = function(mode, first, count) {
    original.call(this, mode, first, count);
    const figure = this.canvas.closest('.stl-viewer');
    if (!figure || mode !== this.TRIANGLES) return;
    window.__stlContexts.add(this);
    const width = this.drawingBufferWidth, height = this.drawingBufferHeight;
    const pixels = new Uint8Array(width * height * 4);
    this.readPixels(0, 0, width, height, this.RGBA, this.UNSIGNED_BYTE, pixels);
    let colored = 0, hash = 2166136261, minX = width, maxX = 0, minY = height, maxY = 0;
    for (let y = 0; y < height; y += 2) {
      for (let x = 0; x < width; x += 2) {
        const i = (y * width + x) * 4;
        hash = Math.imul(hash ^ pixels[i], 16777619);
        hash = Math.imul(hash ^ pixels[i + 1], 16777619);
        hash = Math.imul(hash ^ pixels[i + 2], 16777619);
        if (Math.max(Math.abs(pixels[i] - 245), Math.abs(pixels[i + 1] - 245), Math.abs(pixels[i + 2] - 245)) > 15) {
          colored++;
          minX = Math.min(minX, x); maxX = Math.max(maxX, x);
          minY = Math.min(minY, y); maxY = Math.max(maxY, y);
        }
      }
    }
    const id = figure.querySelector('figcaption').id.replace(/-caption$/, '');
    window.__stlProof[id] = {
      frames: (window.__stlProof[id]?.frames || 0) + 1,
      triangles: count / 3, coloredPixels: colored * 4,
      hash: hash >>> 0, width, height, bounds: [minX, minY, maxX, maxY]
    };
  };
}

const proof = (page, id) => page.evaluate(id => window.__stlProof[id], id);
async function settle(page) {
  await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
}
async function ready(page, index) {
  const figure = page.locator('.stl-viewer').nth(index);
  await figure.evaluate(el => el.scrollIntoView({ block: 'center' }));
  await page.waitForFunction(index => document.querySelectorAll('.stl-viewer')[index].dataset.state === 'ready', index);
  await page.waitForFunction(id => window.__stlProof[id]?.coloredPixels > 0, models[index].id);
  await settle(page);
  return figure;
}
async function touchDrag(page, canvas) {
  const box = await canvas.boundingBox();
  const session = await page.context().newCDPSession(page);
  const x = box.x + box.width * .4, y = box.y + box.height * .5;
  await session.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y, id: 1 }] });
  for (let step = 1; step <= 8; step++) {
    await session.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: x + step * 9, y: y + step * 2, id: 1 }] });
  }
  await session.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  await session.detach();
}
async function pinch(page, canvas) {
  const box = await canvas.boundingBox();
  const session = await page.context().newCDPSession(page);
  const x = box.x + box.width / 2, y = box.y + box.height / 2;
  const points = offset => [{ x: x - offset, y, id: 1 }, { x: x + offset, y, id: 2 }];
  await session.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: points(30) });
  for (let offset = 35; offset <= 65; offset += 5) {
    await session.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: points(offset) });
  }
  await session.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  await session.detach();
}

try {
  for (const mode of [
    { name: 'desktop', viewport: { width: 1280, height: 900 }, deviceScaleFactor: 1 },
    { name: 'mobile', viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true }
  ]) {
    const { name, ...options } = mode;
    const context = await browser.newContext(options);
    await context.addInitScript(observeWebGL);
    const page = await context.newPage();
    page.setDefaultTimeout(15000);
    page.setDefaultNavigationTimeout(30000);
    const requests = [], errors = [], pageErrors = [];
    page.on('request', request => requests.push(request.url()));
    page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
    page.on('pageerror', error => pageErrors.push(error.message));
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    assert.equal(await page.locator('.stl-viewer').count(), 7);
    assert.ok(!requests.some(r => r.endsWith('unibody-frame.stl')), 'last model must stay lazy');
    assert.equal(await page.locator('iframe[src*="viewscreen"]').count(), 0);
    assert.deepEqual(await page.locator('iframe').evaluateAll(nodes => nodes.map(n => n.src)), baseline.otherIframes);
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'no horizontal overflow');
    const modeReport = { name, ...options, models: [], interactions: {}, consoleErrors: errors, pageErrors };
    const initialHeights = await page.locator('.stl-viewer').evaluateAll(elements => elements.map(el => el.getBoundingClientRect().height));
    for (const [index, model] of models.entries()) {
      console.log(`${name}: render ${model.id}`);
      const figure = await ready(page, index);
      const pixels = await proof(page, model.id);
      const ui = await figure.evaluate(el => {
        const help = el.querySelector('.stl-viewer__help');
        const helpStyle = getComputedStyle(help);
        return {
          height: el.getBoundingClientRect().height,
          description: el.querySelector('canvas').getAttribute('aria-describedby'),
          helpId: help.id, helpText: help.textContent,
          clippedHelp: helpStyle.position === 'absolute' && helpStyle.clip === 'rect(0px, 0px, 0px, 0px)' && helpStyle.width === '1px' && helpStyle.height === '1px',
          buttons: [...el.querySelectorAll('button')].map(button => ({
            label: button.getAttribute('aria-label'), title: button.title, text: button.textContent.trim(),
            width: button.getBoundingClientRect().width, height: button.getBoundingClientRect().height,
            iconLoaded: button.querySelector('img').complete && button.querySelector('img').naturalWidth > 0
          }))
        };
      });
      assert.ok(ui.clippedHelp, 'usage instructions are screen-reader-only');
      assert.equal(ui.description, ui.helpId, 'canvas retains accessible instructions');
      assert.match(ui.helpText, /Arrow keys rotate/);
      assert.ok(Math.abs(ui.height - initialHeights[index]) < 1, 'viewer height stays stable when toolbar activates');
      for (const button of ui.buttons) {
        assert.equal(button.text, '', 'toolbar is icon-only');
        assert.ok(button.label && button.title.startsWith(button.label));
        assert.equal(button.width, 44); assert.equal(button.height, 44);
        assert.ok(button.iconLoaded, 'official local SVG loads');
      }
      assert.equal(pixels.triangles, model.triangles, `${name} ${model.id} triangles`);
      assert.ok(pixels.coloredPixels > pixels.width * pixels.height * .005, `${model.id} visible geometry`);
      const [minX, minY, maxX, maxY] = pixels.bounds;
      assert.ok(minX > 4 && minY > 4 && maxX < pixels.width - 4 && maxY < pixels.height - 4, `${model.id} camera fits whole model`);
      const stage = await figure.locator('.stl-viewer__stage').boundingBox();
      assert.ok(Math.abs(stage.width / stage.height - 1.5) < .02, 'stable 3:2 frame');
      assert.ok(pixels.width <= stage.width * 2, 'pixel ratio capped at 2');
      await figure.screenshot({ path: `${output}/${name}-${model.id}.png` });
      modeReport.models.push({ id: model.id, ...pixels, iconToolbarAndHiddenHelp: true });
    }
    const figure = await ready(page, 0), canvas = figure.locator('canvas');
    await figure.getByRole('button', { name: 'Reset view' }).click();
    await settle(page);
    const initial = await proof(page, models[0].id);
    const idleFrames = initial.frames;
    await page.waitForTimeout(350);
    assert.equal((await proof(page, models[0].id)).frames, idleFrames, 'no idle render loop');
    if (mode.isMobile) await touchDrag(page, canvas);
    else {
      const box = await canvas.boundingBox();
      await page.mouse.move(box.x + box.width * .4, box.y + box.height * .5);
      await page.mouse.down();
      await page.mouse.move(box.x + box.width * .65, box.y + box.height * .6, { steps: 10 });
      await page.mouse.up();
    }
    await settle(page);
    const dragged = await proof(page, models[0].id);
    assert.notEqual(dragged.hash, initial.hash, `${name} drag changes rendered pixels`);
    await figure.screenshot({ path: `${output}/${name}-drag.png` });
    if (mode.isMobile) await pinch(page, canvas);
    else { await canvas.hover(); await page.mouse.wheel(0, -180); }
    await settle(page);
    const zoomed = await proof(page, models[0].id);
    assert.notEqual(zoomed.hash, dragged.hash, `${name} zoom changes rendered pixels`);
    await figure.screenshot({ path: `${output}/${name}-zoom.png` });
    await figure.getByRole('button', { name: 'Reset view' }).click();
    await settle(page);
    assert.equal((await proof(page, models[0].id)).hash, initial.hash, 'reset restores fitted view');
    await canvas.focus();
    await page.keyboard.press('ArrowLeft');
    await settle(page);
    assert.notEqual((await proof(page, models[0].id)).hash, initial.hash, 'keyboard rotation works');
    await page.keyboard.press('Home');
    await settle(page);
    assert.equal((await proof(page, models[0].id)).hash, initial.hash, 'Home resets');
    await figure.getByRole('button', { name: 'Zoom in', exact: true }).click();
    await settle(page);
    assert.notEqual((await proof(page, models[0].id)).hash, initial.hash, 'zoom button works');
    for (const button of await figure.getByRole('button').all()) {
      const box = await button.boundingBox();
      assert.ok(box.width >= 44 && box.height >= 44, 'accessible touch target');
    }
    modeReport.interactions = { initial: initial.hash, dragged: dragged.hash, zoomed: zoomed.hash, reset: true, keyboard: true, buttons: true, idleFramesStable: true };
    await page.evaluate(() => scrollTo(0, document.body.scrollHeight));
    await page.waitForFunction(() => document.querySelectorAll('.stl-viewer canvas').length === 0);
    await page.waitForFunction(() => [...window.__stlContexts].every(gl => gl.isContextLost()));
    await ready(page, 0);
    modeReport.offscreenCleanupAndReturn = true;
    assert.ok(!requests.some(r => /viewscreen|view\/solid/.test(r)), 'no blocked viewer requests');
    assert.ok(!errors.some(e => /frame-ancestors|Content Security Policy|THREE\.|WebGL/i.test(e)), 'no viewer/CSP errors');
    assert.equal(pageErrors.length, 0, pageErrors.join('\n'));
    modeReport.modelRequests = requests.filter(r => r.endsWith('.stl'));
    assert.equal(modeReport.modelRequests.length, 7, 'each model fetched once across revisits');
    assert.ok(modeReport.modelRequests.every(r => new URL(r).origin === new URL(url).origin));
    report.viewports.push(modeReport);
    await context.close();
  }

  for (const failure of ['model-404', 'invalid-model', 'module-unavailable', 'webgl-unavailable', 'javascript-disabled']) {
    console.log(`fallback: ${failure}`);
    const context = await browser.newContext({ viewport: { width: 390, height: 844 }, javaScriptEnabled: failure !== 'javascript-disabled' });
    if (failure === 'model-404') await context.route('**/servo-enclosure-test-1.stl', route => route.fulfill({ status: 404, body: 'Missing STL' }));
    if (failure === 'invalid-model') await context.route('**/servo-enclosure-test-1.stl', route => route.fulfill({ status: 200, body: '<html>Not an STL</html>' }));
    if (failure === 'module-unavailable') await context.route('**/stl-viewer-scene.js', route => route.abort());
    // Fault injection only in failure cases. Successful rendering above uses real WebGL.
    if (failure === 'webgl-unavailable') await context.addInitScript(() => {
      const getContext = HTMLCanvasElement.prototype.getContext;
      HTMLCanvasElement.prototype.getContext = function(type, ...args) {
        return type.startsWith('webgl') ? null : getContext.call(this, type, ...args);
      };
    });
    const page = await context.newPage();
    page.setDefaultTimeout(15000);
    page.setDefaultNavigationTimeout(30000);
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    const figure = page.locator('.stl-viewer').first();
    await figure.scrollIntoViewIfNeeded();
    if (failure !== 'javascript-disabled') {
      await page.waitForFunction(() => document.querySelector('.stl-viewer').dataset.state === 'error');
      assert.match(await figure.getByRole('status').textContent(), /could not/);
    } else assert.match(await figure.getByRole('status').textContent(), /requires JavaScript/);
    assert.ok(await figure.getByRole('status').isVisible());
    assert.ok(await figure.getByRole('link', { name: /Download STL/ }).isVisible());
    assert.equal(await figure.locator('canvas').count(), 0);
    assert.equal(await figure.getByRole('link').getAttribute('href'), '/blog/assets/toby/stl/servo-enclosure-test-1.stl');
    await figure.screenshot({ path: `${output}/${failure}.png` });
    // The unchanged downloadable local URL succeeds outside the injected failing request.
    const response = await context.request.get(new URL(await figure.getByRole('link').getAttribute('href'), url).href);
    assert.equal(response.status(), 200);
    assert.equal((await response.body()).length, models[0].bytes);
    report.failures.push({ scenario: failure, visibleMessage: true, downloadFallback: true });
    await context.close();
  }
  console.log('PASS: 14 real model renders; desktop drag/wheel, mobile touch/pinch, reset, keyboard, buttons, idle rendering, GPU cleanup; 5 failure fallbacks.');
} finally {
  writeFileSync(`${output}/report.json`, JSON.stringify(report, null, 2) + '\n');
  await browser.close();
}
