import fs from 'fs';
import path from 'path';

/**
 * Ensures the reference banner image is copied from the uploaded media location
 * to the Next.js static public/images directory so it is served reliably.
 */
export function ensureAboutBanner(): string {
  try {
    const brainUploadedImage = 'C:\\Users\\Admin\\.gemini\\antigravity-ide\\brain\\e35a2100-e99c-411c-a721-05297aa75b63\\.user_uploaded\\media_1791185399114.png';
    const publicDir = path.join(process.cwd(), 'public', 'images');
    const destPath = path.join(publicDir, 'about-discovery-banner.png');

    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }

    const cleanBannerBrain = 'C:\\Users\\Admin\\.gemini\\antigravity-ide\\brain\\e35a2100-e99c-411c-a721-05297aa75b63\\about_clean_banner_1791185770734.jpg';
    const cleanDestPath = path.join(publicDir, 'about-hero-clean.jpg');

    if (fs.existsSync(cleanBannerBrain) && !fs.existsSync(cleanDestPath)) {
      const cleanBuffer = fs.readFileSync(cleanBannerBrain);
      fs.writeFileSync(cleanDestPath, cleanBuffer);
      fs.writeFileSync(path.join(publicDir, 'about-hero-banner.jpg'), cleanBuffer);
    }

    const heritageSourceImage = 'C:\\Users\\Admin\\.gemini\\antigravity-ide\\brain\\e35a2100-e99c-411c-a721-05297aa75b63\\.user_uploaded\\media_1791186323471.png';
    const heritageDestPath = path.join(publicDir, 'heritage-family-trust.png');

    if (fs.existsSync(heritageSourceImage)) {
      const heritageBuffer = fs.readFileSync(heritageSourceImage);
      fs.writeFileSync(heritageDestPath, heritageBuffer);
      fs.writeFileSync(path.join(publicDir, 'heritage-reference.png'), heritageBuffer);
    }

    const meaningSourceImage = 'C:\\Users\\Admin\\.gemini\\antigravity-ide\\brain\\e35a2100-e99c-411c-a721-05297aa75b63\\.user_uploaded\\media_1791186857974.png';
    const meaningDestPath = path.join(publicDir, 'about-name-meaning.png');
    if (fs.existsSync(meaningSourceImage)) {
      const meaningBuffer = fs.readFileSync(meaningSourceImage);
      fs.writeFileSync(meaningDestPath, meaningBuffer);
      const w = meaningBuffer.readUInt32BE(16);
      const h = meaningBuffer.readUInt32BE(20);
      console.log('[Meaning Image Dimensions]:', w, 'x', h);
    }

    const leafSource = 'C:\\Users\\Admin\\.gemini\\antigravity-ide\\brain\\e35a2100-e99c-411c-a721-05297aa75b63\\attar_leaf_emblem_1791186979033.jpg';
    const leafDest = path.join(publicDir, 'attar-leaf-emblem.jpg');
    if (fs.existsSync(leafSource)) {
      fs.writeFileSync(leafDest, fs.readFileSync(leafSource));
    }

    const pondyHDSrc = 'C:\\Users\\Admin\\.gemini\\antigravity-ide\\brain\\e35a2100-e99c-411c-a721-05297aa75b63\\pondicherry_heritage_street_1791186434129.jpg';
    const pondyHDDest = path.join(publicDir, 'pondicherry-heritage-hd.jpg');
    if (fs.existsSync(pondyHDSrc)) {
      fs.writeFileSync(pondyHDDest, fs.readFileSync(pondyHDSrc));
    }

    // Traditions Reference Image
    const traditionsSrc = 'C:\\Users\\Admin\\.gemini\\antigravity-ide\\brain\\e35a2100-e99c-411c-a721-05297aa75b63\\.user_uploaded\\media_1791191584510.png';
    const traditionsFullDest = path.join(publicDir, 'about-three-traditions.png');
    if (fs.existsSync(traditionsSrc) && !fs.existsSync(traditionsFullDest)) {
      fs.copyFileSync(traditionsSrc, traditionsFullDest);
    }

    // New Luxury Marquee Ribbon Banner from user
    const marqueeSourceImage = 'C:\\Users\\Admin\\.gemini\\antigravity-ide\\brain\\85425db1-4d58-4813-90fa-673c25b9ff80\\.user_uploaded\\media_1791200120312.png';
    const marqueeDestPath = path.join(publicDir, 'about-ribbon-marquee-bg.png');
    if (fs.existsSync(marqueeSourceImage) && !fs.existsSync(marqueeDestPath)) {
      fs.copyFileSync(marqueeSourceImage, marqueeDestPath);
    }
    if (fs.existsSync(marqueeDestPath)) {
      const marqueeBuffer = fs.readFileSync(marqueeDestPath);
      const mw = marqueeBuffer.readUInt32BE(16);
      const mh = marqueeBuffer.readUInt32BE(20);
      console.log('[Marquee Banner Dimensions]:', mw, 'x', mh);
    }

    if (fs.existsSync(brainUploadedImage)) {
      const buffer = fs.readFileSync(brainUploadedImage);
      fs.writeFileSync(destPath, buffer);
      return '/images/about-hero-clean.jpg';
    }
  } catch (error) {
    console.error('Failed to ensure about discovery banner image:', error);
  }

  return '/images/about-hero-clean.jpg';
}
