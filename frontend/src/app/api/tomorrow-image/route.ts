import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  const targetPath = path.join(process.cwd(), 'public', 'images', 'brand-tomorrow-arch.png');

  try {
    if (fs.existsSync(targetPath)) {
      const fileBuffer = fs.readFileSync(targetPath);
      return new NextResponse(fileBuffer, {
        headers: {
          'Content-Type': 'image/png',
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      });
    }
  } catch (err) {
    console.error('Error reading tomorrow image:', err);
  }

  return new NextResponse('Image not found', { status: 404 });
}
