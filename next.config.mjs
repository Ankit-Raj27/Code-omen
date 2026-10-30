import { redirects } from "./src/config/redirects.mjs";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return redirects;
  },
  // Serve Firebase's auth handler from our own domain, so redirect sign-in works in
  // browsers that partition third-party storage (Safari, Firefox). Takes effect once
  // NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN is set to this site's domain.
  async rewrites() {
    return [{ source: "/__/auth/:path*", destination: "https://codeomen-fc4b6.firebaseapp.com/__/auth/:path*" }];
  },
};

export default nextConfig;
