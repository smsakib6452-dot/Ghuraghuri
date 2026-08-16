/* ============================================================================
   BANGLADESH TRAVEL EXPLORER - DEFAULT CONFIGURATION
   Loaded BEFORE config.js. Defines window.CONFIG so the site still works
   when config.js is absent (e.g. on GitHub Pages where it is gitignored).
   If config.js exists, its `const CONFIG` shadows this fallback.
   ============================================================================ */

window.CONFIG = {
    WEATHER_PROVIDER: "openmeteo",
    WEATHER_API_KEY: "",
    WEATHER_UNITS: "metric",
    WEATHER_FALLBACK: true,
    WEATHER_CACHE_MINUTES: 10,

    MAP_TILE_URL: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
    MAP_ATTRIBUTION:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',

    GOOGLE_MAPS_SEARCH: "https://www.google.com/maps/search/?api=1&query=",
    GOOGLE_MAPS_DIR: "https://www.google.com/maps/dir/?api=1&origin=",

    /* Admin panel. Client-side only gate (demo security) — change the
       password before publishing. Set ADMIN_ENABLED=false to disable. */
    ADMIN_ENABLED: true,
    ADMIN_PASSWORD: "ghuraghuri-admin"
};