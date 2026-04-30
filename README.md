# cognition-talk

Companion site for *The Industrialization of Cognition* — a memo and accompanying
talk on the AI transition, with implications for capital allocation.

Live: https://hoolio.github.io/cognition-talk/

## What's here

- `content/memo/` — the long-form memo (source of truth).
- `content/outlines/` — talk outlines at varying lengths (30 min, full, etc.).
- `content/slides/` — *(coming)* slide source in markdown.
- `content/speaker-notes/` — *(coming)* per-section talk tracks.
- `app/`, `lib/` — Next.js (App Router, TS) site that renders the markdown.
- `scripts/` — LibreOffice round-trip helpers (markdown ↔ `.odt`).

## Run locally

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # static export to out/
```

## Edit in LibreOffice

```bash
brew install pandoc                 # one-time, if not installed
npm run edit -- content/memo/industrialization-of-cognition.md
npm run edit:watch                  # in another terminal: auto-syncs on Save
```

The `.odt` lands in `.lo-edits/` (gitignored) and syncs back to the source `.md`
on every save. Markdown stays the source of truth.

## Deploy

Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds and
publishes the static export to GitHub Pages.

One-time setup: in GitHub Settings → Pages, set **Source = GitHub Actions**.

## More

See [`CLAUDE.md`](./CLAUDE.md) for the project guide, layout rationale, slides
plan, and conventions.
