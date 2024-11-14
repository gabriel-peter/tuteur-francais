import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: { // https://mongoosejs.com/docs/nextjs.html
    esmExternals: "loose", // <-- add this
     // <-- and this
  },
  // crossOrigin: 'anonymous',
  serverExternalPackages: ["mongoose"],
  // and the following to enable top-level await support for Webpack
  webpack: (config) => {
    config.experiments = {
      topLevelAwait: true,
      layers: true
    };
    return config;
  },
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.ytimg.com',
        port: '',
        // pathname: '/account123/**',
      },
    ],
  }
};

export default nextConfig;
