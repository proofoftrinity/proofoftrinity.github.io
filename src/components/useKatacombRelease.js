import {useEffect, useState} from 'react';
import {usePluginData} from '@docusaurus/useGlobalData';
import {LATEST_API, parseRelease} from '@site/plugins/katacomb-release/release';

// One request per page load, shared by every component that asks. A failed
// request is not retried, so a rate limited visitor doesn't keep asking.
let latest;
const fetchLatest = () => {
  latest ??= fetch(LATEST_API, {
    headers: {Accept: 'application/vnd.github+json'},
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`GitHub API responded ${response.status}`);
      }
      return response.json();
    })
    .then(parseRelease);
  return latest;
};

/**
 * The latest Katacomb VPN release. Renders first with the release the site
 * was built with, then asks GitHub from the browser and switches to whatever
 * is newest, so a release shows up on the site without waiting for a rebuild.
 * If GitHub can't be reached, the build time release stays.
 */
export default function useKatacombRelease() {
  const built = usePluginData('katacomb-release');
  const [release, setRelease] = useState(built);

  useEffect(() => {
    let mounted = true;
    fetchLatest().then(
      (live) => mounted && setRelease(live),
      () => {},
    );
    return () => {
      mounted = false;
    };
  }, []);

  return release;
}
