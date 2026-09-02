import { access, appendFile } from "node:fs/promises";
import { resolve } from "node:path";
import { readJson, root } from "./lib.mjs";

const queue = await readJson(resolve(root, "tools/social-automation/queue.json"));
let selected = null;
for (const item of queue.drafts) {
  if (item.status !== "approved") continue;
  try {
    await access(resolve(root, item.postPath, "07-publish/APPROVED"));
    selected = item.postPath;
    break;
  } catch {}
}
if (!selected) throw new Error("No approved unpublished carousel is available");
console.log(selected);
if (process.env.GITHUB_OUTPUT) await appendFile(process.env.GITHUB_OUTPUT, "post_path=" + selected + "\n");
