import { redirects } from "./src/config/redirects.mjs";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return redirects;
  },
};

export default nextConfig;
