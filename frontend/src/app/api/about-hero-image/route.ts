import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const brainImagePath = 'C:\\Users\\Admin\\.gemini\\antigravity-ide\\brain\\e35a2100-e99c-411c-a721-05297aa75b63\\.user_uploaded\\media_1791185399114.png';
    const publicDir = path.join(process.cwd(), 'public', 'images');
    const destPath = path.join(publicDir, 'about-discovery-banner.png');

    if (fs.existsSync(brainImagePath)) {
      const fileBuffer = fs.readFileSync(brainImagePath);

      try {
        if (!fs.existsSync(publicDir)) {
          fs.mkdirSync(publicDir, { recursive: true });
        }
        fs.writeFileSync(destPath, fileBuffer);
      } catch (err) {
        console.error('Failed to copy about banner to public directory:', err);
      }

      return new Response(new Uint8Array(fileBuffer), {
        status: 200,
        headers: {
          'Content-Type': 'image/png',
          'Content-Length': String(fileBuffer.length),
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      });
    }

    if (fs.existsSync(destPath)) {
      const fileBuffer = fs.readFileSync(destPath);
      return new Response(new Uint8Array(fileBuffer), {
        status: 200,
        headers: {
          'Content-Type': 'image/png',
          'Content-Length': String(fileBuffer.length),
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      });
    }
  } catch (error) {
    console.error('Error serving about discovery banner image:', error);
  }

  return new Response('Not Found', { status: 404 });
}
