import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import popular from 'astro-theme-popular';

/* `site` is the origin and `base` the path the site is served from: a GitHub
   project page lives at <org>.github.io/<repo>/. If the repo is renamed to
   <org>.github.io (or a custom domain is added), set base to '/'. */
export default defineConfig({
  site: 'https://astronomyclubatucsandiego-cloud.github.io',
  base: '/astrowebsite',
  integrations: [
    mdx(),
    popular({
      /* The club ships its own home, board and gallery pages; only the
         theme's prose pages (FAQ, Resources) and site plumbing stay on. */
      routes: {
        home: false,
        authors: false,
        blog: false,
        events: false,
        organizers: false,
        speakers: false,
        venues: false,
        tags: false,
        talks: false,
        rss: false,
        calendar: false,
      },
    }),
  ],
});
