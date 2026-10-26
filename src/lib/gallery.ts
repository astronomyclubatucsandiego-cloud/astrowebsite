import type { ImageMetadata } from 'astro';

/** Gallery sections, in display order. Photos for each live in
 *  src/assets/gallery/<slug>/; dropping a file in is all it takes.
 *  Optional `banner`: the file name of the photo to use as the page banner (defaults to the
 *  first photo), plus `bannerPosition` to pick the crop. Use it when the first photo is a
 *  group shot, since a wide banner crop cuts through faces.
 *  Optional `captions`: exact wording for photos whose file name can't spell it right
 *  (apostrophes, hyphens like "200-inch", capital letters in object names). Keyed by file name.
 *  Optional `about`: for trip sections, what the place is, a few facts and outside links, shown above the
 *  photos (this replaced the Dark Sites page, Oct 2026). A section with `about` shows even before it has
 *  photos. Facts are sourced (SDAA, CA State Parks, the club's own trips); don't add unconfirmed ones. */
export const GALLERY_SECTIONS = [
  { slug: 'general', title: 'Campus Events', description: 'Observing nights, star parties and meetings on campus.' },
  {
    slug: 'astrophotography',
    title: 'Astrophotography',
    description: 'Deep-sky and planetary images taken by club members.',
    captions: {
      '01-elephants-trunk-nebula--connor-sandfer.jpg': "Elephant's Trunk Nebula",
      '02-horsehead-nebula--connor-sandfer.jpg': 'Horsehead Nebula',
      '03-andromeda-galaxy--connor-sandfer.jpg': 'Andromeda Galaxy',
    },
  },
  {
    slug: 'tds',
    title: 'Tierra Del Sol',
    description: 'Photos from our trips to the Tierra Del Sol Darksite with the San Diego Astronomy Association.',
    about: {
      intro:
        "The San Diego Astronomy Association's dark-sky observing site in east San Diego County, at 3,710 feet. " +
        'We have gone out with SDAA for overnight stargazing, looking through small and big telescopes and ' +
        'seeing a multitude of stars with just the naked eye.',
      facts: [
        ['Run by', 'The San Diego Astronomy Association (SDAA)'],
        ['Good for', 'Overnight stargazing through telescopes, far from city light'],
      ],
      /* SDAA's two pages (the site, its weather) were removed on Oct 25, 2026 because sdaa.org was hacked
         (hidden spam links injected on every page). Put them back once it's fixed:
         https://sdaa.org/tierra-del-sol-dark-sky-observing-site/ and https://sdaa.org/tierra-del-sol-weather-conditions/ */
      links: [],
    },
  },
  {
    slug: 'anza',
    title: 'Anza-Borrego',
    description: 'Photos from our annual stargazing and camping trip to Anza-Borrego Desert State Park.',
    about: {
      intro:
        'Our annual weekend trip to Anza-Borrego Desert State Park, an International Dark Sky Park since 2018. ' +
        'We hike through the desert, camp under the stars, play card games, learn how to build a campfire, ' +
        'and look at the cosmos through our telescopes.',
      facts: [
        ['How often', 'Once a year, over a weekend'],
        ['Spots', 'Limited, usually about 25, so watch Discord and Instagram for the announcement'],
      ],
      links: [
        { label: 'Anza-Borrego Desert State Park', href: 'https://www.parks.ca.gov/?page_id=638' },
        { label: 'Dark Sky Park announcement (CA State Parks)', href: 'https://www.parks.ca.gov/NewsRelease/783' },
      ],
    },
  },
  {
    slug: 'palomar',
    title: 'Palomar',
    description: 'Our trip to Palomar Observatory, including a tour of the 200-inch Hale Telescope.',
    banner: '05-the-group-under-the-200-inch-Hale-Telescope.jpg',
    bannerPosition: 'center 30%',
    about: {
      intro:
        'Not a place we set up our own telescopes. We visit the observatory on Palomar Mountain and tour the ' +
        '200-inch Hale Telescope, dedicated in 1948.',
      facts: [['Highlight', 'Standing under the 200-inch Hale Telescope']],
      links: [{ label: 'Visiting Palomar Observatory', href: 'https://sites.astro.caltech.edu/palomar/visitor/' }],
    },
    captions: {
      '05-the-group-under-the-200-inch-Hale-Telescope.jpg': 'The group under the 200-inch Hale Telescope',
    },
  },
  { slug: 'merch', title: 'Merch', description: 'Club shirts, stickers and more.' },
] as const;

export type GallerySection = (typeof GALLERY_SECTIONS)[number];

type About = { intro: string; facts: readonly (readonly [string, string])[]; links: readonly { label: string; href: string }[] };
/** A trip section's `about` block, if it has one. */
export const aboutFor = (section: GallerySection): About | undefined => ('about' in section ? section.about : undefined);

/** Sections listed on the gallery page and menu: any with photos, plus trip sections with an `about`. */
export const isListed = (section: GallerySection) => !!aboutFor(section) || photosFor(section.slug).length > 0;

export interface GalleryPhoto {
  image: ImageMetadata;
  /** The original file name, e.g. "01-horsehead-nebula--connor-sandfer.jpg". */
  file: string;
  /** What's in the photo, from the file name: "01-horsehead-nebula--connor-sandfer.jpg" gives "Horsehead nebula". */
  alt: string;
  /** Who took it, from the part after "--": "Connor Sandfer". Optional. */
  credit?: string;
}

const files = import.meta.glob<{ default: ImageMetadata }>(
  '/src/assets/gallery/*/*.{jpg,jpeg,png,webp,avif,JPG,JPEG,PNG,WEBP}',
  { eager: true },
);

const words = (s: string) => s.replace(/[-_]+/g, ' ').trim();
const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const titleCase = (s: string) => s.replace(/\b\w/g, (c) => c.toUpperCase());

/** "01-orion-from-anza--jane-doe.jpg" gives { alt: "Orion from anza", credit: "Jane Doe" }. */
const describe = (path: string) => {
  const name = path.split('/').pop()!
    .replace(/\.[^.]+$/, '') // extension
    .replace(/^\d+[-_ ]+/, ''); // ordering prefix: "01-"
  const [what, who] = name.split('--');
  return { alt: capitalize(words(what)), credit: who ? titleCase(words(who)) : undefined };
};

/** A section's photos, sorted by file name so a numeric prefix sets the order. */
export function photosFor(slug: string): GalleryPhoto[] {
  const prefix = `/src/assets/gallery/${slug}/`;
  const section = GALLERY_SECTIONS.find((s) => s.slug === slug);
  const captions: Record<string, string> = (section && 'captions' in section ? section.captions : {}) ?? {};
  return Object.keys(files)
    .filter((path) => path.startsWith(prefix))
    .sort()
    .map((path) => {
      const file = path.split('/').pop()!;
      const described = describe(path);
      return { image: files[path].default, file, ...described, alt: captions[file] ?? described.alt };
    });
}
