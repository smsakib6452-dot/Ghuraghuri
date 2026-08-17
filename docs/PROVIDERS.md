# Providers

The API routes every request through a small provider layer:

```
Frontend → /api/… → Service → ProviderRegistry → ProviderInterface → External provider
```

The **frontend never holds or sends provider keys**. All keys live in `api/.env` (gitignored).

## Provider registry

| Capability | Configured provider | Fallback |
| --- | --- | --- |
| Hotels | `GooglePlacesProvider` | `DemoProvider` |
| Restaurants | `GooglePlacesProvider` | `DemoProvider` |
| Location autocomplete / geocoding | `GooglePlacesProvider` | `DemoProvider` (from `api/data/places.json`) |
| Routes | `GoogleRoutesProvider` | `DemoProvider` (Haversine + road factor, labelled `estimate: true`) |
| Transport | *(none until a transport aggregator is wired)* | `DemoProvider` — returns typical travel modes only, **no invented prices or schedules** |
| Booking | `BookingProvider` (stub — reports `NOT CONFIGURED` until credentials) | — |

Check the live status at `GET /api/providers/status` (no secrets are ever returned).

## Demo provider

`DemoProvider` always works. It is used whenever a real provider is missing, and every demo result is clearly flagged:

```json
{ "provider": "demo", "demo": true, "message": "Showing sample hotel data (demo). ..." }
```

Transport demo results **never** invent pricing or schedules:

```json
{ "transport_type": "bus", "price": null, "schedule": [], "live": false, "note": "Typical duration estimate only (demo)." }
```

Route estimates are explicitly labelled:

```json
{ "distance_km": 399.5, "duration_minutes": 436, "estimate": true, "travel_mode": "driving" }
```

## Google Places API (New)

Used for hotels, restaurants and location autocomplete.

1. Enable the **Places API (New)** in Google Cloud Console.
2. Put your key in `api/.env`:

```
GOOGLE_MAPS_API_KEY=AIza...
```

3. Optional: tune `GOOGLE_PLACES_FIELDS` in `api/.env` to control the data you ask for (and quota usage).

Google Places handles the three relevant search methods:
- `searchText` for hotels / restaurants near a destination or coordinates.
- `nearbySearch` for nearby restaurants (used by `GET /api/restaurants/nearby`).
- `autocomplete` for the location dropdown.

> **Do not** scrape Google Maps / Booking / Expedia. Use their official APIs only.

## Google Routes API

Enables real driving distances and durations.

1. Enable the **Routes API**.
2. Add to `api/.env`:

```
ROUTES_API_KEY=AIza...
```

Requests are sent to `https://routes.googleapis.com/directions/v2:computeRoutes` with `travelMode=DRIVE`. Without a key the API falls back to a Haversine estimate labelled `estimate: true`.

## Booking.com Demand API

Optional. The `BookingProvider` is a structured stub that reports `NOT CONFIGURED` until real credentials exist (`BOOKING_API_KEY`, `BOOKING_AFFILIATE_ID`). This keeps a clean seam for adding live hotel availability later.

## No transport aggregator configured yet

Transport lives in the demo provider (typical modes + durations only). To add a live provider:

1. Implement `Ghuraghuri\Api\Contracts\TransportProviderInterface`.
2. Register it in `Ghuraghuri\Api\Services\ProviderRegistry::transports()`.
3. Gate it on the `TRANSPORT_API_KEY` / `TRANSPORT_API_URL` env vars (already in `api/.env.example`).

## Security notes

- `api/.env` is gitignored (`config.js`, `.env`, `.env.*` are ignored; `!.env.example` keeps the safe template tracked).
- `GET /api/providers/status` reports only `configured` booleans — never keys.
- Admin write endpoints require `X-Admin-Token` matching `ADMIN_API_TOKEN`.
- Rate limiting (default 120 req/min per IP) is enforced by `RateLimiter`; disable via `RATE_LIMIT_ENABLED=false`.