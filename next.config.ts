import type { NextConfig } from 'next';
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  experimental: {
    turbo: {
      rules: {
        "*.svg": {
          loaders: ["@svgr/webpack"],
          as: "*.js",
        },
      },
    },
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: { loader: "@svgr/webpack", options: { icon: true } },
    });

    return config;
  },
  
  images: {
    remotePatterns: [
      {
        protocol: "https", 
        hostname: "api.daudtravel.com",
        port: "",
        pathname: "/uploads/**",
      },
    ],
    domains: ["localhost"],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://api.daudtravel.com/api/:path*',
      },
    ];
  },
};

export default withNextIntl(nextConfig);