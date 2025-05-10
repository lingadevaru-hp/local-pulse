import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const sizes = [192, 384, 512];

export async function generatePWAIcons() {
  const sourceIcon = path.join(process.cwd(), 'src', 'icons', 'AppIcon.tsx');
  const outputDir = path.join(process.cwd(), 'public', 'icons');

  // Create output directory if it doesn't exist
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Generate icons for each size
  for (const size of sizes) {
    const outputPath = path.join(outputDir, `icon-${size}x${size}.png`);
    
    // Convert SVG to PNG using sharp
    await sharp(sourceIcon)
      .resize(size, size)
      .png()
      .toFile(outputPath);
  }
}

// Run the generator
generatePWAIcons().catch(console.error); 