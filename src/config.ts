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
  /** NASA API key for "Today from NASA" on Resources (api.nasa.gov, registered to the club Gmail, Oct 2026).
   *  It's meant to be public: it only raises the rate limit (1,000 requests an hour) and can't access or cost anything. */
  nasaApiKey: 'TzrJWDfk68MWrNLtjgqFkPRfcBGLthDcfdPQgKkQ',
  /** Google Calendar shown on the home page: moon phases and astronomy events ("Moon/Astro"). */
  calendars: {
    astronomy: 'sraeglclan8q6m551jc1gn6nlt61fk3a@import.calendar.google.com',
  },
  /** Which board is shown: the folder name in src/content/board/. Switch to '2026-27' when that board is complete. */
  boardTerm: '2025-26',
  boardYear: '2025-2026',
};

/** Sponsors and supporters on the home page, in this order (owner, Oct 2026). `kind` is what the
 *  organization agreed to be called. A logo shows when src/assets/supporters/<slug>.(svg|png|jpg|webp)
 *  exists; get each organization's OK before adding its logo. */
export const SUPPORTERS = [
  {
    slug: 'ucsd-astronomy',
    name: 'Department of Astronomy & Astrophysics, UC San Diego',
    kind: 'Sponsor',
    what: 'Provides the club with annual funding.',
    href: 'https://astro.ucsd.edu/',
  },
  {
    slug: 'palomar',
    name: 'Palomar Observatory',
    kind: 'Supporter',
    what: 'Hosts behind-the-scenes tours of the observatory for our members.',
    href: 'https://sites.astro.caltech.edu/palomar/',
  },
  {
    slug: 'sdaa',
    name: 'San Diego Astronomy Association',
    kind: 'Supporter',
    what: 'Hosts the club\'s major observing event at its Tierra Del Sol dark-sky site and provides access to its large telescopes.',
    /* No link while sdaa.org is hacked (Oct 2026). Restore https://sdaa.org/ once it's clean. */
    href: '',
  },
];

export const NAV = [
  { label: 'Home', href: '/' },
  { label: 'Meet the Board', href: '/board/' },
  { label: 'Gallery', href: '/gallery/' },
  { label: 'FAQs', href: '/faq/' },
  { label: 'Resources', href: '/resources/' },
];

/** Prefix a site path with the configured base ('/astrowebsite'). */
export const url = (path: string) =>
  path.startsWith('/') ? import.meta.env.BASE_URL.replace(/\/$/, '') + path : path;
