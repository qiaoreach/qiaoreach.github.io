// Print MD5 of document.body.innerText for every HTML page.
// Uses the system Chrome. Requires puppeteer-core (not shipped with the site).
//
//   node tools/visible-text-md5.mjs [width]
//
// width defaults to 1280. Pass 390 to match the phone viewport used in review.

import { createHash } from 'node:crypto';
import { readdir } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const width = Number(process.argv[2] || 1280);
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const puppeteerPath = process.env.PUPPETEER_CORE || '/tmp/pptr/node_modules/puppeteer-core/lib/esm/puppeteer/puppeteer-core.js';
const puppeteer = await import(pathToFileURL(puppeteerPath).href);

const files = (await readdir(root)).filter((name) => name.endsWith('.html')).sort();
const browser = await puppeteer.launch({
  executablePath: process.env.CHROME || '/usr/bin/google-chrome',
  headless: true,
  args: ['--no-sandbox', '--disable-dev-shm-usage']
});

for (const file of files) {
  const page = await browser.newPage();
  await page.setViewport({ width, height: 900, deviceScaleFactor: 1 });
  await page.goto(pathToFileURL(path.join(root, file)).href, { waitUntil: 'networkidle0' });
  const text = await page.evaluate(() => (document.body ? document.body.innerText : ''));
  const md5 = createHash('md5').update(text, 'utf8').digest('hex');
  console.log(`${file}\t${width}\t${md5}\t${text.length}`);
  await page.close();
}

await browser.close();
