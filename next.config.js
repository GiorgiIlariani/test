/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '**',
      },
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  compiler: {
    removeConsole:
      process.env.DISABLE_CONSOLE_IN_NEXT === 'true'
        ? {
            exclude: ['error'],
          }
        : false,
  },

  webpack: (config) => {
    config.ignoreWarnings = [
      { module: /node_modules\/@react-pdf\/pdfkit\/lib\/pdfkit\.browser\.es\.js/ },
      { file: /node_modules\/@react-pdf\/pdfkit\/lib\/pdfkit\.browser\.es\.js/ },
    ];

    return config;
  },
};

module.exports = nextConfig;

const { withSentryConfig } = require('@sentry/nextjs/config');

module.exports = withSentryConfig(module.exports, {
  silent: true,
  org: 'redberry-ltd',
  project: 'internal-soft-front',
  widenClientFileUpload: true,
  tunnelRoute: '/monitoring',
  webpack: {
    treeshake: {
      removeDebugLogging: true,
    },
  },
});
