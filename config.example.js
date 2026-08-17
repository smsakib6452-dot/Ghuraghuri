/**
 * ============================================================================
 *  BANGLADESH TRAVEL EXPLORER - CONFIG TEMPLATE (SAFE TO SHARE)
 * ============================================================================
 *
 *  IMPORTANT:
 *  Never commit config.js containing a private API key to a public GitHub
 *  repository. This file (config.example.js) is the SAFE template you push
 *  to GitHub.
 *
 *  HOW TO SET UP LOCALLY:
 *  1. Copy this file to config.js
 *  2. Paste your weather API key into WEATHER_API_KEY below
 *  3. Serve the site via XAMPP (http://localhost/bangladesh-travel-explorer)
 *     or any static server. No build step needed.
 * ============================================================================
 */

const CONFIG = {
    /* Weather provider. Supported values:
     *   "tomorrowio"  - Tomorrow.io v4 (requires an API key)
     *   "openmeteo"   - Open-Meteo (free, NO API key required)
     */
    WEATHER_PROVIDER: "openmeteo",

    /* Tomorrow.io API key - paste your key here. */
    WEATHER_API_KEY: "YOUR_API_KEY_HERE",

    /* Units: "metric" (Celsius) or "imperial" (Fahrenheit) */
    WEATHER_UNITS: "metric",

    /* If the primary provider fails, fall back to Open-Meteo (free, keyless). */
    WEATHER_FALLBACK: true,

    /* Cache weather responses for this many minutes to reduce API calls */
    WEATHER_CACHE_MINUTES: 10,

    /* Leaflet / OpenStreetMap tile server */
    MAP_TILE_URL: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
    MAP_ATTRIBUTION:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',

    /* Base URL used to build "Open in Google Maps" links */
    GOOGLE_MAPS_SEARCH: "https://www.google.com/maps/search/?api=1&query=",
    GOOGLE_MAPS_DIR: "https://www.google.com/maps/dir/?api=1&origin=",

    /* Travel-services API (Hotels / Restaurants / Transport / Routes).
       Served by the PHP backend under api/ (see api/.env.example for the
       server-side keys). Leave "" to auto-detect the "api" folder next to
       the current page (works under XAMPP, the PHP built-in server, or any
       folder/port). Set an absolute URL to override. */
    API_BASE_URL: "",

    /* Admin panel. Client-side only gate (demo security) — change this
     * password before publishing. Set ADMIN_ENABLED=false to disable. */
    ADMIN_ENABLED: true,
    ADMIN_PASSWORD: "ghuraghuri-admin"
};
