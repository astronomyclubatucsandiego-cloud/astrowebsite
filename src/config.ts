/** Club details used across the site. */
export const CLUB = {
  name: 'The Astronomy Club at UC San Diego',
  shortName: 'The Astronomy Club',
  email: 'astronomyclubatucsandiego@gmail.com',
  discord: 'https://discord.com/invite/QfNXmwywTK',
  instagram: 'https://www.instagram.com/ucsdastronomyclub',
  instagramHandle: '@ucsdastronomyclub',
  /** Sign-up form required for off-campus events. */
  offCampusForm: 'https://forms.gle/w1VfiPrjYYpbZkT99',
  /** Where board members request website changes. TODO: add the real form link. */
  updateForm: '',
  /** Google Calendars shown on the home page. */
  calendars: {
    club: 'astronomyclubatucsandiego@gmail.com',
    astronomy: 'sraeglclan8q6m551jc1gn6nlt61fk3a@import.calendar.google.com',
  },
  boardYear: '2025-2026',
};

export const NAV = [
  { label: 'Home', href: '/' },
  { label: 'Meet the Board', href: '/board/' },
  { label: 'Events', href: '/events/' },
  { label: 'Gallery', href: '/gallery/' },
  { label: 'FAQs', href: '/faq/' },
  { label: 'Resources', href: '/resources/' },
];

/** Prefix a site path with the configured base ('/astrowebsite'). */
export const url = (path: string) =>
  path.startsWith('/') ? import.meta.env.BASE_URL.replace(/\/$/, '') + path : path;
