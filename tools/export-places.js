#!/usr/bin/env node
/**
 * ============================================================================
 *  GHURAGHURI - PLACES DATASET EXPORTER
 *  Reads data/destinations.js + data/taxonomy.js and writes a compact
 *  api/data/places.json used by the PHP backend for:
 *    - location autocomplete (EN + BN)
 *    - resolving a destination/district to coordinates
 *    - demo hotel/restaurant/transport/route generation
 *    - route distance estimates
 *  Run:  node tools/export-places.js
 *  ============================================================================
 */
"use strict";

const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const DEST_FILE = path.join(ROOT, "data", "destinations.js");
const TAX_FILE = path.join(ROOT, "data", "taxonomy.js");
const OUT_FILE = path.join(ROOT, "api", "data", "places.json");

function load(jsFile) {
  const src = fs.readFileSync(jsFile, "utf8");
  const w = { u: () => "", localStorage: { getItem: () => null, setItem: () => {} } };
  const wrapped = new Function(
    "window",
    src + "\nreturn { DESTINATIONS: (typeof DESTINATIONS !== 'undefined') ? DESTINATIONS : null, TAXONOMY: window.TAXONOMY || null };"
  );
  return wrapped(w);
}

function main() {
  const dest = load(DEST_FILE);
  const tax = load(TAX_FILE);

  const DESTINATIONS = dest.DESTINATIONS || [];
  const TAXONOMY = tax.TAXONOMY;

  const destinations = DESTINATIONS.map((d) => ({
    slug: d.slug,
    name: d.name,
    name_bn: d.name_bn || "",
    division: d.division,
    district: d.district,
    lat: Number(d.latitude),
    lng: Number(d.longitude),
    categories: d.categories || [d.category].filter(Boolean),
  }));

  // District centroids from their destinations.
  const byDistrict = {};
  destinations.forEach((d) => {
    if (!byDistrict[d.district]) byDistrict[d.district] = [];
    byDistrict[d.district].push(d);
  });

  const districts = [];
  if (TAXONOMY && TAXONOMY.DISTRICTS) {
    TAXONOMY.DISTRICTS.forEach((dist) => {
      const list = byDistrict[dist.name] || [];
      const lat = list.length ? avg(list, (d) => d.lat) : 23.685;
      const lng = list.length ? avg(list, (d) => d.lng) : 90.3563;
      const div = TAXONOMY.divisionOfDistrict ? TAXONOMY.divisionOfDistrict(dist.name) : null;
      districts.push({
        name: dist.name,
        name_bn: dist.name_bn || "",
        division: div ? div.name : "",
        lat: round(lat, 4),
        lng: round(lng, 4),
      });
    });
  }

  // Division centroids from districts.
  const byDivision = {};
  districts.forEach((d) => {
    if (!d.division) return;
    if (!byDivision[d.division]) byDivision[d.division] = [];
    byDivision[d.division].push(d);
  });
  const divisions = Object.keys(byDivision).map((name) => {
    const list = byDivision[name];
    return {
      name,
      name_bn: "",
      lat: round(avg(list, (d) => d.lat), 4),
      lng: round(avg(list, (d) => d.lng), 4),
    };
  });

  const out = { divisions, districts, destinations };
  fs.mkdirSync(path.dirname(OUT_FILE), { recursive: true });
  fs.writeFileSync(OUT_FILE, JSON.stringify(out, null, 1), "utf8");
  console.log(
    `places.json written: ${divisions.length} divisions, ${districts.length} districts, ${destinations.length} destinations`
  );
}

function avg(list, fn) {
  return list.reduce((s, x) => s + fn(x), 0) / list.length;
}
function round(n, p) {
  const f = Math.pow(10, p);
  return Math.round(n * f) / f;
}

main();