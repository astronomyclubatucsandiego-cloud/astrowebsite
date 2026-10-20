import type { ImageMetadata } from 'astro';

/** Gallery sections, in display order. Photos for each live in
 *  src/assets/gallery/<slug>/; dropping a file in is all it takes. */
export const GALLERY_SECTIONS = [
  {
    slug: 'general',
    title: 'Campus Events',
    icon: 'fa-solid fa-users',
    description: 'Star parties, telescope nights and general meetings around campus.',
  },
  {
    slug: 'astrophotography',
    title: 'Astrophotography',
    icon: 'fa-solid fa-camera',
    description: 'Planets, nebulae, galaxies and star trails captured by our members.',
  },
  {
    slug: 'tds',
    title: 'TDS',
    icon: 'fa-solid fa-mountain-sun',
    description: 'Photography from our TDS trips.',
  },
  {
    slug: 'anza',
    title: 'Anza',
    icon: 'fa-solid fa-sun-plant-wilt',
    description: 'Desert dark skies and photography from our Anza trips.',
  },
  {
    slug: 'palomar',
    title: 'Palomar',
    icon: 'fa-solid fa-tower-observation',
    description: 'Photography from our trips to Palomar.',
  },
  {
    slug: 'merch',
    title: 'Merch',
    icon: 'fa-solid fa-shirt',
    description: 'Club shirts, stickers and more. Ask a board member or check Discord to get yours.',
  },
] as const;

export type GallerySection = (typeof GALLERY_SECTIONS)[number];

export interface GalleryPhoto {
  image: ImageMetadata;
  /** Built from the file name: "01-saturn-rings_8in-dob.jpg" → "Saturn rings 8in dob". */
  alt: string;
}

const files = import.meta.glob<{ default: ImageMetadata }>(
  '/src/assets/gallery/*/*.{jpg,jpeg,png,webp,avif,JPG,JPEG,PNG,WEBP}',
  { eager: true },
);

const altFromFileName = (path: string) => {
  const words = path.split('/').pop()!
    .replace(/\.[^.]+$/, '') // extension
    .replace(/^\d+[-_ ]+/, '') // ordering prefix: "01-"
    .replace(/[-_]+/g, ' ')
    .trim();
  return words.charAt(0).toUpperCase() + words.slice(1);
};

/** A section's photos, sorted by file name so a numeric prefix sets the order. */
export function photosFor(slug: string): GalleryPhoto[] {
  const prefix = `/src/assets/gallery/${slug}/`;
  return Object.keys(files)
    .filter((path) => path.startsWith(prefix))
    .sort()
    .map((path) => ({ image: files[path].default, alt: altFromFileName(path) }));
}
