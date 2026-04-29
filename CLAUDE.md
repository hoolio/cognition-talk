# CLAUDE.md

Project guide for Claude Code working in this repo. Keep this file accurate as the
project evolves — update it whenever the layout, tooling, or workflows change.

## Project

**Cognition Talk.** Companion site for a talk and accompanying memo titled
*The Industrialization of Cognition*. The repo holds:

- the long-form **memo** (the source-of-truth essay),
- one or more **talk outlines** at varying lengths,
- (planned) **slides** rendered from markdown,
- (planned) **speaker notes** keyed to slides.

Markdown is the source of truth for everything authored. The Next.js site renders
those markdown files into a static set of pages deployed to GitHub Pages.

## Repository layout

```
cognition-talk/
├── .github/workflows/deploy.yml   GitHub Pages deploy on push to main
├── app/                           Next.js App Router pages
│   ├── layout.tsx                 site shell (header/nav/footer)
│   ├── page.tsx                   home — links to memo + outlines
│   ├── globals.css                typography + layout (no Tailwind)
│   ├── memo/page.tsx              renders content/memo/industrialization-of-cognition.md
│   ├── outlines/
│   │   ├── page.tsx               index of outlines
│   │   └── [slug]/page.tsx        renders content/outlines/<slug>.md
│   ├── slides/page.tsx            placeholder
│   ├── speaker-notes/page.tsx     placeholder
│   └── playground/page.tsx        Observable embed POC
├── components/
│   └── ObservableEmbed.tsx        runtime-based <ObservableEmbed/> client component
├── content/                       markdown source-of-truth
│   ├── memo/
│   │   └── industrialization-of-cognition.md
│   ├── outlines/
│   │   ├── 30min.md
│   │   └── full.md
│   ├── slides/                    (placeholder; see "Slides plan" below)
│   └── speaker-notes/             (placeholder)
├── lib/content.ts                 loadDoc / listDocs — reads + renders markdown
├── scripts/
│   ├── md-to-odt.sh               markdown → .odt, opens in LibreOffice
│   ├── odt-to-md.sh               .odt → markdown
│   └── watch-odt.sh               watches .lo-edits/, syncs on save
├── next.config.mjs                static export, basePath=/cognition-talk in prod
├── tsconfig.json                  TS config with @/ alias
├── package.json                   scripts: dev, build, edit, edit:watch, edit:back
├── CLAUDE.md                      this file
└── README.md                      human-facing intro
```

`.lo-edits/` is created on demand by the LibreOffice scripts. It is gitignored.

## Tech stack

- **Next.js 15** with the App Router, server components.
- **TypeScript**, strict mode.
- **Static export** (`output: 'export'`) — site is a folder of HTML files in `out/`.
- **Markdown pipeline**: `gray-matter` (frontmatter) + `unified` /
  `remark-parse` / `remark-gfm` / `remark-rehype` / `rehype-slug` /
  `rehype-autolink-headings` / `rehype-stringify`.
- **No CSS framework** — plain `globals.css` with serif body and a `.prose` class.
- **No client-side JS for content pages** — everything is rendered at build time.

## Development workflow

```bash
npm install          # once
npm run dev          # http://localhost:3000
npm run build        # builds to out/ (static export)
```

Local dev runs without a `basePath`; production builds use `/cognition-talk` because
the deployed site lives at `https://rafaelmaitra.com/cognition-talk/` (the
`hoolio` GitHub user has a user-level custom domain `rafaelmaitra.com`, so all
project pages serve from `rafaelmaitra.com/<repo>/` rather than from
`hoolio.github.io/<repo>/`). The path segment is the same in either case, so
`basePath: '/cognition-talk'` works for both. This branching lives in
`next.config.mjs` and keys off `NODE_ENV`.

### Adding content

- **Memo updates** → edit `content/memo/industrialization-of-cognition.md`.
- **New outline length** → drop a new `content/outlines/<slug>.md` file. The
  outline list page and dynamic route pick it up automatically via `listDocs`.
- **Slides** → see "Slides plan".
- **Speaker notes** → drop per-section markdown in `content/speaker-notes/`. Keep
  one file per slide or per section, named to match the corresponding slide id.

Frontmatter is optional. If a file has `title:` in YAML frontmatter, that wins;
otherwise the loader uses the first `# H1` heading; otherwise the slug.

### Slides plan (not yet implemented)

The intended pipeline:

1. Slide source lives as markdown in `content/slides/`, one file per deck.
2. Render the deck to HTML via either **Marp** (CLI, `marp deck.md -o out.html`) or
   **Reveal.js** wired to a route. Marp is simpler if the deck stays plain;
   Reveal.js is better once we want richer transitions and fragments.
3. Export to `.odp` via Pandoc + LibreOffice when an offline-editable copy is
   needed: `pandoc deck.md -t pptx -o deck.pptx`, then open in Impress (or convert
   to `.odp` via `soffice --headless --convert-to odp deck.pptx`).
4. Speaker notes are kept separate (in `content/speaker-notes/`) and surfaced on a
   dedicated route, optionally also embedded into the deck as Reveal.js notes.

Pick one of Marp/Reveal.js when the slide work actually begins; do not introduce
both. Until then `app/slides/page.tsx` is just a placeholder.

## Observable embeds

We embed Observable notebook cells directly into this site via the official
runtime pattern (no iframes — they look out of place).

- Component: `components/ObservableEmbed.tsx` (client component, dynamically
  loads `@observablehq/runtime` and the notebook module from
  `api.observablehq.com` at runtime).
- POC route: `app/playground/page.tsx` embeds `@d3/disjoint-force-directed-graph`
  as a smoke test that the wiring works.

### To embed an artifact

1. Author the notebook on https://observablehq.com and publish it as **Public**
   (or "Unlisted" with a link — both work for embedding).
2. Copy the slug from its URL — e.g., `@hoolio/seven-factor-matrix`. For
   unlisted notebooks the slug looks like `d/abc123def456`.
3. Note the cell names you want to render (visible in the notebook UI).
4. Drop the component into any page (server or client component is fine — the
   embed is a client component internally):

   ```tsx
   import { ObservableEmbed } from '@/components/ObservableEmbed';

   <ObservableEmbed
     notebook="@hoolio/seven-factor-matrix"
     cells={['matrix']}
     version={4}
     caption="The seven-factor matrix, sortable by column."
   />
   ```

### Embedding inside markdown (gotcha)

Markdown content under `content/` is rendered to HTML at build time and
injected with `dangerouslySetInnerHTML` — there is no React-component slot
inside that markdown by default. Two options when a memo or outline section
needs an embed:

- **Hand-author a TSX page** that interleaves markdown chunks with embeds (split
  the markdown file at the embed point, render each half via `loadDoc`, and
  drop `<ObservableEmbed/>` between them). Best for one-off integrations.
- **Add a custom remark plugin** that turns a fenced code block (e.g. `​```observable @hoolio/foo cells=chart​````) into a placeholder, post-process the rendered HTML to inject mount points, and hydrate them client-side. Worth the work
  only if embeds become frequent.

For now, prefer the first option until embeds become common.

### Versioning

The `version` prop pins the notebook revision (`?v=N` in the api URL). Bump it
when you intentionally update the upstream notebook so the cache busts.

## LibreOffice round-trip

Markdown is the source of truth. LibreOffice is an *editing surface* — convert
out, edit, convert back, commit the markdown.

```bash
# requires: pandoc (brew install pandoc), LibreOffice
npm run edit -- content/memo/industrialization-of-cognition.md
# this writes .lo-edits/content/memo/industrialization-of-cognition.odt
# and opens it in LibreOffice.

# in another terminal, run the watcher:
npm run edit:watch
# every time you Save in LibreOffice, the .odt is converted back to its .md.
```

One-shot conversion in either direction:

```bash
npm run edit -- path/to/file.md                   # md → odt
npm run edit:back -- .lo-edits/path/to/file.odt   # odt → md
```

Mechanics:

- `scripts/md-to-odt.sh` uses `pandoc -f gfm -t odt`, then opens the file in
  LibreOffice via `/Applications/LibreOffice.app/Contents/MacOS/soffice` (override
  with `SOFFICE` env var). The `.odt` lives at `.lo-edits/<original-path>.odt`,
  preserving directory structure for round-trip.
- `scripts/odt-to-md.sh` uses `pandoc -f odt -t gfm --wrap=preserve` and writes
  back to the matching `.md` path under the source tree.
- `scripts/watch-odt.sh` uses `fswatch` if available, otherwise polls every 2s
  using `find ... -newer`-style mtime comparisons (works on macOS bash 3.2).
- `.odt`, `.docx`, `.odp`, `.pptx`, and the `.lo-edits/` directory are
  **gitignored** — only the resulting markdown is committed.

Caveats:

- Pandoc's `gfm` writer is lossy on exotic constructs (footnote anchors, inline
  HTML). Review the diff after a round-trip; don't blindly commit.
- LibreOffice creates lock files (`.~lock.<name>#`); the watcher ignores them.
- If `pandoc` is missing the scripts print install instructions and exit 1.

## Deployment

`.github/workflows/deploy.yml` builds and publishes on every push to `main`:

1. Checks out, sets up Node 22, runs `npm ci` and `npm run build`.
2. `touch out/.nojekyll` — required so GitHub Pages serves files starting with `_`
   (Next.js puts assets under `_next/`).
3. Uploads `out/` as a Pages artifact and deploys via `actions/deploy-pages@v4`.

**One-time setup in GitHub UI:** Settings → Pages → Build and deployment → Source:
**GitHub Actions**. After that, every push to `main` redeploys.

Live URL: https://rafaelmaitra.com/cognition-talk/ (canonical).
The `hoolio.github.io/cognition-talk/` URL also resolves and 301-redirects here.

## Conventions

- Server components only — no `"use client"` unless a page genuinely needs
  interactivity. Markdown rendering happens at build time.
- Avoid adding deps for things stdlib + remark already do.
- Don't inline content in TSX — content lives in `content/*.md`. Pages are thin.
- `dangerouslySetInnerHTML` is used to inject the rehype-rendered HTML; this is
  fine because the input is *our own* markdown, not user-supplied.
- Don't commit `.odt`/`.docx`/`.odp`/`.pptx`. Markdown is the source of truth.
- Don't pin `basePath` in dev — the env-conditional in `next.config.mjs` keeps
  `npm run dev` working at `http://localhost:3000/`.
