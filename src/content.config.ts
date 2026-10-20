import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/** Board members: one Markdown file each in src/content/board/<term>/ (e.g. 2026-27/).
 *  The body is the bio. CLUB.boardTerm in src/config.ts picks which term is shown. */
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
      /** Their favorite NASA image, from the board form. */
      favoriteNasa: z.object({ text: z.string(), url: z.string().url().optional() }).optional(),
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
      /** Tie-breaker for events with the same (or no) endsOn date, lowest first. */
      order: z.number().default(100),
      /** Last day of the event, YYYY-MM-DD. Decides upcoming vs. past; see src/lib/events.ts. */
      endsOn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'endsOn must be YYYY-MM-DD').optional(),
      /** Ongoing series (e.g. on-campus observing): never upcoming or past. */
      recurring: z.boolean().default(false),
      flyers: z.array(z.object({ src: image(), alt: z.string() })).default([]),
    }),
});

export const collections = { board, events };
