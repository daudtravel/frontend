import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
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
  webpack(config: { module: { rules: { test: RegExp; use: { loader: string; options: { icon: boolean; }; }; }[]; }; }) {
    config.module.rules.push({
      test: /\.svg$/,
      use: { loader: "@svgr/webpack", options: { icon: true } },
    });

    return config;
  },
  
  images: {
    domains: ["localhost"  ],  
  },
  
};

 
export default withNextIntl(nextConfig);
