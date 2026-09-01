import { execFileSync } from "node:child_process";
import { access, readFile, readdir } from "node:fs/promises";
import { join, relative } from "node:path";
import { postPath, root } from "./lib.mjs";

const target = process.argv[2];
if (!target) throw new Error("Usage: node validate-post.mjs <post-folder>");
const post = postPath(target);
const finalDir = join(post, "06-renders/final");
const files = (await readdir(finalDir)).filter((name) => /^slide-\d+\.png$/.test(name)).sort();
if (files.length < 6 || files.length > 10) throw new Error(`Expected 6-10 slides, found ${files.length}`);

for (const file of files) {
  const dimensions = execFileSync("ffprobe", [
    "-v", "error", "-select_streams", "v:0", "-show_entries", "stream=width,height",
    "-of", "csv=s=x:p=0", join(finalDir, file),
  ], { encoding: "utf8" }).trim();
  if (dimensions !== "1080x1080") throw new Error(`${file}: expected 1080x1080, got ${dimensions}`);
}

const caption = await readFile(join(finalDir, "caption.txt"), "utf8");
if (!/AI-assisted content\. Reviewed by Vectus Lern\./i.test(caption)) {
  throw new Error("caption.txt is missing the required AI-assisted disclosure");
}
if (!/#VectusLern\b/i.test(caption)) throw new Error("caption.txt is missing #VectusLern");
if (caption.length > 2200) throw new Error(`Caption exceeds 2200 characters (${caption.length})`);
await access(join(post, "post.json"));

console.log(JSON.stringify({
  valid: true,
  post: relative(root, post),
  slides: files.length,
  dimensions: "1080x1080",
  aiDisclosure: true,
  captionCharacters: caption.length,
}, null, 2));
