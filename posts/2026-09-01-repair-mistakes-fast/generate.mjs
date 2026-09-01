import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
const here = new URL(".", import.meta.url).pathname;
const root = resolve(here, "../..");
const output = resolve(here, "05-edit/html");
const font = async (name) => `data:font/ttf;base64,${(await readFile(resolve(root, "assets/fonts", name))).toString("base64")}`;
const spaceGrotesk = await font("SpaceGrotesk-Variable.ttf");
const plexMono = await font("IBMPlexMono-Regular.ttf");
const slides = [
  { color: "#ff4da6", type: "cover", label: "THE RED X", title: "YOU GOT IT WRONG.", accent: "GOOD.", body: "Now do this before your brain wastes the mistake.", footer: "SWIPE FOR THE 5-MINUTE REPAIR LOOP ->" },
  { color: "#ffd83d", label: "THE TRAP", title: "Reading the solution", accent: "is not the fix.", body: "It can feel obvious while the answer is visible — without proving you can produce it alone.", callout: "FAMILIAR NOW != RETRIEVABLE LATER" },
  { color: "#37f28a", label: "STEP 01 — DIAGNOSE", title: "Name the", accent: "actual cause.", body: "Was it missing knowledge, the wrong method, a misread prompt, or careless execution?", chips: ["KNOWLEDGE", "METHOD", "MISREAD", "CARELESS"] },
  { color: "#ff4da6", label: "STEP 02 — REPAIR", title: "Fix the gap.", accent: "Not the chapter.", body: "Review the smallest idea or step that caused the error. Then close the solution.", callout: "TARGET THE CAUSE — NOT EVERYTHING" },
  { color: "#37f28a", label: "STEP 03 — RETRIEVE", title: "Start again from", accent: "a blank page.", body: "Redo the same problem without looking. A clean retry is evidence that something changed.", callout: "NO PEEKING. NO COPYING." },
  { color: "#ffd83d", label: "STEP 04 — EXPLAIN", title: "Say why the", accent: "correct step works.", body: "If you cannot explain the correction in your own words, the gap may still be hiding.", callout: "CORRECT ANSWER + REASON" },
  { color: "#ff4da6", type: "final", label: "STEP 05 — RETEST", title: "Try a similar question", accent: "later.", body: "If the error returns, repair again. If it holds, move on.", footer: "SAVE THIS LOOP: DIAGNOSE -> REPAIR -> RETRIEVE -> EXPLAIN -> RETEST" },
];
await mkdir(output, { recursive: true });
for (let index = 0; index < slides.length; index++) {
  const slide = slides[index];
  const centered = slide.type === "cover" || slide.type === "final";
  const css = `@font-face{font-family:Space;src:url(${spaceGrotesk})}@font-face{font-family:Mono;src:url(${plexMono})}*{box-sizing:border-box}html,body{margin:0;width:1080px;height:1080px;overflow:hidden}body{background:#080909;color:#f5f3ef;font-family:Space}main{width:1080px;height:1080px;padding:70px 76px;position:relative;overflow:hidden}main:before,main:after{content:"";position:absolute;width:430px;height:430px;border-radius:50%;filter:blur(105px);opacity:.18}main:before{background:#ffd83d;left:-190px;top:-210px}main:after{background:${slide.color};right:-170px;bottom:-220px}.top{display:flex;justify-content:space-between;font:700 12px Mono;letter-spacing:2px;color:#aaa;position:relative;z-index:2}.top b{color:${slide.color}}.content{position:relative;z-index:2;margin-top:${centered ? 176 : 132}px;${centered ? "text-align:center" : ""}}.label{display:inline-block;background:${slide.color};color:#090909;border-radius:30px;padding:10px 18px;font:700 12px Mono;letter-spacing:1.6px;margin-bottom:27px}h1{margin:0;font-size:${slide.type === "cover" ? 82 : 70}px;line-height:1;letter-spacing:-3px;font-weight:660}h1 span{display:block;color:${slide.color}}.body{font-size:25px;line-height:1.42;color:#d2cfca;max-width:800px;margin:${centered ? "32px auto" : "30px 0"} 0}.callout{margin-top:62px;border:1px solid ${slide.color};background:#101111;padding:25px;text-align:center;color:${slide.color};font:700 14px Mono;letter-spacing:1.8px}.chips{display:flex;flex-wrap:wrap;gap:14px;margin-top:55px}.chip{border:1px solid #363735;background:#101111;padding:18px 22px;color:${slide.color};font:700 13px Mono;letter-spacing:1.4px}.footer{position:absolute;bottom:60px;left:58px;right:58px;text-align:center;color:${slide.color};font:700 12px Mono;letter-spacing:1.7px;line-height:1.5}`;
  const chips = slide.chips ? `<div class="chips">${slide.chips.map((chip) => `<div class="chip">${chip}</div>`).join("")}</div>` : "";
  const html = `<!doctype html><style>${css}</style><main><div class="top"><span>VECTUS — BRAIN SCIENCE</span><b>${String(index + 1).padStart(2, "0")} / 07</b></div><section class="content"><div class="label">${slide.label}</div><h1>${slide.title}<span>${slide.accent}</span></h1><p class="body">${slide.body}</p>${chips}${slide.callout ? `<div class="callout">${slide.callout}</div>` : ""}</section>${slide.footer ? `<div class="footer">${slide.footer}</div>` : ""}</main>`;
  await writeFile(resolve(output, `slide-${String(index + 1).padStart(2, "0")}.html`), html);
}
console.log("Generated 7 slides");
