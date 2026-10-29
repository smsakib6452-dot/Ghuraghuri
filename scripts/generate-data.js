const fs = require('fs');
const path = require('path');

const destinationsPath = path.resolve(__dirname, '../src/data/destinations.json');
if (!fs.existsSync(destinationsPath)) {
  console.error(`FATAL: destinations.json not found at ${destinationsPath}`);
  process.exit(1);
}

const destinations = JSON.parse(fs.readFileSync(destinationsPath, 'utf8'));

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
  const cats = [d.category, ...(d.categories || [])];
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

if (totalDistricts > 64) {
  console.error(`\n[FATAL BUILD ERROR] Found ${totalDistricts} districts (expected <= 64):`, Array.from(districtsSet));
  process.exit(1);
}

if (totalDestinations <= 0) {
  console.error(`\n[FATAL BUILD ERROR] destinations.json contains 0 destinations!`);
  process.exit(1);
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
  slug: d.slug,
  latitude: d.latitude,
  longitude: d.longitude,
  division: d.division,
  district: d.district,
  category: d.category,
  categories: d.categories || [],
  image: d.image,
  shortDesc: d.shortDesc || "",
  shortDesc_bn: d.shortDesc_bn || ""
}));

const mapOutPath = path.resolve(__dirname, '../public/data/map-destinations.json');
fs.writeFileSync(mapOutPath, JSON.stringify(slimMapDestinations) + '\n');

// 7. Generate compact search-index.json
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

const searchItems = destinations.map(d => {
  const autoSlug = d.name.toLowerCase().replace(/['\.]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const explicitSlug = d.slug !== autoSlug ? d.slug : "";
  return [
    explicitSlug,
    d.name,
    d.name_bn || d.name,
    distMap.get(d.district) ?? 0,
    divMap.get(d.division) ?? 0,
    catMap.get(d.category) ?? 0,
  ];
});

const searchIndexData = {
  v: uniqueDivisions,
  t: uniqueDistricts,
  c: uniqueCategories,
  i: searchItems,
};

const searchOutPath = path.resolve(__dirname, '../src/data/search-index.json');
fs.writeFileSync(searchOutPath, JSON.stringify(searchIndexData) + '\n');

console.log(`[generate-data] Verified and generated build-time constants:`);
console.log(`  - Total Destinations: ${totalDestinations}`);
console.log(`  - Divisions (${totalDivisions}): ${JSON.stringify(sortedDivisionCounts)}`);
console.log(`  - Districts (${totalDistricts}): ${uniqueDistricts.length} districts in search index`);
console.log(`  - Category Groups: ${Object.keys(categoryGroupCounts).length} groups calculated`);
console.log(`  - Written to ${path.relative(process.cwd(), countsOutPath)}, ${path.relative(process.cwd(), mapOutPath)}, and ${path.relative(process.cwd(), searchOutPath)}`);

