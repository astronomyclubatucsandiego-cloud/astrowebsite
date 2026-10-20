import { defineConfig } from 'astro/config';

/* `site` is the origin and `base` the path the site is served from: a GitHub
   project page lives at <org>.github.io/<repo>/. If the repo is renamed to
   <org>.github.io (or a custom domain is added), set base to '/'. */
export default defineConfig({
  site: 'https://astronomyclubatucsandiego-cloud.github.io',
  base: '/astrowebsite',
  trailingSlash: 'always',
});
