import { defineConfig } from 'astro/config';

/* `site` is the origin and `base` the path the site is served from: a GitHub
   project page lives at <org>.github.io/<repo>/. If the repo is renamed to
   <org>.github.io (or a custom domain is added), set base to '/'. */
export default defineConfig({
  site: 'https://astronomyclubatucsandiego-cloud.github.io',
  base: '/astrowebsite',
  trailingSlash: 'always',
  // No code blocks on the site; Shiki's inline colors would clash with the CSP below.
  markdown: { syntaxHighlight: false },
  /* Content Security Policy: a <meta> tag on every page listing the only places the page may load
     from. GitHub Pages can't send security headers, so this is the strongest option there. Astro
     adds a hash for each of our own scripts and styles at build time. If you add an embed or a new
     outside service, add its domain here, then check the browser console for "Refused to" errors. */
  security: {
    csp: {
      directives: [
        "default-src 'self'",
        "img-src 'self' data: https://apod.nasa.gov https://img.youtube.com https://i.vimeocdn.com", // NASA picture of the day
        "connect-src 'self' https://api.nasa.gov",
        "frame-src https://www.google.com https://calendar.google.com https://www.astrospheric.com", // map, calendar, forecast
        "media-src 'self'",
        "font-src 'self' data:", // small font files are inlined into the CSS
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'none'",
        'upgrade-insecure-requests',
      ],
      scriptDirective: {
        resources: ["'self'", 'https://s-v1-galaxy-direct.astrospheric.com'],
      },
      styleDirective: {
        // style="" attributes (photo crops, the forecast embed's loading box). Scripts stay strict.
        resources: ["'self'", { resource: "'unsafe-inline'", kind: 'attribute' }],
      },
    },
  },
});
