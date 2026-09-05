import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const here = new URL(".", import.meta.url).pathname;
const root = resolve(here, "../..");
const output = resolve(here, "05-edit/html");
const content = JSON.parse(await readFile(resolve(here, "content.json"), "utf8"));
const font = async (name) => `data:font/ttf;base64,${(await readFile(resolve(root, "assets/fonts", name))).toString("base64")}`;
const spaceGrotesk = await font("SpaceGrotesk-Variable.ttf");
const plexMono = await font("IBMPlexMono-Regular.ttf");
const escapeHtml = (value) => String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");

await mkdir(output, { recursive: true });
for (let index = 0; index < content.slides.length; index++) {
  const slide = content.slides[index];
  const centered = slide.type === "cover" || slide.type === "final";
  const css = `@font-face{font-family:Space;src:url(${spaceGrotesk})}@font-face{font-family:Mono;src:url(${plexMono})}*{box-sizing:border-box}html,body{margin:0;width:1080px;height:1080px;overflow:hidden}body{background:#080909;color:#f5f3ef;font-family:Space}main{width:1080px;height:1080px;padding:70px 76px;position:relative;overflow:hidden}main:before,main:after{content:"";position:absolute;width:430px;height:430px;border-radius:50%;filter:blur(105px);opacity:.18}main:before{background:#ffd83d;left:-190px;top:-210px}main:after{background:${slide.color};right:-170px;bottom:-220px}.top{display:flex;justify-content:space-between;font:700 12px Mono;letter-spacing:2px;color:#aaa;position:relative;z-index:2}.top b{color:${slide.color}}.content{position:relative;z-index:2;margin-top:${centered ? 176 : 132}px;${centered ? "text-align:center" : ""}}.label{display:inline-block;background:${slide.color};color:#090909;border-radius:30px;padding:10px 18px;font:700 12px Mono;letter-spacing:1.6px;margin-bottom:27px}h1{margin:0;font-size:${slide.type === "cover" ? 82 : 70}px;line-height:1;letter-spacing:-3px;font-weight:660}h1 span{display:block;color:${slide.color}}.body{font-size:25px;line-height:1.42;color:#d2cfca;max-width:800px;margin:${centered ? "32px auto" : "30px 0"}}.callout{margin-top:58px;border:1px solid ${slide.color};background:#101111;padding:23px;text-align:center;color:${slide.color};font:700 14px Mono;letter-spacing:1.6px}.chips{display:flex;flex-wrap:wrap;gap:14px;margin-top:48px;${centered ? "justify-content:center" : ""}}.chip{border:1px solid #363735;background:#101111;padding:18px 22px;color:${slide.color};font:700 13px Mono;letter-spacing:1.4px}`;
  const chips = slide.chips ? `<div class="chips">${slide.chips.map((chip) => `<div class="chip">${escapeHtml(chip)}</div>`).join("")}</div>` : "";
  const callout = slide.callout ? `<div class="callout">${escapeHtml(slide.callout)}</div>` : "";
  const html = `<!doctype html><meta charset="utf-8"><style>${css}</style><main><div class="top"><span>VECTUS — BRAIN SCIENCE</span><b>${String(index + 1).padStart(2, "0")} / ${String(content.slides.length).padStart(2, "0")}</b></div><section class="content"><div class="label">${escapeHtml(slide.label)}</div><h1>${escapeHtml(slide.title)}<span>${escapeHtml(slide.accent)}</span></h1><p class="body">${escapeHtml(slide.body)}</p>${chips}${callout}</section></main>`;
  await writeFile(resolve(output, `slide-${String(index + 1).padStart(2, "0")}.html`), html);
}
console.log(`Generated ${content.slides.length} slides`);
