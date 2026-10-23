const {LATEST_API, UNKNOWN, parseRelease} = require('./release');

/**
 * Reads the latest Katacomb VPN release at build time so the version, the
 * download links and the artifact sizes on the site follow GitHub instead of
 * being edited by hand after every release. The pages check GitHub again in
 * the browser (src/components/useKatacombRelease.js), so a release published
 * after the build still reaches visitors straight away.
 */
module.exports = function katacombRelease() {
  return {
    name: 'katacomb-release',

    async loadContent() {
      try {
        const headers = {
          Accept: 'application/vnd.github+json',
          'User-Agent': 'proofoftrinity-website-build',
        };
        // CI passes the workflow's token so a shared runner IP can't get the
        // build rate limited. Anonymous requests work too, just with less room.
        if (process.env.GITHUB_TOKEN) {
          headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
        }

        const response = await fetch(LATEST_API, {
          headers,
          signal: AbortSignal.timeout(15000),
        });
        if (!response.ok) {
          throw new Error(`GitHub API responded ${response.status}`);
        }

        const release = parseRelease(await response.json());
        const missing = ['deb', 'appimage', 'windows'].filter(
          (build) => !release[build].name,
        );
        if (missing.length > 0) {
          console.warn(
            `[katacomb-release] v${release.version} has no ${missing.join(', ')} ` +
              'asset; those downloads link to the release page',
          );
        }

        console.log(`[katacomb-release] using v${release.version} from GitHub`);
        return release;
      } catch (error) {
        // Never fail the build over this. The links go to GitHub's latest
        // release page, and the browser fills in the version on load.
        console.warn(
          `[katacomb-release] could not read the latest release (${error.message}); ` +
            'linking to the latest release page instead',
        );
        return UNKNOWN;
      }
    },

    async contentLoaded({content, actions}) {
      actions.setGlobalData(content);
    },
  };
};
