import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/**
 * Every project is a "track" on the tape.
 * Side A = your featured work. Side B = experiments, side quests, weird stuff.
 * Add a project by dropping a new .md file in src/content/tracks/.
 * If the frontmatter doesn't match this schema, `npm run check` tells you exactly what's wrong.
 */
const tracks = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/tracks' }),
  schema: z.object({
    title: z.string(),
    side: z.enum(['A', 'B']),
    /** Position on its side: A1, A2, A3… */
    order: z.number().int().positive(),
    year: z.number().int().min(2000),
    /** One line, shown in the tracklist. Keep it short enough to fit a J-card. */
    summary: z.string().max(120),
    stack: z.array(z.string()).default([]),
    links: z
      .object({
        live: z.url().optional(),
        repo: z.url().optional(),
      })
      .default({}),
    draft: z.boolean().default(false),
  }),
});

export const collections = { tracks };
