import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',         // Static export для Netlify
  trailingSlash: true,      // Netlify-совместимые URL
  reactCompiler: true,
  images: {
    unoptimized: true,    // Нужно для статического экспорта
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000',
  },
};

export default nextConfig;
