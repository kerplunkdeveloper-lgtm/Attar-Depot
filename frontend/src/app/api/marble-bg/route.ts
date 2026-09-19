import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  const src = 'C:\\Users\\Admin\\.gemini\\antigravity-ide\\brain\\f549dd6a-b487-437f-9e5a-a79f1646842f\\luxury_marble_bg_1789794069156.jpg';
  const destDir = path.join(process.cwd(), 'public', 'images');
  const dest = path.join(destDir, 'luxury-marble-bg.jpg');

  try {
    if (fs.existsSync(src)) {
      if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true });
      }
      fs.copyFileSync(src, dest);
      const buffer = fs.readFileSync(src);
      return new Response(buffer, {
        headers: {
          'Content-Type': 'image/jpeg',
          'Cache-Control': 'public, max-age=86400',
        },
      });
    }
    return NextResponse.json({ error: 'Source image not found' }, { status: 404 });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Error copying file' }, { status: 500 });
  }
}
