// Turns a GitHub release into what the site shows. Shared by the build time
// plugin (Node) and the live check in the browser (useKatacombRelease), so
// both read a release the same way. Kept to plain CommonJS with no syntax
// that needs Babel helpers, so it loads unchanged in either place.

const REPO = 'proofoftrinity/katacomb-vpn';
const RELEASES = `https://github.com/${REPO}/releases`;
const LATEST_API = `https://api.github.com/repos/${REPO}/releases/latest`;

// GitHub redirects these to the newest release, and to an asset of it when
// the asset's name never changes. They stand in when the release itself
// can't be read, so no version ever has to be pinned here.
const LATEST = `${RELEASES}/latest`;
const UNKNOWN = {
  version: null,
  publishedAt: null,
  releaseUrl: LATEST,
  deb: {url: LATEST},
  appimage: {url: LATEST},
  windows: {url: LATEST},
  checksums: `${LATEST}/download/SHA256SUMS`,
  signature: `${LATEST}/download/SHA256SUMS.asc`,
};

const megabytes = (bytes) =>
  typeof bytes === 'number' && bytes > 0
    ? `${Math.round(bytes / 1024 / 1024)} MB`
    : undefined;

function parseRelease(release) {
  const tag = String((release && release.tag_name) || '');
  const version = tag.replace(/^v/, '');
  if (!/^\d+\.\d+\.\d+/.test(version)) {
    throw new Error(`unexpected tag name ${tag || '(none)'}`);
  }
  const releaseUrl = `${RELEASES}/tag/${tag}`;

  // Only links into this repo's own release downloads are offered.
  const assets = (Array.isArray(release.assets) ? release.assets : []).filter(
    (a) =>
      a &&
      typeof a.name === 'string' &&
      typeof a.browser_download_url === 'string' &&
      a.browser_download_url.startsWith(`${RELEASES}/download/`),
  );

  // A release without one of the builds still renders: that download goes
  // to the release page instead.
  const pick = (test) => {
    const asset = assets.find((a) => test(a.name));
    return asset
      ? {name: asset.name, url: asset.browser_download_url, size: megabytes(asset.size)}
      : {url: releaseUrl};
  };

  return {
    version,
    publishedAt:
      typeof release.published_at === 'string' ? release.published_at : null,
    releaseUrl,
    deb: pick((n) => n.endsWith('.deb')),
    appimage: pick((n) => n.endsWith('.AppImage')),
    windows: pick((n) => n.endsWith('-setup.exe')),
    checksums: pick((n) => n === 'SHA256SUMS').url,
    signature: pick((n) => n === 'SHA256SUMS.asc').url,
  };
}

module.exports = {LATEST_API, UNKNOWN, parseRelease};
