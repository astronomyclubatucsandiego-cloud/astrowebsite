/** Which naked-eye planets are up tonight from UC San Diego, and where.
 *  Uses Astronomy Engine (MIT, github.com/cosinekitty/astronomy), accurate to well under a
 *  minute of arc, far better than anyone needs to find a planet. */
import * as Astronomy from 'astronomy-engine';
import { UCSD } from './sky';

const PLANETS = [
  Astronomy.Body.Mercury,
  Astronomy.Body.Venus,
  Astronomy.Body.Mars,
  Astronomy.Body.Jupiter,
  Astronomy.Body.Saturn,
] as const;

const observer = new Astronomy.Observer(UCSD.lat, UCSD.lon, 120);
const COMPASS = ['north', 'northeast', 'east', 'southeast', 'south', 'southwest', 'west', 'northwest'];
const compass = (azimuth: number) => COMPASS[Math.round(azimuth / 45) % 8];

function horizon(body: Astronomy.Body, when: Date) {
  const eq = Astronomy.Equator(body, when, observer, true, true);
  return Astronomy.Horizon(when, observer, eq.ra, eq.dec, 'normal');
}

export interface PlanetTonight {
  name: string;
  /** When it's worth looking, for sorting. */
  when: Date;
  /** e.g. "high in the south, sets 2:15 AM" or "rises 11:40 PM in the east". */
  detail: string;
}

/**
 * Planets you can see this evening (from sunset until 1 AM).
 *  - Up when it gets dark (at least 5 degrees high): where to look, and when it sets.
 *  - Below the horizon then but rising before 1 AM: when and where it rises.
 *  - Mercury and Venus, which hug the Sun: "low in the west after sunset" if they're up
 *    40 minutes after sunset.
 */
export function planetsTonight(sunset: Date, dark: Date, fmt: (d: Date) => string): PlanetTonight[] {
  const twilight = new Date(sunset.getTime() + 40 * 60000);
  // Cutoff: 1 AM San Diego time tonight.
  const [h, m] = new Intl.DateTimeFormat('en-US', { timeZone: UCSD.timeZone, hour: 'numeric', minute: 'numeric', hourCycle: 'h23' })
    .format(dark).split(':').map(Number);
  const latest = new Date(dark.getTime() + (((25 - h) % 24) * 60 - m) * 60000);
  const found: PlanetTonight[] = [];

  for (const body of PLANETS) {
    const atDark = horizon(body, dark);
    const set = Astronomy.SearchRiseSet(body, observer, -1, dark, 1)?.date;

    if (atDark.altitude >= 5) {
      const height = atDark.altitude >= 40 ? 'high in the' : atDark.altitude >= 15 ? 'in the' : 'low in the';
      found.push({ name: body, when: dark, detail: `${height} ${compass(atDark.azimuth)}${set ? `, sets ${fmt(set)}` : ''}` });
      continue;
    }

    const atTwilight = horizon(body, twilight);
    if (atTwilight.altitude >= 5 && (body === Astronomy.Body.Mercury || body === Astronomy.Body.Venus)) {
      const sets = Astronomy.SearchRiseSet(body, observer, -1, twilight, 1)?.date;
      found.push({ name: body, when: twilight, detail: `low in the ${compass(atTwilight.azimuth)} after sunset${sets ? `, sets ${fmt(sets)}` : ''}` });
      continue;
    }

    const rise = Astronomy.SearchRiseSet(body, observer, +1, dark, 1)?.date;
    if (rise && rise <= latest) {
      const risePos = horizon(body, new Date(rise.getTime() + 60000));
      found.push({ name: body, when: rise, detail: `rises ${fmt(rise)} in the ${compass(risePos.azimuth)}` });
    }
  }
  return found.sort((a, b) => a.when.getTime() - b.when.getTime());
}
