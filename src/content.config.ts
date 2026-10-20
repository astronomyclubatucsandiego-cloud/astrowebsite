// The theme package owns the prose-page model; the board collection is ours.
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { collections as theme } from 'astro-theme-popular/schemas';

/** Board members: one Markdown file each in src/content/board/. */
const board = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/board' }),
  schema: z.object({
    name: z.string(),
    role: z.string(),
    /** Display order on the Meet the Board page, lowest first. */
    order: z.number().default(100),
    photo: z.string().optional(),
    major: z.string().optional(),
    year: z.string().optional(),
    bio: z.string().optional(),
    favoriteObject: z.string().optional(),
    social: z.array(z.object({ label: z.string(), icon: z.string(), url: z.string() })).default([]),
  }),
});

export const collections = { pages: theme.pages, board };
