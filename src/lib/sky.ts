/** Tonight's sky for UC San Diego, computed in the visitor's browser so it's always today.
 *  Sun: the sunrise equation from the Almanac for Computers (1990), good to about a minute.
 *  Moon: Meeus, Astronomical Algorithms ch. 48 (low precision), good to about 1% illumination. */

export const UCSD = { lat: 32.8801, lon: -117.234, timeZone: 'America/Los_Angeles' };

const rad = (d: number) => (d * Math.PI) / 180;
const deg = (r: number) => (r * 180) / Math.PI;
const norm = (d: number, m = 360) => ((d % m) + m) % m;

/** Today's date (year, month, day) in a time zone. */
export function localDate(now: Date, timeZone = UCSD.timeZone) {
  const [y, m, d] = new Intl.DateTimeFormat('en-CA', { timeZone }).format(now).split('-').map(Number);
  return { y, m, d };
}

/**
 * UTC time when the sun sets past `zenith` degrees on a calendar date at a place.
 * zenith 90.833 = sunset, 108 = end of astronomical twilight (fully dark).
 * Returns null if it never gets that dark (doesn't happen at San Diego's latitude).
 */
export function sunsetUtc(date: { y: number; m: number; d: number }, zenith: number, lat = UCSD.lat, lon = UCSD.lon) {
  const N = Math.floor((Date.UTC(date.y, date.m - 1, date.d) - Date.UTC(date.y, 0, 0)) / 86400000);
  const lngHour = lon / 15;
  const t = N + (18 - lngHour) / 24;
  const M = 0.9856 * t - 3.289;
  const L = norm(M + 1.916 * Math.sin(rad(M)) + 0.02 * Math.sin(rad(2 * M)) + 282.634);
  let RA = norm(deg(Math.atan(0.91764 * Math.tan(rad(L)))));
  RA = (RA + Math.floor(L / 90) * 90 - Math.floor(RA / 90) * 90) / 15;
  const sinDec = 0.39782 * Math.sin(rad(L));
  const cosDec = Math.cos(Math.asin(sinDec));
  const cosH = (Math.cos(rad(zenith)) - sinDec * Math.sin(rad(lat))) / (cosDec * Math.cos(rad(lat)));
  if (cosH < -1 || cosH > 1) return null;
  const H = deg(Math.acos(cosH)) / 15;
  const UT = norm(H + RA - 0.06571 * t - 6.622 - lngHour, 24);
  // UT is hours on the UTC day; evening in California is the next UTC day.
  const base = Date.UTC(date.y, date.m - 1, date.d);
  let when = base + UT * 3600000;
  if (when < base + 12 * 3600000) when += 86400000;
  return new Date(when);
}

/** Moon's illuminated fraction (0 to 1) and whether it's waxing, at a moment. */
export function moonPhase(at: Date) {
  const jd = at.getTime() / 86400000 + 2440587.5;
  const T = (jd - 2451545) / 36525;
  const D = norm(297.8501921 + 445267.1114034 * T);
  const M = norm(357.5291092 + 35999.0502909 * T);
  const Mp = norm(134.9633964 + 477198.8675055 * T);
  const i =
    180 - D - 6.289 * Math.sin(rad(Mp)) + 2.1 * Math.sin(rad(M)) - 1.274 * Math.sin(rad(2 * D - Mp))
    - 0.658 * Math.sin(rad(2 * D)) - 0.214 * Math.sin(rad(2 * Mp)) - 0.11 * Math.sin(rad(D));
  const fraction = (1 + Math.cos(rad(i))) / 2;
  return { fraction, waxing: D < 180 };
}

export function phaseName({ fraction, waxing }: { fraction: number; waxing: boolean }) {
  if (fraction < 0.02) return 'New moon';
  if (fraction > 0.98) return 'Full moon';
  if (Math.abs(fraction - 0.5) < 0.04) return waxing ? 'First quarter' : 'Last quarter';
  return `${waxing ? 'Waxing' : 'Waning'} ${fraction < 0.5 ? 'crescent' : 'gibbous'}`;
}

/** SVG path for the lit part of a moon of radius r centered on 0,0 (lit side on the right; mirror for waning). */
export function moonLitPath(fraction: number, r: number) {
  const rx = r * Math.abs(1 - 2 * fraction);
  const sweep = fraction > 0.5 ? 1 : 0;
  return `M0 ${-r} A${r} ${r} 0 0 1 0 ${r} A${rx.toFixed(2)} ${r} 0 0 ${sweep} 0 ${-r}Z`;
}
