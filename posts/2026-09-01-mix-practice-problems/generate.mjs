import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
const here = new URL(".", import.meta.url).pathname;
const root = resolve(here, "../..");
const output = resolve(here, "05-edit/html");
const font = async (name) => `data:font/ttf;base64,${(await readFile(resolve(root, "assets/fonts", name))).toString("base64")}`;
const spaceGrotesk = await font("SpaceGrotesk-Variable.ttf");
const plexMono = await font("IBMPlexMono-Regular.ttf");
const slides = [
  {
    "color": "#ff4da6",
    "type": "cover",
    "label": "THE PRACTICE TRAP",
    "title": "ONE PROBLEM TYPE",
    "accent": "FEELS TOO EASY.",
    "body": "You may be learning to repeat a pattern — not choose the right method.",
    "footer": "SWIPE TO MAKE PRACTICE EXAM-READY ->"
  },
  {
    "color": "#ffd83d",
    "label": "BLOCKED PRACTICE",
    "title": "The method is",
    "accent": "already decided.",
    "body": "After five identical examples, you know what comes next. You practise the steps — but not the choice.",
    "chips": [
      "A",
      "A",
      "A",
      "A",
      "B",
      "B",
      "B",
      "B"
    ]
  },
  {
    "color": "#37f28a",
    "label": "INTERLEAVING",
    "title": "Mix related",
    "accent": "problem types.",
    "body": "Now every question asks two things: Which method fits? And can you execute it?",
    "chips": [
      "A",
      "C",
      "B",
      "A",
      "B",
      "C",
      "A",
      "C"
    ]
  },
  {
    "color": "#ff4da6",
    "label": "THE USEFUL STRUGGLE",
    "title": "Pause before",
    "accent": "you calculate.",
    "body": "Name the clue. Choose the method. Then solve. That decision is part of the skill.",
    "callout": "CLUE -> METHOD -> SOLUTION"
  },
  {
    "color": "#37f28a",
    "label": "START SMALL",
    "title": "Mix two or three",
    "accent": "related types.",
    "body": "Learn each method first. Then shuffle a short set. Completely new material may still need focused examples.",
    "chips": [
      "LEARN",
      "MIX",
      "CHOOSE",
      "SOLVE"
    ]
  },
  {
    "color": "#ffd83d",
    "label": "CHECK THE RIGHT THING",
    "title": "Do not only ask:",
    "accent": "Was I correct?",
    "body": "Also ask: Did I choose the method from the problem clues — or from the page heading?",
    "callout": "EXPLAIN WHY YOUR METHOD FITS"
  },
  {
    "color": "#ff4da6",
    "type": "final",
    "label": "YOUR NEXT PROBLEM SET",
    "title": "Stop rehearsing",
    "accent": "predictable order.",
    "body": "Practise choosing, solving, and explaining — the way a mixed exam actually demands.",
    "footer": "SAVE THIS: LEARN -> MIX -> CHOOSE -> SOLVE -> EXPLAIN"
  }
];
await mkdir(output, { recursive: true });
for (let index = 0; index < slides.length; index++) {
  const slide = slides[index];
  const centered = slide.type === "cover" || slide.type === "final";
  const css = `@font-face{font-family:Space;src:url(${spaceGrotesk})}@font-face{font-family:Mono;src:url(${plexMono})}*{box-sizing:border-box}html,body{margin:0;width:1080px;height:1080px;overflow:hidden}body{background:#080909;color:#f5f3ef;font-family:Space}main{width:1080px;height:1080px;padding:70px 76px;position:relative;overflow:hidden}main:before,main:after{content:"";position:absolute;width:430px;height:430px;border-radius:50%;filter:blur(105px);opacity:.18}main:before{background:#ffd83d;left:-190px;top:-210px}main:after{background:${slide.color};right:-170px;bottom:-220px}.top{display:flex;justify-content:space-between;font:700 12px Mono;letter-spacing:2px;color:#aaa;position:relative;z-index:2}.top b{color:${slide.color}}.content{position:relative;z-index:2;margin-top:${centered ? 176 : 132}px;${centered ? "text-align:center" : ""}}.label{display:inline-block;background:${slide.color};color:#090909;border-radius:30px;padding:10px 18px;font:700 12px Mono;letter-spacing:1.6px;margin-bottom:27px}h1{margin:0;font-size:${slide.type === "cover" ? 82 : 70}px;line-height:1;letter-spacing:-3px;font-weight:660}h1 span{display:block;color:${slide.color}}.body{font-size:25px;line-height:1.42;color:#d2cfca;max-width:800px;margin:${centered ? "32px auto" : "30px 0"} 0}.callout{margin-top:62px;border:1px solid ${slide.color};background:#101111;padding:25px;text-align:center;color:${slide.color};font:700 14px Mono;letter-spacing:1.8px}.chips{display:flex;flex-wrap:wrap;gap:14px;margin-top:55px}.chip{border:1px solid #363735;background:#101111;padding:18px 22px;color:${slide.color};font:700 13px Mono;letter-spacing:1.4px}.footer{position:absolute;bottom:60px;left:58px;right:58px;text-align:center;color:${slide.color};font:700 12px Mono;letter-spacing:1.7px;line-height:1.5}`;
  const chips = slide.chips ? `<div class="chips">${slide.chips.map((chip) => `<div class="chip">${chip}</div>`).join("")}</div>` : "";
  const html = `<!doctype html><meta charset="utf-8"><style>${css}</style><main><div class="top"><span>VECTUS — BRAIN SCIENCE</span><b>${String(index + 1).padStart(2, "0")} / 07</b></div><section class="content"><div class="label">${slide.label}</div><h1>${slide.title}<span>${slide.accent}</span></h1><p class="body">${slide.body}</p>${chips}${slide.callout ? `<div class="callout">${slide.callout}</div>` : ""}</section>${slide.footer ? `<div class="footer">${slide.footer}</div>` : ""}</main>`;
  await writeFile(resolve(output, `slide-${String(index + 1).padStart(2, "0")}.html`), html);
}
console.log("Generated 7 slides");
