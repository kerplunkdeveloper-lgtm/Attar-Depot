import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const brainImagePath =
      'C:\\Users\\Admin\\.gemini\\antigravity-ide\\brain\\d9685302-6140-48ba-931b-1005a16c6112\\preloader_royal_bg_1791003048870.jpg';

    // 1. Check if public image already exists
    const publicDir = path.join(process.cwd(), 'public', 'images');
    const destPath = path.join(publicDir, 'preloader-bg.jpg');

    if (fs.existsSync(destPath)) {
      const buffer = fs.readFileSync(destPath);
      return new NextResponse(buffer, {
        headers: {
          'Content-Type': 'image/jpeg',
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      });
    }

    // 2. If not yet copied, copy from brain artifact
    if (fs.existsSync(brainImagePath)) {
      const fileBuffer = fs.readFileSync(brainImagePath);

      try {
        if (!fs.existsSync(publicDir)) {
          fs.mkdirSync(publicDir, { recursive: true });
        }
        fs.writeFileSync(destPath, fileBuffer);
      } catch (err) {
        console.error('Failed to copy preloader background to public directory:', err);
      }

      return new NextResponse(fileBuffer, {
        headers: {
          'Content-Type': 'image/jpeg',
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      });
    }
  } catch (error) {
    console.error('Error serving preloader background image:', error);
  }

  return new NextResponse(null, { status: 404 });
}
