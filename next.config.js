/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Product images are local SVG placeholders for now — allow next/image
    // to serve them. Safe: only our own static files, locked down by CSP.
    // When you move to real photos (Supabase Storage, Printful, a CDN),
    // add the hostname(s) to remotePatterns and drop the SVG flags.
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [],
  },
};

module.exports = nextConfig;
