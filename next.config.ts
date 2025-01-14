import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/, // Target SVG files
      use: ['@svgr/webpack'], // Use @svgr/webpack loader
    });
    return config;
  },
};

export default nextConfig;
