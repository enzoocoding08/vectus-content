import { readFile, writeFile } from "node:fs/promises";
import { isAbsolute, resolve } from "node:path";

export const root = resolve(new URL("../..", import.meta.url).pathname);

export async function readJson(path) {
  return JSON.parse(await readFile(path, "utf8"));
}

export async function loadEnv() {
  let text = "";
  try { text = await readFile(resolve(root, ".env"), "utf8"); } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
  return Object.fromEntries(
    text.split(/\r?\n/)
      .filter((line) => line && !line.startsWith("#"))
      .map((line) => {
        const index = line.indexOf("=");
        return [line.slice(0, index), line.slice(index + 1)];
      }),
  );
}

export function postPath(value) {
  if (isAbsolute(value)) return resolve(value);
  return resolve(root, value.startsWith("posts/") ? value : `posts/${value}`);
}

export async function updateQueue(post, status, extra = {}) {
  const queuePath = resolve(root, "tools/social-automation/queue.json");
  const queue = await readJson(queuePath);
  const relativePath = `posts/${post.split("/").pop()}`;
  let item = queue.drafts.find((draft) => draft.postPath === relativePath);
  if (!item) {
    item = { postPath: relativePath };
    queue.drafts.push(item);
  }
  Object.assign(item, { status, ...extra });
  await writeFile(queuePath, `${JSON.stringify(queue, null, 2)}\n`);
}
