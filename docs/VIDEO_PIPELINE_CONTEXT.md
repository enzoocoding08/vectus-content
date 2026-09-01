# Faceless Reels / Video Pipeline — durable handover context

## Goal

Build a faceless social-media system for a learning app, initially for Instagram Reels and later TikTok and YouTube Shorts. Videos should feel like intentionally edited educational/product content—not generic AI output—and combine authentic app screen recordings, fitting stock B-roll, voiceover, concise captions, good cuts, light punch-ins, and consistent branding. Automate as much as proves useful while keeping recurring costs low. Default format: vertical 9:16, 1080x1920.

## Core content pattern

Do not simply advertise the app. Use:

```text
Problem -> Aha / learning principle -> visual proof or example -> product as concrete solution
```

Canonical example:

- Hook: “Du hast den Stoff nicht gelernt, wenn er dir nur bekannt vorkommt.”
- B-roll: notes, highlighting, studying.
- Aha: “Recognition ≠ Recall”.
- Product proof: the source disappears and the learner recalls freely.
- The app finds two missing key points.
- Gap Repair addresses only those gaps.
- Close: “That's why I'm building this.”

The desired association over time is: “Das ist die Lern-App, die Lernen nach echtem Verständnis organisiert.” It must not become a generic study account.

## Content pillars and mix

Suggested mix:

- 40% learning problems / aha moments
- 25% product in action
- 20% build in public
- 10% concrete math or coding examples
- 5% opinion / motivation

Learning and brain-hacking topics include Active Recall, Spaced Repetition, Recognition vs Recall, Productive Struggle, rereading illusions, errors as learning signals, Gap Repair, transfer instead of memorization, and exam-like review.

Product demos can cover Recall, Gap Repair, Spaced Repetition, Test Preparation, Math Learning, Programming Learning, Project Understanding, Archive Test, and Concept Maps. A strong demo is: “Du hast 80% gelernt. Warum nochmal 100% wiederholen?” followed by 81% recall coverage, two named gaps, and repair of only those gaps.

Math content should expose the gap between knowing a formula and recognizing when to use it. A useful visual sequence is: situation -> given/wanted -> model -> method -> calculation -> interpretation.

Programming is especially suitable for faceless content. Topics include Predict before Run, Code Reading, Debugging, Project Maps, Vertical Slices, explain-before-accept for AI code, and system understanding. Example path: Angular Component -> Service -> REST -> Controller -> Service -> Database. Strong hook: “AI made coding faster—and made students understand less.”

Build-in-public posts can begin with: “Day 17 of building a learning system that doesn't let me fake studying,” followed by a 10–25 second feature demo.

Other hook directions:

- “Du lernst wahrscheinlich falsch, wenn ...”
- “Warum du nach 2 Stunden Lernen trotzdem nichts kannst”
- “Recognition is lying to you.”
- “Wenn deine Lern-App dir sofort die Antwort zeigt, ist das ein Problem.”
- “Der größte Fehler beim Active Recall.”

## Faceless visual language

Use screen recordings, hands, keyboards, laptops, notebooks, whiteboards, phones, desks, books, libraries, code editors, app UI, graphs, and stock B-roll. Use large readable type, one idea at a time, a fast first hook, calmer explanatory passages, and app recordings as proof. Favor light zooms over excessive transitions. Keep caption position, typography, colors, and branding consistent.

Prefer close-ups, hands, objects, screens, desk shots, and movement over repetitive footage of smiling people at laptops.

## Voice and sound

A real voice is preferred when practical because faceless does not need to mean impersonal. A useful chain is noise reduction, EQ, compression, and loudness normalization. Optional pitch/formant changes must be subtle. Pitch and formant are different; pitch-only changes easily sound artificial. If used, roughly ±1 to ±3 semitones is the intended maximum range. Audacity, DaVinci Resolve/Fairlight, CapCut, Adobe Audition, or Voicemod are possible tools.

The audio stack is dominant voiceover plus quiet background music and optional sparse sound effects. Duck music under speech. Reserve clicks, swipes, UI reveals, punch-ins, and transitions for moments that benefit from emphasis; do not sonify every movement.

## Stock media and rights

Pexels is the primary candidate because it offers free stock video and an API. Recheck current API limits and license terms before production use. Other possible sources are Pixabay, Mixkit, and Coverr; check each individual asset license.

Useful concrete queries include:

- `close up typing keyboard`
- `hand writing notes`
- `scrolling phone close up`
- `laptop screen dark room`
- `turning textbook pages`
- `highlighting textbook`
- `desk timer`
- `coffee laptop desk`
- `student exam stress`

“Royalty-free” does not mean copyright-free; it means a license permits certain uses. Be especially careful with logos, trademarks, celebrities, identifiable people, protected designs, and scenes that could imply endorsement.

Every fetched asset must retain source, source asset ID/URL, creator when available, license/source reference, and original download date. Also keep technical properties and the query used. Use the repository's `asset.metadata.json` template.

## Screen recordings

Real app recordings are the highest-value assets because they are unique, prove the product, and look less generic than stock. Move the cursor deliberately, eliminate dead waiting time, prepare demo data, show relevant UI large enough, zoom later when useful, and exclude sensitive data.

When the spoken content becomes product-specific, prefer the actual app recording instead of stock B-roll.

## Editing model

FFmpeg is not the intelligent editor. It trims, concatenates, crops, scales, adapts to 9:16, zooms, pans, changes speed, transitions, overlays, renders text/subtitles, mixes audio, ducks music, encodes, and exports. A planner must decide which clip appears, when the cut occurs, shot length, zoom/focus, captions, and when the app screen replaces B-roll.

The defining architecture rule is:

```text
AI / deterministic rules -> WHAT happens + WHEN
FFmpeg                 -> HOW it is rendered
```

Pipeline:

```text
Reel idea
-> Script generator
-> Beat planner
-> Visual search + app assets
-> Asset selection
-> Voiceover
-> Transcript with word timestamps
-> Neutral Edit Decision List (EDL)
-> FFmpeg renderer
-> reviewed 1080x1920 MP4
```

Never make editing logic emit raw FFmpeg commands directly. It produces a neutral EDL; rendering logic translates that EDL to FFmpeg.

## Beat and cut rules

Split scripts into `HOOK`, `PROBLEM`, `EXPLANATION`, `AHA`, `PRODUCT`, and `CTA`.

- Hook: 1–2 seconds per shot, large caption, immediate visual change, strong first frame.
- Problem: concrete B-roll, usually 2–3 seconds.
- Explanation: calmer pacing, fewer cuts, text/diagram/UI as appropriate.
- Important statement: punch-in, short pause, highlighted keyword.
- Product: real screen recording, zoom into the relevant UI, no unnecessary stock.

Useful general rules:

- New core statement -> new shot.
- Strong contrast -> hard cut or punch-in.
- Product mentioned -> app screen.
- Abstract explanation -> diagram, text, or UI.
- Emotional problem -> B-roll.

Generate the final voiceover before final caption timing. Transcribe it with word/sentence timestamps and align cuts to spoken semantic boundaries. Show few caption words at once, highlight keywords, avoid filling the screen, and ensure the story remains understandable without sound.

## Asset selection and ranking

Transform each script line into a visual intent and one or more concrete search queries. Example: “Du liest denselben Stoff immer wieder” maps to studying/textbook/repetition and `highlighting textbook close up`. “Beim Test kannst du ihn trotzdem nicht abrufen” maps to exam/stress/confusion and `student exam stress`.

Rank candidates by semantic relevance, vertical-crop suitability, useful motion, absence of distracting logos/watermarks, visual quality, resolution, viable framing, and avoidance of generic stock aesthetics.

## Fixed reel templates

Start with six recognizable templates:

1. Brain Hack
2. App Demo
3. Normal App vs My App
4. Coding Problem
5. Math Problem
6. Build in Public

Each template defines caption style, hook length, maximum shot duration, zoom rules, app-UI placement, CTA, audio mix, and transitions. Individual videos mainly vary hook, script, voice, B-roll, and app recording.

### Brain Hack timing example

- 0.0–1.8: hand/notes B-roll; “Du hast den Stoff nicht gelernt, wenn er dir nur bekannt vorkommt.”
- 1.8–4.5: highlighting B-roll; “Beim Wiederlesen erkennst du Informationen wieder.”
- 4.5–6.5: text punch-in; “Recognition ≠ Recall”.
- 6.5–11.5: app recording; the source disappears and real recall begins.
- 11.5–15.5: Gap Repair UI; “2 missing key points”.
- 15.5–18.0: app/brand; “That's what I'm building.”

### Programming example

Hook: “AI made coding faster—and made students understand less.” Show generated code, then: “200 lines. It works. But where does the request actually go?” Reveal the system path and locate the learner at `JobsController.GetById()`. Close with: “Build faster. Keep the mental model.”

### Math example

Hook: “Warum du Textaufgaben hasst, obwohl du die Formel kannst.” Contrast an easy standard task with the same mathematics hidden in prose, then reveal the structured app sequence. Close with: “Knowing the formula isn't the same as knowing when to use it.”

## Technical direction

An eventual API may expose `POST /api/reels/render` with template, hook, script, voice path, screen recordings, and caption settings. A likely backend is ASP.NET/C# -> Reel Planner -> Asset Search -> EDL -> FFmpeg -> MP4.

FFMpegCore can simplify basic .NET integration. Direct `Process` calls may be preferable where exact filter graphs, progress reporting, or escape/control behavior needs finer control. This choice is intentionally still open.

Remotion is a possible later complement for React-based motion graphics, animated text, UI videos, and strongly standardized templates, but brings another toolchain and requires a current license review. JSON2Video, Shotstack, and Creatomate are useful prototype/reference options, not planned as permanent zero-cost production dependencies.

Suggested entities are `ReelProject`, `ScriptBeat`, `Asset`, `Scene`, `VoiceTrack`, and `RenderJob`. The repository templates capture the initial file-level equivalents before a database is justified.

## MVP phases

### Phase 1 — validate content manually

Manual or AI-assisted script -> recorded voiceover -> 2–4 Pexels clips -> one app recording -> FFmpeg template -> finished reel. Measure which hooks and formats work before building full automation.

### Phase 2 — semi-automation

Automate Pexels search/download, 9:16 crop, caption generation/timing, audio mix, and template rendering. A human still chooses the hook, script, final clips, and approves the render.

### Phase 3 — intelligent editing engine

Add semantic beat recognition, visual-intent extraction, automatic asset search/ranking, scene-duration planning, EDL creation, and FFmpeg translation.

## Open decisions

- Exact FFmpeg command/filter-graph architecture
- FFMpegCore versus direct process invocation
- Caption renderer, font, and brand system
- Asset cache and Pexels ranking
- Real voice versus TTS and speech-to-text provider
- Project persistence and render queue
- Music source and licensing
- Automatic beat planner
- Review UI before final render
- Whether Remotion should complement FFmpeg

## Non-negotiable implementation priorities

- Build locally and cheaply first.
- Do not make an expensive video-AI API a core dependency.
- Authentic product footage is more important than generic AI B-roll.
- Make stock media searchable and provenance-auditable.
- Treat FFmpeg as a rendering engine, not a creative agent.
- Plan good cuts through beat and scene logic.
- Use templates to create recognition and consistency.
- Test content before investing in full automation.
- The output must feel consciously edited, not randomly generated.

