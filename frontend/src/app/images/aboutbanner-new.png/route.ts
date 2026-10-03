import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const destDir = path.join(process.cwd(), 'public', 'images');
    const destPath = path.join(destDir, 'aboutbanner-new.png');
    const heroBannerPath = path.join(destDir, 'about-hero-banner.jpg');
    const fallbackDestPath = path.join(destDir, 'aboutbanners1.png');
    const uploadedImagePath = 'C:\\Users\\Admin\\.gemini\\antigravity-ide\\brain\\8c0aa016-3e23-4537-bdb1-75cf85217467\\.user_uploaded\\media_1791018383377.png';

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
    } else if (fs.existsSync(uploadedImagePath)) {
      fileBuffer = fs.readFileSync(uploadedImagePath);
      contentType = 'image/png';
    }

    if (fileBuffer) {
      return new Response(new Uint8Array(fileBuffer), {
        status: 200,
        headers: {
          'Content-Type': contentType,
          'Content-Length': String(fileBuffer.length),
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      });
    }
  } catch (error) {
    console.error('Error serving about banner image:', error);
  }

  return new Response('Not Found', { status: 404 });
}
