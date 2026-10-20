import type { ImageMetadata } from 'astro';

/** Gallery sections, in display order. Photos for each live in
 *  src/assets/gallery/<slug>/; dropping a file in is all it takes. */
export const GALLERY_SECTIONS = [
  { slug: 'general', title: 'Campus Events', description: 'Observing nights, star parties and meetings on campus.' },
  { slug: 'astrophotography', title: 'Astrophotography', description: 'Deep-sky and planetary images taken by club members.' },
  { slug: 'tds', title: 'Tierra Del Sol', description: 'Photos from our trips to the Tierra Del Sol Darksite with the San Diego Astronomy Association.' },
  { slug: 'anza', title: 'Anza Borrego', description: 'Photos from our annual stargazing and camping trip to Anza-Borrego Desert State Park.' },
  { slug: 'palomar', title: 'Palomar', description: 'Photos from our trips to Palomar.' },
  { slug: 'merch', title: 'Merch', description: 'Club shirts, stickers and more.' },
] as const;

export type GallerySection = (typeof GALLERY_SECTIONS)[number];

export interface GalleryPhoto {
  image: ImageMetadata;
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
  return Object.keys(files)
    .filter((path) => path.startsWith(prefix))
    .sort()
    .map((path) => ({ image: files[path].default, ...describe(path) }));
}
