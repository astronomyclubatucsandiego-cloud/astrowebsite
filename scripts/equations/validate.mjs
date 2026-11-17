#!/usr/bin/env node
// Check every entry in src/content/equations/: schema, file names, unique ids and pinned
// dates, and that all LaTeX (equation, symbols, inline $...$) renders in KaTeX.
// Exits with status 1 if anything is wrong, so CI can block the pull request.
import { checkEntries, loadEntries } from "./lib.mjs";

const { entries, errors, warnings } = checkEntries(loadEntries());

for (const w of warnings) console.warn(`warning: ${w}`);
for (const e of errors) console.error(`error: ${e}`);
console.log(`Checked ${entries.length} entries: ${errors.length} error(s), ${warnings.length} warning(s).`);
process.exit(errors.length ? 1 : 0);
