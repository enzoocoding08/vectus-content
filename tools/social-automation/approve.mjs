import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { postPath, updateQueue } from "./lib.mjs";

const target = process.argv[2];
if (!target) throw new Error("Usage: node approve.mjs <post-folder>");
const post = postPath(target);
const metadataPath = join(post, "post.json");
const metadata = JSON.parse(await readFile(metadataPath, "utf8"));
if (metadata.status === "published") throw new Error("Post is already published");
await writeFile(join(post, "07-publish/APPROVED"), `${new Date().toISOString()}\n`);
metadata.status = "approved";
metadata.approvedAt = new Date().toISOString();
await writeFile(metadataPath, `${JSON.stringify(metadata, null, 2)}\n`);
await updateQueue(post, "approved", { approvedAt: metadata.approvedAt });
console.log(`Approved ${metadata.id || target}`);
