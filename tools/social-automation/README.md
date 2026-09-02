# Vectus social automation

The cloud scheduler runs the full carousel autopilot at 09:00 and 18:00 Europe/Vienna. Each run reads the binding growth system, creates and renders one new carousel, validates and automatically approves it, then publishes the oldest approved carousel with its complete caption.

## Manual review and publish

1. Review the PNGs and `caption.txt` in the post's `06-renders/final/` directory.
2. Validate: `node tools/social-automation/validate-post.mjs posts/YYYY-MM-DD-slug`
3. Approve: `node tools/social-automation/approve.mjs posts/YYYY-MM-DD-slug`
4. Publish: `node tools/social-automation/instagram-publish.mjs posts/YYYY-MM-DD-slug`

The publisher requires `07-publish/APPROVED`, converts PNGs to JPEG, exposes them only during Meta ingestion through a temporary HTTPS tunnel, publishes through the official Instagram API, verifies the permalink, records `publish-result.json`, and shuts the tunnel down.

## AI disclosure

The documented Instagram publishing API does not expose a reliable native AI-label parameter for carousels. Every caption must therefore end with the exact disclosure configured in `config.json`:

`AI-assisted content. Reviewed by Vectus Lern.`

The validator and publisher reject missing disclosure.

## Autopilot

The scheduled workflow requires no user action. A post is eligible for automatic publishing only after the renderer and validator complete successfully. Failed creation, validation, media staging, or Meta API verification stops the workflow rather than publishing incomplete content.
