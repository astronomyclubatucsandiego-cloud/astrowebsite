# Astronomy Club at UC San Diego website

Built with [Astro](https://astro.build) and the [Popular](https://popular.mariatta.ca/) theme,
with a night-sky look. It is published to GitHub Pages automatically on every push to `main`:
https://astronomyclubatucsandiego-cloud.github.io/astrowebsite/

## Run it locally

```bash
npm install
npm run dev        # http://localhost:4321/astrowebsite/
```

## Where to edit things

| What | Where |
|---|---|
| Club email, Discord, Instagram, update form link | `popular.config.ts` → `CLUB` |
| Navigation menu, footer links | `popular.config.ts` → `NAV`, `FOOTER` |
| Colors | `popular.config.ts` → `BRAND` |
| Home page (About Us, Get Involved, Contact) | `src/pages/index.astro` |
| Board members | one file each in `src/content/board/` (photos go in `public/images/board/`) |
| Gallery photos | drop images into `src/assets/gallery/<section>/` |
| Gallery section names and descriptions | `src/data/gallery.ts` |
| FAQ | `src/content/pages/faq.mdx` |
| Resources | `src/content/pages/resources.md` |
| Night-sky styling | `public/styles/space.css` |

### Adding gallery photos

Put `.jpg`, `.png` or `.webp` files in the right folder under `src/assets/gallery/`
(`general`, `astrophotography`, `tds`, `anza`, `palomar`, `merch`). The file name becomes
the photo's description for screen readers, so name it like
`01-orion-nebula-from-anza.jpg`. A leading number sets the order and is not shown.
Photos are resized and compressed automatically when the site builds.

### Adding a board member

Copy one of the files in `src/content/board/`, fill in the details, and set `order`
to control where it appears.
