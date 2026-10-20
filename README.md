# Astronomy Club @ UCSD website

The club's website. It replaced our old Google Site and keeps the same look.

**Live:** https://astronomyclubatucsandiego-cloud.github.io/astrowebsite/

Built with [Astro](https://astro.build), hosted for free on GitHub Pages.

## Getting set up

You need:
- **Node.js 22.22 or newer** (Astro won't run on older versions). Check with `node -v`.
- **Git**, and write access to this repo (ask a board member who's an admin).

Then:

```bash
git clone https://github.com/astronomyclubatucsandiego-cloud/astrowebsite.git
cd astrowebsite
npm install      # first time only
npm run dev      # then open http://localhost:4321/astrowebsite/
```

The `/astrowebsite/` at the end matters. The site lives under that path, locally and on GitHub Pages.

Other commands:
- `npm run build` builds the real site into `dist/`. If this fails, don't push.
- `npm run preview` serves that build so you can check it before pushing. Open the address it prints
  plus `/astrowebsite/`.

## How it goes live

Push to `main`. A GitHub Action builds the site and publishes it in about 1 to 2 minutes. Watch the
**Actions** tab: green check means it's live, red X means the build broke (click it to see why).

GitHub Pages is already turned on (Settings, Pages, Source: GitHub Actions). Only repo admins can change that.

## What's where

```
src/
  config.ts             Club links (Discord, Instagram, email, forms, calendars), menu, which board year shows
  styles/global.css     All the styling. Colors and fonts are at the top.
  layouts/Base.astro    Top bar and the "Get involved" footer on every page
  components/Banner.astro  The big photo banner at the top of each page
  pages/                One file per page: index (home), board, faq, resources, 404, gallery/
  content/board/        Board members, one folder per year (2025-26/, 2026-27/)
  lib/gallery.ts        Gallery section names and descriptions
  assets/               Images: board/, gallery/, equipment/, site/ (logo and icons)
.github/workflows/deploy.yml   The build and publish setup
```

## Updating stuff

### Events
The website doesn't do event announcements. Those go on **Discord and Instagram**, and on the club
Google Calendar, which shows up on the home page by itself. After an event, post the photos in the gallery.

### Board members
Each person is one file in that year's folder, like `src/content/board/2026-27/caleb-patton.md`:

```md
---
name: "Caleb Ruben Patton"
role: "Social Media Director"
team: "Executive Board"
order: 2
photo: ../../../assets/board/caleb-patton.jpg
favoriteNasa:
  text: "The Pillars of Creation"
---

Their bio goes here, word for word from the board form.
```

- `team` has to be exactly `Executive Board`, `Media Team` or `Outreach Team`.
- `order` is their spot within the team (1 shows first).
- `photo` is optional. No photo yet? They just show without one.
- `favoriteNasa` is optional. Add `url: "https://..."` under `text` to make it a link.
- Never put anyone's email on the site.

### New board year
1. Make a folder like `src/content/board/2027-28/` and add one file per person (copy one from an older year).
2. Put their photos in `src/assets/board/2027-28/`, about 1400px max. Point each `photo:` line at the file,
   for example `photo: ../../../assets/board/2027-28/jane-doe.jpg`.
3. Want to see it before it's live? Change `boardTerm` in `src/config.ts` to the new folder name, run
   `npm run dev`, look, then change it back.
4. When the roster's done, set `boardTerm` (`'2027-28'`) and `boardYear` (`'2027-2028'`) in `src/config.ts`
   and push.

Old years stay in their folders, so nothing gets lost.

### Gallery photos
Drop them in `src/assets/gallery/<section>/`. The sections are `general` (Campus Events),
`astrophotography`, `tds` (Tierra Del Sol), `anza`, `palomar` and `merch`.
- Name them like `04-orion-from-anza.jpg`. The number sets the order, and the rest becomes the photo's
  description for screen readers ("Orion from anza"). So name them like you're describing the photo.
- An empty section just says "no photos yet" until you add some.
- To rename a section or change its description, edit `src/lib/gallery.ts`.

### Everything else

| What | Where |
|---|---|
| Discord, Instagram, email, forms, calendars | `CLUB` in `src/config.ts` |
| Menu | `NAV` in `src/config.ts` |
| Home page text and photos | `src/pages/index.astro` |
| FAQ | `src/pages/faq.astro` |
| Resources | `src/pages/resources.astro` |
| Colors and fonts | top of `src/styles/global.css` |

Linking between pages? Use the `url()` helper: `href={url('/board/')}`, not a plain `href="/board/"`.
Plain links break because of the `/astrowebsite/` path. Import it at the top of the page with
`import { url } from '../config';` (use `'../../config'` inside `src/pages/gallery/`).

## Keep it looking like us

- Keep the look of the old Google Site: navy top bar, photo banners, Arvo headings, Lato text, white and
  dark gray sections.
- Use real club photos. No stock images, glowing gradients, or generic template stuff.
- Don't make things up on the site (dates, numbers, policies). If you don't know it, leave it out.
- Every image needs a description (`alt` text), except purely decorative banners.

## Before you push

- `npm run build` has to pass.
- Check it on your phone, not just your laptop.
- Shrink big photos first (about 2400px wide max, 1400px for board photos). Don't commit 10 MB PNGs.
  On a Mac: check the size with `sips -g pixelWidth -g pixelHeight photo.jpg`, and if it's bigger than
  2400px, shrink it with `sips -Z 2400 photo.jpg`. Don't run `-Z` on small photos. It blows them up and
  makes them blurry.

## To do

- [ ] Make the club Google Calendar public. It shows a sign-in box right now. Fix it in Google Calendar settings
      for astronomyclubatucsandiego@gmail.com, "Make available to public".
- [ ] Finish the 2026-27 board. Only 6 form responses so far, and their photos are stuck on Drive behind a sign-in.
- [ ] Add the Website Update Form link (`updateForm` in `src/config.ts`).
- [ ] Get Connor's full-size Andromeda photo (the current one is only 200px).
- [ ] Fill the empty gallery sections (Tierra Del Sol, Anza, Palomar, Merch).
- [ ] Write the Resources page.
- [ ] Point the old Google Site to this one, or take it down.
