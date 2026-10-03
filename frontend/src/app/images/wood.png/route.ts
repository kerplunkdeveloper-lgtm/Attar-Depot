import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const publicDir = path.join(process.cwd(), 'public', 'images');
    const jpegPath = path.join(publicDir, 'wood.jpeg');
    const pngPath = path.join(publicDir, 'wood.png');
    const rootPngPath = path.join(process.cwd(), 'public', 'wood.png');

    if (fs.existsSync(jpegPath)) {
      const fileBuffer = fs.readFileSync(jpegPath);
      try {
        if (!fs.existsSync(pngPath)) {
          fs.writeFileSync(pngPath, fileBuffer);
        }
        if (!fs.existsSync(rootPngPath)) {
          fs.writeFileSync(rootPngPath, fileBuffer);
        }
      } catch {}

      return new NextResponse(fileBuffer, {
        headers: {
          'Content-Type': 'image/png',
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      });
    }
  } catch (error) {
    console.error('Error serving wood.png:', error);
  }

  return new NextResponse(null, { status: 404 });
}
