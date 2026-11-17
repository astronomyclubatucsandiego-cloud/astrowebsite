# Astronomy Club at UC San Diego website

The club's public website, built with [Astro](https://astro.build) and hosted on GitHub Pages.

- **Live site:** https://astronomyclubatucsandiego-cloud.github.io/astrowebsite/
- **Repo:** `astronomyclubatucsandiego-cloud/astrowebsite`, branch `main`

## Run it locally

- Install **Node.js 22.22 or newer** and **Git**.
- Then run:

```bash
npm install      # first time only
npm run dev      # open http://localhost:4321/astrowebsite/
```

- `npm run build` builds the site into `dist/`. It must pass before you push.
- `npm run preview` serves that build so you can check it.
- The site lives under `/astrowebsite/`, so keep that at the end of local addresses.

## How it goes live

- Push to `main`. A GitHub Action builds and publishes the site in about 1 minute.
- Check the **Actions** tab. A green check means it's live; a red X means the build failed (click it for the error).
- Browsers can keep the old page for up to 10 minutes. Hard refresh with Cmd+Shift+R.
- Dependabot opens weekly pull requests for updates. Merge them only when their build passes.

## Where things are

| What | Where |
|---|---|
| Club links (Discord, Instagram, email), menu, board year shown, NASA API key, sponsors | `src/config.ts` |
| Colors, fonts and all styling | `src/styles/global.css` |
| Top bar and footer on every page | `src/layouts/Base.astro` |
| Pages (home, board, gallery, FAQ, resources, 404) | `src/pages/` |
| Board members, one folder per year | `src/content/board/<year>/` |
| Board photos | `src/assets/board/` (2025-26), `src/assets/board/<year>/` (later years) |
| Gallery photos, one folder per section | `src/assets/gallery/<section>/` |
| Gallery section names, captions and trip info | `src/lib/gallery.ts` |
| Photo banner, Tonight panel, forecast, NASA picture | `src/components/` |
| Tonight sky math: sun, moon, planets, meteor showers and other events | `src/lib/sky.ts`, `src/lib/planets.ts`, `src/lib/events.ts` |
| Moon and planet photos (NASA, public domain) | `src/assets/sky/` |
| Equation of the Day: entries, section on Resources, daily pick, checks | `src/content/equations/`, `src/components/EquationOfTheDay.astro`, `src/lib/equation-*.ts`, `scripts/equations/` |
| Sponsor and supporter logos | `src/assets/supporters/` |
| Home page banner video | `public/video/` |
| Build and deploy setup | `.github/workflows/deploy.yml` |
| Dependabot settings | `.github/dependabot.yml` |
| Security policy (allowed outside sites) and the old `/dark-sites/` redirect | `astro.config.mjs` |

## Updating content

### Board members

- One Markdown file per person, for example `src/content/board/2026-27/jane-doe.md`:

```md
---
name: "Jane Doe"
role: "Treasurer"
team: "Executive Board"
order: 3
photo: ../../../assets/board/2026-27/jane-doe.jpg
favoriteNasa:
  text: "The Pillars of Creation"
---

Their bio, word for word from the board form.
```

- `team` must be `Executive Board`, `Media Team` or `Outreach Team`.
- `order` sets their place in the team (1 is first).
- `photo` and `favoriteNasa` are optional. Add `url:` under `text` to make the NASA image a link.
- The page shows photo, name and role. The bio opens when someone clicks the photo.
- Never put anyone's email on the site.

### New board year

1. Make a new folder, for example `src/content/board/2027-28/`, with one file per person.
2. Put photos in `src/assets/board/2027-28/`, 1400px max.
3. To preview, set `boardTerm` in `src/config.ts` to the new folder, run `npm run dev`, then set it back.
4. When the roster is complete, set `boardTerm` and `boardYear` in `src/config.ts` and push.

### Gallery photos

- Add photos to `src/assets/gallery/<section>/`. Sections: `general` (Campus Events), `astrophotography`, `tds` (Tierra Del Sol), `anza`, `palomar`, `merch`.
- Name files like `04-orion-from-anza--jane-doe.jpg`:
  - `04` sets the order.
  - `orion-from-anza` becomes the caption and alt text.
  - `--jane-doe` adds "Photo: Jane Doe". Leave it off if unknown.
- Special punctuation in captions goes under `captions` in `src/lib/gallery.ts`.
- Trip sections (Tierra Del Sol, Anza-Borrego, Palomar) have an `about` block in `src/lib/gallery.ts`: a short description, facts and links shown above the photos. They always show, even before they have photos.
- Other empty sections (like Merch) stay hidden until they have a photo.

### Other content

- **Home:** `src/pages/index.astro`. Sections: About Us, General Body Meetings, Sponsors and Supporters, Observing Forecast, Astronomy Calendar.
- **Sponsors and supporters:** the `SUPPORTERS` list in `src/config.ts`. Logos go in `src/assets/supporters/`, named after each `slug` (see the note in that folder).
- **FAQ:** `src/pages/faq.astro`, including the "Coming on a Trip" guide.
- **Resources:** the `GROUPS` list at the top of `src/pages/resources.astro`. Check each link works before adding it.
- **Tonight panel:** calculated in the browser every day, so there's nothing to update, except the meteor showers below.
- **Meteor showers:** each January, compare the `SHOWERS` list in `src/lib/events.ts` with the International Meteor Organization's new calendar (imo.net) and update any changed peak or rate.
- **NASA API key:** `nasaApiKey` in `src/config.ts`, registered to the club Gmail at api.nasa.gov. It's public by design. If it stops working, get a new one there.
- **Equation of the Day:** see below.
- **Events:** not on the website. Announce them on Discord and Instagram (each trip has its own sign-up form there), then add photos to the gallery.

### Equation of the Day

A section at the bottom of Resources. Each day shows one equation, the same for everyone, picked in
the browser. Nothing to update day to day.

- One YAML file per equation in `src/content/equations/`, named after its `id`:

```yaml
id: schwarzschild-radius            # must match the file name
title: 'Schwarzschild radius'
latex: 'r_s = \frac{2GM}{c^2}'      # KaTeX-compatible, no surrounding $
variables:
  - symbol: 'r_s'                   # LaTeX, no surrounding $
    meaning: 'radius of the event horizon of a non-rotating black hole'
blurb: >-                           # 2-4 sentences; inline math between $...$
  The radius of the event horizon ...
tags: [black-holes, general-relativity]
level: intro                        # intro | intermediate | advanced
references:
  - 'Carroll, Spacetime and Geometry (2004)'
docs: 'https://en.wikipedia.org/wiki/Schwarzschild_radius'
pinned: '03-14'                     # optional: show on this date every year
added: '2026-11-16'
author: your-name
reviewed_by: null                   # the reviewer's name once checked
```

- Put LaTeX in single quotes so backslashes stay literal (write `''` for an apostrophe). In `blurb` and `meaning`, `$` always starts or ends math. Dates go in quotes too.
- **Only reviewed entries go on the live site.** An entry shows once `reviewed_by` has a name. `npm run dev` also shows drafts, marked "Draft". To review one: open its `docs` link and compare the equation (signs, factors of 2, exponents), check every number, name and date in the blurb, read it as a first-year would, then set `reviewed_by` to your name.
- The 37 starter entries were drafted by Claude (`author: claude-draft`) and none is reviewed yet, so the section stays hidden until they are. At least 31 reviewed, unpinned entries are needed so no equation repeats within a month. Splitting the review by tag keeps it to about eight each.
- **How the pick works:** each month's entries are shuffled in a fixed order (seeded by the year and month), and day *d* shows the *d*-th. A new entry joins on the 1st of the month after its `added` date, so adding one never reshuffles the current month. `pinned` entries show on their date every year instead (the Einstein field equations on March 14, the chirp mass on September 14). "Today" is California time.
- Add `?date=2027-03-14` to the Resources address to see any day.
- Check your changes before pushing. A pull request that touches the equations runs the same checks automatically (`.github/workflows/equations.yml`):

| Command | What it does |
| --- | --- |
| `npm run equations:validate` | Every field, file names, pinned dates, and that all LaTeX renders |
| `npm run equations:preview -- 2026-12` | That month's schedule (add `--include-unreviewed` for drafts, `--months 12` for more) |
| `npm run equations:check-links` | Opens every `docs` link |
| `npm run equations:test` | `validate` plus a two-year no-repeats check |

## Rules for every change

- **Links between pages:** use `url()`, like `href={url('/board/')}`. A plain `href="/board/"` breaks on GitHub Pages.
- **Real content only:** club photos, members' own words, no made-up dates or numbers.
- **Alt text:** every image needs a description, except decorative banners.
- **Shrink photos before committing:** 2400px max (1400px for board photos), and strip camera data:
  `ffmpeg -i in.jpg -vf "scale=w=2400:h=2400:force_original_aspect_ratio=decrease" -q:v 6 -map_metadata -1 out.jpg`
- **Outside services:** a new embed or service must be added to the security policy in `astro.config.mjs`, or the browser will block it.
- **Check before you push:** run `npm run build`, then look at the page on a phone and a laptop.
- **Never commit** `dist/`, `node_modules/`, `.astro/`, passwords or full-size camera files.
