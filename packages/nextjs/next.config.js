// @ts-check

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: process.env.NEXT_PUBLIC_IGNORE_BUILD_ERROR === "true",
  },
  eslint: {
    ignoreDuringBuilds: process.env.NEXT_PUBLIC_IGNORE_BUILD_ERROR === "true",
  },
  serverRuntimeConfig: {
    fs: require('fs'),
  },
  webpack: config => {
    config.resolve.fallback = { net: false, tls: false };
    return config;
  },
};

module.exports = nextConfig;
