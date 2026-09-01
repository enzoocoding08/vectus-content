import { mkdir, readdir } from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { postPath, root } from "./lib.mjs";

const target = process.argv[2];
if (!target) throw new Error("Usage: node carousel-render.mjs <post-folder>");
const post = postPath(target);
const htmlDir = resolve(post, "05-edit/html");
const output = resolve(post, "06-renders/final");
process.env.PLAYWRIGHT_BROWSERS_PATH ||= resolve(root, "tools/content-renderer/.browsers");
const { chromium } = await import(resolve(root, "tools/content-renderer/node_modules/playwright/index.mjs"));
await mkdir(output, { recursive: true });
const files = (await readdir(htmlDir)).filter((name) => /^slide-\d+\.html$/.test(name)).sort();
if (files.length < 6 || files.length > 8) throw new Error("Expected 6-8 slides; found " + files.length);
const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 1080, height: 1080 }, deviceScaleFactor: 1 });
  for (const file of files) {
    await page.goto(pathToFileURL(resolve(htmlDir, file)).href);
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: resolve(output, file.replace(/\.html$/, ".png")) });
  }
} finally {
  await browser.close();
}
console.log("Rendered " + files.length + " PNG files");
