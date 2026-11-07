const fs = require('fs');
const path = require('path');

const destinationsPath = path.resolve(__dirname, '../src/data/destinations.json');
if (!fs.existsSync(destinationsPath)) {
  console.error(`FATAL: destinations.json not found at ${destinationsPath}`);
  process.exit(1);
}

const destinations = JSON.parse(fs.readFileSync(destinationsPath, 'utf8'));

// Load image quarantine list
const quarantinePath = path.resolve(__dirname, '../src/data/image-quarantine.json');
const quarantine = fs.existsSync(quarantinePath) ? JSON.parse(fs.readFileSync(quarantinePath, 'utf8')) : [];
const quarantinedSlugs = new Set(quarantine.map(q => q.slug));

// 1. Compute total destinations, divisions, districts
const totalDestinations = destinations.length;
const divisionsSet = new Set(destinations.map(d => d.division).filter(Boolean));
const districtsSet = new Set(destinations.map(d => d.district).filter(Boolean));
const totalDivisions = divisionsSet.size;
const totalDistricts = districtsSet.size;

// 2. Compute DIVISION_COUNTS dynamically
const divisionCounts = {};
destinations.forEach(d => {
  if (d.division) {
    divisionCounts[d.division] = (divisionCounts[d.division] || 0) + 1;
  }
});

// Sort divisions by count descending
const sortedDivisionCounts = Object.fromEntries(
  Object.entries(divisionCounts).sort(([, a], [, b]) => b - a)
);

// 3. Define Taxonomy Groups and Compute CATEGORY_GROUP_COUNTS dynamically
const CATEGORY_GROUPS = {
  "Beaches & Coast": ["Beach", "Coastal"],
  "Hills & Peaks": ["Hill", "Mountain"],
  "Waterfalls": ["Waterfall"],
  "Forests & Wildlife": ["Forest", "National Park", "Wildlife", "Eco Tourism"],
  "Islands": ["Island"],
  "Rivers, Lakes & Wetlands": ["River", "Lake", "Haor"],
  "Heritage & History": ["Historical", "Archaeological", "Palace", "Heritage", "Campus & Heritage"],
  "Religious Sites": ["Religious", "Mosque", "Shrine"],
  "Culture & Museums": ["Cultural", "Museum", "Village", "City"],
  "Nature & Gardens": ["Nature", "Tea Garden", "Campus & Nature"],
  "Family & Fun": ["Family", "Adventure", "Resort Area"],
};

const CATEGORY_TO_GROUP = {};
for (const [groupName, categories] of Object.entries(CATEGORY_GROUPS)) {
  for (const cat of categories) {
    CATEGORY_TO_GROUP[cat] = groupName;
  }
}

const categoryGroupCounts = {};
for (const group of Object.keys(CATEGORY_GROUPS)) {
  categoryGroupCounts[group] = 0;
}

destinations.forEach(d => {
  const cats = [d.category];
  const matchedGroups = new Set();
  cats.forEach(c => {
    const grp = CATEGORY_TO_GROUP[c];
    if (grp) matchedGroups.add(grp);
  });
  matchedGroups.forEach(grp => {
    categoryGroupCounts[grp] = (categoryGroupCounts[grp] || 0) + 1;
  });
});

// 4. Build-time Verification & Integrity Check
const divisionSum = Object.values(divisionCounts).reduce((a, b) => a + b, 0);
if (divisionSum !== totalDestinations) {
  console.error(`\n[FATAL BUILD ERROR] Data Integrity Failure:`);
  console.error(`Division counts sum (${divisionSum}) does not match total destinations (${totalDestinations})!`);
  process.exit(1);
}

const OFFICIAL_DIVISION_DISTRICTS = {
  Dhaka: ["Dhaka", "Gazipur", "Narayanganj", "Narsingdi", "Manikganj", "Munshiganj", "Tangail", "Kishoreganj", "Faridpur", "Gopalganj", "Madaripur", "Rajbari", "Shariatpur"],
  Mymensingh: ["Mymensingh", "Jamalpur", "Netrokona", "Sherpur"],
  Chattogram: ["Chattogram", "Cox's Bazar", "Bandarban", "Rangamati", "Khagrachhari", "Feni", "Noakhali", "Lakshmipur", "Cumilla", "Chandpur", "Brahmanbaria"],
  Sylhet: ["Sylhet", "Moulvibazar", "Habiganj", "Sunamganj"],
  Rajshahi: ["Rajshahi", "Natore", "Naogaon", "Chapainawabganj", "Pabna", "Sirajganj", "Bogura", "Joypurhat"],
  Rangpur: ["Rangpur", "Dinajpur", "Gaibandha", "Kurigram", "Lalmonirhat", "Nilphamari", "Panchagarh", "Thakurgaon"],
  Khulna: ["Khulna", "Bagerhat", "Satkhira", "Jashore", "Jhenaidah", "Magura", "Narail", "Kushtia", "Chuadanga", "Meherpur"],
  Barishal: ["Barishal", "Barguna", "Bhola", "Jhalokathi", "Patuakhali", "Pirojpur"]
};

const DISTRICT_TO_DIVISION = {};
for (const [divName, distList] of Object.entries(OFFICIAL_DIVISION_DISTRICTS)) {
  for (const distName of distList) {
    DISTRICT_TO_DIVISION[distName] = divName;
  }
}

const districtDivisionErrors = [];
destinations.forEach(d => {
  const expectedDiv = DISTRICT_TO_DIVISION[d.district];
  if (!expectedDiv) {
    districtDivisionErrors.push(`[${d.slug}] unknown district '${d.district}' (not in official 64-district list)`);
  } else if (d.division !== expectedDiv) {
    districtDivisionErrors.push(`[${d.slug}] district '${d.district}' is listed under division '${d.division}', expected '${expectedDiv}'`);
  }
});

if (districtDivisionErrors.length > 0) {
  console.error(`\n🚨 FATAL BUILD GUARD ERROR: Official 64-district to 8-division mapping violations:`);
  districtDivisionErrors.forEach(err => console.error(`  - ${err}`));
  process.exit(1);
} else {
  console.log(`✓ Build Guard PASSED: All ${destinations.length} destinations map to valid official districts and divisions.`);
}

const allOfficialDistricts = Object.values(OFFICIAL_DIVISION_DISTRICTS).flat();
const zeroDestinationDistricts = allOfficialDistricts.filter(d => !districtsSet.has(d));
console.log(`[generate-data] Districts with zero destinations (${zeroDestinationDistricts.length}): ${zeroDestinationDistricts.join(', ') || 'None'}`);

if (totalDistricts > 64) {
  console.error(`\n[FATAL BUILD ERROR] Found ${totalDistricts} districts (expected <= 64):`, Array.from(districtsSet));
  process.exit(1);
}

if (totalDestinations <= 0) {
  console.error(`\n[FATAL BUILD ERROR] destinations.json contains 0 destinations!`);
  process.exit(1);
}

// Build Guard: Destination & Service Rating Verifiability Guard
const unverifiedRatings = [];

for (const d of destinations) {
  if ((d.rating !== undefined || d.reviews !== undefined) && (!d.ratingSource || !d.ratingCheckedAt)) {
    unverifiedRatings.push(`[destination:${d.slug}] has rating (${d.rating}) or reviews (${d.reviews}) without ratingSource/ratingCheckedAt`);
  }
}

if (unverifiedRatings.length > 0) {
  console.error(`\n🚨 FATAL BUILD GUARD ERROR: Found ${unverifiedRatings.length} entries with unverified rating or reviews without ratingSource and ratingCheckedAt:`);
  unverifiedRatings.slice(0, 20).forEach(err => console.error(`  - ${err}`));
  if (unverifiedRatings.length > 20) console.error(`  ... and ${unverifiedRatings.length - 20} more`);
  process.exit(1);
} else {
  console.log(`✓ Build Guard PASSED: All destinations are free from unverified auto-generated ratings.`);
}


// 5. Write generated-counts.json
const generatedCounts = {
  totalDestinations,
  totalDivisions,
  totalDistricts,
  divisionCounts: sortedDivisionCounts,
  categoryGroupCounts,
  generatedAt: new Date().toISOString()
};

const countsOutPath = path.resolve(__dirname, '../src/data/generated-counts.json');
fs.writeFileSync(countsOutPath, JSON.stringify(generatedCounts, null, 2) + '\n');

// 6. Generate slim map-destinations.json if needed
const slimMapDestinations = destinations.map(d => ({
  id: d.id,
  name: d.name,
  name_bn: d.name_bn || d.name,
  ...(Array.isArray(d.alternateNames) && d.alternateNames.length > 0 ? { alternateNames: d.alternateNames } : {}),
  slug: d.slug,
  latitude: d.latitude,
  longitude: d.longitude,
  division: d.division,
  district: d.district,
  category: d.category,
  categories: d.categories || [],
  image: quarantinedSlugs.has(d.slug) ? null : d.image,
  shortDesc: d.shortDesc || "",
  shortDesc_bn: d.shortDesc_bn || ""
}));

const mapOutPath = path.resolve(__dirname, '../public/data/map-destinations.json');
fs.writeFileSync(mapOutPath, JSON.stringify(slimMapDestinations) + '\n');

// 7. Generate compact search-index.json (including alternateNames and Bangla names)
const uniqueDivisions = [];
const uniqueDistricts = [];
const uniqueCategories = [];

const divMap = new Map();
const distMap = new Map();
const catMap = new Map();

destinations.forEach(d => {
  if (d.division && !divMap.has(d.division)) {
    divMap.set(d.division, uniqueDivisions.length);
    uniqueDivisions.push(d.division);
  }
  if (d.district && !distMap.has(d.district)) {
    distMap.set(d.district, uniqueDistricts.length);
    uniqueDistricts.push(d.district);
  }
  if (d.category && !catMap.has(d.category)) {
    catMap.set(d.category, uniqueCategories.length);
    uniqueCategories.push(d.category);
  }
});

const searchItems = destinations.filter(d => !d.needsReview).map(d => {
  const autoSlug = d.name.toLowerCase().replace(/['\.]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const explicitSlug = d.slug !== autoSlug ? d.slug : "";
  const item = [
    explicitSlug,
    d.name,
    d.name_bn || d.name,
    distMap.get(d.district) ?? 0,
    divMap.get(d.division) ?? 0,
    catMap.get(d.category) ?? 0,
  ];
  if (Array.isArray(d.alternateNames) && d.alternateNames.length > 0) {
    item.push(d.alternateNames);
  }
  return item;
});

const searchIndexData = {
  v: uniqueDivisions,
  t: uniqueDistricts,
  c: uniqueCategories,
  i: searchItems,
};

const searchOutPath = path.resolve(__dirname, '../src/data/search-index.json');
const publicSearchOutPath = path.resolve(__dirname, '../public/data/search-index.json');
fs.writeFileSync(searchOutPath, JSON.stringify(searchIndexData) + '\n');
fs.writeFileSync(publicSearchOutPath, JSON.stringify(searchIndexData) + '\n');

const needsReviewSlugs = destinations.filter(d => d.needsReview).map(d => d.slug);
console.log(`[generate-data] Needs review destinations (${needsReviewSlugs.length}): ${needsReviewSlugs.join(', ')}`);
console.log(`[generate-data] Verified and generated build-time constants:`);
console.log(`  - Total Destinations: ${totalDestinations}`);
console.log(`  - Divisions (${totalDivisions}): ${JSON.stringify(sortedDivisionCounts)}`);
console.log(`  - Districts (${totalDistricts}): ${uniqueDistricts.length} districts in search index`);
console.log(`  - Category Groups: ${Object.keys(categoryGroupCounts).length} groups calculated`);
console.log(`  - Written to ${path.relative(process.cwd(), countsOutPath)}, ${path.relative(process.cwd(), mapOutPath)}, and ${path.relative(process.cwd(), searchOutPath)}`);

// 8. Build Guard: Verify all active (non-quarantined) destination images exist in /public
console.log('\n[generate-data] Running Build Guard: Verifying active destination images...');
const missingImages = [];

destinations.forEach(d => {
  if (quarantinedSlugs.has(d.slug)) {
    return; // Quarantined images are safely omitted/moved
  }
  if (!d.image) {
    missingImages.push({ slug: d.slug, error: 'Missing image field' });
    return;
  }
  const cleanPath = d.image.replace(/^\/+/, '');
  const publicPath = path.resolve(__dirname, '../public', cleanPath);
  if (!fs.existsSync(publicPath)) {
    missingImages.push({ slug: d.slug, path: cleanPath });
  }
});

if (missingImages.length > 0) {
  console.error('\n🚨 FATAL BUILD GUARD ERROR: The following active destinations reference missing images in /public:');
  missingImages.forEach(m => {
    console.error(`  - [${m.slug}]: ${m.path || m.error}`);
  });
  console.error(`Total offending slugs: ${missingImages.length}`);
  process.exit(1);
} else {
  console.log(`✓ Build Guard PASSED: All ${destinations.length - quarantinedSlugs.size} active destinations have verified authentic images in /public.`);
}

// 9. Build Guard: Verify all destination slugs referenced across data files & component constants exist in destinations.json or slug-redirects.json
console.log('\n[generate-data] Running Build Guard: Verifying destination slug references across data files and components...');
const redirectsPath = path.resolve(__dirname, '../src/data/slug-redirects.json');
const slugRedirects = fs.existsSync(redirectsPath) ? JSON.parse(fs.readFileSync(redirectsPath, 'utf8')) : {};
const activeSlugs = new Set(destinations.map(d => d.slug));
const redirectSlugs = new Set(Object.keys(slugRedirects));
const slugErrors = [];

// Verify redirect targets exist in active destinations
for (const [oldSlug, newSlug] of Object.entries(slugRedirects)) {
  if (!activeSlugs.has(newSlug)) {
    slugErrors.push(`src/data/slug-redirects.json: target '${newSlug}' (for '${oldSlug}') does not exist in destinations.json`);
  }
  if (activeSlugs.has(oldSlug)) {
    slugErrors.push(`src/data/slug-redirects.json: source '${oldSlug}' is still active in destinations.json`);
  }
}

// Check JSON data files keyed by or containing destination slugs
const jsonFilesToCheck = [
  { file: '../src/data/image-quarantine.json', mode: 'array-slug', allowRedirect: false },
  { file: '../src/data/image-replacement-queue.json', mode: 'array-slug', allowRedirect: false },
  { file: '../src/data/translations.json', mode: 'object-keys', allowRedirect: false },
  { file: '../src/data/translations.pending.json', mode: 'object-keys', allowRedirect: false },
  { file: '../public/data/map-destinations.json', mode: 'array-slug', allowRedirect: false }
];

for (const item of jsonFilesToCheck) {
  const fullPath = path.resolve(__dirname, item.file);
  if (!fs.existsSync(fullPath)) continue;
  const parsed = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
  const slugsToVerify = item.mode === 'object-keys' ? Object.keys(parsed) : parsed.map(x => x.slug);
  for (const s of slugsToVerify) {
    if (!activeSlugs.has(s) && !(item.allowRedirect && redirectSlugs.has(s))) {
      slugErrors.push(`${item.file}: references invalid/retired destination slug '${s}'`);
    }
  }
}

// Scan component constants and pages for `/destinations/<slug>` or `slug: "<slug>"`
const componentFilesToCheck = [
  '../src/components/hero/HeroSection.tsx',
  '../src/components/home/WeekendEscapes.tsx',
  '../src/components/home/FeaturedSection.tsx',
  '../src/components/home/TripFinderQuiz.tsx',
  '../src/app/travel/page.tsx',
  '../src/app/hotels/page.tsx',
  '../src/app/restaurants/page.tsx',
  '../public/data/destinations.js',
  '../public/data/translations.js'
];

for (const relFile of componentFilesToCheck) {
  const fullPath = path.resolve(__dirname, relFile);
  if (!fs.existsSync(fullPath)) continue;
  const content = fs.readFileSync(fullPath, 'utf8');
  // Match /destinations/<slug> links (excluding division or template expressions)
  const linkRegex = /\/destinations\/([a-z0-9-]+)(?=["'`?/#\s])/g;
  let match;
  while ((match = linkRegex.exec(content)) !== null) {
    const slug = match[1];
    if (slug === 'division') continue;
    if (!activeSlugs.has(slug) && !redirectSlugs.has(slug)) {
      slugErrors.push(`${relFile}: references unknown destination URL '/destinations/${slug}'`);
    } else if (redirectSlugs.has(slug)) {
      slugErrors.push(`${relFile}: references merged-away slug '/destinations/${slug}' (should use '${slugRedirects[slug]}')`);
    }
  }
  // Match slug: "<slug>" or "slug": "<slug>"
  const propRegex = /\bslug["']?\s*:\s*["']([a-z0-9-]+)["']/g;
  while ((match = propRegex.exec(content)) !== null) {
    const slug = match[1];
    if (['chattogram', 'sylhet', 'khulna', 'barishal', 'dhaka', 'rajshahi', 'rangpur', 'mymensingh'].includes(slug)) continue;
    if (!activeSlugs.has(slug) && !redirectSlugs.has(slug)) {
      slugErrors.push(`${relFile}: references unknown slug '${slug}'`);
    } else if (redirectSlugs.has(slug)) {
      slugErrors.push(`${relFile}: references merged-away slug '${slug}' (should use '${slugRedirects[slug]}')`);
    }
  }
  // Match I18N_DEST["<slug>"]
  const i18nRegex = /I18N_DEST\[["']([a-z0-9-]+)["']\]/g;
  while ((match = i18nRegex.exec(content)) !== null) {
    const slug = match[1];
    if (!activeSlugs.has(slug)) {
      slugErrors.push(`${relFile}: I18N_DEST references invalid/merged-away slug '${slug}'`);
    }
  }
}

if (slugErrors.length > 0) {
  console.error('\n🚨 FATAL BUILD GUARD ERROR: Invalid or merged-away destination slug references detected:');
  slugErrors.forEach(e => console.error(`  - ${e}`));
  process.exit(1);
} else {
  console.log(`✓ Build Guard PASSED: All destination slugs across data files and component constants are valid (${activeSlugs.size} active, ${redirectSlugs.size} redirects).`);
}

// 10. Build Guard: Verify Wikimedia Commons image attribution and licensing
console.log('\n[generate-data] Running Build Guard: Verifying Commons image attribution and licensing...');
const ALLOWED_LICENSES = new Set([
  'CC0', 'CC0 1.0', 'Public domain',
  'CC BY 2.0', 'CC BY-SA 2.0',
  'CC BY 2.5', 'CC BY-SA 2.5',
  'CC BY 3.0', 'CC BY-SA 3.0',
  'CC BY 4.0', 'CC BY-SA 4.0'
]);

const commonsCreditErrors = [];
let commonsImageCount = 0;

destinations.forEach(d => {
  const isCommonsImage = (d.image && d.image.includes('-commons.webp')) || (d.imageLg && d.imageLg.includes('-commons.webp')) || !!d.imageCredit;
  if (!isCommonsImage) return;

  commonsImageCount++;

  if (!d.imageCredit) {
    commonsCreditErrors.push(`[${d.slug}] uses -commons.webp image but is missing imageCredit metadata`);
    return;
  }

  // Verify imageCredit strings do not contain forbidden artifacts (<, >, redlink, action=edit, http://)
  const FORBIDDEN_STRINGS = ['<', '>', 'redlink', 'action=edit', 'http://'];
  for (const [key, val] of Object.entries(d.imageCredit)) {
    if (typeof val === 'string') {
      for (const forbidden of FORBIDDEN_STRINGS) {
        if (val.includes(forbidden)) {
          commonsCreditErrors.push(`[${d.slug}] imageCredit.${key} contains forbidden string "${forbidden}": "${val}"`);
        }
      }
    }
  }

  const { author, license, licenseUrl, sourceUrl } = d.imageCredit;

  if (!author || author.trim() === '' || author === 'NO AUTHOR') {
    commonsCreditErrors.push(`[${d.slug}] invalid or missing author ('${author}')`);
  }

  if (!license || !ALLOWED_LICENSES.has(license)) {
    commonsCreditErrors.push(`[${d.slug}] disallowed or missing license ('${license}')`);
  }

  if (!sourceUrl || !sourceUrl.startsWith('https://commons.wikimedia.org/wiki/File:')) {
    commonsCreditErrors.push(`[${d.slug}] missing or invalid sourceUrl ('${sourceUrl}')`);
  }

  if (license !== 'Public domain' && (!licenseUrl || !licenseUrl.startsWith('http'))) {
    commonsCreditErrors.push(`[${d.slug}] missing or invalid licenseUrl ('${licenseUrl}')`);
  }

  // Verify file existence in /public
  if (d.image) {
    const cleanPath = d.image.replace(/^\/+/, '');
    const fullPath = path.resolve(__dirname, '../public', cleanPath);
    if (!fs.existsSync(fullPath)) {
      commonsCreditErrors.push(`[${d.slug}] image file does not exist at /public/${cleanPath}`);
    }
  }
});

if (commonsCreditErrors.length > 0) {
  console.error('\n🚨 FATAL BUILD GUARD ERROR: Commons image credit integrity failures:');
  commonsCreditErrors.forEach(err => console.error(`  - ${err}`));
  process.exit(1);
} else {
  console.log(`✓ Build Guard PASSED: All ${commonsImageCount} Wikimedia Commons images have verified credits, valid licenses, and verified files in /public.`);
}
