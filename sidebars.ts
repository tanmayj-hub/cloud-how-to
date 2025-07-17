import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

/**
 * Sidebar structure
 *
 * ├─ Intro
 * └─ Route 53
 *     └─ Buy a domain
 *
 * Add more categories or files as you grow.
 */
const sidebars: SidebarsConfig = {
  docsSidebar: [
    // Optional welcome page (docs/intro.md). Remove this line if you don't have it.
    'intro',

    {
      type: 'category',
      label: 'Route 53',
      items: [
        'route53/buy-domain', // docs/route53/buy-domain.md
      ],
    },
    {
      type: 'category',
      label: 'S3',
      items: ['s3/static-site',
      ],
    },

    // You can add more categories here, e.g. S3, EKS, IAM…
  ],
};

export default sidebars;
