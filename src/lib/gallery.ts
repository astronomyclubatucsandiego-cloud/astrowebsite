import type { ImageMetadata } from 'astro';

/** Gallery sections, in display order. Photos for each live in
 *  src/assets/gallery/<slug>/; dropping a file in is all it takes.
 *  Optional `banner`: the file name of the photo to use as the page banner (defaults to the
 *  first photo), plus `bannerPosition` to pick the crop. Use it when the first photo is a
 *  group shot, since a wide banner crop cuts through faces.
 *  Optional `captions`: exact wording for photos whose file name can't spell it right
 *  (apostrophes, hyphens like "200-inch", capital letters in object names). Keyed by file name. */
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
  { slug: 'tds', title: 'Tierra Del Sol', description: 'Photos from our trips to the Tierra Del Sol Darksite with the San Diego Astronomy Association.' },
  { slug: 'anza', title: 'Anza-Borrego', description: 'Photos from our annual stargazing and camping trip to Anza-Borrego Desert State Park.' },
  {
    slug: 'palomar',
    title: 'Palomar',
    description: 'Our trip to Palomar Observatory, including a tour of the 200-inch Hale Telescope.',
    banner: '05-the-group-under-the-200-inch-Hale-Telescope.jpg',
    bannerPosition: 'center 30%',
    captions: {
      '05-the-group-under-the-200-inch-Hale-Telescope.jpg': 'The group under the 200-inch Hale Telescope',
    },
  },
  { slug: 'merch', title: 'Merch', description: 'Club shirts, stickers and more.' },
] as const;

export type GallerySection = (typeof GALLERY_SECTIONS)[number];

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
