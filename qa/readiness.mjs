import { createRequire } from 'node:module';
import { readFile, writeFile, mkdir, stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import { resolve, extname, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

// Run from the project root. A readiness pass proves tooling, not site quality.
const require = createRequire(process.env.SITECHECK_PACKAGE_JSON || import.meta.url);
const { chromium, firefox, webkit } = require('playwright');
const config = JSON.parse(await readFile(process.argv[2], 'utf8'));
const output = resolve(process.env.SITECHECK_OUTPUT || 'qa/readiness-results');
await mkdir(output, { recursive: true });
const report = {
  kind: 'sitecheck-readiness', target: config.target,
  commit: process.env.GITHUB_SHA || process.env.SITECHECK_COMMIT || 'unrecorded',
  timestamp: new Date().toISOString(), status: 'Blocked—readiness check failed',
  source: { status: 'pending' }, browsers: [],
  screenshotInspection: 'pending: a reviewer must open every readiness capture',
  limitations: ['Readiness only; not a website audit or physical-device test.']
};
let server;
try {
  const root = resolve(config.root || 'public');
  const source = resolve(root, config.source);
  if (!source.startsWith(root + sep)) throw new Error('Source path leaves configured root');
  const contents = await readFile(source, 'utf8');
  if (!contents.trim()) throw new Error('Source file is empty');
  report.source = { status: 'passed', file: source, bytes: Buffer.byteLength(contents) };
  const mime = { '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.woff2': 'font/woff2' };
  server = createServer(async (req, res) => {
    try {
      let file = resolve(root, '.' + decodeURIComponent(new URL(req.url, 'http://localhost').pathname));
      if (file !== root && !file.startsWith(root + sep)) return res.writeHead(403).end();
      if ((await stat(file)).isDirectory()) file = resolve(file, 'index.html');
      res.writeHead(200, { 'Content-Type': mime[extname(file)] || 'application/octet-stream' });
      res.end(await readFile(file));
    } catch { res.writeHead(404).end('Not found'); }
  });
  await new Promise((ok, fail) => { server.once('error', fail); server.listen(0, '127.0.0.1', ok); });
  const origin = `http://127.0.0.1:${server.address().port}`;
  report.testedURL = origin + config.path;
  const requested = (process.env.QA_BROWSER || 'chromium,firefox,webkit').split(',');
  for (const name of requested) {
    const result = { name, status: 'failed', stages: {}, captures: [] };
    report.browsers.push(result);
    let browser;
    try {
      const engine = { chromium, firefox, webkit }[name];
      if (!engine) throw new Error('Unknown browser: ' + name);
      browser = await engine.launch({ headless: true, timeout: 20000 });
      result.version = browser.version();
      result.stages.launch = 'passed';
      for (const viewport of config.viewports) {
        const context = await browser.newContext({ viewport });
        try {
          // Confine the source-copy proof to the local site. No remote submissions.
          await context.route('**/*', route => {
            const request = route.request();
            if (request.url().startsWith(origin + '/') && ['GET', 'HEAD'].includes(request.method())) return route.continue();
            return route.abort('blockedbyclient');
          });
          const page = await context.newPage();
          page.setDefaultTimeout(10000);
          await page.goto(origin + config.path, { waitUntil: 'load', timeout: 20000 });
          const frame = config.frame ? page.frameLocator(config.frame) : page;
          await frame.getByRole(config.control.role, { name: config.control.name, exact: true }).click();
          const expected = frame.getByRole(config.expected.role, { name: config.expected.name, exact: true });
          await expected.waitFor({ state: 'visible' });
          // Wait for the panel transition to settle using its actual animations.
          await expected.evaluate(el => Promise.all(el.getAnimations({ subtree: true }).map(a => a.finished.catch(() => {}))));
          const actual = await page.evaluate(() => ({ width: innerWidth, height: innerHeight }));
          if (actual.width !== viewport.width || actual.height !== viewport.height) throw new Error('Viewport mismatch: ' + JSON.stringify({ viewport, actual }));
          const file = `${name}-${viewport.width}x${viewport.height}.png`;
          await page.screenshot({ path: resolve(output, file) });
          const bytes = await readFile(resolve(output, file));
          if (bytes.length < 100 || bytes.subarray(0, 8).toString('hex') !== '89504e470d0a1a0a') throw new Error('Invalid screenshot PNG');
          result.captures.push({ file, requested: viewport, actual, clickVerified: true, screenshotCaptured: true, visuallyInspected: false });
        } finally { await context.close(); }
      }
      result.stages.interaction = 'passed';
      result.stages.screenshotCapture = 'passed';
      result.status = 'machine checks passed; visual inspection pending';
    } catch (error) { result.error = error.stack; }
    finally { if (browser) await browser.close().catch(() => {}); }
    console.log(`${name}: ${result.status}${result.error ? '\n' + result.error : ''}`);
  }
  if (report.browsers.length === requested.length && report.browsers.every(b => b.status.startsWith('machine checks passed'))) report.status = 'Machine readiness passed—screenshot inspection pending';
} catch (error) { report.error = error.stack; }
finally {
  if (server) await new Promise(ok => server.close(ok));
  await writeFile(resolve(output, 'report.json'), JSON.stringify(report, null, 2));
}
console.log(report.status);
process.exitCode = report.status.startsWith('Machine readiness passed') ? 0 : 1;
