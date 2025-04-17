const createNextIntlPlugin = require('next-intl/plugin');

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    domains: ['localhost'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // Skip static generation for client-component pages
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
  reactStrictMode: true,
  swcMinify: true,
};

module.exports = withNextIntl(nextConfig);
