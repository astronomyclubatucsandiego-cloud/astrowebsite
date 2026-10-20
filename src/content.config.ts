import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/** Board members: one Markdown file each in src/content/board/. The body is the bio. */
const board = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/board' }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      role: z.string(),
      team: z.enum(['Executive Board', 'Media Team', 'Outreach Team']),
      /** Order within the team, lowest first. */
      order: z.number(),
      photo: image().optional(),
    }),
});

/** Events: one Markdown file each in src/content/events/. The body is the description. */
const events = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/events' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      /** Human-readable date as it should appear, e.g. "January 23, 2026". */
      date: z.string().optional(),
      /** Page order, lowest first (newest events first). */
      order: z.number(),
      flyers: z.array(z.object({ src: image(), alt: z.string() })).default([]),
    }),
});

export const collections = { board, events };
