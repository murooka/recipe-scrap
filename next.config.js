// @ts-check

const isProd = process.env.NODE_ENV === "production";

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  assetPrefix: isProd ? "https://a.rscrap.site" : undefined,
  serverExternalPackages: [
    "@google-cloud/storage",
    "@google-cloud/vision",
    "@googleapis/youtube",
    "google-auth-library",
  ],
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
};

export default nextConfig;
