/** Sky events for one night at UC San Diego, computed with Astronomy Engine (MIT,
 *  github.com/cosinekitty/astronomy): meteor shower peaks, eclipses, oppositions, Mercury and
 *  Venus at greatest elongation, the Moon close to a planet, full and new moon, equinoxes and
 *  solstices. Nothing is fetched, so it never goes stale. Checked against published 2026 dates
 *  (IMO meteor calendar, NASA eclipse pages, USNO). */
import * as Astronomy from 'astronomy-engine';
import { UCSD } from './sky';

const observer = new Astronomy.Observer(UCSD.lat, UCSD.lon, 120);
const HOUR = 3600000;
const DAY = 24 * HOUR;

/** The main annual meteor showers, from the International Meteor Organization's 2026 calendar
 *  (Table 5, imo.net/files/meteor-shower/cal2026.pdf). The maximum is a solar longitude (J2000),
 *  which is the same every year, so peak dates for later years come out right too.
 *  zhr: meteors per hour for one observer under a perfectly dark sky with the radiant overhead;
 *  real counts are lower. ra/dec: the radiant (where the meteors seem to come from), degrees. */
const SHOWERS = [
  { name: 'Quadrantids', peakLon: 283.15, zhr: 80, ra: 230, dec: 49 },
  { name: 'Lyrids', peakLon: 32.32, zhr: 18, ra: 271, dec: 34 },
  { name: 'Eta Aquariids', peakLon: 45.5, zhr: 50, ra: 338, dec: -1 },
  { name: 'Southern Delta Aquariids', peakLon: 128, zhr: 25, ra: 340, dec: -16 },
  { name: 'Perseids', peakLon: 140.0, zhr: 100, ra: 48, dec: 58 },
  { name: 'Orionids', peakLon: 208, zhr: 20, ra: 95, dec: 16 },
  { name: 'Leonids', peakLon: 235.27, zhr: 15, ra: 152, dec: 22 },
  { name: 'Geminids', peakLon: 262.2, zhr: 150, ra: 112, dec: 33 },
  { name: 'Ursids', peakLon: 270.7, zhr: 10, ra: 217, dec: 76 },
] as const;

export interface SkyEvent {
  /** Sorts the list. */
  when: Date;
  /** e.g. "Geminid meteor shower peaks". */
  title: string;
  /** Times and what to expect, e.g. "Best after 9:40 PM, up to 150 an hour under dark skies". */
  detail: string;
}

/** One observing night: sunset to the next sunrise. */
export interface Night {
  sunset: Date;
  dark: Date;
  dawn: Date;
  sunrise: Date;
}

export function nightFrom(sunset: Date, dark: Date): Night {
  const dawn = Astronomy.SearchAltitude(Astronomy.Body.Sun, observer, +1, dark, 1, -18)?.date ?? new Date(dark.getTime() + 9 * HOUR);
  const sunrise = Astronomy.SearchRiseSet(Astronomy.Body.Sun, observer, +1, dark, 1)?.date ?? new Date(dawn.getTime() + 1.5 * HOUR);
  return { sunset, dark, dawn, sunrise };
}

/** Precession moves the equinox about 0.014 degrees a year; IMO longitudes are for J2000. */
const ofDate = (lonJ2000: number, year: number) => (lonJ2000 + (year - 2000) * 0.013969) % 360;

/** The next maximum within ~7 weeks. (A long search window makes Astronomy Engine skip a target
 *  that's only a day or two away, so keep it short.) */
function showerPeak(peakLon: number, from: Date): Date | null {
  return Astronomy.SearchSunLongitude(ofDate(peakLon, from.getUTCFullYear()), from, 50)?.date ?? null;
}

/** When a shower's radiant first climbs above 25 degrees during the night (or "dark" if it's already up). */
function radiantUp(ra: number, dec: number, night: Night): Date | null {
  Astronomy.DefineStar(Astronomy.Body.Star1, ra / 15, dec, 1000);
  for (let t = night.dark.getTime(); t < night.dawn.getTime(); t += 10 * 60000) {
    const eq = Astronomy.Equator(Astronomy.Body.Star1, new Date(t), observer, true, false);
    if (Astronomy.Horizon(new Date(t), observer, eq.ra, eq.dec, 'normal').altitude >= 25) return new Date(t);
  }
  return null;
}

const altitude = (body: Astronomy.Body, when: Date) => {
  const eq = Astronomy.Equator(body, when, observer, true, true);
  return Astronomy.Horizon(when, observer, eq.ra, eq.dec, 'normal').altitude;
};

const PLANETS = [Astronomy.Body.Mercury, Astronomy.Body.Venus, Astronomy.Body.Mars, Astronomy.Body.Jupiter, Astronomy.Body.Saturn];
const SEASONS: [keyof Astronomy.SeasonInfo, string][] = [
  ['mar_equinox', 'March equinox: first day of spring'],
  ['jun_solstice', 'June solstice: longest day of the year'],
  ['sep_equinox', 'September equinox: first day of fall'],
  ['dec_solstice', 'December solstice: longest night of the year'],
];

/**
 * Events tonight (sunset to sunrise; a solar eclipse or season change counts if it's today), and the
 * next few notable ones within `aheadDays` for when tonight is quiet.
 */
export function skyEvents(night: Night, fmt: (d: Date) => string, aheadDays = 45) {
  const start = night.sunset.getTime();
  const end = night.sunrise.getTime();
  const dayStart = start - 14 * HOUR; // roughly this morning
  const inNight = (d: Date) => d.getTime() >= start && d.getTime() <= end;
  const tonight: SkyEvent[] = [];
  const ahead: SkyEvent[] = [];
  const later = (d: Date) => d.getTime() > end && d.getTime() < end + aheadDays * DAY;
  const dateOf = (d: Date) => d.toLocaleDateString('en-US', { timeZone: UCSD.timeZone, month: 'long', day: 'numeric' });

  // Meteor showers: the peak night is the one closest to the maximum.
  for (const s of SHOWERS) {
    const peak = showerPeak(s.peakLon, new Date(start - 1.5 * DAY));
    if (!peak) continue;
    const mid = (start + end) / 2;
    if (Math.abs(peak.getTime() - mid) <= 0.5 * DAY) {
      const up = radiantUp(s.ra, s.dec, night);
      const moon = Astronomy.Illumination(Astronomy.Body.Moon, new Date(mid)).phase_fraction;
      const best = up ? (up.getTime() <= night.dark.getTime() + 15 * 60000 ? 'Best from full dark until dawn' : `Best after ${fmt(up)}`) : 'Radiant stays low tonight, so expect only a few';
      const moonNote = moon > 0.5 ? ` The Moon is ${Math.round(moon * 100)}% lit, so only the brighter meteors will show.` : '';
      tonight.push({ when: up ?? night.dark, title: `${s.name} meteor shower peaks`, detail: `${best}. Up to ${s.zhr} meteors an hour under ideal dark skies.${moonNote}` });
    } else if (later(peak)) {
      ahead.push({ when: peak, title: `${s.name} meteor shower peaks`, detail: `Night of ${dateOf(new Date(peak.getTime() - 6 * HOUR))}` });
    }
  }

  // Lunar eclipse, only if the Moon is up for some of it.
  const lunar = Astronomy.SearchLunarEclipse(new Date(start - DAY));
  const lPeak = lunar.peak.date;
  if (inNight(lPeak) || later(lPeak)) {
    const mins = (m: number) => new Date(lPeak.getTime() + m * 60000);
    const visible = altitude(Astronomy.Body.Moon, lPeak) > 0;
    const kind = lunar.kind === 'total' ? 'Total' : lunar.kind === 'partial' ? 'Partial' : 'Penumbral';
    if (inNight(lPeak) && visible) {
      const parts = lunar.sd_partial > 0
        ? [`partial phase ${fmt(mins(-lunar.sd_partial))} to ${fmt(mins(lunar.sd_partial))}`]
        : [`${fmt(mins(-lunar.sd_penum))} to ${fmt(mins(lunar.sd_penum))}, a faint shading only`];
      if (lunar.sd_total > 0) parts.push(`totality ${fmt(mins(-lunar.sd_total))} to ${fmt(mins(lunar.sd_total))}`);
      tonight.push({ when: mins(-(lunar.sd_partial || lunar.sd_penum)), title: `${kind} lunar eclipse`, detail: `${parts.join('; ')}. Peak at ${fmt(lPeak)}.` });
    } else if (later(lPeak) && visible && lunar.kind !== 'penumbral') {
      ahead.push({ when: lPeak, title: `${kind} lunar eclipse`, detail: `${dateOf(lPeak)}, peak at ${fmt(lPeak)}` });
    }
  }

  // Solar eclipse seen from San Diego (today counts, since it happens in daylight).
  const solar = Astronomy.SearchLocalSolarEclipse(new Date(dayStart), observer);
  const sPeak = solar.peak.time.date;
  if (sPeak.getTime() >= dayStart && sPeak.getTime() <= end && solar.peak.altitude > 0) {
    tonight.push({ when: sPeak, title: `${solar.kind === 'partial' ? 'Partial' : solar.kind === 'annular' ? 'Annular' : 'Total'} solar eclipse today`, detail: `${fmt(solar.partial_begin.time.date)} to ${fmt(solar.partial_end.time.date)}, ${Math.round(solar.obscuration * 100)}% of the Sun covered at ${fmt(sPeak)}. Never look at the Sun without certified eclipse glasses.` });
  } else if (later(sPeak) && solar.peak.altitude > 0) {
    ahead.push({ when: sPeak, title: 'Solar eclipse visible from San Diego', detail: `${dateOf(sPeak)}, peak at ${fmt(sPeak)}` });
  }

  // Oppositions: Mars, Jupiter or Saturn at its biggest and brightest, up all night.
  for (const body of [Astronomy.Body.Mars, Astronomy.Body.Jupiter, Astronomy.Body.Saturn]) {
    const opp = Astronomy.SearchRelativeLongitude(body, 0, new Date(start - DAY)).date;
    if (Math.abs(opp.getTime() - (start + end) / 2) <= 0.5 * DAY) {
      tonight.push({ when: night.dark, title: `${body} at opposition`, detail: 'Closest and brightest of the year, up all night.' });
    } else if (later(opp)) {
      ahead.push({ when: opp, title: `${body} at opposition`, detail: dateOf(opp) });
    }
  }

  // Mercury and Venus at greatest elongation: easiest to see, low after sunset or before sunrise.
  for (const body of [Astronomy.Body.Mercury, Astronomy.Body.Venus]) {
    const el = Astronomy.SearchMaxElongation(body, new Date(start - 2 * DAY));
    const t = el.time.date;
    const where = el.visibility === 'evening' ? 'low in the west after sunset' : 'low in the east before sunrise';
    if (Math.abs(t.getTime() - (start + end) / 2) <= 0.5 * DAY) {
      tonight.push({ when: el.visibility === 'evening' ? night.sunset : night.dawn, title: `${body} at greatest elongation`, detail: `Farthest from the Sun (${Math.round(el.elongation)}°), so easiest to spot: ${where}.` });
    } else if (later(t)) {
      ahead.push({ when: t, title: `${body} at greatest elongation`, detail: `${dateOf(t)}, ${where}` });
    }
  }

  // The Moon close to a planet (within 4 degrees) while both are above the horizon.
  for (const body of PLANETS) {
    for (let t = night.sunset.getTime() + 0.5 * HOUR; t < end - 0.5 * HOUR; t += HOUR) {
      const when = new Date(t);
      if (altitude(Astronomy.Body.Moon, when) < 5 || altitude(body, when) < 5) continue;
      const moon = Astronomy.Equator(Astronomy.Body.Moon, when, observer, true, true).vec;
      const planet = Astronomy.Equator(body, when, observer, true, true).vec;
      const sep = Astronomy.AngleBetween(moon, planet);
      if (sep <= 4) {
        tonight.push({ when, title: `The Moon passes close to ${body}`, detail: `About ${Math.max(1, Math.round(sep))}° apart around ${fmt(when)}.` });
        break;
      }
    }
  }

  // Full and new moon.
  let q = Astronomy.SearchMoonQuarter(new Date(start - DAY));
  for (let i = 0; i < 8; i++, q = Astronomy.NextMoonQuarter(q)) {
    const t = q.time.date;
    if (t.getTime() > end) break;
    if (q.quarter === 2 && inNight(t)) tonight.push({ when: t, title: 'Full moon', detail: `Exactly full at ${fmt(t)}. A bright sky for the Moon, not for faint stars.` });
    if (q.quarter === 0 && t.getTime() >= dayStart && t.getTime() <= end) tonight.push({ when: t, title: 'New moon', detail: `At ${fmt(t)}. The darkest skies of the month.` });
  }

  // Equinoxes and solstices (today).
  const seasons = Astronomy.Seasons(new Date(start).getUTCFullYear());
  for (const [key, title] of SEASONS) {
    const t = (seasons[key] as Astronomy.AstroTime).date;
    if (t.getTime() >= dayStart && t.getTime() <= end) tonight.push({ when: t, title, detail: `At ${fmt(t)}.` });
  }

  const byTime = (a: SkyEvent, b: SkyEvent) => a.when.getTime() - b.when.getTime();
  return { tonight: tonight.sort(byTime), ahead: ahead.sort(byTime).slice(0, 2) };
}

/** Moonrise and moonset during the night, and the dark hours with the Moon down (best for faint things). */
export function moonTonight(night: Night) {
  const rise = Astronomy.SearchRiseSet(Astronomy.Body.Moon, observer, +1, night.sunset, 1)?.date ?? null;
  const set = Astronomy.SearchRiseSet(Astronomy.Body.Moon, observer, -1, night.sunset, 1)?.date ?? null;
  // Walk the dark hours in 5-minute steps and collect the stretches with the Moon below the horizon.
  const windows: [Date, Date][] = [];
  let open: Date | null = null;
  for (let t = night.dark.getTime(); t <= night.dawn.getTime(); t += 5 * 60000) {
    const down = altitude(Astronomy.Body.Moon, new Date(t)) < 0;
    if (down && !open) open = new Date(t);
    if (!down && open) { windows.push([open, new Date(t)]); open = null; }
  }
  if (open) windows.push([open, night.dawn]);
  return {
    rise: rise && rise.getTime() < night.sunrise.getTime() ? rise : null,
    set: set && set.getTime() < night.sunrise.getTime() ? set : null,
    darkWindows: windows.filter(([a, b]) => b.getTime() - a.getTime() >= 20 * 60000),
  };
}
