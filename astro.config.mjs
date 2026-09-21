// @ts-check
import { defineConfig, fontProviders } from 'astro/config';

// Fonts live in src/assets/fonts (all SIL Open Font License, from Fontsource).
// Astro's Fonts API turns them into optimized @font-face rules, preloads and
// metric-matched fallbacks, so text doesn't jump when the real font arrives.
const local = fontProviders.local();
const dir = './src/assets/fonts';

export default defineConfig({
  // Deployed Domain.
  site: 'https://stevwya77.github.io',

  fonts: [
    {
      // Wide, extended caps: the cassette-brand logo voice. Display only.
      name: 'Michroma',
      cssVariable: '--font-display',
      provider: local,
      fallbacks: ['Arial Black', 'sans-serif'],
      options: {
        variants: [{ src: [`${dir}/michroma-latin-400-normal.woff2`], weight: 400, style: 'normal' }],
      },
    },
    {
      // Pixel Japanese face for katakana subtitles, the vaporwave J-card move.
      name: 'DotGothic16',
      cssVariable: '--font-jp',
      provider: local,
      fallbacks: ['monospace'],
      options: {
        variants: [
          { src: [`${dir}/dotgothic16-latin-400-normal.woff2`], weight: 400, style: 'normal' },
          {
            // The Japanese file is big (~400KB). unicode-range means browsers only
            // download it when a page actually contains kana or full-width characters.
            src: [`${dir}/dotgothic16-japanese-400-normal.woff2`],
            weight: 400,
            style: 'normal',
            unicodeRange: ['U+3000-30FF', 'U+FF00-FFEF'],
          },
        ],
      },
    },
    {
      // Body text: a calm grotesk that stays readable under all the flavor.
      name: 'Instrument Sans',
      cssVariable: '--font-body',
      provider: local,
      fallbacks: ['system-ui', 'sans-serif'],
      options: {
        variants: [
          { src: [`${dir}/instrument-sans-latin-wght-normal.woff2`], weight: '400 700', style: 'normal' },
          { src: [`${dir}/instrument-sans-latin-wght-italic.woff2`], weight: '400 700', style: 'italic' },
        ],
      },
    },
    {
      // Catalog numbers, track codes, years: anything that lines up in columns.
      name: 'Martian Mono',
      cssVariable: '--font-mono',
      provider: local,
      fallbacks: ['ui-monospace', 'monospace'],
      options: {
        variants: [{ src: [`${dir}/martian-mono-latin-wght-normal.woff2`], weight: '100 800', style: 'normal' }],
      },
    },
  ],
});
