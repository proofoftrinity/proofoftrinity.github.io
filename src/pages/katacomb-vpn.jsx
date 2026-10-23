import React, {useEffect, useState} from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import {PageMetadata} from '@docusaurus/theme-common';

import {
  HomepageCard as Card,
  HomepageSection as Section,
} from '../components/HomepageComponents';
import KatacombDownload from '../components/KatacombDownload';
import ScreenshotGallery from '../components/ScreenshotGallery';
import useKatacombRelease from '../components/useKatacombRelease';
import {
  GlobeIcon,
  RouteIcon,
  ShieldIcon,
  SplitIcon,
  KeyIcon,
  ServerIcon,
  CheckIcon,
} from '../components/icons';

const REPO = 'https://github.com/proofoftrinity/katacomb-vpn';

// Warm accent taken from the app's own icon. The site stays blue; the
// product section reads as the product.
const ACCENT = '#e1bc99';

// Gallery order. `label` names the tab, so the caption doesn't repeat it.
const SHOTS = [
  {
    src: 'img/katacomb/0.png',
    label: 'Welcome',
    alt: 'Katacomb VPN welcome screen: a dotted world map of nodes beside a three-step Get started panel',
    caption: 'Create or import a wallet, add P2P, then pick a node and connect.',
  },
  {
    src: 'img/katacomb/1.png',
    label: 'Map',
    alt: 'Katacomb VPN map view: a 3D globe beside a country list with node counts',
    caption:
      'A 3D globe with per-country node counts, and the live network size in the corner.',
  },
  {
    src: 'img/katacomb/2.png',
    label: 'Nodes',
    alt: 'Katacomb VPN node table listing country, city, moniker, protocol and price',
    caption:
      'The whole network in one sortable table, with per-GB and per-hour prices.',
  },
  {
    src: 'img/katacomb/3.png',
    label: 'Multi-hop',
    alt: 'Katacomb VPN multi-hop view showing entry and exit node selection',
    caption:
      'Pick an entry and an exit. Only nodes that can actually be chained are offered.',
  },
];

// `iface` and `runs` describe Linux; the footnote under the table covers
// Windows. Every protocol runs on Linux.
const PROTOCOLS = [
  {name: 'WireGuard', iface: 'sntl0', runs: 'root (wg-quick)', notes: 'Uses the distro wireguard-tools', windows: true, multihop: false},
  {name: 'V2Ray', iface: 'sntl-tun', runs: 'userspace + tun2socks', notes: 'Bundled core; encrypted DNS over DoH', windows: true, multihop: true},
  {name: 'OpenVPN', iface: 'sntl-ovpn', runs: 'root (openvpn)', notes: "The node's PKI issues the client cert", windows: false, multihop: false},
  {name: 'XRAY', iface: 'sntl-tun', runs: 'userspace + tun2socks', notes: 'VLESS + Reality; bundled core', windows: true, multihop: true},
  {name: 'AmneziaWG', iface: 'sntl0', runs: 'root (built into the helper)', notes: 'WireGuard fork with DPI-evasion params', windows: true, multihop: false},
  {name: 'Hysteria2', iface: 'sntl-tun', runs: 'userspace + tun2socks', notes: 'QUIC; refuses to connect without a TLS pin', windows: true, multihop: false},
];

// The visitor's system, read only after hydration so the static HTML is the
// same for everyone. Android and ChromeOS report Linux but can't run these.
function useVisitorOS() {
  const [os, setOS] = useState(null);
  useEffect(() => {
    const platform = `${navigator.userAgentData?.platform ?? ''} ${navigator.userAgent}`;
    if (/windows/i.test(platform)) {
      setOS('windows');
    } else if (/linux|x11/i.test(platform) && !/android|cros/i.test(platform)) {
      setOS('linux');
    }
  }, []);
  return os;
}

// A yes/no cell in the protocol table: a tick or a dash on screen, a word for
// screen readers.
function Supported({yes}) {
  return (
    <td className={clsx('proto-table__flag', !yes && 'proto-table__flag--no')}>
      {yes ? <CheckIcon /> : <span aria-hidden="true">&mdash;</span>}
      <span className="visually-hidden">{yes ? 'Yes' : 'No'}</span>
    </td>
  );
}

export default function KatacombVPN() {
  // Latest release: read from GitHub at build time, then again in the browser.
  const release = useKatacombRelease();
  const os = useVisitorOS();
  const iconUrl = useBaseUrl('img/katacomb.svg');

  return (
    <Layout
      title="Katacomb VPN"
      description="A Linux and Windows desktop client for the Sentinel decentralized VPN network. Pick a node anywhere, pay for the session on-chain, and the tunnel comes up."
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
            <p className="hero-tagline">Pick a node anywhere. Pay on-chain. Connect.</p>
            <p className="hero-subtitle">
              A desktop client for the Sentinel decentralized VPN network. No
              accounts and no single provider: you pay independent node operators
              directly, from a wallet you hold the keys to.
            </p>
            <ul className="hero-protocols" aria-label="Protocols">
              {PROTOCOLS.map(({name}) => (
                <li key={name}>{name}</li>
              ))}
            </ul>
            <KatacombDownload release={release} os={os} />
          </section>

          <Section
            id="screenshots"
            title="A look inside"
            className="section--flow"
            accentColor={ACCENT}>
            <ScreenshotGallery shots={SHOTS} />
          </Section>

          <Section
            id="features"
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
              description="Chain two nodes so the entry sees your IP but not where you go, and the exit sees where you go but not your IP. Candidates are checked against each node's advertised inbounds before anything is paid for, and the exit is paid from a second wallet."
            />
            <Card
              icon={<ShieldIcon />}
              title="Kill switch"
              description="Firewall rules that drop everything outside the tunnel: iptables on Linux, the Windows Filtering Platform on Windows. Armed on connect and torn down on disconnect, with a self-healing marker that repairs stranded rules if the app dies mid-connection."
            />
            <Card
              icon={<SplitIcon />}
              title="DNS and split tunneling"
              description="Choose a resolver (Cloudflare, Quad9, NextDNS) applied on connect; on the V2Ray-family protocols queries go out over DoH, so the node can't read them. CIDR routes bypass the tunnel, with private ranges excluded by default."
            />
            <Card
              icon={<KeyIcon />}
              title="Wallet"
              description="BIP-39 import or generate, multiple wallets, subaccounts at a chosen index. Seeds are encrypted at rest with the OS keyring on Linux and with Windows' own data protection (DPAPI) on Windows. If the keyring is unavailable, saving is refused rather than falling back to plaintext."
            />
            <Card
              icon={<ServerIcon />}
              title="Provider mode"
              description="The other side of the network: register a provider, create and activate plans, lease nodes and read subscriber counts off the chain. An economics strip tracks daily burn, escrowed funds and revenue net of the hub's cut."
            />
          </Section>

          <Section
            id="protocols"
            title="Protocols"
            className="section--flow"
            accentColor={ACCENT}
            description="Each node runs exactly one. On Linux the client connects to all six and refuses only nodes advertising an unknown type.">
            <div className="proto-table-wrap">
              <table className="proto-table">
                <thead>
                  <tr>
                    <th scope="col">Protocol</th>
                    <th scope="col" className="proto-table__flag">Linux</th>
                    <th scope="col" className="proto-table__flag">Windows</th>
                    <th scope="col" className="proto-table__flag">Multi-hop</th>
                    <th scope="col">Interface</th>
                    <th scope="col">How it runs</th>
                    <th scope="col">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {PROTOCOLS.map(({name, iface, runs, notes, windows: onWindows, multihop}) => (
                    <tr key={name}>
                      <th scope="row">{name}</th>
                      <Supported yes />
                      <Supported yes={onWindows} />
                      <Supported yes={multihop} />
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
              Multi-hop chains are built on v2ray-core's{' '}
              <code>proxySettings.tag</code>, which the other protocols have no
              equivalent for. Bundled binaries are SHA-256 pinned; both the app and
              the root daemon refuse to execute one whose hash doesn't match.
            </p>
            <p className="table-footnote">
              Interface and How it runs are for Linux. On Windows, every protocol
              runs through the Katacomb VPN service, on Wintun adapters with the same
              names. OpenVPN nodes are marked as unavailable in the node list there,
              and the app refuses them before anything is paid.
            </p>
          </Section>

          <Section
            id="security"
            title="Security model"
            className="section--flow"
            accentColor={ACCENT}>
            <p className="security-lead">
              <strong>Node operators are treated as adversaries.</strong> Their
              handshake data turns into configs that <code>wg-quick</code>,{' '}
              <code>openvpn</code> and <code>iptables</code> execute as root, and a
              single <code>PostUp</code> line in a WireGuard config is a root shell.
            </p>
            <div className="security-grid">
              <article className="security-card">
                <h4>Every config is checked twice</h4>
                <p>
                  Every node-supplied config passes an allow-list validator first, and
                  anything not explicitly permitted is rejected, including every
                  OpenVPN directive that can run a script. The privileged helper
                  re-validates independently, because its socket is the real trust
                  boundary. On Windows the same helper runs as a LocalSystem service
                  behind a named pipe, under the same rules. The renderer runs
                  sandboxed with context isolation and no Node access.
                </p>
              </article>
              <div className="security-stack">
                <article className="security-card">
                  <h4>Paying for a session</h4>
                  <p>
                    Connecting spends real funds: a session is a blockchain
                    transaction priced in <code>udvpn</code> and paid to the node
                    operator. Preflight checks run <em>before</em> it is paid for, and
                    a failure on the client side, during the handshake or validation,
                    cancels the session and refunds it automatically. A session you
                    actually used is not refunded. A multi-hop chain is two sessions
                    and two deposits.
                  </p>
                </article>
                <article className="security-card">
                  <h4>What multi-hop does not do</h4>
                  <p>
                    It protects against one dishonest node: with two hops, neither end
                    holds both your identity and your destinations. It does not make
                    you anonymous. Two operators working together can still correlate
                    the circuit on traffic volume and timing, since the same bytes
                    cross both hops at the same moments. That is a hard ceiling, not
                    something a client can close.
                  </p>
                </article>
              </div>
            </div>
            <p className="security-more">
              The full model, including the invariants that must not regress, is in
              the repository.{' '}
              <Link to={`${REPO}#security-model`}>
                Read the security model <span aria-hidden="true">&rarr;</span>
              </Link>
            </p>
          </Section>

          <div className="app-footer">
            <p className="app-footer__note">Built with Electron, React and TypeScript.</p>
            <div className="hero-actions">
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
      </div>
    </Layout>
  );
}
