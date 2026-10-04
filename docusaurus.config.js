// @ts-nocheck
// Note: type annotations allow type checking and IDEs autocompletion

import {themes as prismThemes} from 'prism-react-renderer';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Trinity',
  tagline: 'Professional Sentinel validation service',
  favicon: 'img/favicon.png',

  // Set the production url of your site here
  url: 'https://proofoftrinity.github.io',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'proofoftrinity', // Usually your GitHub org/user name.
  projectName: 'proofoftrinity.github.io', // Usually your repo name.

  trailingSlash: false,

  onBrokenLinks: 'throw',
    markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  plugins: [require.resolve('./plugins/katacomb-release')],

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: false,
        blog: false,
        pages: {},
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: 'img/trinity-social-card.png',
      navbar: {
        title: 'Trinity',
        logo: {
          alt: 'Trinity Logo',
          src: 'img/trinity.svg',
        },
        items: [
          {
            to: '/katacomb-vpn',
            position: 'left',
            label: 'Katacomb VPN',
          },
          {
            label: 'Find us',
            to: 'https://linktr.ee/proofoftrinity',
            position: 'right',
          },
          {
            label: 'Sentinel',
            type: 'dropdown',
            position: 'right',
            items: [
              {
                href: 'https://sentinel.co',
                label: 'Website',
              },
              {
                href: 'https://docs.sentinel.co',
                label: 'Docs',
              },
              {
                href: 'https://stats.sentinel.co',
                label: 'Stats',
              },
              {
                label: 'Node Map',
                href: 'https://map.sentinel.co',
              },
            ],
          },
          {
            href: 'https://github.com/proofoftrinity',
            className: 'pseudo-icon github-icon',
            position: 'right',
          },
        ],
      },

      // this block enables dark mode only
      colorMode: {
        defaultMode: 'dark',
        disableSwitch: true,
        respectPrefersColorScheme: false,
      },


      footer: {
        style: 'dark',
        logo: {
          alt: 'Trinity',
          src: 'img/trinity-wordmark.svg',
          width: 129,
        },
        links: [
          {
            title: 'Katacomb VPN',
            items: [
              {
                label: 'Overview',
                to: '/katacomb-vpn',
              },
              {
                label: 'Download',
                to: '/katacomb-vpn#download',
              },
              {
                label: 'Source',
                href: 'https://github.com/proofoftrinity/katacomb-vpn',
              },
              {
                label: 'Releases',
                href: 'https://github.com/proofoftrinity/katacomb-vpn/releases',
              },
            ],
          },
          {
            title: 'Get in Touch',
            items: [
              {
                label: 'X',
                href: 'https://x.com/proofoftrinity',
              },
              {
                label: 'GitHub',
                href: 'https://github.com/proofoftrinity',
              },
              {
                label: 'KeyBase',
                href: 'https://keybase.io/trinitystake',
              },
            ],
          },
          {
            title: 'Sentinel',
            items: [
              {
                label: 'Official Website',
                href: 'https://sentinel.co',
              },
              {
                label: 'Documentation',
                href: 'https://docs.sentinel.co',
              },
              {
                label: 'Stats',
                href: 'https://stats.sentinel.co',
              },
              {
                label: 'Node Map',
                href: 'https://map.sentinel.co',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} - Trinity`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
        additionalLanguages: [
          'bash',
          'jsx',
          'yaml',
          'python',
          'markdown',
          'toml'
        ],
      },
    }),
};

module.exports = config;
