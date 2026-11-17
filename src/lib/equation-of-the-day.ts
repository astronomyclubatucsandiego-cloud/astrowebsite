/** Equation of the Day: pick the entry to show on a given date.
 *
 *  Within each month, entries are sampled without replacement: the month's pool is shuffled once
 *  with a pseudo-random generator seeded by the year and month, and day d shows the d-th entry of
 *  that shuffle. Every visitor computes the same shuffle, so nothing is stored or scheduled.
 *
 *  No imports: this file runs in the browser (EquationOfTheDay.astro) and in Node
 *  (scripts/equations/). Keep to plain type annotations so Node can run it as-is. */

/** The fields the schedule needs; full entries (src/content/equations/) have more. */
export interface Scheduled {
  id: string;
  /** MM-DD: shown on that date every year and kept out of the rotation. */
  pinned?: string;
  /** YYYY-MM-DD: the entry joins the rotation on the 1st of the following month. */
  added: string;
}

/** One "today" for every visitor: the club's time zone. */
export const DEFAULT_TIME_ZONE = 'America/Los_Angeles';

const pad = (n: number) => String(n).padStart(2, '0');

/** mulberry32: a small, fast, seedable PRNG returning floats in [0, 1). */
export function mulberry32(seed: number): () => number {
  let a = seed | 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** In-place Fisher–Yates shuffle; every ordering is equally likely. */
export function shuffle<T>(items: T[], rand: () => number): T[] {
  for (let i = items.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }
  return items;
}

/** Calendar date of `now` in an IANA time zone, as numbers (month is 1-12). */
export function dateInTimeZone(now = new Date(), timeZone = DEFAULT_TIME_ZONE) {
  const parts = new Intl.DateTimeFormat('en-US', { timeZone, year: 'numeric', month: 'numeric', day: 'numeric' }).formatToParts(now);
  const get = (type: string) => Number(parts.find((p) => p.type === type)!.value);
  return { year: get('year'), month: get('month'), day: get('day') };
}

/** The month's rotation, in display order (index 0 is day 1). Only entries added before the 1st
 *  of the month take part, so adding an entry mid-month can't reshuffle the rest of that month. */
export function monthPool<T extends Scheduled>(entries: readonly T[], year: number, month: number): T[] {
  const monthStart = `${year}-${pad(month)}-01`;
  const pool = entries
    .filter((e) => !e.pinned && e.added < monthStart)
    .sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
  return shuffle(pool, mulberry32(year * 100 + month));
}

/** The entry for a calendar date (month is 1-12), or null if there is none. */
export function equationForDate<T extends Scheduled>(entries: readonly T[], year: number, month: number, day: number): T | null {
  const pinned = entries.find((e) => e.pinned === `${pad(month)}-${pad(day)}`);
  if (pinned) return pinned;
  const pool = monthPool(entries, year, month);
  return pool.length ? pool[(day - 1) % pool.length] : null;
}

/** Today's entry, with "today" taken in the club's time zone. */
export function equationOfTheDay<T extends Scheduled>(entries: readonly T[], { now = new Date(), timeZone = DEFAULT_TIME_ZONE } = {}): T | null {
  const { year, month, day } = dateInTimeZone(now, timeZone);
  return equationForDate(entries, year, month, day);
}
