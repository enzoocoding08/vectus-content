import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { postPath, root } from "./lib.mjs";

const target = process.argv[2];
if (!target) throw new Error("Usage: node carousel-generate.mjs <post-folder>");
const post = postPath(target);
const output = resolve(post, "05-edit/html");
const data = JSON.parse(await readFile(resolve(post, "content.json"), "utf8"));
const fontData = async (name) => "data:font/ttf;base64," + (await readFile(resolve(root, "assets/fonts", name))).toString("base64");
const space = await fontData("SpaceGrotesk-Variable.ttf");
const mono = await fontData("IBMPlexMono-Regular.ttf");
const esc = (value = "") => String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
await mkdir(output, { recursive: true });

for (let index = 0; index < data.slides.length; index += 1) {
  const slide = data.slides[index];
  const color = slide.color;
  const centered = slide.type === "cover" || slide.type === "final";
  const bullets = slide.bullets.length ? '<div class="bullets">' + slide.bullets.map((item) => "<div><b>→</b> " + esc(item) + "</div>").join("") + "</div>" : "";
  const callout = slide.callout ? '<div class="callout">' + esc(slide.callout) + "</div>" : "";
  const footer = slide.footer ? '<div class="footer">' + esc(slide.footer) + "</div>" : "";
  const css = "@font-face{font-family:Space;src:url(" + space + ")}@font-face{font-family:Mono;src:url(" + mono + ")}*{box-sizing:border-box}html,body{margin:0;width:1080px;height:1080px;overflow:hidden}body{background:#080909;color:#f5f3ef;font-family:Space}main{width:1080px;height:1080px;padding:70px 76px;position:relative;overflow:hidden}main:before,main:after{content:'';position:absolute;width:430px;height:430px;border-radius:50%;filter:blur(105px);opacity:.18}main:before{background:#ffd83d;left:-190px;top:-210px}main:after{background:" + color + ";right:-170px;bottom:-220px}.top{display:flex;justify-content:space-between;font:700 12px Mono;letter-spacing:2px;color:#aaa;position:relative;z-index:2}.top b{color:" + color + "}.content{position:relative;z-index:2;margin-top:" + (centered ? "165px;text-align:center" : "112px") + "}.label{display:inline-block;background:" + color + ";color:#090909;border-radius:30px;padding:10px 18px;font:700 12px Mono;letter-spacing:1.6px;margin-bottom:27px}h1{margin:0;font-size:" + (slide.type === "cover" ? "82px" : "68px") + ";line-height:1;letter-spacing:-3px;font-weight:660}h1 span{display:block;color:" + color + "}.body{font-size:25px;line-height:1.42;color:#d2cfca;max-width:820px;margin:" + (centered ? "32px auto" : "30px 0") + "}.callout{margin-top:48px;border:1px solid " + color + ";background:#101111;padding:23px;text-align:center;color:" + color + ";font:700 14px Mono;letter-spacing:1.5px}.bullets{display:grid;gap:14px;margin-top:42px;text-align:left;font-size:23px}.bullets div{background:#101111;border:1px solid #303130;padding:16px 20px}.bullets b{color:" + color + ";margin-right:10px}.footer{position:absolute;bottom:60px;left:58px;right:58px;text-align:center;color:" + color + ";font:700 12px Mono;letter-spacing:1.5px;line-height:1.5}";
  const html = '<!doctype html><meta charset="utf-8"><style>' + css + '</style><main><div class="top"><span>VECTUS — LEARN BETTER</span><b>' + String(index + 1).padStart(2, "0") + " / " + String(data.slides.length).padStart(2, "0") + '</b></div><section class="content"><div class="label">' + esc(slide.label) + "</div><h1>" + esc(slide.title) + "<span>" + esc(slide.accent) + '</span></h1><p class="body">' + esc(slide.body) + "</p>" + bullets + callout + "</section>" + footer + "</main>";
  await writeFile(resolve(output, "slide-" + String(index + 1).padStart(2, "0") + ".html"), html);
}
console.log("Generated " + data.slides.length + " slides");
