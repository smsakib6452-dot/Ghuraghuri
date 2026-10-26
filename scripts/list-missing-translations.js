const fs = require('fs');
const path = require('path');

const destinationsPath = path.join(__dirname, '..', 'src', 'data', 'destinations.json');
const translationsPath = path.join(__dirname, '..', 'src', 'data', 'translations.json');
const outputPath = path.join(__dirname, 'missing-translations.json');

const destinations = JSON.parse(fs.readFileSync(destinationsPath, 'utf8'));
const translations = JSON.parse(fs.readFileSync(translationsPath, 'utf8'));

const missingSlugs = destinations
  .filter(d => !translations[d.slug])
  .map(d => d.slug);

fs.writeFileSync(outputPath, JSON.stringify(missingSlugs, null, 2), 'utf8');

console.log(`Total destinations: ${destinations.length}`);
console.log(`Translated destinations: ${Object.keys(translations).length}`);
console.log(`Missing translations count: ${missingSlugs.length}`);
console.log(`Saved missing slugs list to: ${outputPath}`);
