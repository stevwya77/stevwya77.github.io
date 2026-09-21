# J-card portfolio

A portfolio laid out like an unfolded cassette J-card: back flap, spine and front cover up top, the inside of the card (Side A, Side B, liner notes, credits) below. The structure is built. The words, art and flourishes are yours to write.

Search the code for `TODO(you)` to see every spot waiting on you.

## The stack

| Piece | What it does | Why this one |
|---|---|---|
| **Astro 7** | Builds the site into plain HTML | Ships zero JavaScript unless you ask for it. Its Rust compiler and Vite 8 make builds fast. |
| **TypeScript 6** (strict) | Types for your data and components | TS 7 (the new Go-native compiler) is out, but Astro's `.astro` type-checking can't run on it yet. Move up when TS 7.1 lands. |
| **Content collections** | Each project is a Markdown file with checked frontmatter | Typo in a project's `year`? `npm run check` catches it before the site ships. |
| **Astro Fonts API** | Self-hosts the fonts in `src/assets/fonts` | Preloads, metric-matched fallbacks, no Google Fonts requests. |
| **Plain modern CSS** | `@layer`, custom properties, `color-mix()`, logical properties | A look this custom fights utility frameworks. Tokens live in one file. |

## The J-card, mapped to files

```
┌───────┬────┬──────────────────────┐
│ FLAP  │ SP │ FRONT COVER          │   src/components/JCard.astro
│ index │ I  │ CoverArt.astro       │   (sizes in real inches: 0.625 / 0.5 / 2.5 × 4)
│       │ N  │ name, katakana, role │
│       │ E  │ catalog · Dolby · ℗  │
└───────┴────┴──────────────────────┘
┌─────────────────┬─────────────────┐
│ SIDE A          │ SIDE B          │   src/components/Inlay.astro
│ Tracklist.astro │ Tracklist.astro │   projects come from src/content/tracks/*.md
├─────────────────┼─────────────────┤
│ LINER NOTES     │ CREDITS         │
└─────────────────┴─────────────────┘
```

```
src/
  data/site.ts            ← your name, catalog number, links
  content/tracks/*.md     ← one file per project
  content.config.ts       ← the schema those files must match
  styles/tokens.css       ← every color, size and the J-card geometry
  styles/global.css       ← reset + base type
  layouts/Base.astro      ← <head>, fonts, grain overlay
  components/             ← JCard, CoverArt, Inlay, Tracklist
  components/deco/        ← Starburst, Grain (empty stubs for you)
  pages/index.astro       ← the home page
  pages/tracks/[id].astro ← one page per project
```

## Build it: the tracklist

Each step is small enough for one sitting. Do them in order: later steps assume earlier ones.

### Step 0 · Press play
Install [Node 22.12+](https://nodejs.org), then:
```sh
npm install
npm run dev        # http://localhost:4321, reloads as you save
```
**Done when:** you see the placeholder card in your browser.

### Step 1 · Label the tape
**File:** `src/data/site.ts`. Replace every placeholder: name, katakana, role, catalog number, links.
**Learn:** why the object ends in `satisfies SiteConfig`. Try deleting `email` and watch your editor complain.
**Tip:** for katakana, type your name into a romaji-to-katakana converter, then check it with someone who reads Japanese, or use an English subtitle instead.

### Step 2 · Record your tracks
**Files:** `src/content/tracks/`. Delete the examples and add 3–5 real projects. Side A is your strongest work.
**Learn:** open `content.config.ts`, then break a file on purpose (`year: "soon"`) and run `npm run check`.
**Then:** style `pages/tracks/[id].astro` so a project page feels like a single-track insert.

### Step 3 · Write the liner notes
**File:** `src/components/Inlay.astro`, the `#notes` panel. Two or three short paragraphs. Also update the Credits rows.

### Step 4 · Y2K layer
**Files:** `components/deco/Starburst.astro`, the flap in `JCard.astro`.
- A 4-point sparkle as an inline `<svg>`, filled with the `--pearl` gradient, parked in a corner of the front.
- A fake barcode at the bottom of the flap (hint: `repeating-linear-gradient`).
- Optional: an iridescent sticker on the cover ("NEW!", "DIGITALLY REMASTERED").
**Rule of thumb:** pick one hero flourish. Y2K gets tacky fast.

### Step 5 · Solarpunk cover art
**File:** `components/CoverArt.astro`. Replace the placeholder sun and hill with your scene: layered gradients, leaf silhouettes, light rays, a solar array on a hillside, or a real image via `<Image />` from `astro:assets`.
**Mood board:** Macroblank covers (soft, grainy, faded), Studio Ghibli skies, art nouveau vines.

### Step 6 · Macroblank haze
**File:** `components/deco/Grain.astro`. A fixed full-page noise overlay (SVG `feTurbulence` as a data URL, `mix-blend-mode: multiply`, opacity around 0.1). Then try a faint blur or chromatic fringe on the cover art only.

### Step 7 · Side B after dark
**File:** `src/styles/tokens.css`. Add a night palette inside `@media (prefers-color-scheme: dark)`. Redefine only the color tokens: deep teal ground, moonlit paper, the sun gold turned into a streetlight glow.

### Step 8 · Motion
- Page transitions with no JavaScript: add `@view-transition { navigation: auto; }` to `global.css`, then give the track title a matching `view-transition-name` on the list and detail pages.
- A slow spin on the starburst, a hover lift on tracks.
- Wrap every animation in `@media (prefers-reduced-motion: no-preference)`.

### Step 9 · Ship it
Push to GitHub and connect the repo to Cloudflare, Netlify or Vercel (all detect Astro automatically). Set `site` in `astro.config.mjs` to your domain.

## Commands

| Command | Does |
|---|---|
| `npm run dev` | Local dev server with hot reload |
| `npm run check` | Type-checks `.astro`, `.ts` and your content |
| `npm run build` | Check, then build to `dist/` |
| `npm run preview` | Serve the built site locally |

Fonts: Michroma, DotGothic16, Instrument Sans and Martian Mono, all under the SIL Open Font License, via Fontsource.
