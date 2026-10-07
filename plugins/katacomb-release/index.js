const REPO = 'proofoftrinity/katacomb-vpn';
const RELEASES = `https://github.com/${REPO}/releases`;

// Used when the GitHub API can't be reached, so an offline or rate-limited
// build still produces a working page instead of failing.
const FALLBACK = {
  version: '1.15.0',
  stale: true,
  releaseUrl: `${RELEASES}/tag/v1.15.0`,
  deb: {
    name: 'katacomb-vpn_1.15.0_amd64.deb',
    url: `${RELEASES}/download/v1.15.0/katacomb-vpn_1.15.0_amd64.deb`,
    size: '113 MB',
  },
  appimage: {
    name: 'katacomb-vpn-1.15.0.AppImage',
    url: `${RELEASES}/download/v1.15.0/katacomb-vpn-1.15.0.AppImage`,
    size: '132 MB',
  },
  checksums: `${RELEASES}/download/v1.15.0/SHA256SUMS`,
  signature: `${RELEASES}/download/v1.15.0/SHA256SUMS.asc`,
};

const megabytes = (bytes) =>
  typeof bytes === 'number' && bytes > 0
    ? `${Math.round(bytes / 1024 / 1024)} MB`
    : undefined;

const pick = (assets, test) => {
  const asset = assets.find((a) => test(a.name ?? ''));
  return asset
    ? {name: asset.name, url: asset.browser_download_url, size: megabytes(asset.size)}
    : undefined;
};

/**
 * Reads the latest Katacomb VPN release at build time so the version, the
 * download links and the artifact sizes on the site follow GitHub instead of
 * being edited by hand after every release.
 */
module.exports = function katacombRelease() {
  return {
    name: 'katacomb-release',

    async loadContent() {
      try {
        const response = await fetch(
          `https://api.github.com/repos/${REPO}/releases/latest`,
          {
            headers: {
              Accept: 'application/vnd.github+json',
              'User-Agent': 'proofoftrinity-website-build',
            },
          },
        );
        if (!response.ok) {
          throw new Error(`GitHub API responded ${response.status}`);
        }

        const release = await response.json();
        const version = String(release.tag_name ?? '').replace(/^v/, '');
        if (!/^\d+\.\d+\.\d+/.test(version)) {
          throw new Error(`unexpected tag name ${release.tag_name}`);
        }

        const assets = Array.isArray(release.assets) ? release.assets : [];
        const deb = pick(assets, (n) => n.endsWith('.deb'));
        const appimage = pick(assets, (n) => n.endsWith('.AppImage'));
        if (!deb || !appimage) {
          throw new Error(`release ${version} is missing a .deb or AppImage`);
        }

        const asset = (name) =>
          assets.find((a) => a.name === name)?.browser_download_url;

        console.log(`[katacomb-release] using v${version} from GitHub`);
        return {
          version,
          stale: false,
          releaseUrl: release.html_url ?? `${RELEASES}/tag/v${version}`,
          deb,
          appimage,
          checksums: asset('SHA256SUMS') ?? FALLBACK.checksums,
          signature: asset('SHA256SUMS.asc') ?? FALLBACK.signature,
        };
      } catch (error) {
        console.warn(
          `[katacomb-release] could not read the latest release (${error.message}); ` +
            `falling back to v${FALLBACK.version}`,
        );
        return FALLBACK;
      }
    },

    async contentLoaded({content, actions}) {
      actions.setGlobalData(content);
    },
  };
};
