# Ghuraghuri — Bangladesh Travel Explorer

An interactive travel guide for Bangladesh covering **all 64 districts and 231 destinations**, with an optional **server-side travel-services API** (hotels, restaurants, transport, routes).

- **Frontend:** pure static HTML + vanilla JS + Leaflet + Open-Meteo (no build step).
- **Backend:** optional PHP 8.1+ API under `api/` (works with or without MySQL).
- **i18n:** English ⇄ বাংলা with a language toggle.

---

## Quick start (static frontend)

Open `index.html` in a browser. Everything works offline: destinations, maps, weather (via Open-Meteo) and search.

To run a local static server:

```sh
# Python
python -m http.server 8080

# or PHP (the router forwards /api/* to the PHP API)
php -S localhost:8080 serve.php
```

Then open http://localhost:8080.

> Without the PHP backend running, the Hotels / Restaurants / Transport sections
> automatically show clearly-labelled **local information** instead of failing
> with "Something went wrong". Live results appear as soon as the API is reachable.

## Quick start (with travel services)

The travel-services pages (`hotels.html`, `restaurants.html`, `transport.html`, `travel.html`) and the destination-page panels talk to the PHP API. See **[docs/XAMPP_SETUP.md](docs/XAMPP_SETUP.md)** for a full XAMPP walkthrough. In short:

1. Copy `api/.env.example` → `api/.env` and fill in optional keys (see **[docs/PROVIDERS.md](docs/PROVIDERS.md)**).
2. Serve the project from a PHP web server so `api/index.php` is reachable.
3. Set `API_BASE_URL` in `config.js` (e.g. `http://localhost/ghuraghuri/api`).

> Without any external keys the API still works using the built-in **demo provider** — all demo results are clearly flagged (`demo: true`).

---

## Project layout

```
index.html          Home (hero, divisions, themes, map, weather)
destinations.html   Full destination browser (filters + sort)
destination.html    Destination detail (facts, map, weather, travel services)
hotels.html         Hotel search (via API)
restaurants.html    Restaurant search (via API)
transport.html      Transport options + route estimates (via API)
travel.html         Unified search hub (via API)
weather.html        Live weather across destinations
admin.html          Local admin (browser-only) + provider status

data/               Static data (destinations.js, taxonomy.js, translations.js)
js/                 Frontend logic (store, i18n, map, weather, app, api, travel-*)
css/                Styles (style.css, admin.css)
api/                PHP backend (config, router, providers, services, cache)
database/           MySQL schema + seed
tools/              Node build/export scripts
cache/              File cache (created at runtime, gitignored)
```

---

## Travel services API

The frontend never talks to an external provider directly. Every request goes to our own API (`js/api.js` → `API_BASE_URL`), so **API keys stay server-side**.

```
Ghuraghuri Frontend → /api/… → Service → ProviderInterface → External provider
```

- Hotel / restaurant / location: `GooglePlacesProvider` (active when `GOOGLE_MAPS_API_KEY` is set), else `DemoProvider`.
- Routes: `GoogleRoutesProvider`, else `DemoProvider` (Haversine estimate, clearly labelled `estimate: true`).
- Transport: only demo / configured aggregator — **never invents prices or schedules** (`price: null`, `schedule: []`, `live: false`).

See **[docs/API.md](docs/API.md)** for the full endpoint reference and **[docs/PROVIDERS.md](docs/PROVIDERS.md)** for provider configuration.

---

## Local admin

`admin.html` lets you add, edit, hide and delete destinations. Changes are stored in your browser (`localStorage`) and applied to the live site immediately. The password and role come from `config.js` (`ADMIN_PASSWORD`, `ADMIN_ROLE`). The admin dashboard also shows the live status of travel-service providers.

> The destination admin is frontend-only. Server-side hotel/restaurant admin endpoints exist under `/api/admin/*` and are guarded by `ADMIN_API_TOKEN` (see docs/API.md).

---

## Data & tooling

- **Destination database:** `data/destinations.js` (231 entries). The build script `tools/build-destinations.js` is **not idempotent** — run `git checkout -- data/destinations.js` before rebuilding.
- **Backend dataset:** `node tools/export-places.js` regenerates `api/data/places.json` (8 divisions / 64 districts / 231 destinations) used by the API for autocomplete, geocoding, demo generation and route estimates.
- **Database:** `database/ghuraghuri.sql` (schema + indexes) and `database/seed.sql`; apply via `mysql -u root < database/ghuraghuri.sql`.

---

## License & data sources

- Maps: © OpenStreetMap contributors (Leaflet + OSM tiles)
- Weather: Open-Meteo
- Photos: Unsplash (via photo ids in the data)
- Travel services: official provider APIs only (Google Places / Routes, Booking.com demand API), never scraped.