import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  serverExternalPackages: ['pdf-parse', 'pdfjs-dist'],
  turbopack: {
    root: import.meta.dirname,
  },
};

export default nextConfig;

