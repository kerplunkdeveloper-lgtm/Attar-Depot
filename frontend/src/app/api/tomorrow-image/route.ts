import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  const sourcePath =
    'C:/Users/Admin/.gemini/antigravity-ide/brain/9ff7d09c-6a49-4261-b6b4-8f7719475bd2/.user_uploaded/media_1791351206831.png';
  const targetDir = path.join(process.cwd(), 'public', 'images');
  const targetPath = path.join(targetDir, 'brand-tomorrow-arch.png');

  try {
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }
    if (fs.existsSync(sourcePath)) {
      fs.copyFileSync(sourcePath, targetPath);
    }
  } catch (err) {
    console.error('Error copying tomorrow image:', err);
  }

  try {
    const fileBuffer = fs.readFileSync(sourcePath);
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (err) {
    console.error('Error reading tomorrow image:', err);
    return new NextResponse('Image not found', { status: 404 });
  }
}
