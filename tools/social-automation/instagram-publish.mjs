import { execFileSync, spawn } from "node:child_process";
import { createReadStream } from "node:fs";
import { access, mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import http from "node:http";
import { basename, extname, join, resolve } from "node:path";
import { loadEnv, postPath, root, updateQueue } from "./lib.mjs";

const target = process.argv[2];
const dryRun = process.argv.includes("--dry-run");
const pagesMode = process.argv.includes("--pages");
if (!target) throw new Error("Usage: node instagram-publish.mjs <post-folder> [--dry-run|--pages]");
const post = postPath(target);
const finalDir = join(post, "06-renders/final");
const publishDir = join(post, "07-publish");
const mediaDir = join(publishDir, "media");
const metadataPath = join(post, "post.json");
const caption = (await readFile(join(finalDir, "caption.txt"), "utf8")).trim();
const metadata = JSON.parse(await readFile(metadataPath, "utf8"));
if (metadata.status === "published") throw new Error("Refusing to republish an already published post");
if (!dryRun && pagesMode && process.env.REVIEW_APPROVED !== "true") throw new Error("Pages publishing requires the manually triggered review workflow");
if (!dryRun && !pagesMode) await access(join(publishDir, "APPROVED"));
if (!/AI-assisted content\. Reviewed by Vectus Lern\./i.test(caption)) throw new Error("Refusing to publish without the required AI-assisted disclosure");
const slides = (await readdir(finalDir)).filter((name) => /^slide-\d+\.png$/.test(name)).sort();
if (slides.length < 2 || slides.length > 10) throw new Error("Instagram carousel requires 2-10 slides; found " + slides.length);
if (!pagesMode) {
  await mkdir(mediaDir, { recursive: true });
  for (const slide of slides) {
    execFileSync("ffmpeg", ["-hide_banner", "-loglevel", "error", "-i", join(finalDir, slide), "-q:v", "2", "-pix_fmt", "yuvj420p", "-y", join(mediaDir, slide.replace(/\.png$/, ".jpg"))]);
  }
}
if (dryRun) {
  console.log(JSON.stringify({ ready: true, approved: false, post: metadata.id, slides: slides.length, captionCharacters: caption.length }, null, 2));
  process.exit(0);
}
const env = { ...(await loadEnv()), ...process.env };
for (const key of ["INSTAGRAM_ACCESS_TOKEN", "INSTAGRAM_USER_ID", "INSTAGRAM_API_VERSION"]) if (!env[key]) throw new Error("Missing " + key);

async function graph(path, options = {}) {
  const response = await fetch("https://graph.instagram.com/" + env.INSTAGRAM_API_VERSION + "/" + path, {
    ...options, headers: { Authorization: "Bearer " + env.INSTAGRAM_ACCESS_TOKEN, ...(options.headers || {}) },
  });
  const data = await response.json();
  if (!response.ok || data.error) throw new Error(JSON.stringify(data));
  return data;
}
async function waitUntilReady(id) {
  for (let attempt = 0; attempt < 30; attempt += 1) {
    const data = await graph(id + "?fields=status_code");
    if (["FINISHED", "PUBLISHED"].includes(data.status_code)) return;
    if (data.status_code === "ERROR") throw new Error("Container " + id + " failed");
    await new Promise((resolveWait) => setTimeout(resolveWait, 10_000));
  }
  throw new Error("Container " + id + " processing timed out");
}
async function publish(publicBase) {
  const childIds = [];
  for (const slide of slides) {
    const imageUrl = publicBase.replace(/\/$/, "") + "/" + slide.replace(/\.png$/, ".jpg");
    let publicReady = false;
    for (let attempt = 0; attempt < 12; attempt += 1) {
      try {
        const check = await fetch(imageUrl, { method: "HEAD" });
        if (check.ok) {
          publicReady = true;
          break;
        }
      } catch {}
      await new Promise((resolveWait) => setTimeout(resolveWait, 2_500));
    }
    if (!publicReady) throw new Error("Public media check failed: " + imageUrl);
    const body = new URLSearchParams({ image_url: imageUrl, is_carousel_item: "true" });
    const child = await graph(env.INSTAGRAM_USER_ID + "/media", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body });
    childIds.push(child.id);
  }
  await Promise.all(childIds.map(waitUntilReady));
  let body = new URLSearchParams({ media_type: "CAROUSEL", children: childIds.join(","), caption });
  const carousel = await graph(env.INSTAGRAM_USER_ID + "/media", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body });
  await waitUntilReady(carousel.id);
  body = new URLSearchParams({ creation_id: carousel.id });
  const published = await graph(env.INSTAGRAM_USER_ID + "/media_publish", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body });
  const verified = await graph(published.id + "?fields=id,media_type,permalink,timestamp,username");
  const result = { ...verified, creationId: carousel.id, childIds, sourcePost: metadata.id, aiDisclosure: true };
  await writeFile(join(publishDir, "publish-result.json"), JSON.stringify(result, null, 2) + "\n");
  metadata.status = "published";
  metadata.publishedAt = verified.timestamp;
  metadata.instagramMediaId = verified.id;
  metadata.instagramPermalink = verified.permalink;
  await writeFile(metadataPath, JSON.stringify(metadata, null, 2) + "\n");
  await updateQueue(post, "published", { publishedAt: verified.timestamp, permalink: verified.permalink });
  console.log(JSON.stringify(result, null, 2));
}
if (pagesMode) {
  if (!env.MEDIA_BASE_URL) throw new Error("Missing MEDIA_BASE_URL");
  await publish(env.MEDIA_BASE_URL);
} else {
  const cloudflared = resolve(root, "tools/social-automation/bin/cloudflared");
  await access(cloudflared);
  const server = http.createServer((request, response) => {
    const name = basename(new URL(request.url, "http://localhost").pathname);
    if (!/^slide-\d+\.jpg$/.test(name) || extname(name) !== ".jpg") return response.writeHead(404).end();
    createReadStream(join(mediaDir, name)).on("error", () => response.writeHead(404).end()).pipe(response.writeHead(200, { "Content-Type": "image/jpeg", "Cache-Control": "no-store" }));
  });
  await new Promise((done) => server.listen(0, "127.0.0.1", done));
  const tunnel = spawn(cloudflared, ["tunnel", "--url", "http://127.0.0.1:" + server.address().port, "--no-autoupdate"], { stdio: ["ignore", "pipe", "pipe"] });
  try {
    const publicBase = await new Promise((resolveUrl, reject) => {
      const timer = setTimeout(() => reject(new Error("Timed out waiting for Cloudflare tunnel URL")), 30_000);
      const inspect = (chunk) => {
        const matches = chunk.toString().matchAll(/https:\/\/[a-z0-9-]+\.trycloudflare\.com/g);
        const tunnelUrl = Array.from(matches, (match) => match[0]).find((url) => !url.includes("api.trycloudflare.com"));
        if (tunnelUrl) { clearTimeout(timer); resolveUrl(tunnelUrl); }
      };
      tunnel.stdout.on("data", inspect); tunnel.stderr.on("data", inspect);
      tunnel.on("exit", (code) => reject(new Error("cloudflared exited before startup (" + code + ")")));
    });
    await publish(publicBase);
  } finally {
    tunnel.kill("SIGINT");
    await new Promise((done) => server.close(done));
  }
}
