// Shared helpers for the Equation of the Day checks: load src/content/equations/*.yaml and check
// every entry with the same schema and KaTeX settings the site build uses.
//
// Imports the site's TypeScript files directly. Node 22.18+ runs plain TypeScript as-is.
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { parseDocument } from "yaml";
import { equationSchema } from "../../src/lib/equation-schema.ts";
import { displayMath, inlineMath, textWithMath } from "../../src/lib/equation-render.ts";

export const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
export const EQUATIONS_DIR = join(ROOT, "src", "content", "equations");
export const DAYS_IN_LONGEST_MONTH = 31;

/** Parse YAML exactly as Astro's content loader does (unquoted dates become Date objects,
 *  which the schema then rejects, so `added` and `pinned` must be in quotes). */
function parseYaml(source) {
  const doc = parseDocument(source, { customTags: ["timestamp"], merge: true, schema: "core" });
  if (doc.errors.length) throw doc.errors[0];
  return doc.toJS();
}

/** Parse every YAML file in the folder. Returns [{ file, data } | { file, error }]. */
export function loadEntries(dir = EQUATIONS_DIR) {
  return readdirSync(dir)
    .filter((f) => f.endsWith(".yaml"))
    .sort()
    .map((file) => {
      try {
        return { file, data: parseYaml(readFileSync(join(dir, file), "utf8")) };
      } catch (err) {
        return { file, error: `YAML parse error: ${err.message}` };
      }
    });
}

/** The error message if `render` throws, otherwise null. */
function renderError(render) {
  try {
    render();
    return null;
  } catch (err) {
    return err.message;
  }
}

/** Check loaded entries. Returns { entries, errors, warnings }; entries holds only the entries
 *  that passed the schema check. */
export function checkEntries(loaded) {
  const errors = [];
  const warnings = [];
  const entries = [];
  const pinnedBy = new Map();

  for (const { file, data, error } of loaded) {
    const fail = (msg) => errors.push(`src/content/equations/${file}: ${msg}`);
    if (error) {
      fail(error);
      continue;
    }
    const parsed = equationSchema.safeParse(data);
    if (!parsed.success) {
      for (const issue of parsed.error.issues) fail(`${issue.path.join(".") || "(top level)"}: ${issue.message}`);
      continue;
    }
    const e = parsed.data;

    const stem = file.replace(/\.yaml$/, "");
    if (e.id !== stem) fail(`id "${e.id}" must match the file name "${stem}"`);
    if (e.pinned) {
      if (pinnedBy.has(e.pinned)) fail(`pinned date ${e.pinned} is also used by "${pinnedBy.get(e.pinned)}"`);
      pinnedBy.set(e.pinned, e.id);
    }

    const latexErr = renderError(() => displayMath(e.latex));
    if (latexErr) fail(`latex does not render: ${latexErr}`);
    e.variables.forEach((v, i) => {
      const symErr = renderError(() => inlineMath(v.symbol));
      if (symErr) fail(`variables[${i}].symbol does not render: ${symErr}`);
      const meaningErr = renderError(() => textWithMath(v.meaning));
      if (meaningErr) fail(`variables[${i}].meaning: ${meaningErr}`);
    });
    const blurbErr = renderError(() => textWithMath(e.blurb));
    if (blurbErr) fail(`blurb: ${blurbErr}`);

    entries.push(e);
  }

  const unreviewed = entries.filter((e) => !e.reviewed_by).length;
  if (unreviewed) {
    warnings.push(
      `${unreviewed} of ${entries.length} entries have reviewed_by: null and stay off the live site until someone checks them.`,
    );
  }
  const rotation = entries.filter((e) => e.reviewed_by && !e.pinned).length;
  if (rotation < DAYS_IN_LONGEST_MONTH) {
    warnings.push(
      `Only ${rotation} reviewed, unpinned entries; at least ${DAYS_IN_LONGEST_MONTH} are needed for a month with no repeats.`,
    );
  }
  return { entries, errors, warnings };
}
