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

export const collections = { board };
