import { mkdir, readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const here = new URL(".", import.meta.url).pathname;
const htmlDir = resolve(here, "05-edit/html");
const output = resolve(here, "06-renders/final");
const content = JSON.parse(await readFile(resolve(here, "content.json"), "utf8"));
process.env.PLAYWRIGHT_BROWSERS_PATH = resolve(here, "../../tools/content-renderer/.browsers");
const { chromium } = await import("../../tools/content-renderer/node_modules/playwright/index.mjs");

await mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1080, height: 1080 }, deviceScaleFactor: 1 });
for (let index = 1; index <= content.slides.length; index++) {
  const name = `slide-${String(index).padStart(2, "0")}`;
  await page.goto(pathToFileURL(resolve(htmlDir, `${name}.html`)).href);
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: resolve(output, `${name}.png`) });
}
await browser.close();
console.log(`Rendered ${content.slides.length} PNG files`);
