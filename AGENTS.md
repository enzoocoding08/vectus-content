# Agent instructions

Before planning or changing anything in this repository, read:

1. docs/CHAT_HANDOVER.md — latest conversation state, Vectus Lern brand decisions, prior draft, and outstanding inputs.
2. docs/VIDEO_PIPELINE_CONTEXT.md — product vision, content strategy, visual language, architecture, and implementation priorities.
3. README.md — folder layout, naming conventions, and the workflow for creating a post.

Keep the following invariants:

- FFmpeg is the renderer, not the creative editor. Planning produces a neutral Edit Decision List first.
- Prefer authentic app screen recordings over generic stock footage whenever the product is relevant.
- Store downloaded-asset provenance and license metadata alongside each asset.
- Every post lives in its own `posts/YYYY-MM-DD-short-slug/` directory, copied from `posts/_template/`.
- Standard output is vertical 9:16, 1080x1920.
- Keep costs low and the pipeline local-first; do not introduce a paid video API as a core dependency without an explicit decision.
- Preserve human review for hooks, scripts, asset selection, and final renders until the formats have been validated.

