/** Site configuration for the Astronomy Club at UC San Diego, built on the
 *  Popular theme. Most day-to-day edits happen here and in src/content/. */

/* Club details used across the site. Replace each placeholder (marked TODO)
   with the real link. */
export const CLUB = {
  email: 'astronomy@example.com', // TODO: club email
  discord: 'https://discord.gg/your-invite', // TODO: Discord invite link
  instagram: 'https://www.instagram.com/your-handle/', // TODO: Instagram profile
  instagramHandle: '@your-handle', // TODO
  // Link to the board's website update form (e.g. a Google Form).
  updateForm: 'https://forms.gle/your-form', // TODO
};

export const SITE = {
  title: 'Astronomy Club at UC San Diego',
  tagline: 'Stargazing, astrophotography and dark-sky trips',
  description: 'The Astronomy Club at UC San Diego: campus star parties, astrophotography, and dark-sky trips to Anza and Palomar.',
  brandName: 'Astronomy Club',
  brandSub: 'UC San Diego',
  logo: '/images/logo.svg',
  favicon: '/images/logo.svg',
  ogImage: '/images/logo.svg',
  locale: 'en-US',
  landAcknowledgement: 'Looking up together, from campus to the darkest skies in San Diego County.',
  community: { chat: { url: CLUB.discord, label: 'Join our Discord' } },
  // Night-sky styling layered on top of the theme.
  customCSS: ['/styles/space.css'],
};

export const STRINGS: Record<string, string> = {
  skipToContent: 'Skip to content',
  primaryNav: 'Primary',
  toggleMenu: 'Toggle menu',
  nextMeetup: 'Next meetup',
  venueTba: 'Venue to be announced',
  eventCancelled: 'Cancelled',
  rsvp: 'RSVP',
  rsvpExternal: 'RSVP on Luma',
  allEvents: 'All events',
  allSpeakers: 'All speakers',
  allVenues: 'All venues',
  allOrganizers: 'All organizers',
  comingUp: 'Coming up',
  upcomingEvents: 'Upcoming events',
  upcomingLead: 'Save your seat early, space is limited and our rooms fill up.',
  noUpcomingEvents: 'Nothing on the calendar right now, follow us to hear when the next one lands.',
  lookingBack: 'Looking back',
  pastEvents: 'Past events',
  venueWanted: 'Venue wanted',
  eventPlanning: 'Planning',
  confirmed: 'Confirmed',
  fromTheBlog: 'From the blog',
  latestFromCommunity: 'Latest from our community',
  readTheBlog: 'Read the blog',
  allPosts: 'All posts',
  filterLabel: 'Filter:',
  filterAll: 'All',
  subscribeRss: 'Subscribe via RSS',
  subscribeCalendar: 'Subscribe to calendar',
  subscribeGoogle: 'Add to Google Calendar',
  downloadCalendar: 'Download .ics',
  watchRecording: 'Watch',
  viewSlides: 'Slides',
  hasRecording: 'Recording available',
  talks: 'Talks',
  talksLead: 'Every talk from our past events, with recordings and slides where we have them.',
  learnMore: 'Learn more',
  joinChat: 'Join the chat',
  speakerInviteTitle: 'Your name here?',
  speakerInviteBody: 'We are always looking for new voices. Lightning talks welcome, and we will help you prepare.',
  subscribeRssTitle: 'Follow new posts in any feed reader',
  noPosts: 'No posts yet, check back soon.',
  ourSpeaker: 'Our speaker',
  minRead: '{n} min read',
  authorsBy: 'By',
  listSeparator: ', ',
  listSeparatorFinal: ' & ',
  posts: 'Posts',
  guest: 'Guest',
  website: 'Website',
  previewLabel: 'Preview',
  previewBanner: 'This is a preview. Nothing here is published yet.',
  checklist: 'Checklist',
  copyCode: 'Copy code',
  checklistDone: 'done',
  writtenBy: 'Written by {name}',
  eyebrowBlog: 'Blog',
  eyebrowEvents: 'Events',
  eyebrowAuthor: 'Author',
  eyebrowDocs: 'Docs',
  eyebrowTag: 'Tag',
  taggedCount: '{n} post(s) tagged {tag}',
  speakers: 'Speakers',
  eyebrowSpeaker: 'Speaker',
  eyebrowOrganizer: 'Organizer',
  sessionsBy: 'Sessions by {name}',
  eyebrowVenue: 'Venue',
  gettingThere: 'Getting there & access',
  wheelchairAccessible: 'Wheelchair accessible',
  transit: 'Transit',
  parking: 'Parking',
  venueEvents: 'Events held here',
  beforeYouArrive: 'Before you arrive',
  postNavigation: 'More posts',
  newerPost: 'Newer post',
  olderPost: 'Older post',
  paginationLabel: 'Pagination',
  paginationPrev: 'Previous',
  paginationNext: 'Next',
};


/* List pagination size. Mirrors Hugo's [pagination] pagerSize (see PARITY.md). */
export const PAGINATION = { pageSize: 10 };

/* Renameable content sections. Unused here: the home and organizer pages are
   the club's own (src/pages/), but the theme expects the export. */
export const SECTIONS_MAP = {
  authors: 'authors',
  team: 'board',
};

/* Night-sky palette. The surface/text keys switch the theme to a dark
   background; primary is a pale periwinkle with dark text on buttons. */
export const BRAND: Record<string, string> = {
  primary: '#a5b4fc',
  primaryHover: '#c7d2fe',
  primaryActive: '#818cf8',
  link: '#a5b4fc',
  linkHover: '#e0e7ff',
  secondary: '#1e2748',
  accent: '#fbbf24',
  ink: '#eef2ff',
  textBody: '#c9d1ea',
  textMuted: '#97a3c4',
  textOnBrand: '#0a0f1f',
  surfacePage: '#0a0f1f',
  surfaceCard: '#121a31',
  surfaceTertiary: '#0d1428',
  surfaceWash: '#0d1430',
  surfaceWashSoft: '#0f1733',
  surfaceInk: '#060914',
  borderSubtle: '#243056',
  fontSans: 'Inter, system-ui, sans-serif',
  fontDisplay: 'Quantico, Inter, sans-serif',
};

export const NAV: {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
}[] = [
  { label: 'Home', href: '/' },
  { label: 'Meet the Board', href: '/board/' },
  {
    label: 'Gallery',
    href: '/gallery/',
    children: [
      { label: 'All galleries', href: '/gallery/' },
      { label: 'Campus Events', href: '/gallery/general/' },
      { label: 'Astrophotography', href: '/gallery/astrophotography/' },
      { label: 'TDS', href: '/gallery/tds/' },
      { label: 'Anza', href: '/gallery/anza/' },
      { label: 'Palomar', href: '/gallery/palomar/' },
      { label: 'Merch', href: '/gallery/merch/' },
    ],
  },
  { label: 'FAQ', href: '/faq/' },
  { label: 'Resources', href: '/resources/' },
];

export const CTA = { label: 'Join Discord', url: CLUB.discord, icon: 'fa-brands fa-discord' };

export const SOCIAL = [
  { label: 'Discord', icon: 'fa-brands fa-discord', url: CLUB.discord },
  { label: 'Instagram', icon: 'fa-brands fa-instagram', url: CLUB.instagram },
  { label: 'Email', icon: 'fa-solid fa-envelope', url: `mailto:${CLUB.email}` },
];

export const FOOTER = {
  tagline: 'Clear skies!',
  credit: { label: 'Built with the Popular theme', url: 'https://popular.mariatta.ca/' },
  columns: [
    { title: 'Club', links: [
      { label: 'About us', href: '/#about' },
      { label: 'Get involved', href: '/#get-involved' },
      { label: 'Contact', href: '/#contact' },
      { label: 'Meet the Board', href: '/board/' },
    ]},
    { title: 'Gallery', links: [
      { label: 'Campus Events', href: '/gallery/general/' },
      { label: 'Astrophotography', href: '/gallery/astrophotography/' },
      { label: 'Dark-sky trips', href: '/gallery/' },
      { label: 'Merch', href: '/gallery/merch/' },
    ]},
    { title: 'Help', links: [
      { label: 'FAQ', href: '/faq/' },
      { label: 'Resources', href: '/resources/' },
    ]},
  ],
};

/** Support box at the bottom of blog posts, null hides it. */
export const SUPPORT = null;

/** Section list-page headers (theme routes; unused by the club pages). */
export const SECTIONS = {};

/** The home page is src/pages/index.astro; the theme's own is turned off. */
export const HOME = {};

/** Demo-only switcher bar. */
export const DEMO_BAR = null;
