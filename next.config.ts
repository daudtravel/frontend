import type { NextConfig } from "next";
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
    // Add SVG handling
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
    domains: ["localhost", "api.daudtravel.com"],
  },

  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://api.daudtravel.com/api/:path*",
      },
    ];
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
