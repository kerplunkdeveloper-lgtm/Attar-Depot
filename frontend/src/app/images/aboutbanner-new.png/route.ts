import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const destDir = path.join(process.cwd(), 'public', 'images');
    const destPath = path.join(destDir, 'aboutbanner-new.png');
    const heroBannerPath = path.join(destDir, 'about-hero-banner.jpg');
    const fallbackDestPath = path.join(destDir, 'aboutbanners1.png');

    let fileBuffer: Buffer | null = null;
    let contentType = 'image/png';

    if (fs.existsSync(destPath)) {
      fileBuffer = fs.readFileSync(destPath);
      contentType = 'image/png';
    } else if (fs.existsSync(heroBannerPath)) {
      fileBuffer = fs.readFileSync(heroBannerPath);
      contentType = 'image/jpeg';
    } else if (fs.existsSync(fallbackDestPath)) {
      fileBuffer = fs.readFileSync(fallbackDestPath);
      contentType = 'image/png';
    }

    if (fileBuffer) {
      return new NextResponse(fileBuffer, {
        headers: {
          'Content-Type': contentType,
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      });
    }
  } catch (error) {
    console.error('Error serving about banner image:', error);
  }

  return new NextResponse('Not Found', { status: 404 });
}
