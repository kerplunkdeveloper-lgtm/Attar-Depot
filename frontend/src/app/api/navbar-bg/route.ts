import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const brainImagePath =
      'C:\\Users\\Admin\\.gemini\\antigravity-ide\\brain\\d9685302-6140-48ba-931b-1005a16c6112\\navbar_panoramic_clean_bg_1791005169378.jpg';

    const publicDir = path.join(process.cwd(), 'public', 'images');
    const greenBgPath = path.join(publicDir, 'greenbgnew.jpeg');
    const destPath = path.join(publicDir, 'navbar-bg.jpg');

    if (fs.existsSync(greenBgPath)) {
      const buffer = fs.readFileSync(greenBgPath);
      return new Response(new Uint8Array(buffer), {
        status: 200,
        headers: {
          'Content-Type': 'image/jpeg',
          'Content-Length': String(buffer.length),
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      });
    }

    if (fs.existsSync(destPath)) {
      const buffer = fs.readFileSync(destPath);
      return new Response(new Uint8Array(buffer), {
        status: 200,
        headers: {
          'Content-Type': 'image/jpeg',
          'Content-Length': String(buffer.length),
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        },
      });
    }
  } catch (error) {
    console.error('Error serving navbar background image:', error);
  }

  return new Response('Not Found', { status: 404 });
}
