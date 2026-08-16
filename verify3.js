const fs = require('fs');
const content = fs.readFileSync('data/destinations.js', 'utf8');

const names = [
  "Saint Martin's Island",
  "Ratargul Swamp Forest",
  "Jaflong"
];

names.forEach(name => {
  const idx = content.indexOf('name: ' + JSON.stringify(name));
  if (idx !== -1) {
    const snippet = content.substring(idx, idx + 500);
    const imgMatch = snippet.match(/image: u\(['"]([^'"]+)['"]/);
    console.log(name + ': ' + (imgMatch ? imgMatch[1] : 'NOT FOUND'));
  } else {
    console.log(name + ': NOT FOUND IN FILE');
  }
});