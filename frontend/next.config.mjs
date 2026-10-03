import fs from 'node:fs';
import path from 'node:path';

// Ensure texture.png and wood.png exist in public/images/ and public/
try {
  const source = path.join(process.cwd(), 'public', 'images', 'texture.png.jpeg');
  const target1 = path.join(process.cwd(), 'public', 'images', 'texture.png');
  const target2 = path.join(process.cwd(), 'public', 'texture.png');
  if (fs.existsSync(source)) {
    if (!fs.existsSync(target1)) fs.copyFileSync(source, target1);
    if (!fs.existsSync(target2)) fs.copyFileSync(source, target2);
  }

  const woodSource = path.join(process.cwd(), 'public', 'images', 'wood.jpeg');
  const woodTarget1 = path.join(process.cwd(), 'public', 'images', 'wood.png');
  const woodTarget2 = path.join(process.cwd(), 'public', 'wood.png');
  if (fs.existsSync(woodSource)) {
    if (!fs.existsSync(woodTarget1)) fs.copyFileSync(woodSource, woodTarget1);
    if (!fs.existsSync(woodTarget2)) fs.copyFileSync(woodSource, woodTarget2);
  }

  const aboutSource = 'C:\\Users\\Admin\\.gemini\\antigravity-ide\\brain\\8c0aa016-3e23-4537-bdb1-75cf85217467\\.user_uploaded\\media_1791018383377.png';
  const aboutTarget = path.join(process.cwd(), 'public', 'images', 'aboutbanner-new.png');
  if (fs.existsSync(aboutSource)) {
    fs.copyFileSync(aboutSource, aboutTarget);
  }
} catch (e) {
  // ignore
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  compress: true,
  poweredByHeader: false,
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 2592000, // 30 days image cache
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
    optimizePackageImports: ['lucide-react', '@reduxjs/toolkit', '@tanstack/react-query'],
  },
  async rewrites() {
    return [
      {
        source: '/logonew.png',
        destination: '/images/logonew.png',
      },
      {
        source: '/images/texture.png',
        destination: '/images/texture.png.jpeg',
      },
      {
        source: '/texture.png',
        destination: '/images/texture.png.jpeg',
      },
      {
        source: '/images/wood.png',
        destination: '/images/wood.jpeg',
      },
      {
        source: '/wood.png',
        destination: '/images/wood.jpeg',
      },
    ];
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;

