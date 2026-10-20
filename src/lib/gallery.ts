import type { ImageMetadata } from 'astro';

/** Gallery sections, in display order. Photos for each live in
 *  src/assets/gallery/<slug>/; dropping a file in is all it takes. */
export const GALLERY_SECTIONS = [
  { slug: 'general', title: 'Campus Events', description: 'Observing nights, star parties and meetings on campus.' },
  { slug: 'astrophotography', title: 'Astrophotography', description: 'Deep-sky and planetary images taken by club members.', credit: 'Images taken by our former club president Connor Sandfer' },
  { slug: 'tds', title: 'Tierra Del Sol', description: 'Photos from our trips to the Tierra Del Sol Darksite with the San Diego Astronomy Association.' },
  { slug: 'anza', title: 'Anza Borrego', description: 'Photos from our annual stargazing and camping trip to Anza-Borrego Desert State Park.' },
  { slug: 'palomar', title: 'Palomar', description: 'Photos from our trips to Palomar.' },
  { slug: 'merch', title: 'Merch', description: 'Club shirts, stickers and more.' },
] as const;

export type GallerySection = (typeof GALLERY_SECTIONS)[number];

export interface GalleryPhoto {
  image: ImageMetadata;
  /** From the file name: "01-horsehead-nebula.jpg" becomes "Horsehead nebula". */
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
