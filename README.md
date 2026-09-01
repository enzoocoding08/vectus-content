# Faceless Reels / Video Pipeline

Local-first pipeline for deliberately edited educational and product reels for a learning app. The default delivery format is 9:16 at 1080x1920.

The durable product and architecture context is in [`docs/VIDEO_PIPELINE_CONTEXT.md`](docs/VIDEO_PIPELINE_CONTEXT.md). Both Codex and Claude Code are instructed to read it.

## Folder layout

```text
assets/                         Reusable, project-wide media
  stock/                        Curated reusable stock clips
  screen-recordings/            Reusable app recordings
  audio/{voice,music,sfx}/      Reusable audio
  brand/                        Logos, colors, overlays
  fonts/                        Licensed project fonts
docs/                           Product and technical decisions
templates/                      Shared EDL and metadata templates
posts/
  _template/                    Copy this for every new post
  YYYY-MM-DD-short-slug/        One self-contained post
```

Each post is arranged in production order:

```text
01-brief/                       Idea, hook, goal, platform
02-script/                      Script, beats, transcript/timestamps
03-assets/{stock,screen-recordings,images}/
04-audio/{voice,music,sfx}/
05-edit/                        EDL, captions, render settings
06-renders/{drafts,final}/
07-publish/                     Caption, hashtags, thumbnail, results
post.json                       Status and post-level metadata
README.md                       Human-readable post checklist
```

## Create a post

Copy `posts/_template` to a directory named `YYYY-MM-DD-short-slug`, then replace placeholder values in `post.json`. Do not put unrelated posts into the same directory.

Example:

```sh
cp -R posts/_template posts/2026-08-24-recognition-vs-recall
```

Use stable, descriptive filenames:

- `stock-01-highlighting-textbook.mp4`
- `screen-01-gap-repair-demo.mp4`
- `voice-v01.wav`
- `edl-v01.json`
- `draft-v01.mp4`
- `final-instagram.mp4`

For every externally fetched asset, create a matching `.metadata.json` file based on `templates/asset.metadata.json`. Never rely on a download URL or filename alone for licensing provenance.

## Workflow

1. Define the problem-led idea and hook in `01-brief/`.
2. Write the script and split it into semantic beats: Hook, Problem, Explanation, Aha, Product, CTA.
3. Record the voiceover, transcribe it, and use word timestamps as the cut foundation.
4. Select app recordings where the product is relevant; use ranked stock B-roll elsewhere.
5. Write a neutral EDL in `05-edit/`, then render it with FFmpeg.
6. Review the draft manually before producing the final 1080x1920 MP4.
7. Save publishing copy and later performance data in `07-publish/` so creative decisions can be evaluated.

`assets/` is for genuinely reusable media. A post's downloaded/fetched clips belong under that post's `03-assets/` directory so the post remains reproducible and auditable.

