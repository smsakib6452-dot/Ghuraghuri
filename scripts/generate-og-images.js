const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function generateOgImages() {
  const destinationsPath = path.resolve(__dirname, '../src/data/destinations.json');
  const destinations = JSON.parse(fs.readFileSync(destinationsPath, 'utf8'));

  const outDir = path.resolve(__dirname, '../public/assets/og/destinations');
  fs.mkdirSync(outDir, { recursive: true });

  console.log(`Generating 1200x630 OG JPGs for ${destinations.length} destinations...`);
  const t0 = Date.now();
  let generated = 0;
  let skipped = 0;

  for (const d of destinations) {
    const outFile = path.join(outDir, `${d.slug}.jpg`);
    
    // If already generated and source hasn't changed, skip to keep build lightning fast
    if (fs.existsSync(outFile)) {
      skipped++;
      continue;
    }

    let srcImgPath = path.resolve(__dirname, '../public', d.image.replace(/^\/+/, ''));
    if (!fs.existsSync(srcImgPath)) {
      srcImgPath = path.resolve(__dirname, '../public/og-default.jpg');
    }

    try {
      await sharp(srcImgPath)
        .resize(1200, 630, {
          fit: 'cover',
          position: 'center'
        })
        .jpeg({
          quality: 82,
          mozjpeg: true
        })
        .toFile(outFile);
      generated++;
    } catch (err) {
      console.warn(`Failed to generate OG image for ${d.slug}: ${err.message}`);
    }
  }

  console.log(`Generated ${generated} new OG images (${skipped} up to date) in ${(Date.now() - t0) / 1000}s`);
}

generateOgImages().catch(err => {
  console.error(err);
  process.exit(1);
});

