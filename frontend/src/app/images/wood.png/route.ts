import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const candidates = [
      path.join(process.cwd(), 'public', 'images', 'wood.jpeg'),
      path.join(process.cwd(), 'public', 'images', 'wood.png'),
      path.join(process.cwd(), 'public', 'wood.png'),
      path.join(process.cwd(), 'frontend', 'public', 'images', 'wood.jpeg'),
      path.join(process.cwd(), 'frontend', 'public', 'images', 'wood.png'),
      path.join(process.cwd(), 'frontend', 'public', 'wood.png'),
    ];

    for (const filePath of candidates) {
      if (fs.existsSync(filePath)) {
        const fileBuffer = fs.readFileSync(filePath);
        return new Response(new Uint8Array(fileBuffer), {
          status: 200,
          headers: {
            'Content-Type': filePath.endsWith('.png') ? 'image/png' : 'image/jpeg',
            'Content-Length': String(fileBuffer.length),
            'Cache-Control': 'public, max-age=31536000, immutable',
          },
        });
      }
    }
  } catch (error) {
    console.error('Error serving wood.png:', error);
  }

  return new Response('Not Found', { status: 404 });
}

