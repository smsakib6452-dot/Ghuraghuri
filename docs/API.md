# API Reference

The API is a PHP front controller at `api/index.php`. All responses are JSON (`application/json; charset=utf-8`). Set the base URL in `config.js` (`API_BASE_URL`); the frontend client is `js/api.js`.

Base path examples assume `API_BASE_URL = http://localhost/ghuraghuri/api`.

---

## Conventions

- **Errors** use a non-2xx status with `{ "error": { "code": "...", "message": "..." } }`. Technical details are only surfaced when `APP_DEBUG=true`.
- **Pagination** params: `page` (1-based) and `limit` (clamped per endpoint). Responses include `total` and `items`.
- **Demo** responses are flagged `"demo": true`; transport demo also returns `"live": false`.
- **Rate limiting**: 120 requests/min per IP by default (`RATE_LIMIT_ENABLED`, `RATE_LIMIT_PER_MINUTE`). Exceeding it returns `429`.
- Caching: POI responses are cached (file cache by default; MySQL cache if DB configured). `CACHE_TTL_SECONDS` controls lifetime.

---

## Public endpoints

### `GET /health`

Liveness check.

```json
{ "ok": true, "service": "ghuraghuri-api", "time": "2026-08-16T16:46:27+00:00" }
```

### `GET /providers/status`

Which providers are configured (booleans only — never keys).

```json
{ "providers": [
  { "provider": "google_places", "configured": false, "status": "not_configured" },
  { "provider": "demo", "configured": true, "status": "connected" }
] }
```

### `GET /locations/autocomplete`

Search destinations/places (English + Bangla).

| Param | Description |
| --- | --- |
| `q` | Query string (required) |
| `limit` | Max results (1–15, default 10) |

```json
{ "items": [ { "name": "Cox's Bazar", "name_bn": "কক্সবাজার", "type": "district", "district": "Cox's Bazar", "division": "Chattogram", "lat": 21.4272, "lng": 92.0058 } ] }
```

### `GET /hotels/search`

| Param | Description |
| --- | --- |
| `destination` | Place name (e.g. `Cox's Bazar`) |
| `latitude` / `longitude` | Use coordinates instead of a name |
| `check_in` / `check_out` | Dates `YYYY-MM-DD` (optional) |
| `adults` / `rooms` | Party size (optional) |
| `rating` | Minimum rating (e.g. `4.0`) |
| `max_price` | Maximum price in BDT (optional) |
| `hotel_type` | `hotel` / `resort` / `guesthouse` (optional) |
| `page` / `limit` | Pagination (limit ≤ 24) |

Response items: `id, provider, name, address, district, division, latitude, longitude, rating, review_count, price, currency, image, images, amenities, availability, demo`.

### `GET /hotels/{id}`

Full details for one hotel.

### `GET /restaurants/search`

| Param | Description |
| --- | --- |
| `destination` | Place name |
| `latitude` / `longitude` | Use coordinates instead of a name |
| `cuisine` | e.g. `Bangladeshi`, `Seafood` |
| `price_level` | `1`–`3` |
| `rating` | Minimum rating |
| `open_now` | `true` to filter open places |
| `page` / `limit` | Pagination (limit ≤ 24) |

### `GET /restaurants/nearby`

Nearest restaurants to a point (used on destination pages).

| Param | Description |
| --- | --- |
| `latitude` | Required |
| `longitude` | Required |
| `radius` | Search radius in meters (optional) |
| `limit` | Max results (≤ 12) |

### `GET /restaurants/{id}`

Full details for one restaurant.

### `GET /transport/search`

Transport options between two places. **No invented pricing or schedules** — live providers are not configured, so this returns typical travel modes with `"live": false`.

| Param | Description |
| --- | --- |
| `from` | Origin (e.g. `Dhaka`) |
| `to` | Destination (e.g. `Cox's Bazar`) |
| `departure_date` | `YYYY-MM-DD` (optional) |
| `transport_type` | `bus` / `train` / `flight` / `ferry` / `car` / `taxi` (optional; omitted = all) |
| `passengers` | Number of passengers (optional) |

```json
{ "provider": "demo", "demo": true, "live": false,
  "message": "Live transport data is currently unavailable. Showing typical travel modes for guidance.",
  "items": [ { "id": "demo:transport:bus:...", "transport_type": "bus", "from": "Dhaka", "to": "Cox's Bazar",
               "typical_duration_minutes": 312, "price": null, "schedule": [], "live": false, "demo": true } ],
  "total": 3 }
```

### `GET /routes`

Point-to-point route. Returns a **distance/time estimate** (`"estimate": true`) unless Google Routes is configured.

| Param | Description |
| --- | --- |
| `origin` | e.g. `Dhaka` |
| `destination` | e.g. `Cox's Bazar` |
| `travel_mode` | `driving` (default), `flying`, `walking`, `cycling` |
| `origin_lat` / `origin_lng` / `destination_lat` / `destination_lng` | Optional explicit coordinates |

```json
{ "origin": "Dhaka", "destination": "Cox's Bazar", "distance_km": 399.5,
  "duration_minutes": 436, "estimate": true, "travel_mode": "driving",
  "note": "Estimated route (Haversine + road factor). Connect Google Routes for live directions." }
```

---

## Admin endpoints

Guarded by the `X-Admin-Token` header, which must equal `ADMIN_API_TOKEN` from `api/.env`. If the token is unset or still the placeholder, they return `503 admin_api_not_configured`.

### `POST /admin/hotels/upsert`

Upsert a hotel into MySQL (`hotels` table). Payload keys: `name, provider_id, provider, latitude, longitude, rating, review_count, featured_image, status, featured, address, district, division, amenities, price, currency, phone, website, booking_url`. Requires MySQL (`database/ghuraghuri.sql`). Returns `{ "ok": true, "id": ... }` or a graceful note when the DB is unavailable.

### `POST /admin/restaurants/upsert`

Same shape, targeting the `restaurants` table. Payload keys: `name, provider_id, provider, latitude, longitude, rating, review_count, price_level, featured_image, status, featured, address, cuisine, phone, website, google_maps_url`.

### `POST /admin/places/toggle`

Toggle local place metadata (featured/hidden) in MySQL. Payload: `place_id`, optional `featured` (bool), optional `hidden` (bool). No-op success when the DB is off.

### `POST /admin/providers/config`

Update provider config in the `provider_mappings` table. Payload: `provider`, `field`, `value`.

---

## Frontend client

`js/api.js` exposes `window.API`:

```js
API.health()
API.providers()
API.autocomplete(q, limit)
API.hotels.search(params) / API.hotels.details(id)
API.restaurants.search(params) / API.restaurants.nearby(params) / API.restaurants.details(id)
API.transport.search(params)
API.routes.route(params)
```

Every method returns a promise resolving to `{ ok, status, data, error }` and never throws. When `API_BASE_URL` is empty, calls resolve to `{ ok:false, error:{ code:"api_not_configured" } }` so pages can show a friendly state.

## Testing locally (XAMPP PHP)

```bat
C:\xampp\php\php.exe -S localhost:8000 -t C:\path\to\project C:\path\to\project\api\index.php
```

```bat
curl "http://localhost:8000/api/hotels/search?destination=Cox%27s%20Bazar"
```