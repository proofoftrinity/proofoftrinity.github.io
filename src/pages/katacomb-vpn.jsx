import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import CodeBlock from '@theme/CodeBlock';
import useBaseUrl from '@docusaurus/useBaseUrl';
import {usePluginData} from '@docusaurus/useGlobalData';
import {PageMetadata} from '@docusaurus/theme-common';

import {
  HomepageCard as Card,
  HomepageSection as Section,
} from '../components/HomepageComponents';
import {
  GlobeIcon,
  RouteIcon,
  ShieldIcon,
  SplitIcon,
  KeyIcon,
  ServerIcon,
} from '../components/icons';

const REPO = 'https://github.com/proofoftrinity/katacomb-vpn';

// Fingerprint of the key the release checksums are signed with. Published here
// so it reaches you over a different channel than the binaries themselves.
const SIGNING_KEY = '740A F267 B0D8 162B E477  779D 7315 246A 6E67 F3C6';

// Warm accent taken from the app's own icon. The site stays blue; the
// product section reads as the product.
const ACCENT = '#e1bc99';

const SHOTS = [
  {
    src: 'img/katacomb/0.png',
    alt: 'Katacomb VPN welcome screen: a dotted world map of nodes beside a three-step Get started panel',
    caption:
      'Welcome: create or import a wallet, add P2P, then pick a node and connect.',
    wide: true,
  },
  {
    src: 'img/katacomb/1.png',
    alt: 'Katacomb VPN map view: a 3D globe beside a country list with node counts',
    caption:
      'Map: a 3D globe with per-country node counts, and the live network size in the corner.',
    wide: true,
  },
  {
    src: 'img/katacomb/2.png',
    alt: 'Katacomb VPN node table listing country, city, moniker, protocol and price',
    caption:
      'Nodes: the whole network in one sortable table, with per-GB and per-hour prices.',
  },
  {
    src: 'img/katacomb/3.png',
    alt: 'Katacomb VPN multi-hop view showing entry and exit node selection',
    caption:
      'Multi-hop: pick an entry and an exit. Only nodes that can actually be chained are offered.',
  },
];

const PROTOCOLS = [
  ['WireGuard', 'sntl0', 'root (wg-quick)', 'Uses the distro wireguard-tools'],
  ['V2Ray', 'sntl-tun', 'userspace + tun2socks', 'Bundled core; encrypted DNS over DoH'],
  ['OpenVPN', 'sntl-ovpn', 'root (openvpn)', "The node's PKI issues the client cert"],
  ['XRAY', 'sntl-tun', 'userspace + tun2socks', 'VLESS + Reality; bundled core'],
  ['AmneziaWG', 'sntl0', 'root (awg-quick)', 'WireGuard fork with DPI-evasion params'],
  ['Hysteria2', 'sntl-tun', 'userspace + tun2socks', 'QUIC; refuses to connect without a TLS pin'],
];

function Screenshot({src, alt, caption, wide}) {
  const url = useBaseUrl(src);
  return (
    <figure className={wide ? 'shot shot--wide' : 'shot'}>
      <a
        href={url}
        className="shot-link"
        target="_blank"
        rel="noopener noreferrer">
        <img src={url} alt={alt} loading="lazy" width="1280" height="832" />
      </a>
      <figcaption>{caption}</figcaption>
    </figure>
  );
}

export default function KatacombVPN() {
  // Latest release, read from GitHub at build time.
  const {version, deb, appimage, checksums, signature} =
    usePluginData('katacomb-release');
  const iconUrl = useBaseUrl('img/katacomb.svg');

  return (
    <Layout
      title="Katacomb VPN"
      description="A Linux desktop client for the Sentinel decentralized VPN network. Pick a node anywhere, pay for the session on-chain, and the tunnel comes up."
      wrapperClassName="katacomb-page">
      {/* Layout only forwards title/description, so the page's own social
          card has to go through PageMetadata to override the site default. */}
      <PageMetadata image="img/katacomb-social-card.png" />
      <div className="pad">
        <div className="center homepage-content">
          <section className="hero-section" aria-labelledby="katacomb-heading">
            <div className="hero-glow hero-glow--warm" aria-hidden="true" />
            <img className="app-hero-icon" src={iconUrl} alt="" aria-hidden="true" />
            <h1 id="katacomb-heading" className="hero-title">
              <span className="hero-title-gradient hero-title-gradient--warm">
                Katacomb VPN
              </span>
            </h1>
            <p className="hero-subtitle">
              A desktop client for the Sentinel decentralized VPN network. Pick a
              node anywhere in the world, pay for a session on-chain, and Katacomb
              brings up the tunnel on WireGuard, AmneziaWG, OpenVPN, V2Ray, XRAY or
              Hysteria2, whichever that node speaks. No accounts, no subscription to
              a single provider: bandwidth is bought directly from independent node
              operators with a wallet you hold the keys to.
            </p>
            <div className="hero-actions">
              <Link to={deb.url} className="hero-cta-primary">
                Download .deb <span aria-hidden="true">&darr;</span>
              </Link>
              <Link to={appimage.url} className="hero-cta-secondary">
                AppImage
              </Link>
              <Link to={REPO} className="hero-cta-secondary">
                Source
              </Link>
            </div>
            <ul className="app-meta" aria-label="Release details">
              <li className="app-meta__chip">Linux x86_64</li>
              <li className="app-meta__chip">v{version}</li>
              <li className="app-meta__chip">GPL-3.0</li>
              <li className="app-meta__chip">Electron · React · TypeScript</li>
            </ul>
          </section>

          <Section
            title="A look inside"
            className="section--flow"
            accentColor={ACCENT}>
            <div className="shot-grid">
              {SHOTS.map((shot) => (
                <Screenshot key={shot.src} {...shot} />
              ))}
            </div>
          </Section>

          <Section
            title="What it does"
            accentColor={ACCENT}
            description="Everything runs locally against the chain. There is no Trinity server in the path.">
            <Card
              icon={<GlobeIcon />}
              title="Map and node table"
              description="A 3D globe with per-country counts, plus a virtualized table over the whole network. Filter by country, city, protocol or bookmarks, sort on any column, and probe latency or test download speed before you spend anything."
            />
            <Card
              icon={<RouteIcon />}
              title="Multi-hop"
              description="Chain two nodes so the entry sees your IP but not where you go, and the exit sees where you go but not your IP. Candidates are checked against each node's advertised inbounds before anything is paid for, and the two hops can be paid from separate wallets."
            />
            <Card
              icon={<ShieldIcon />}
              title="Kill switch"
              description="iptables rules that drop everything outside the tunnel, armed on connect and torn down on disconnect. A self-healing marker repairs stranded rules if the app dies mid-connection."
            />
            <Card
              icon={<SplitIcon />}
              title="DNS and split tunneling"
              description="Choose a resolver (Cloudflare, Quad9, NextDNS) applied on connect; on the V2Ray-family protocols queries go out over DoH, so the node can't read them. CIDR routes bypass the tunnel, with private ranges excluded by default."
            />
            <Card
              icon={<KeyIcon />}
              title="Wallet"
              description="BIP-39 import or generate, multiple wallets, subaccounts at a chosen index. Seeds are encrypted at rest with the OS keyring, and if the keyring is unavailable, saving is refused rather than falling back to plaintext."
            />
            <Card
              icon={<ServerIcon />}
              title="Provider mode"
              description="The other side of the network: register a provider, create and activate plans, lease nodes and read subscriber counts off the chain. An economics strip tracks daily burn, escrowed funds and revenue net of the hub's cut."
            />
          </Section>

          <Section
            title="Protocols"
            className="section--flow"
            accentColor={ACCENT}
            description="Each node runs exactly one. The client connects to all six and refuses only nodes advertising an unknown type.">
            <div className="proto-table-wrap">
              <table className="proto-table">
                <thead>
                  <tr>
                    <th scope="col">Protocol</th>
                    <th scope="col">Interface</th>
                    <th scope="col">How it runs</th>
                    <th scope="col">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {PROTOCOLS.map(([name, iface, runs, notes]) => (
                    <tr key={name}>
                      <th scope="row">{name}</th>
                      <td>
                        <code>{iface}</code>
                      </td>
                      <td>{runs}</td>
                      <td>{notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="table-footnote">
              Multi-hop chains only work on V2Ray and XRAY. The mechanism is
              v2ray-core's <code>proxySettings.tag</code>, which the other protocols
              have no equivalent for. Bundled binaries are SHA-256 pinned; both the
              app and the root daemon refuse to execute one whose hash doesn't match.
            </p>
          </Section>

          <Section id="download" title="Download" accentColor={ACCENT}>
            <Card
              badge="Recommended"
              icon={<ShieldIcon />}
              title="Debian and Ubuntu"
              description={`${deb.name} · ${deb.size} · Debian 11+, Ubuntu 20.04+ and derivatives. Installs a small root daemon, so connecting and disconnecting never prompt for a password, and declares its dependencies properly.`}
              to={deb.url}
            />
            <Card
              badge="Portable"
              icon={<ServerIcon />}
              title="AppImage"
              description={`${appimage.name} · ${appimage.size} · No install step; each privileged action goes through pkexec. Needs FUSE 2 and libgbm1 from your system.`}
              to={appimage.url}
            />
            <Card
              icon={<GlobeIcon />}
              title="All releases"
              description="Previous versions, release notes and the full asset list on GitHub."
              to={`${REPO}/releases`}
            />
          </Section>

          <section className="verify-block" aria-labelledby="verify-heading">
            <h3 id="verify-heading">Verify what you downloaded</h3>
            <p>
              Every release ships a <code>SHA256SUMS</code> covering both artifacts.
              Put it next to the download and check it:
            </p>
            <CodeBlock language="bash">
              sha256sum -c SHA256SUMS --ignore-missing
            </CodeBlock>
            <p>
              A checksum on its own only proves the file arrived intact. Anyone who
              can replace the download can replace the checksums with it. It means
              something when the checksums reach you from somewhere the binaries
              don't, which is the point of listing the signing key on this page
              rather than only on the release:
            </p>
            <CodeBlock language="bash">
              gpg --verify SHA256SUMS.asc SHA256SUMS
            </CodeBlock>
            <p className="fingerprint">
              <span className="fingerprint__label">Signing key</span>
              <code>{SIGNING_KEY}</code>
            </p>
            <p className="verify-links">
              <Link to={checksums}>SHA256SUMS</Link>
              <Link to={signature}>Signature</Link>
              <Link to="https://keybase.io/trinitystake">Keybase identity</Link>
            </p>
          </section>

          <section className="notice notice--warn" aria-labelledby="before-heading">
            <h3 id="before-heading" className="notice__title">
              Before you install
            </h3>
            <ul>
              <li>
                <strong>Linux x86_64 only.</strong> There is no Windows, macOS or
                mobile build.
              </li>
              <li>
                <strong>Connecting spends real funds.</strong> A session is a
                blockchain transaction priced in <code>udvpn</code> and paid to the
                node operator. Failures on the client side are refunded
                automatically; a session you actually used is not. A multi-hop chain
                is two sessions and two deposits.
              </li>
              <li>
                <strong>Wallet storage needs an OS keyring.</strong> GNOME and KDE
                ship one; on a bare XFCE or LXQt install, add{' '}
                <code>gnome-keyring</code>. A missing keyring means saving a wallet
                is refused outright rather than silently falling back to weak
                encryption.
              </li>
              <li>
                <strong>On Ubuntu 24.04+, prefer the .deb.</strong> With
                unprivileged user namespaces restricted, the AppImage starts with
                Chromium's sandbox disabled. The <code>.deb</code> installs the
                AppArmor profile that keeps it on.
              </li>
            </ul>
          </section>

          <Section
            title="Security model"
            className="section--flow"
            accentColor={ACCENT}>
            <div className="app-prose">
              <p>
                The design assumption worth stating plainly:{' '}
                <strong>node operators are treated as adversaries.</strong> Their
                handshake data turns into configs that <code>wg-quick</code>,{' '}
                <code>openvpn</code> and <code>iptables</code> execute as root, and a
                single <code>PostUp</code> line in a WireGuard config is a root
                shell. So every node-supplied config passes an allow-list validator
                first, and anything not explicitly permitted is rejected, including
                every OpenVPN directive that can run a script. The privileged helper
                re-validates independently, because its socket is the real trust
                boundary, and the renderer runs sandboxed with context isolation and
                no Node access.
              </p>
              <p>
                Payment order matters too: preflight checks run{' '}
                <em>before</em> the session is paid for, and a failure during the
                handshake or validation cancels the session and refunds it.
              </p>
              <p>
                <strong>What multi-hop does not do.</strong> It protects against one
                dishonest node: with two hops, neither end holds both your identity
                and your destinations. It does not make you anonymous. Two operators
                working together can still correlate the circuit on traffic volume
                and timing, since the same bytes cross both hops at the same moments.
                That is a hard ceiling, not something a client can close.
              </p>
              <p>
                The full model, including the invariants that must not regress, is in
                the repository.
              </p>
            </div>
          </Section>

          <div className="hero-actions app-footer-actions">
            <Link to={REPO} className="hero-cta-primary">
              Read the source <span aria-hidden="true">&rarr;</span>
            </Link>
            <Link to={`${REPO}/issues`} className="hero-cta-secondary">
              Report an issue
            </Link>
            <Link to={`${REPO}/blob/main/LICENSE`} className="hero-cta-secondary">
              GPL-3.0 license
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
