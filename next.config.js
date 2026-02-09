/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'dd.dexscreener.com' },
      { protocol: 'https', hostname: '**.dexscreener.com' },
      { protocol: 'https', hostname: 'raw.githubusercontent.com' },
    ],
  },
}

module.exports = nextConfig
