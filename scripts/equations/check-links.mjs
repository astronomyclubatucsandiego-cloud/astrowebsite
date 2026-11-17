#!/usr/bin/env node
// Check that every entry's `docs` link loads (HTTP 2xx after redirects).
// Needs internet access, so CI runs it as a separate job.
import { checkEntries, loadEntries } from "./lib.mjs";

const USER_AGENT = "EquationOfTheDay-link-check/0.1 (astrophysics club website)";
const TIMEOUT_MS = 15_000;
const CONCURRENCY = 4;

async function problemWith(url) {
  try {
    const res = await fetch(url, {
      redirect: "follow",
      headers: { "user-agent": USER_AGENT },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    return res.ok ? null : `HTTP ${res.status}`;
  } catch (err) {
    return err.cause?.code || err.name || String(err);
  }
}

const { entries, errors } = checkEntries(loadEntries());
if (errors.length) {
  for (const e of errors) console.error(`error: ${e}`);
  process.exit(1);
}

// One request per distinct URL, a few at a time.
const urls = [...new Set(entries.map((e) => e.docs))];
const results = new Map();
let next = 0;
async function worker() {
  while (next < urls.length) {
    const url = urls[next++];
    results.set(url, await problemWith(url));
  }
}
await Promise.all(Array.from({ length: CONCURRENCY }, worker));

let broken = 0;
for (const e of entries) {
  const problem = results.get(e.docs);
  if (problem) {
    broken++;
    console.error(`broken: src/content/equations/${e.id}.yaml  ${e.docs}  (${problem})`);
  }
}
console.log(
  `Checked ${urls.length} distinct links used by ${entries.length} entries: ` +
    (broken ? `${broken} entries point to a broken link.` : "all OK."),
);
process.exit(broken ? 1 : 0);
