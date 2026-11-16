#!/usr/bin/env node
// Print the schedule for one or more months and check that no equation
// repeats within a month.
//
//   npm run equations:preview                          this month (club time zone)
//   npm run equations:preview -- 2026-12               a specific month
//   npm run equations:preview -- 2026-12 --months 12   twelve months from there
//   options: --include-unreviewed  --quiet (summary only)
import { parseArgs } from "node:util";
import { DEFAULT_TIME_ZONE, dateInTimeZone, equationForDate, monthPool } from "../../src/lib/equation-of-the-day.ts";
import { checkEntries, loadEntries } from "./lib.mjs";

const { values, positionals } = parseArgs({
  allowPositionals: true,
  options: {
    months: { type: "string", default: "1" },
    "include-unreviewed": { type: "boolean", default: false },
    quiet: { type: "boolean", default: false },
  },
});

const { entries: all, errors } = checkEntries(loadEntries());
if (errors.length) {
  for (const e of errors) console.error(`error: ${e}`);
  process.exit(1);
}
const entries = values["include-unreviewed"] ? all : all.filter((e) => e.reviewed_by);

let year;
let month;
if (positionals[0]) {
  const m = /^(\d{4})-(\d{2})$/.exec(positionals[0]);
  if (!m) {
    console.error("Give the month as YYYY-MM, e.g. 2026-12.");
    process.exit(2);
  }
  [year, month] = [Number(m[1]), Number(m[2])];
} else {
  ({ year, month } = dateInTimeZone(new Date(), DEFAULT_TIME_ZONE));
}

const monthCount = Number(values.months);
const problems = [];
const notes = [];
const label = (y, m) => `${y}-${String(m).padStart(2, "0")}`;

for (let k = 0; k < monthCount; k++) {
  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const poolSize = monthPool(entries, year, month).length;
  const seen = new Map();
  let emptyDays = 0;
  if (!values.quiet) console.log(`\n${label(year, month)}  (rotation of ${poolSize} entries)`);

  for (let day = 1; day <= daysInMonth; day++) {
    const e = equationForDate(entries, year, month, day);
    if (!e) {
      emptyDays++;
      continue;
    }
    if (!values.quiet) console.log(`  ${String(day).padStart(2, " ")}  ${e.id}${e.pinned ? "  (pinned)" : ""}`);
    if (e.pinned) continue;
    if (seen.has(e.id)) {
      const msg = `${label(year, month)}: "${e.id}" on day ${seen.get(e.id)} and day ${day}`;
      // Repeats are only a bug if the rotation is big enough to avoid them.
      (poolSize >= daysInMonth ? problems : notes).push(msg);
    }
    seen.set(e.id, day);
  }
  if (emptyDays) notes.push(`${label(year, month)}: ${emptyDays} day(s) with nothing to show (empty rotation)`);
  month += 1;
  if (month > 12) [year, month] = [year + 1, 1];
}

for (const n of notes) console.warn(`note: ${n}`);
for (const p of problems) console.error(`repeat: ${p}`);
console.log(`\nChecked ${monthCount} month(s): ${problems.length} unexpected repeat(s), ${notes.length} note(s).`);
process.exit(problems.length ? 1 : 0);
