/** Turn an Equation of the Day entry's LaTeX into HTML with KaTeX, at build time. Used by
 *  EquationOfTheDay.astro and by `npm run equations:validate`, so anything the checks pass
 *  renders on the site. Throws on LaTeX KaTeX can't render, which stops the build. */
import katex from 'katex';

const OPTIONS = { throwOnError: true, strict: 'error', output: 'htmlAndMathml' } as const;

/** A whole equation, centered on its own line. */
export const displayMath = (tex: string) => katex.renderToString(tex, { ...OPTIONS, displayMode: true });

/** Math inside a line of text, like a variable's symbol. */
export const inlineMath = (tex: string) => katex.renderToString(tex, { ...OPTIONS, displayMode: false });

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

/** Plain text with inline math between $...$ (blurbs and variable meanings). `$` always opens or
 *  closes math, so an odd number of them is an error. */
export function textWithMath(text: string): string {
  const parts = text.split('$');
  if (parts.length % 2 === 0) throw new Error('unbalanced $ (every $ opens or closes math)');
  return parts.map((part, i) => (i % 2 ? inlineMath(part) : escapeHtml(part))).join('');
}
