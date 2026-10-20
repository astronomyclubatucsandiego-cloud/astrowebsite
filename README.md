# The Astronomy Club at UC San Diego website

Built with [Astro](https://astro.build). It carries over the look of the club's Google Site
(navy top bar, photo banners, Arvo + Lato + Playfair Display) and is published to GitHub Pages
automatically on every push to `main`:
https://astronomyclubatucsandiego-cloud.github.io/astrowebsite/

## Run it locally

```bash
npm install
npm run dev        # http://localhost:4321/astrowebsite/
```

## Where to edit things

| What | Where |
|---|---|
| Club email, Discord, Instagram, forms, calendars, board year | `src/config.ts` |
| Navigation menu | `src/config.ts` → `NAV` |
| Home page text and photos | `src/pages/index.astro` |
| "Upcoming Event!" on the home page | `FEATURED_EVENT` in `src/pages/index.astro` |
| Board members | one file each in `src/content/board/`; photos in `src/assets/board/` |
| Events | one file each in `src/content/events/`; flyers in `src/assets/events/` |
| Gallery photos | drop images into `src/assets/gallery/<section>/` |
| Gallery section names and descriptions | `src/lib/gallery.ts` |
| FAQ | `src/pages/faq.astro` |
| Resources | `src/pages/resources.astro` |
| Colors and fonts | `src/styles/global.css` (top of the file) |

### Adding a board member

Copy a file in `src/content/board/`, put their photo in `src/assets/board/`, and fill in
`name`, `role`, `team` (`Executive Board`, `Media Team` or `Outreach Team`) and `order`.
The text below the `---` is their bio.

### Adding an event

Copy a file in `src/content/events/`, put the flyer in `src/assets/events/`, and set `order`
(lowest shows first, so give new events a lower number). Describe the flyer in its `alt` text
so people using screen readers get the details too.

### Adding gallery photos

Put `.jpg`, `.png` or `.webp` files in the right folder under `src/assets/gallery/`
(`general`, `astrophotography`, `tds`, `anza`, `palomar`, `merch`). The file name becomes the
photo's description, so name it like `04-orion-nebula-from-anza.jpg`. A leading number sets the
order and is not shown. Photos are resized and compressed automatically when the site builds.
