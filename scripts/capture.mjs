/**
 * Gera as capturas (PNG) e animações (GIF) usadas no README.
 *
 *   1. npm start            (em outro terminal)
 *   2. npm run capture
 *
 * Variáveis opcionais: BASE_URL (padrão http://localhost:4300) e CHROME_PATH.
 */
import { mkdir, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer-core';
import { PNG } from 'pngjs';
import gifenc from 'gifenc';

const { GIFEncoder, quantize, applyPalette } = gifenc;

const BASE = process.env.BASE_URL ?? 'http://localhost:4300';
const OUT = new URL('../docs/screenshots/', import.meta.url);
const CHROME =
  process.env.CHROME_PATH ??
  [
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium',
  ].find((p) => existsSync(p));

const MOBILE = { width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true };
const MOBILE_GIF = { width: 360, height: 720, deviceScaleFactor: 1, isMobile: true, hasTouch: true };
const DESKTOP = { width: 1440, height: 900, deviceScaleFactor: 1 };

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const file = (name) => fileURLToPath(new URL(name, OUT));

if (!CHROME) throw new Error('Chrome não encontrado. Defina CHROME_PATH.');
await mkdir(OUT, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ['--hide-scrollbars', '--force-color-profile=srgb'],
});

/** Abre uma página em contexto isolado. `intro=false` marca a abertura como já vista. */
async function open(path, viewport, { intro = false } = {}) {
  const ctx = await browser.createBrowserContext();
  const page = await ctx.newPage();
  await page.setViewport(viewport);
  if (!intro) {
    await page.evaluateOnNewDocument(() => sessionStorage.setItem('imperium:intro-seen', '1'));
  }
  await page.goto(BASE + path, { waitUntil: 'networkidle0' });
  await page.evaluate(() => document.fonts.ready);
  return { page, close: () => ctx.close() };
}

async function scrollTo(page, selector, offset = 0) {
  await page.evaluate(
    (sel, off) => {
      const el = document.querySelector(sel);
      window.scrollTo({ top: el.getBoundingClientRect().top + scrollY + off, behavior: 'instant' });
    },
    selector,
    offset,
  );
}

async function shot(page, name) {
  await page.screenshot({ path: file(name) });
  console.log('  ✔', name);
}

/** Grava quadros por `ms` e salva como GIF (atrasos reais entre quadros). */
async function record(page, name, ms, { fps = 12, during } = {}) {
  const frames = [];
  const start = Date.now();
  const action = during?.();
  while (Date.now() - start < ms) {
    const t = Date.now();
    frames.push({ buf: await page.screenshot({ type: 'png' }), t });
    const wait = 1000 / fps - (Date.now() - t);
    if (wait > 0) await sleep(wait);
  }
  await action;

  const gif = GIFEncoder();
  frames.forEach((f, i) => {
    const png = PNG.sync.read(f.buf);
    const palette = quantize(png.data, 256);
    const index = applyPalette(png.data, palette);
    const delay = i < frames.length - 1 ? frames[i + 1].t - f.t : 1200;
    gif.writeFrame(index, png.width, png.height, { palette, delay });
  });
  gif.finish();
  await writeFile(file(name), gif.bytes());
  console.log(`  ✔ ${name} (${frames.length} quadros, ${(gif.bytes().length / 1e6).toFixed(1)} MB)`);
}

console.log(`Capturando ${BASE} com ${CHROME}\n`);

// ---------- PNG mobile ----------
{
  const { page, close } = await open('/', MOBILE, { intro: true });
  await sleep(4600);
  await shot(page, 'mobile-abertura.png');
  await close();
}
{
  const { page, close } = await open('/', MOBILE);
  await sleep(3000);
  await shot(page, 'mobile-inicio.png');

  await scrollTo(page, '#faccoes', -60);
  await sleep(2200);
  await shot(page, 'mobile-carrossel.png');

  await page.click('.burger');
  await sleep(1500);
  await shot(page, 'mobile-menu.png');
  await close();
}
{
  const { page, close } = await open('/faccao/adeptus-mechanicus', MOBILE);
  await sleep(2600);
  await shot(page, 'mobile-faccao.png');

  await scrollTo(page, '.stats', -20);
  await sleep(2400);
  await shot(page, 'mobile-atributos.png');

  await scrollTo(page, '.timeline-section', -40);
  await sleep(2200);
  await shot(page, 'mobile-linha-do-tempo.png');
  await close();
}

// ---------- PNG desktop ----------
{
  const { page, close } = await open('/', DESKTOP);
  await sleep(3000);
  await shot(page, 'desktop-inicio.png');
  await scrollTo(page, '#faccoes', -40);
  await sleep(2200);
  await shot(page, 'desktop-carrossel.png');
  await close();
}
{
  const { page, close } = await open('/faccao/adeptus-custodes', DESKTOP);
  await sleep(2600);
  await shot(page, 'desktop-faccao.png');
  await close();
}

// ---------- GIFs ----------
{
  const { page, close } = await open('/', MOBILE_GIF, { intro: true });
  await record(page, 'abertura.gif', 6200, { fps: 10 });
  await close();
}
{
  const { page, close } = await open('/', MOBILE_GIF);
  await scrollTo(page, '#faccoes', -60);
  await sleep(1500);
  await record(page, 'carrossel.gif', 5200, {
    fps: 12,
    during: async () => {
      for (let i = 0; i < 3; i++) {
        await sleep(1100);
        await page.click('.arrow[aria-label="Próxima"]');
      }
    },
  });
  await close();
}
{
  const { page, close } = await open('/', MOBILE_GIF);
  await scrollTo(page, '#faccoes', -60);
  await sleep(1500);
  await record(page, 'navegacao.gif', 6500, {
    fps: 12,
    during: async () => {
      await sleep(600);
      await page.click('.card.active');
      await sleep(3200);
      for (let y = 0; y < 8; y++) {
        await page.evaluate(() => scrollBy({ top: 70, behavior: 'instant' }));
        await sleep(90);
      }
    },
  });
  await close();
}

await browser.close();
console.log('\nPronto → docs/screenshots/');
