import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const brainImagePath = 'C:\\Users\\Admin\\.gemini\\antigravity-ide\\brain\\dfb096d8-ca33-4ff2-945e-5893cdbf73da\\attar_spotlight_bottle_1789553148339.jpg';
    
    if (fs.existsSync(brainImagePath)) {
      const fileBuffer = fs.readFileSync(brainImagePath);

      // Also persist to public/images/attar-spotlight.jpg so it becomes a static asset
      try {
        const publicDir = path.join(process.cwd(), 'public', 'images');
        if (!fs.existsSync(publicDir)) {
          fs.mkdirSync(publicDir, { recursive: true });
        }
        const destPath = path.join(publicDir, 'attar-spotlight.jpg');
        fs.writeFileSync(destPath, fileBuffer);
      } catch (err) {
        console.error('Failed to copy to public directory:', err);
      }

      return new NextResponse(fileBuffer, {
        headers: {
          'Content-Type': 'image/jpeg',
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      });
    }
  } catch (error) {
    console.error('Error serving spotlight image:', error);
  }

  return new NextResponse(null, { status: 404 });
}
