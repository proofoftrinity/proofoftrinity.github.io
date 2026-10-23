<div align="center">

<img src="static/img/trinity.svg" alt="" width="96" />

# Trinity

**The Trinity website, and the home of Katacomb VPN.**

[![Deploy](https://github.com/proofoftrinity/proofoftrinity.github.io/actions/workflows/deploy.yml/badge.svg)](https://github.com/proofoftrinity/proofoftrinity.github.io/actions/workflows/deploy.yml)
[![Docusaurus](https://img.shields.io/badge/Docusaurus-3.10-3ECC5F?logo=docusaurus&logoColor=white)](https://docusaurus.io/)
[![Node](https://img.shields.io/badge/Node-20%2B-5FA04E?logo=node.js&logoColor=white)](https://nodejs.org/)

[**Live site**](https://proofoftrinity.github.io/) · [Katacomb VPN](https://proofoftrinity.github.io/katacomb-vpn) · [Validator status](https://p2pscan.com/validator/sentvaloper1mcwvu4vpvfcnxduzpelehmgga282wtc0xux7se)

</div>

---

A Docusaurus 3 site with the docs and blog plugins switched off. Every page is a React
component under `src/pages`, the look comes from one stylesheet, and dark mode is the
only mode. It covers who Trinity is and the Katacomb VPN desktop client.

## Quick start

You need **Node 20 or newer** and **npm**. This project uses npm, not yarn: the lockfile
is `package-lock.json`.

```bash
npm install     # first time; use npm ci for an exact install from the lockfile
npm start       # dev server with live reload
```

The dev server runs at **http://localhost:3000/**.

Other commands worth knowing:

```bash
npm run build   # production build into build/
npm run serve   # serve the built site locally, exactly as it will ship
npm run clear   # drop the Docusaurus cache when output looks stale
```

## Layout

| Path | What lives there |
| :--- | :--- |
| `src/pages/index.jsx` | Homepage: hero, About |
| `src/pages/katacomb-vpn.jsx` | Katacomb VPN: hero with downloads, screenshots, features, protocols, security model |
| `src/components/HomepageComponents.jsx` | `HomepageSection` and `HomepageCard`, the blocks both pages are built from |
| `src/components/icons.jsx` | Inline SVG icons |
| `src/components/ScreenshotGallery.jsx` | Katacomb screenshots: tabs, full-size view, swipe on touch screens |
| `src/components/KatacombDownload.jsx` | The Katacomb download picker: a tab per build, with its verify and install steps |
| `src/components/useKatacombRelease.js` | The latest Katacomb release, refreshed from GitHub in the browser |
| `src/css/custom.css` | The entire design: layout, hero, cards, accent colors |
| `src/theme/Footer/Layout/index.jsx` | Swizzled footer layout |
| `plugins/katacomb-release/` | Build time plugin that reads the latest Katacomb release |
| `static/img/` | Logos, screenshots, social card |
| `static/img/platforms/` | Tux, AppImage and Windows logos for the download buttons |
| `docusaurus.config.js` | Site metadata, navbar, footer, plugin registration |

## Katacomb release data

The version, download links, file sizes and release date on the site are never edited by
hand, and no version is pinned anywhere in this repo. Cutting a release of
[katacomb-vpn](https://github.com/proofoftrinity/katacomb-vpn) on GitHub is the whole
update. It reaches the site in two ways:

1. **At build time**, `plugins/katacomb-release` asks the GitHub API for the latest
   release and bakes it into the static HTML. A successful build says which one it used:

   ```
   [katacomb-release] using v1.18.0 from GitHub
   ```

2. **In the browser**, `useKatacombRelease()` asks the same API when a page loads and
   switches to the newest release. A release published after the last build shows up
   straight away, without a rebuild.

Both read the API response with `plugins/katacomb-release/release.js`, so they agree on
what a release looks like. The .deb, AppImage and Windows installer are found by file
name ending (`.deb`, `.AppImage`, `-setup.exe`). If a release is missing one, that download
links to the release page instead.

If the build cannot reach GitHub, it does not fail. The download links point to GitHub's
*latest release* page, the version is left out, and the browser fills it all in on load.
CI passes the workflow token to the build so it is never rate limited.

The download picker in the hero is the only place on the page to download from. It
opens on the build that fits the visitor's system (the .deb on Linux and everywhere else,
the installer on Windows), read from the browser's user agent after the page loads. Its
"Verify and install" steps use the file names from the release, or a `*` wildcard when
the build could not reach GitHub.

## Deploying

There is nothing to run. [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)
builds the site and publishes `build/` to the `gh-pages` branch on:

- **every push to `main`**
- **a daily run at 05:00 UTC**, which bakes the latest Katacomb release into the static
  HTML (visitors' browsers already show it; this is for search engines and no-JavaScript
  visitors)
- **manual runs**, from the Actions tab via *Run workflow*

## Good to know

- `onBrokenLinks` is set to `throw`. A dead internal link fails the build rather than
  shipping, so fix the link, do not soften the setting.
- Dark mode is the only mode. The toggle is disabled in `docusaurus.config.js`.
- Katacomb screenshots live in `static/img/katacomb/` and are listed in `SHOTS` in
  `src/pages/katacomb-vpn.jsx`, which sets their order and tab names. Keep them
  1280×832: the gallery's image sizes and its fit-on-one-screen limit assume that shape.
- Platform logos: Tux is by Larry Ewing (lewing@isc.tamu.edu), drawn with The GIMP, in
  the SVG version by Simon Budig and Garrett LeSage from
  [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Tux.svg), free to use with
  credit. The AppImage logo is from [AppImageKit](https://github.com/AppImage/AppImageKit)
  (MIT). The Windows mark is drawn here.
- `engines.node` in `package.json` still says `>=16.14`. That is stale: Docusaurus 3.10
  requires Node 20 or newer, and CI builds on Node 23.
- Leftovers from the Docusaurus template that nothing uses: `sidebars.js`, the empty
  `docs/` folder, `src/pages/markdown-page.md`, and the `deploy` script in `package.json`.
