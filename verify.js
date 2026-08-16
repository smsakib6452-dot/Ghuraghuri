const fs = require('fs');
const content = fs.readFileSync('data/destinations.js', 'utf8');
const destinations = ['Sajek Valley', 'Bandarban', 'Rangamati', 'Sylhet', 'Srimangal', 'Sundarbans', 'Saint Martin', 'Kuakata', 'Jaflong', 'Ratargul', 'Sonargaon', 'Kaptai Lake', 'Inani Beach'];
destinations.forEach(name => {
  const idx = content.indexOf('name: ' + JSON.stringify(name));
  if (idx !== -1) {
    const snippet = content.substring(idx, idx + 300);
    const imgMatch = snippet.match(/image: u\(['"]([^'"]+)['"]/);
    console.log(name + ': ' + (imgMatch ? imgMatch[1] : 'NOT FOUND'));
  } else {
    console.log(name + ': NOT FOUND IN FILE');
  }
});