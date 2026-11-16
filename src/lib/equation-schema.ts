/** The shape of an Equation of the Day entry (src/content/equations/<id>.yaml). Used by the
 *  `equations` collection in src/content.config.ts and by `npm run equations:validate`, so the
 *  site build and the checks agree. */
import { z } from 'astro/zod';

const slug = z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, 'lowercase words joined by hyphens');

/** True for a real calendar date written YYYY-MM-DD (rejects 2026-02-30). */
const isRealDate = (iso: string) => {
  const d = new Date(`${iso}T00:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === iso;
};

export const equationSchema = z.strictObject({
  /** Must match the file name. */
  id: slug,
  title: z.string().min(3).max(80),
  /** The equation, as KaTeX-compatible LaTeX (no surrounding $). */
  latex: z.string().min(1),
  variables: z
    .array(
      z.strictObject({
        /** LaTeX, no surrounding $. */
        symbol: z.string().min(1),
        /** Plain text; inline math between $...$. */
        meaning: z.string().min(1),
      }),
    )
    .min(1),
  /** 2-4 sentences on why the equation is interesting. Inline math between $...$. */
  blurb: z.string().min(80).max(800),
  tags: z.array(slug).min(1).refine((t) => new Set(t).size === t.length, 'tags must not repeat'),
  level: z.enum(['intro', 'intermediate', 'advanced']),
  references: z.array(z.string().min(3)).min(1),
  /** A public page reviewers can check the equation against. */
  docs: z.string().regex(/^https:\/\//, 'must start with https://'),
  /** Optional MM-DD: shown on that date every year and kept out of the random rotation. */
  pinned: z
    .string()
    .regex(/^\d{2}-\d{2}$/, 'write it as MM-DD in quotes')
    .refine((md) => isRealDate(`2024-${md}`), 'not a real month and day')
    .optional(),
  /** YYYY-MM-DD, in quotes. The entry joins the rotation on the 1st of the following month. */
  added: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "write it as 'YYYY-MM-DD' in quotes")
    .refine(isRealDate, 'not a real date'),
  author: z.string().min(1),
  /** Name of the member who checked the physics, or null. Only reviewed entries go on the site. */
  reviewed_by: z.string().min(1).nullable(),
});

export type Equation = z.infer<typeof equationSchema>;
