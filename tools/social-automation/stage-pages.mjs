import { execFileSync } from "node:child_process";
import { mkdir, readdir, writeFile } from "node:fs/promises";
import { basename, resolve } from "node:path";
import { postPath, root } from "./lib.mjs";

const target = process.argv[2];
if (!target) throw new Error("Usage: node stage-pages.mjs <post-folder>");
const post = postPath(target);
const id = basename(post);
const source = resolve(post, "06-renders/final");
const destination = resolve(root, "_site/media", id);
await mkdir(destination, { recursive: true });
const slides = (await readdir(source)).filter((name) => /^slide-\d+\.png$/.test(name)).sort();
for (const slide of slides) {
  execFileSync("ffmpeg", ["-hide_banner", "-loglevel", "error", "-i", resolve(source, slide), "-q:v", "2", "-pix_fmt", "yuvj420p", "-y", resolve(destination, slide.replace(".png", ".jpg"))]);
}
await writeFile(resolve(root, "_site/.nojekyll"), "");
await writeFile(resolve(root, "_site/index.html"), "<!doctype html><title>Vectus media</title><meta name=\"robots\" content=\"noindex\">");
await writeFile(resolve(root, "_site/media-manifest.json"), JSON.stringify({ post: id, slides: slides.map((name) => "media/" + id + "/" + name.replace(".png", ".jpg")) }, null, 2));
console.log(JSON.stringify({ post: id, slides: slides.length }));
