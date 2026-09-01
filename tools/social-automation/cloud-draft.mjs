import { cp, mkdir, readFile, writeFile } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import { resolve } from "node:path";
import { readJson, root } from "./lib.mjs";

if (!process.env.OPENAI_API_KEY) throw new Error("Missing OPENAI_API_KEY");
const config = await readJson(resolve(root, "tools/social-automation/config.json"));
const topics = await readJson(resolve(root, "tools/social-automation/topics.json"));
const historyPath = resolve(root, "tools/social-automation/history.json");
const queuePath = resolve(root, "tools/social-automation/queue.json");
const history = await readJson(historyPath);
const queue = await readJson(queuePath);
const used = new Set(history.generated.map((item) => item.topic));
const topic = topics.ideas.find((idea) => !used.has(idea)) || topics.ideas[history.generated.length % topics.ideas.length];
const parts = Object.fromEntries(new Intl.DateTimeFormat("en", { timeZone: config.timezone, year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(new Date()).map((part) => [part.type, part.value]));
const today = parts.year + "-" + parts.month + "-" + parts.day;
const baseSlug = topic.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 42);
let slug = baseSlug;
let id = today + "-" + slug;
let suffix = 2;
while (history.generated.some((item) => item.slug === slug)) {
  slug = baseSlug + "-" + suffix;
  id = today + "-" + slug;
  suffix += 1;
}
const slideSchema = {
  type: "object",
  additionalProperties: false,
  required: ["type", "label", "title", "accent", "body", "callout", "footer", "bullets", "color"],
  properties: {
    type: { type: "string", enum: ["cover", "plain", "final"] },
    label: { type: "string" },
    title: { type: "string" },
    accent: { type: "string" },
    body: { type: "string" },
    callout: { type: "string" },
    footer: { type: "string" },
    bullets: { type: "array", maxItems: 5, items: { type: "string" } },
    color: { type: "string", enum: ["#ffd83d", "#ff4da6", "#37f28a"] }
  }
};
const schema = {
  type: "object",
  additionalProperties: false,
  required: ["title", "hook", "cta", "contentPillar", "slides", "caption"],
  properties: {
    title: { type: "string" },
    hook: { type: "string" },
    cta: { type: "string" },
    contentPillar: { type: "string", enum: ["learning-aha", "product", "build-in-public", "math-coding", "opinion"] },
    slides: { type: "array", minItems: 6, maxItems: 8, items: slideSchema },
    caption: { type: "string" }
  }
};
const instructions = [
  "Create a save-worthy English Instagram carousel for Vectus Lern, a modern learning-science account for students.",
  "Use 6 to 8 concise slides about the supplied topic.",
  "Be direct, practical, specific, evidence-aligned, and easy to understand.",
  "Avoid generic advice, fake statistics, unverified citations, empty motivation, and exaggerated neuroscience.",
  "Each slide communicates one main idea. Slide 1 is a strong hook. The final slide has a memorable takeaway and discussion CTA.",
  "Keep each title under 8 words, body under 32 words, callout under 10 words, and each bullet under 8 words.",
  "Use type cover only on slide 1, final only on the last slide, and plain on all others.",
  "The caption must add value, include a CTA, 5 to 10 relevant hashtags including #VectusLern, and end exactly with: " + config.aiDisclosure
].join("\n");
const response = await fetch("https://api.openai.com/v1/responses", {
  method: "POST",
  headers: { Authorization: "Bearer " + process.env.OPENAI_API_KEY, "Content-Type": "application/json" },
  body: JSON.stringify({
    model: process.env.OPENAI_MODEL || "gpt-5-mini",
    instructions,
    input: "Topic: " + topic + "\nRecent topics to avoid repeating: " + Array.from(used).slice(-12).join("; "),
    text: { format: { type: "json_schema", name: "vectus_carousel", strict: true, schema } },
    store: false
  })
});
const result = await response.json();
if (!response.ok) throw new Error(JSON.stringify(result));
const output = result.output?.flatMap((item) => item.content || []).find((item) => item.type === "output_text")?.text;
if (!output) throw new Error("OpenAI response had no output_text");
const data = JSON.parse(output);
if (!data.caption.trim().endsWith(config.aiDisclosure)) throw new Error("Generated caption lacks exact AI disclosure");
if (data.slides[0].type !== "cover" || data.slides.at(-1).type !== "final") throw new Error("Invalid first/final slide types");
const post = resolve(root, "posts", id);
await cp(resolve(root, "posts/_template"), post, { recursive: true });
await mkdir(resolve(post, "06-renders/final"), { recursive: true });
await writeFile(resolve(post, "content.json"), JSON.stringify(data, null, 2) + "\n");
await writeFile(resolve(post, "01-brief/brief.md"), "# " + data.title + "\n\nTopic: " + topic + "\n\nHook: " + data.hook + "\n\nGoal: Give students one immediately useful learning strategy.\n");
await writeFile(resolve(post, "02-script/script.md"), data.slides.map((slide, index) => "## Slide " + (index + 1) + "\n\n" + slide.title + " " + slide.accent + "\n\n" + slide.body + "\n").join("\n"));
await writeFile(resolve(post, "06-renders/final/caption.txt"), data.caption.trim() + "\n");
const metadata = { id, title: data.title, status: "draft", template: "vectus-carousel", platforms: ["instagram"], format: { width: 1080, height: 1080 }, language: "en", createdAt: today, publishedAt: null, contentPillar: data.contentPillar, hook: data.hook, cta: data.cta, owners: [], notes: "Generated automatically. Human review required before publishing." };
await writeFile(resolve(post, "post.json"), JSON.stringify(metadata, null, 2) + "\n");
execFileSync("node", [resolve(root, "tools/social-automation/carousel-generate.mjs"), post], { stdio: "inherit" });
execFileSync("node", [resolve(root, "tools/social-automation/carousel-render.mjs"), post], { stdio: "inherit" });
execFileSync("node", [resolve(root, "tools/social-automation/validate-post.mjs"), post], { stdio: "inherit" });
const now = new Date().toISOString();
history.generated.push({ topic, slug, timestamp: now });
queue.drafts.push({ postPath: "posts/" + id, topic, createdAt: now, status: "awaiting_review" });
await writeFile(historyPath, JSON.stringify(history, null, 2) + "\n");
await writeFile(queuePath, JSON.stringify(queue, null, 2) + "\n");
console.log(JSON.stringify({ postPath: "posts/" + id, topic, status: "awaiting_review" }));
