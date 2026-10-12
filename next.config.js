const isMigrationPreview = process.env.NEXT_PUBLIC_MIGRATION_PREVIEW === "true" || ["deploy-preview", "branch-deploy"].includes(process.env.CONTEXT);
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Keep dependency tracing inside this site despite unrelated parent lockfiles.
  outputFileTracingRoot: __dirname,
  distDir: process.env.NEXT_DIST_DIR || ".next",
  reactStrictMode: true,
  env: { NEXT_PUBLIC_MIGRATION_PREVIEW: String(isMigrationPreview), ...(isMigrationPreview ? { NEXT_PUBLIC_META_PIXEL_ID: "" } : {}) },
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
