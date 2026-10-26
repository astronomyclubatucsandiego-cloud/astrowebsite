/** Club details used across the site. */
export const CLUB = {
  name: 'The Astronomy Club at UC San Diego',
  shortName: 'The Astronomy Club',
  email: 'astronomyclubatucsandiego@gmail.com',
  discord: 'https://discord.com/invite/QfNXmwywTK',
  instagram: 'https://www.instagram.com/astronomyclubatucsd/',
  instagramHandle: '@astronomyclubatucsd',
  /** Where board members request website changes. TODO: add the real form link. */
  updateForm: '',
  /** Where General Body Meetings are held (one GBM each fall, winter and spring; dates go out on Discord and Instagram). */
  gbm: {
    room: 'SERF 383',
    address: ['3183 Matthews Ln', 'La Jolla, CA 92093'],
    mapQuery: 'SERF, UC San Diego, 3183 Matthews Ln, La Jolla, CA 92093',
  },
  /** Google Calendar shown on the home page: moon phases and astronomy events ("Moon/Astro"). */
  calendars: {
    astronomy: 'sraeglclan8q6m551jc1gn6nlt61fk3a@import.calendar.google.com',
  },
  /** Which board is shown: the folder name in src/content/board/. Switch to '2026-27' when that board is complete. */
  boardTerm: '2025-26',
  boardYear: '2025-2026',
};

export const NAV = [
  { label: 'Home', href: '/' },
  { label: 'Meet the Board', href: '/board/' },
  { label: 'Gallery', href: '/gallery/' },
  { label: 'Dark Sites', href: '/dark-sites/' },
  { label: 'FAQs', href: '/faq/' },
  { label: 'Resources', href: '/resources/' },
];

/** Prefix a site path with the configured base ('/astrowebsite'). */
export const url = (path: string) =>
  path.startsWith('/') ? import.meta.env.BASE_URL.replace(/\/$/, '') + path : path;
