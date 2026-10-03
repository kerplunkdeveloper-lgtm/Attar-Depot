import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const uploadedImagePath = 'C:\\Users\\Admin\\.gemini\\antigravity-ide\\brain\\f30006dc-3c5d-4da6-804e-af994d6384c6\\.user_uploaded\\media_1791020661201.png';
    const destDir = path.join(process.cwd(), 'public', 'images');
    const destPath = path.join(destDir, 'fragrance-becomes.png');
    const bgDestPath = path.join(destDir, 'fragrance-becomes-bg.png');

    let fileBuffer: Buffer | null = null;

    if (fs.existsSync(uploadedImagePath)) {
      fileBuffer = fs.readFileSync(uploadedImagePath);
      try {
        if (!fs.existsSync(destDir)) {
          fs.mkdirSync(destDir, { recursive: true });
        }
        fs.writeFileSync(destPath, fileBuffer);
        fs.writeFileSync(bgDestPath, fileBuffer);
      } catch {}
    } else if (fs.existsSync(destPath)) {
      fileBuffer = fs.readFileSync(destPath);
    } else if (fs.existsSync(bgDestPath)) {
      fileBuffer = fs.readFileSync(bgDestPath);
    }

    if (fileBuffer) {
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
    console.error('Error serving fragrance becomes image:', error);
  }

  return new Response('Not Found', { status: 404 });
}
