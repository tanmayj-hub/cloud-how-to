import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

/**
 * Docusaurus v3 configuration for the **cloud-how-to** knowledge base.
 * Update <your-github-user> everywhere it appears below if your username changes.
 */
const config: Config = {
  title: 'Cloud How-To',
  tagline: 'Mini runbooks for AWS & cloud tasks',
  favicon: 'img/favicon.ico',

  future: {
    v4: true,
  },

  // GitHub Pages deployment settings -----------------------------------------
  url: 'https://tanmayj-hub.github.io', // e.g. https://tanmayj-hub.github.io
  baseUrl: '/cloud-how-to/',            // repo name with leading & trailing slashes
  organizationName: 'tanmayj-hub',      // e.g. tanmayj-hub
  projectName: 'cloud-how-to',          // repo name

  // ───────────────────────────────────────────────────────────────────────────
  // Allow drafts / missing links during early authoring phase
  onBrokenLinks: 'warn',                // ⬅️  was 'throw'
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  // --------------------------------------------------------------------------
  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          editUrl:
            'https://github.com/tanmayj-hub/cloud-how-to/blob/main/', // edit link in every page
        },
        // Disable blog for now; flip to true later if you want an internal blog.
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/docusaurus-social-card.jpg',

    navbar: {
      title: 'Cloud How-To',
      logo: {
        alt: 'Cloud How-To Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'docsSidebar',       // aligns with sidebars.ts
          position: 'left',
          label: 'Docs',
        },
        {
          href: 'https://github.com/tanmayj-hub/cloud-how-to',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },

    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Route 53 — Buy a Domain',
              to: '/docs/route53/buy-domain',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {label: 'Stack Overflow', href: 'https://stackoverflow.com/questions/tagged/aws-route53'},
            {label: 'Discord', href: 'https://discord.gg/aws'},
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/tanmayj-hub/cloud-how-to',
            },
          ],
        },
      ],
      copyright: `© ${new Date().getFullYear()} Cloud How-To. Built with Docusaurus.`,
    },

    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
