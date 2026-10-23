import React, {useState} from 'react';
import Link from '@docusaurus/Link';
import CodeBlock from '@theme/CodeBlock';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import {useBaseUrlUtils} from '@docusaurus/useBaseUrl';
import useBrokenLinks from '@docusaurus/useBrokenLinks';

import {DownloadIcon} from './icons';

const RELEASES = 'https://github.com/proofoftrinity/katacomb-vpn/releases';

// Fingerprint of the key the release checksums are signed with. Published here
// so it reaches you over a different channel than the binaries themselves.
const SIGNING_KEY = '740A F267 B0D8 162B E477  779D 7315 246A 6E67 F3C6';

// Where the public half of that key is served. gpg fetches it itself, so the
// same line works in a Linux shell and in PowerShell.
const KEYBASE = 'https://keybase.io/proofoftrinity';
const FETCH_KEY = `gpg --fetch-keys ${KEYBASE}/pgp_keys.asc`;

// Fixed locale and time zone, so the build and the browser print the same
// date and hydration doesn't trip over it.
const RELEASE_DATE = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
});

const LINUX_CHECK = {
  intro: (
    <>
      Put <code>SHA256SUMS</code> and <code>SHA256SUMS.asc</code> next to the
      download. Import the signing key once, then check the file and the
      signature:
    </>
  ),
  code: () =>
    `${FETCH_KEY}\nsha256sum -c SHA256SUMS --ignore-missing\ngpg --verify SHA256SUMS.asc SHA256SUMS`,
};

const KEYRING = (
  <>
    <strong>Wallet storage needs an OS keyring.</strong> GNOME and KDE ship one; on
    a bare XFCE or LXQt install, add <code>gnome-keyring</code>. A missing keyring
    means saving a wallet is refused outright rather than silently falling back to
    weak encryption.
  </>
);

// One tab per build, in tab order. `os` marks the build a visitor starts on
// when their browser reports that system; .deb is the default for everyone
// else. `fallback` names the file in commands when the build couldn't read
// the release from GitHub.
const BUILDS = [
  {
    build: 'deb',
    os: 'linux',
    logo: 'img/platforms/tux.svg',
    tab: 'Debian / Ubuntu',
    title: 'Debian and Ubuntu',
    badge: 'Recommended',
    format: '.deb package · x86_64',
    summary:
      'Debian 11+, Ubuntu 20.04+ and derivatives. Installs a small root daemon, so connecting and disconnecting never prompt for a password, and declares its dependencies properly.',
    button: 'Download .deb',
    fallback: 'katacomb-vpn_*_amd64.deb',
    language: 'bash',
    check: LINUX_CHECK,
    install: {
      intro: 'Install it with apt, which pulls in its dependencies:',
      code: (file) => `sudo apt install ./${file}`,
      outro:
        'The install adds you to the katacomb-vpn group. Log out and back in once for it to take effect; until then, connecting asks for your password each time.',
    },
    notes: [KEYRING],
  },
  {
    build: 'appimage',
    logo: 'img/platforms/appimage.svg',
    tab: 'AppImage',
    title: 'AppImage',
    badge: 'Portable',
    format: 'Portable · x86_64, any distro',
    summary:
      'No install step; each privileged action goes through pkexec. Needs fusermount and libgbm1, which a stock desktop already has.',
    button: 'Download AppImage',
    fallback: 'katacomb-vpn-*.AppImage',
    language: 'bash',
    check: LINUX_CHECK,
    install: {
      intro: 'Make it executable and run it:',
      code: (file) => `chmod +x ${file}\n./${file}`,
    },
    notes: [
      <>
        <strong>On Ubuntu 24.04+, prefer the .deb.</strong> With unprivileged user
        namespaces restricted, the AppImage starts with Chromium's sandbox
        disabled. The <code>.deb</code> installs the AppArmor profile that keeps it
        on.
      </>,
      KEYRING,
    ],
  },
  {
    build: 'windows',
    os: 'windows',
    logo: 'img/platforms/windows.svg',
    tab: 'Windows',
    title: 'Windows 10 and 11',
    badge: 'Beta',
    format: 'Installer · x64',
    summary:
      'Installs the app and a small Windows service: one administrator prompt to install, then connecting never asks again. All five protocols. Not code-signed yet, so SmartScreen warns; verify it first.',
    button: 'Download for Windows',
    fallback: 'katacomb-vpn-*-setup.exe',
    language: 'powershell',
    check: {
      intro: (
        <>
          In PowerShell, import the signing key once with Gpg4win's{' '}
          <code>gpg</code>. Then print the installer's hash, compare it with its
          line in <code>SHA256SUMS</code>, and check the signature:
        </>
      ),
      code: (file) =>
        `${FETCH_KEY}\nGet-FileHash .\\${file}\ngpg --verify SHA256SUMS.asc SHA256SUMS`,
    },
    install: {
      intro: (
        <>
          Run the installer and approve the administrator prompt. At the SmartScreen
          warning, choose <strong>More info</strong>, then <strong>Run anyway</strong>.
        </>
      ),
    },
    notes: [
      <>
        <strong>Tested on Windows 11 only.</strong> Multi-hop chains and local proxy
        mode have not been tried on Windows yet.
      </>,
      <>
        <strong>One account.</strong> Only the account that ran the installer can
        connect; the service refuses the others.
      </>,
    ],
  },
];

function Build({build, asset, release, open, onToggle}) {
  const file = asset.name ?? build.fallback;
  return (
    <div className="get__panel">
      <div className="get__head">
        <h3 className="get__title">{build.title}</h3>
        <span className="card-badge">{build.badge}</span>
      </div>
      <p className="get__format">{build.format}</p>
      <p className="get__summary">{build.summary}</p>
      <Link to={asset.url} className="hero-cta-primary get__button">
        <DownloadIcon />
        {build.button}
        {asset.size && <span className="get__size">{asset.size}</span>}
      </Link>
      <p className="get__file">
        {asset.name ? <code>{asset.name}</code> : 'From the latest release on GitHub'}
      </p>
      {/* Every tab has its own copy of this, all following one open state, so
          switching builds keeps the steps open or closed. */}
      <details className="get__details" open={open} onToggle={onToggle}>
        <summary>Verify and install</summary>
        <ol className="verify-steps">
          <li>
            <h4 className="get__step">Check it</h4>
            <p>{build.check.intro}</p>
            <CodeBlock language={build.language}>{build.check.code(file)}</CodeBlock>
            <p>
              A checksum only proves the file arrived intact: anyone who can replace
              the download can replace the checksums with it. The signature is what
              makes it mean something, which is why the key's fingerprint is listed
              here rather than only on the release. Look for{' '}
              <em>Good signature</em> and check that the fingerprint gpg prints
              matches this one; its warning that the key is not certified is
              expected.
            </p>
            <p className="fingerprint">
              <span className="fingerprint__label">Signing key</span>
              <code>{SIGNING_KEY}</code>
            </p>
            <p className="verify-links">
              <Link to={release.checksums}>SHA256SUMS</Link>
              <Link to={release.signature}>Signature</Link>
              <Link to={KEYBASE}>Keybase identity</Link>
            </p>
          </li>
          <li>
            <h4 className="get__step">Install</h4>
            <p>{build.install.intro}</p>
            {build.install.code && (
              <CodeBlock language={build.language}>{build.install.code(file)}</CodeBlock>
            )}
            {build.install.outro && <p>{build.install.outro}</p>}
          </li>
        </ol>
        <h4 className="get__step">Good to know</h4>
        <ul className="get__notes">
          {build.notes.map((note, index) => (
            <li key={index}>{note}</li>
          ))}
        </ul>
      </details>
    </div>
  );
}

// The page's one download place: a tab per build, opened on the build that
// fits the visitor's system, with a direct download button and the verify and
// install steps for that build.
export default function KatacombDownload({release, os}) {
  const {withBaseUrl} = useBaseUrlUtils();
  const [open, setOpen] = useState(false);
  const start = BUILDS.find((build) => build.os === os)?.build ?? 'deb';
  const {version, publishedAt, releaseUrl} = release;

  // The footer's "Download" link points here.
  useBrokenLinks().collectAnchor('download');

  return (
    <div id="download" className="get" role="region" aria-label="Download">
      {/* Remounted once the visitor's system is known, so it opens on theirs. */}
      <Tabs key={os ?? 'unknown'} className="segmented get__tabs" defaultValue={start}>
        {BUILDS.map((build) => (
          <TabItem
            key={build.build}
            value={build.build}
            label={
              <span className="get__tab">
                <img src={withBaseUrl(build.logo)} alt="" width="18" height="18" />
                {build.tab}
              </span>
            }>
            <Build
              build={build}
              asset={release[build.build]}
              release={release}
              open={open}
              onToggle={(event) => setOpen(event.currentTarget.open)}
            />
          </TabItem>
        ))}
      </Tabs>
      <p className="get__release">
        <span className="get__version">
          {version ? `Version ${version}` : 'Latest release'}
          {publishedAt && `, released ${RELEASE_DATE.format(new Date(publishedAt))}`}
        </span>
        <Link to={releaseUrl}>Release notes</Link>
        <Link to={RELEASES}>All releases</Link>
      </p>
      <p className="get__none">There is no macOS or mobile build.</p>
    </div>
  );
}
