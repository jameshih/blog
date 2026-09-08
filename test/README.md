# STL viewer checks

Run from the repository root, using the existing Ruby 3.3.12 bundle:

```sh
JEKYLL_ENV=production bundle exec jekyll build --strict_front_matter
bundle exec htmlproofer ./_site --disable-external --ignore-urls '/assets/' --swap-urls '^/blog/:/'
node --test test/stl-assets.mjs
```

The dependency-free Node regression checks run in the existing Pages CI after the production build. They verify pinned Three.js/Lucide hashes/imports/licenses, the seven original binary STL hashes and parsed geometry, every byte of the article outside the replaced preview blocks, the other images/videos, absence of solid embeds throughout `_posts`, and generated baseurl/download/accessibility markup. `toby-article.json` records the preservation baseline from main `72808ef9344f0705af5770d918134af2a343d97d`.

For a root deployment, build separately with `--baseurl '' --destination /tmp/blog-root-site`, then run `SITE_DIR=/tmp/blog-root-site SITE_BASEURL='' node --test test/stl-assets.mjs`.

## Real browser smoke

Start a local Jekyll server after building:

```sh
bundle exec jekyll serve --skip-initial-build --no-watch --host 127.0.0.1 --port 4009
```

Use an **already installed** Playwright/Playwright Core module and Chrome. The test does not install dependencies or browsers, connect to a user profile, or relax CSP. Override `CHROME_PATH` on Linux or another installation. An installed `playwright` package resolves by default; `PLAYWRIGHT_MODULE` accepts its absolute `index.mjs` path.

```sh
PLAYWRIGHT_MODULE=/path/to/playwright-core/index.mjs \
CHROME_PATH='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' \
STL_TEST_OUTPUT=/tmp/blog-9-browser \
node test/stl-browser.mjs
```

`STL_TEST_URL` defaults to `http://127.0.0.1:4009/blog/toby-the-robo-dog`. The smoke uses isolated temporary browser contexts with the Chrome sandbox enabled. It writes 14 model screenshots, interaction and fallback screenshots, and `report.json` with tested viewer source hashes.

Success cases use real network assets, Three.js, WebGL geometry and rendering. Test-only instrumentation reads pixels immediately after actual WebGL triangle draws; it verifies triangle counts, nonblank pixels, camera fit, desktop mouse drag/wheel, mobile touch drag/pinch, reset, keyboard/buttons, no idle rendering, offscreen WebGL context loss and successful re-entry, capped pixel density, stable aspect ratio and toolbar height, loaded official icons in consistently sized labeled buttons, screen-reader-only instructions linked by `aria-describedby`, one same-origin fetch per model, preserved video embeds, and no viewer/CSP errors. Failure cases separately inject a 404, invalid STL, unavailable module and unavailable WebGL, plus disable JavaScript. Each must show a readable fallback and the original downloadable URL.

Page readiness uses DOM content followed by actual viewer/draw readiness. It deliberately does not depend on whole-page `networkidle`: this article retains remote images, analytics and video embeds. Successful runs still record all page/console errors, and fail on script or viewer/CSP errors.

The regression suite is in CI. The browser smoke is local/manual to reuse installed Chrome without adding a browser download to the Jekyll build. Screenshots and measurements from BLOG-9 are in `evidence/`; this entire test directory is excluded from the published site.
