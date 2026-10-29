const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

function escapeXml(unsafe) {
  return String(unsafe).replace(/[<>&'"]/g, c => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
    }
  });
}

async function renderCard(bgSrc, title, subtitle, outFile, logoBuf) {
  let srcImgPath = path.resolve(__dirname, '../public', bgSrc.replace(/^\/+/, ''));
  if (!fs.existsSync(srcImgPath)) {
    srcImgPath = path.resolve(__dirname, '../public/og-default.jpg');
  }

  const safeTitle = escapeXml(title);
  const safeSubtitle = escapeXml(subtitle);

  const svgBanner = Buffer.from(`
    <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bgGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#000000" stop-opacity="0.35"/>
          <stop offset="45%" stop-color="#000000" stop-opacity="0.15"/>
          <stop offset="100%" stop-color="#051c14" stop-opacity="0.95"/>
        </linearGradient>
      </defs>
      <rect width="1200" height="630" fill="url(#bgGrad)"/>
      <text x="60" y="495" font-family="Arial, Helvetica, sans-serif" font-size="46" font-weight="bold" fill="#ffffff">${safeTitle}</text>
      <text x="60" y="550" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="600" fill="#2ecc71">${safeSubtitle}</text>
    </svg>
  `);

  await sharp(srcImgPath)
    .resize(1200, 630, { fit: 'cover', position: 'center' })
    .composite([
      { input: svgBanner, top: 0, left: 0 },
      { input: logoBuf, top: 45, left: 60 }
    ])
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(outFile);
}

async function generateAllOgImages() {
  const t0 = Date.now();
  console.log('--- GENERATING OPEN GRAPH SHARE ASSETS (1200x630 JPG) ---');

  const logoPath = path.resolve(__dirname, '../public/assets/logo.svg');
  const logoBuf = await sharp(logoPath)
    .resize({ width: 220 })
    .toBuffer();

  // 1. Static Routes
  const ogDir = path.resolve(__dirname, '../public/og');
  fs.mkdirSync(ogDir, { recursive: true });

  const staticRoutes = [
    {
      file: 'home.jpg',
      bg: 'assets/destinations/sundarbans.webp',
      title: 'Ghuraghuri • Bangladesh Travel Explorer',
      subtitle: 'Discover 295+ Curated Tourist Destinations Across 8 Divisions'
    },
    {
      file: 'destinations.jpg',
      bg: 'assets/destinations/coxs-bazar.webp',
      title: 'Explore All Destinations in Bangladesh',
      subtitle: 'Beaches, Hill Tracts, Waterfalls, Heritage & Eco-Stays'
    },
    {
      file: 'hotels.jpg',
      bg: 'assets/destinations/sajek-valley.webp',
      title: 'Hotels, Eco-Resorts & Stays in Bangladesh',
      subtitle: 'Verified Hotel Directory with Direct Contacts & Map Locations'
    },
    {
      file: 'restaurants.jpg',
      bg: 'assets/destinations/old-dhaka.webp',
      title: 'Authentic Restaurants & Bengali Cuisine',
      subtitle: 'Traditional Food Guides, Local Dining & Signature Delicacies'
    },
    {
      file: 'transport.jpg',
      bg: 'assets/destinations/chattogram.webp',
      title: 'Bangladesh Transit & Intercity Transport Directory',
      subtitle: 'Intercity Bus Routes, Train Schedules, Ferries & Fares'
    },
    {
      file: 'weather.jpg',
      bg: 'assets/destinations/srimangal.webp',
      title: 'Live Weather & Seasonal Travel Climate Guide',
      subtitle: 'Real-Time Weather Forecasts & Monsoon Updates for 64 Districts'
    },
    {
      file: 'travel.jpg',
      bg: 'assets/destinations/kuakata.webp',
      title: 'Travel Services & Trip Planning Bangladesh',
      subtitle: 'Complete Hub Guides, Verified Contacts & Route Plans'
    },
    {
      file: 'chattogram.jpg',
      bg: 'assets/destinations/coxs-bazar.webp',
      title: 'Chattogram Division Travel Guide',
      subtitle: 'Explore 110 Handpicked Spots, Hills, Beaches & Scenic Drives'
    }
  ];

  for (const item of staticRoutes) {
    const target = path.join(ogDir, item.file);
    if (!fs.existsSync(target)) {
      await renderCard(item.bg, item.title, item.subtitle, target, logoBuf);
      console.log(`Generated static OG: /og/${item.file}`);
    }
  }

  // 2. Division Pages
  const divisionsDir = path.resolve(__dirname, '../public/og/divisions');
  fs.mkdirSync(divisionsDir, { recursive: true });

  const divisionRoutes = [
    { slug: 'chattogram', name: 'Chattogram', count: 110, bg: 'assets/destinations/coxs-bazar.webp' },
    { slug: 'sylhet', name: 'Sylhet', count: 30, bg: 'assets/destinations/srimangal.webp' },
    { slug: 'khulna', name: 'Khulna', count: 22, bg: 'assets/destinations/sundarbans.webp' },
    { slug: 'barishal', name: 'Barishal', count: 19, bg: 'assets/destinations/kuakata.webp' },
    { slug: 'dhaka', name: 'Dhaka', count: 56, bg: 'assets/destinations/ahsan-manzil.webp' },
    { slug: 'rajshahi', name: 'Rajshahi', count: 27, bg: 'assets/destinations/puthia-temple-complex.webp' },
    { slug: 'rangpur', name: 'Rangpur', count: 19, bg: 'assets/destinations/tajhat-palace.webp' },
    { slug: 'mymensingh', name: 'Mymensingh', count: 12, bg: 'assets/destinations/birishiri.webp' }
  ];

  for (const div of divisionRoutes) {
    const target = path.join(divisionsDir, `${div.slug}.jpg`);
    if (!fs.existsSync(target)) {
      await renderCard(
        div.bg,
        `${div.name} Division Travel Guide`,
        `Ghuraghuri • Explore ${div.count} Curated Tourist Spots in ${div.name}`,
        target,
        logoBuf
      );
      console.log(`Generated division OG: /og/divisions/${div.slug}.jpg`);
    }
  }

  // 3. Destination Pages
  const destinationsPath = path.resolve(__dirname, '../src/data/destinations.json');
  const destinations = JSON.parse(fs.readFileSync(destinationsPath, 'utf8'));

  const destOgDirLegacy = path.resolve(__dirname, '../public/assets/og/destinations');
  const destOgDir = path.resolve(__dirname, '../public/og/destinations');
  fs.mkdirSync(destOgDirLegacy, { recursive: true });
  fs.mkdirSync(destOgDir, { recursive: true });

  let newDestOg = 0;
  for (const d of destinations) {
    const outLegacy = path.join(destOgDirLegacy, `${d.slug}.jpg`);
    const outNew = path.join(destOgDir, `${d.slug}.jpg`);

    if (fs.existsSync(outLegacy) && fs.existsSync(outNew)) {
      continue;
    }

    let srcImgPath = path.resolve(__dirname, '../public', d.image.replace(/^\/+/, ''));
    if (!fs.existsSync(srcImgPath)) {
      srcImgPath = path.resolve(__dirname, '../public/og-default.jpg');
    }

    try {
      const destBuffer = await sharp(srcImgPath)
        .resize(1200, 630, { fit: 'cover', position: 'center' })
        .jpeg({ quality: 82, mozjpeg: true })
        .toBuffer();

      if (!fs.existsSync(outLegacy)) fs.writeFileSync(outLegacy, destBuffer);
      if (!fs.existsSync(outNew)) fs.writeFileSync(outNew, destBuffer);
      newDestOg++;
    } catch (err) {
      console.warn(`Failed to generate destination OG for ${d.slug}: ${err.message}`);
    }
  }

  console.log(`Open Graph generation complete (${newDestOg} new destination cards) in ${((Date.now() - t0) / 1000).toFixed(2)}s.`);
}

generateAllOgImages().catch(err => {
  console.error(err);
  process.exit(1);
});
