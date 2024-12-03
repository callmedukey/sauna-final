/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  webpack: (config) => {
    // Resolve @react-pdf/renderer issues
    config.resolve.alias.canvas = false;
    config.resolve.alias.encoding = false;

    return config;
  },
};

module.exports = nextConfig;
