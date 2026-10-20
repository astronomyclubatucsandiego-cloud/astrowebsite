import { getCollection, type CollectionEntry } from 'astro:content';

export type ClubEvent = CollectionEntry<'events'>;

/** Today in San Diego as YYYY-MM-DD, so an event stays "upcoming" through its last local day. */
export const todayInSanDiego = () =>
  new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Los_Angeles' }).format(new Date());

/**
 * Splits events by date at build time. The site rebuilds daily (deploy.yml),
 * so events move to "past" without anyone editing them.
 *  - upcoming: endsOn is today or later, soonest first
 *  - regular:  recurring series, by order
 *  - past:     everything else, most recent first; undated past events go last
 */
export async function eventsByStatus() {
  const today = todayInSanDiego();
  const all = await getCollection('events');
  const byOrder = (a: ClubEvent, b: ClubEvent) => a.data.order - b.data.order;

  const upcoming = all
    .filter((e) => !e.data.recurring && e.data.endsOn && e.data.endsOn >= today)
    .sort((a, b) => a.data.endsOn!.localeCompare(b.data.endsOn!) || byOrder(a, b));
  const regular = all.filter((e) => e.data.recurring).sort(byOrder);
  const past = all
    .filter((e) => !e.data.recurring && !(e.data.endsOn && e.data.endsOn >= today))
    .sort((a, b) => (b.data.endsOn ?? '').localeCompare(a.data.endsOn ?? '') || byOrder(a, b));

  return { upcoming, regular, past };
}
