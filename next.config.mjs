import { redirects } from "./src/config/redirects.mjs";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return redirects;
  },
  // Serve Firebase's auth handler (and the config it loads) from our own domain, so
  // redirect sign-in survives browsers that block cross-site storage. Used by the
  // same-origin authDomain in src/Firebase/firebase.ts.
  async rewrites() {
    const firebaseHosting = "https://codeomen-fc4b6.firebaseapp.com";
    return [
      { source: "/__/auth/:path*", destination: `${firebaseHosting}/__/auth/:path*` },
      { source: "/__/firebase/:path*", destination: `${firebaseHosting}/__/firebase/:path*` },
    ];
  },
};

export default nextConfig;
