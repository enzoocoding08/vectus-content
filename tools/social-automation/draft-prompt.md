Create exactly one new English Vectus Lern Instagram carousel draft in this repository.

Read AGENTS.md, docs/CHAT_HANDOVER.md, docs/VIDEO_PIPELINE_CONTEXT.md, and README.md before acting.

Requirements:

- Read tools/social-automation/config.json, topics.json, history.json, queue.json, and all existing posts.
- Select a useful learning-science topic that does not duplicate an existing post or history entry.
- Create a new posts/YYYY-MM-DD-short-slug directory from posts/_template.
- Write 6-8 concise English slides with a strong, credible hook and practical value.
- Use the established Vectus HTML/CSS design and the shared local fonts.
- Render final 1080x1080 PNG slides with the existing local Playwright/Chromium installation.
- Write 06-renders/final/caption.txt with relevant hashtags and this exact disclosure on its own final paragraph: AI-assisted content. Reviewed by Vectus Lern.
- Run: node tools/social-automation/validate-post.mjs <post-folder>
- Keep status as draft. Never create APPROVED and never publish to Instagram.
- Append the chosen topic, slug, and timestamp to tools/social-automation/history.json.
- Append the post path, topic, createdAt, and status "awaiting_review" to tools/social-automation/queue.json.
- Do not modify or delete existing posts.

Finish by reporting the created post path and validation result.
