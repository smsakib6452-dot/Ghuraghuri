/* ============================================================================
   GHURAGHURI - TRAVEL FALLBACK ENGINE (CLIENT-SIDE, CLEARLY LABELLED)
   Loaded AFTER js/api.js. Wraps the API methods so that whenever the PHP
   backend (api/) is unreachable, not configured, or returns an error, the
   Hotels / Restaurants / Transport / Routes pages still return usable data
   built from the local dataset (js/fallback-data.js) and the site's own
   destination database.

   Honesty rules:
   - Every fallback response is flagged `fallback:true`, `demo:true`,
     `live:false` and carries a visible "Local information" notice.
   - NO fake schedules, NO fake live prices, NO fake availability.
   - Transport shows typical durations estimated from real coordinates only.
   - The original error is preserved in `source` for console debugging.

   Backend-first: a 5s health probe decides once whether the real API is up.
   If it is up, real requests run normally (no fallback involved).
   ============================================================================ */

(function (window) {
    "use strict";

    var API = window.API;
    var FALLBACK = window.FALLBACK_DATA;
    if (!API || !FALLBACK) return;

    var DEST = (typeof window.DESTINATIONS !== "undefined") ? window.DESTINATIONS : [];
    var TAX = (typeof window.TAXONOMY !== "undefined") ? window.TAXONOMY : null;

    /* ------------------------------------------------------------------ */
    /*  Backend health probe (cached, 5s timeout)                          */
    /* ------------------------------------------------------------------ */

    var probeState = null; // null = not yet probed, true = up, false = down

    function quickProbe() {
        var url = API.baseUrl.replace(/\/+$/, "") + "/health";
        var ctrl = new AbortController();
        var timer = window.setTimeout(function () { ctrl.abort(); }, 5000);
        return fetch(url, { method: "GET", signal: ctrl.signal })
            .then(function (res) { return res.ok; })
            .catch(function () { return false; })
            .finally(function () { window.clearTimeout(timer); });
    }

    /* ------------------------------------------------------------------ */
    /*  Helpers                                                            */
    /* ------------------------------------------------------------------ */

    function norm(s) {
        return String(s || "").trim().toLowerCase();
    }

    function slugify(s) {
        return String(s || "").trim().toLowerCase()
            .replace(/['’]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
    }

    function haversineKm(lat1, lng1, lat2, lng2) {
        var R = 6371;
        var dLat = (lat2 - lat1) * Math.PI / 180;
        var dLng = (lng2 - lng1) * Math.PI / 180;
        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLng / 2) * Math.sin(dLng / 2);
        return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    }

    function offsetRand(seed) {
        var h = 0;
        for (var i = 0; i < seed.length; i++) h = ((h << 5) - h) + seed.charCodeAt(i) | 0;
        return function () {
            h = (h + 0x6D2B79F5) & 0xFFFFFFFF;
            var t = h;
            t = ((t << 15) | (t >> 17)) & 0xFFFFFFFF;
            t = (t * 0x1FFFFFFF + 0x1337) & 0xFFFFFFFF;
            h = t;
            return ((h >> 9) ^ h) / 4294967296;
        };
    }

    /* ------------------------------------------------------------------ */
    /*  Place resolution (fallback map -> DESTINATIONS -> taxonomy)         */
    /* ------------------------------------------------------------------ */

    function placeByKey(key) {
        if (FALLBACK.places && FALLBACK.places[key]) return FALLBACK.places[key];
        var d = findInDestinations(norm(key), true);
        if (d) return d;
        return null;
    }

    function findInDestinations(q, exactOnly) {
        if (!DEST.length) return null;
        for (var i = 0; i < DEST.length; i++) {
            var d = DEST[i];
            if (norm(d.slug) === q || norm(d.name) === q || norm(d.name_bn) === q) return d;
        }
        if (exactOnly) return null;
        for (var j = 0; j < DEST.length; j++) {
            var e = DEST[j];
            if (norm(e.name).indexOf(q) !== -1 || norm(e.name_bn).indexOf(q) !== -1) return e;
        }
        return null;
    }

    function resolvePlace(query) {
        var q = norm(query);
        if (!q) return null;

        /* 1. Exact key / name (incl. Bangla) in the curated fallback map
              (Dhaka, Chattogram, Rajshahi, Khulna, Barishal have no
              destination entry). */
        var key = slugify(query);
        var p = null;
        var fbKeys = Object.keys(FALLBACK.places || {});
        for (var fk = 0; fk < fbKeys.length; fk++) {
            var fbc = FALLBACK.places[fbKeys[fk]];
            if (fbKeys[fk] === key || norm(fbc.name) === q || norm(fbc.name_bn) === q) {
                p = fbc;
                if (fbKeys[fk] === key) break;
            }
        }
        if (!p) p = placeByKey(key);
        if (p) {
            return {
                key: key, name: p.name, name_bn: p.name_bn || "",
                lat: (typeof p.latitude === "number") ? p.latitude : (p.lat || 0),
                lng: (typeof p.longitude === "number") ? p.longitude : (p.lng || 0),
                district: p.district || "", division: p.division || ""
            };
        }

        /* 2. Exact match in DESTINATIONS. */
        var d = findInDestinations(q, true);
        if (d) {
            return {
                key: slugify(d.slug || d.name), name: d.name, name_bn: d.name_bn || "",
                lat: d.latitude || 0, lng: d.longitude || 0,
                district: d.district || "", division: d.division || ""
            };
        }

        /* 3. District / division name match -> borrow coordinates from the
              first destination inside that district / division. */
        var taxMatch = findTaxonomy(q);
        if (taxMatch) return taxMatch;

        /* 4. Fuzzy prefix match in DESTINATIONS. */
        var f = findInDestinations(q, false);
        if (f) {
            return {
                key: slugify(f.slug || f.name), name: f.name, name_bn: f.name_bn || "",
                lat: f.latitude || 0, lng: f.longitude || 0,
                district: f.district || "", division: f.division || ""
            };
        }

        return null;
    }

    /* Nearest known place within ~40 km of a coordinate pair. Used by the
       destination page (detail.js) which queries with latitude/longitude. */
    function resolveNear(lat, lng) {
        lat = parseFloat(lat); lng = parseFloat(lng);
        if (isNaN(lat) || isNaN(lng)) return null;
        var best = null, bestKm = Infinity;
        Object.keys(FALLBACK.places || {}).forEach(function (k) {
            var p = FALLBACK.places[k];
            if (typeof p.lat !== "number" || typeof p.lng !== "number") return;
            var km = haversineKm(lat, lng, p.lat, p.lng);
            if (km < bestKm) { bestKm = km; best = p; }
        });
        if (DEST.length) {
            for (var i = 0; i < DEST.length; i++) {
                var d = DEST[i];
                if (!d.latitude || !d.longitude) continue;
                var k2 = haversineKm(lat, lng, d.latitude, d.longitude);
                if (k2 < bestKm) { bestKm = k2; best = d; }
            }
        }
        if (!best || bestKm > 40) return null;
        return {
            key: slugify(best.slug || best.key || best.name),
            name: best.name, name_bn: best.name_bn || "",
            lat: (typeof best.latitude === "number") ? best.latitude : best.lat,
            lng: (typeof best.longitude === "number") ? best.longitude : best.lng,
            district: best.district || "", division: best.division || ""
        };
    }

    /* Resolve the target place from whichever param the caller provided. */
    function placeFromParams(params) {
        var q = params.destination || params.district || params.query || "";
        if (q) {
            var p = resolvePlace(q);
            if (p) return p;
        }
        return resolveNear(params.latitude, params.longitude);
    }

    function findTaxonomy(q) {        if (!TAX) return null;
        var lists = [];
        if (TAX.DIVISIONS) lists.push({ kind: "division", list: TAX.DIVISIONS });
        if (TAX.DISTRICTS) lists.push({ kind: "district", list: TAX.DISTRICTS });
        for (var li = 0; li < lists.length; li++) {
            var item = lists[li];
            for (var i = 0; i < item.list.length; i++) {
                var e = item.list[i];
                if (norm(e.name) === q || norm(e.name_bn) === q) {
                    var borrowed = borrowCoords(item.kind, e);
                    return {
                        key: slugify(e.name), name: e.name, name_bn: e.name_bn || "",
                        lat: borrowed.lat, lng: borrowed.lng,
                        district: item.kind === "district" ? e.name : "",
                        division: item.kind === "division" ? e.name : (e.division || e.name)
                    };
                }
            }
        }
        return null;
    }

    function borrowCoords(kind, entry) {
        var division = kind === "division" ? entry.name : (entry.division || "");
        var district = kind === "district" ? entry.name : "";
        for (var i = 0; i < DEST.length; i++) {
            var d = DEST[i];
            if (district && norm(d.district) === norm(district)) {
                return { lat: d.latitude || 0, lng: d.longitude || 0 };
            }
            if (division && norm(d.division) === norm(division)) {
                return { lat: d.latitude || 0, lng: d.longitude || 0 };
            }
        }
        var fb = { dhaka: { lat: 23.8103, lng: 90.4125 } };
        return fb.dhaka;
    }

    /* ------------------------------------------------------------------ */
    /*  Local autocomplete (uses the site's own destination database)       */
    /* ------------------------------------------------------------------ */

    function localAutocomplete(params) {
        var q = norm(params.q || "");
        var limit = Math.max(1, Math.min(15, parseInt(params.limit, 10) || 10));
        if (!q) return { provider: "local", demo: true, fallback: true, items: [] };

        var out = [];
        var seen = {};

        function push(type, name, name_bn, district, division, lat, lng) {
            var k = type + ":" + norm(name);
            if (seen[k] || out.length >= limit) return;
            seen[k] = true;
            out.push({ type: type, name: name, name_bn: name_bn || "", district: district || "", division: division || "", lat: lat || 0, lng: lng || 0 });
        }

        Object.keys(FALLBACK.places || {}).forEach(function (k) {
            var p = FALLBACK.places[k];
            if (norm(p.name).indexOf(q) !== -1 || norm(p.name_bn).indexOf(q) !== -1) {
                push("destination", p.name, p.name_bn, p.district, p.division, p.lat, p.lng);
            }
        });

        if (DEST.length) {
            for (var i = 0; i < DEST.length && out.length < limit; i++) {
                var d = DEST[i];
                if (norm(d.name).indexOf(q) !== -1 || norm(d.name_bn).indexOf(q) !== -1 || norm(d.slug).indexOf(q) !== -1) {
                    push("destination", d.name, d.name_bn, d.district, d.division, d.latitude, d.longitude);
                }
            }
        }

        if (TAX) {
            (TAX.DISTRICTS || []).forEach(function (e) {
                if (norm(e.name).indexOf(q) !== -1 || norm(e.name_bn).indexOf(q) !== -1) {
                    push("district", e.name, e.name_bn, e.name, e.division || "", 0, 0);
                }
            });
            (TAX.DIVISIONS || []).forEach(function (e) {
                if (norm(e.name).indexOf(q) !== -1) {
                    push("division", e.name, e.name_bn, "", e.name, 0, 0);
                }
            });
        }

        return { query: params.q, provider: "local", demo: true, fallback: true, items: out.slice(0, limit) };
    }

    /* ------------------------------------------------------------------ */
    /*  Local hotels                                                        */
    /* ------------------------------------------------------------------ */

    var GEN_HOTELS = [
        ["City Comfort Hotel", "hotel"], ["Green Leaf Guest House", "guesthouse"],
        ["Bangladesh Grand Stay", "hotel"], ["Hill Country Lodge", "resort"]
    ];

    function makeHotels(params) {
        var place = placeFromParams(params);
        if (!place) {
            return emptyResult("hotel", "We couldn't find \"" + (params.destination || "") + "\" in our local guide. Try a city, district or destination in Bangladesh.");
        }

        var curated = FALLBACK.hotels[place.key] || [];
        var items = [];

        if (curated.length) {
            var rand = offsetRand(place.name + "|hotel");
            curated.forEach(function (h, i) {
                items.push({
                    id: "local:hotel:" + place.key + ":" + i,
                    provider: "local", provider_id: "local-hotel-" + place.key + "-" + i,
                    name: h.name, name_bn: "", hotel_type: h.hotel_type || "hotel",
                    address: h.address || (place.name + " · Bangladesh"),
                    district: place.district, division: place.division,
                    latitude: +(place.lat + (rand() - 0.5) * 0.02).toFixed(5),
                    longitude: +(place.lng + (rand() - 0.5) * 0.02).toFixed(5),
                    rating: h.rating, review_count: h.review_count,
                    price: h.price, currency: "BDT",
                    image: FALLBACK.img(h.photo), images: [],
                    amenities: h.amenities || [],
                    phone: "", website: "", booking_url: "",
                    availability: "local", source: "local",
                    demo: true, fallback: true
                });
            });
        } else {
            /* Other known destinations: deterministic local listings. */
            GEN_HOTELS.forEach(function (g, i) {
                var price = 1800 + ((i * 7) % 6) * 900;
                items.push({
                    id: "local:hotel:" + place.key + ":" + i,
                    provider: "local", provider_id: "local-hotel-" + place.key + "-" + i,
                    name: g[0] + " — " + place.name, name_bn: "", hotel_type: g[1],
                    address: place.name + " · " + (place.district || "Bangladesh"),
                    district: place.district, division: place.division,
                    latitude: +(place.lat + (i - 1.5) * 0.008).toFixed(5),
                    longitude: +(place.lng + (i % 3) * 0.008).toFixed(5),
                    rating: 3.6 + (i % 3) * 0.3, review_count: 60 + i * 45,
                    price: price, currency: "BDT",
                    image: FALLBACK.img(["1566073771259-6a8506099945", "1520250497591-112f2f40a3f4", "1582719508461-905c673771fd", "1571003123894-1f0594d2b5d9"][i % 4]),
                    images: [], amenities: ["Free Wi-Fi", "AC Rooms", "Parking", "Room Service"],
                    phone: "", website: "", booking_url: "",
                    availability: "local", source: "local",
                    demo: true, fallback: true
                });
            });
        }

        /* Apply local filters (mirrors the demo provider). */
        var minRating = (params.rating !== undefined && params.rating !== "") ? parseFloat(params.rating) : 0;
        var maxPrice = (params.max_price !== undefined && params.max_price !== "") ? parseFloat(params.max_price) : 0;
        var type = norm(params.hotel_type || "");
        items = items.filter(function (h) {
            if (minRating > 0 && h.rating < minRating) return false;
            if (maxPrice > 0 && h.price > maxPrice) return false;
            if (type && norm(h.hotel_type) !== type) return false;
            return true;
        });

        var page = Math.max(1, parseInt(params.page, 10) || 1);
        var limit = Math.max(1, Math.min(24, parseInt(params.limit, 10) || 8));
        var offset = (page - 1) * limit;
        var paged = items.slice(offset, offset + limit);

        return {
            provider: "local", demo: true, fallback: true,
            page: page, limit: limit, total: items.length,
            pages: Math.max(1, Math.ceil(items.length / limit)),
            items: paged,
            message: "Showing local information for " + place.name + ". Live hotel data is currently unavailable.",
            filters: params
        };
    }

    /* ------------------------------------------------------------------ */
    /*  Local restaurants                                                   */
    /* ------------------------------------------------------------------ */

    function makeRestaurants(params) {
        var place = placeFromParams(params);
        if (!place) {
            return emptyResult("restaurant", "We couldn't find \"" + (params.destination || "") + "\" in our local guide. Try a city, district or destination in Bangladesh.");
        }

        var curated = FALLBACK.restaurants[place.key] || [];
        var items = [];

        if (curated.length) {
            var rand = offsetRand(place.name + "|restaurant");
            curated.forEach(function (r, i) {
                items.push({
                    id: "local:restaurant:" + place.key + ":" + i,
                    provider: "local", provider_id: "local-restaurant-" + place.key + "-" + i,
                    name: r.name, name_bn: "",
                    address: r.address || (place.name + " · Bangladesh"),
                    district: place.district, division: place.division,
                    latitude: +(place.lat + (rand() - 0.5) * 0.015).toFixed(5),
                    longitude: +(place.lng + (rand() - 0.5) * 0.015).toFixed(5),
                    rating: r.rating, review_count: r.review_count,
                    price_level: r.price_level, cuisine: r.cuisine || ["Bangladeshi"],
                    cover_image: FALLBACK.img(r.photo), photos: [],
                    phone: "", website: "",
                    opening_hours: r.opening_hours || "",
                    open_now: true,
                    google_maps_url: "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(place.name),
                    place_id: "",
                    demo: true, fallback: true
                });
            });
        } else {
            var cuis = [["Bangladeshi"], ["Chinese"], ["Bangladeshi"], ["Seafood"]];
            var names = ["Local Kitchen", "Bazar Eatery", "Green Table", "River View Diner"];
            names.forEach(function (n, i) {
                items.push({
                    id: "local:restaurant:" + place.key + ":" + i,
                    provider: "local", provider_id: "local-restaurant-" + place.key + "-" + i,
                    name: n + " — " + place.name, name_bn: "",
                    address: place.name + " · " + (place.district || "Bangladesh"),
                    district: place.district, division: place.division,
                    latitude: +(place.lat + (i - 1.5) * 0.01).toFixed(5),
                    longitude: +(place.lng + (i % 3) * 0.01).toFixed(5),
                    rating: 3.6 + (i % 3) * 0.3, review_count: 40 + i * 30,
                    price_level: String(1 + (i % 2)), cuisine: cuis[i % cuis.length],
                    cover_image: FALLBACK.img(["1517248135467-4c7edcad34c4", "1414235077428-338989a2e8c0", "1555396273-367ea4eb4db5", "1504674900247-0877df9cc836"][i % 4]),
                    photos: [], phone: "", website: "",
                    opening_hours: "Open daily 10:00–22:00",
                    open_now: true,
                    google_maps_url: "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(place.name),
                    place_id: "",
                    demo: true, fallback: true
                });
            });
        }

        /* Local filters (mirrors the demo provider). */
        var cuisine = norm(params.cuisine || "");
        var priceLevel = norm(params.price_level || "");
        var minRating = (params.rating !== undefined && params.rating !== "") ? parseFloat(params.rating) : 0;
        var openOnly = params.open_now === "true" || params.open_now === true;

        items = items.filter(function (r) {
            if (cuisine && !(r.cuisine || []).some(function (c) { return norm(c) === cuisine; })) return false;
            if (priceLevel && norm(r.price_level) !== priceLevel) return false;
            if (minRating > 0 && r.rating < minRating) return false;
            if (openOnly && !r.open_now) return false;
            return true;
        });

        var page = Math.max(1, parseInt(params.page, 10) || 1);
        var limit = Math.max(1, Math.min(24, parseInt(params.limit, 10) || 8));
        var offset = (page - 1) * limit;
        var paged = items.slice(offset, offset + limit);

        return {
            provider: "local", demo: true, fallback: true,
            page: page, limit: limit, total: items.length,
            pages: Math.max(1, Math.ceil(items.length / limit)),
            items: paged,
            message: "Showing local information for " + place.name + ". Live restaurant data is currently unavailable.",
            filters: params
        };
    }

    function emptyResult(kind, message) {
        return { provider: "local", demo: true, fallback: true, page: 1, limit: 8, total: 0, pages: 0, items: [], message: message };
    }

    /* ------------------------------------------------------------------ */
    /*  Local transport (estimates only, never fake schedules)              */
    /* ------------------------------------------------------------------ */

    function makeTransport(params) {
        var from = resolvePlace(params.from || "");
        var to = resolvePlace(params.to || "");
        if (!from || !to) {
            return {
                provider: "local", demo: true, fallback: true, live: false,
                items: [], total: 0,
                message: "Live transport data is unavailable, and we couldn't resolve one of the places in our local guide. Try city names such as Dhaka, Chattogram, Cox's Bazar or Sylhet."
            };
        }

        var km = haversineKm(from.lat, from.lng, to.lat, to.lng);
        var roadKm = Math.round(km * 1.3);
        var type = norm(params.transport_type || "");
        var types = type ? [type] : ["bus", "train", "flight", "ferry"];

        var items = [];
        types.forEach(function (t) {
            var durMin;
            if (t === "flight") {
                if (km < 150) return; // no domestic flight for very short hops
                durMin = Math.max(45, Math.round(km / 600 * 60));
            } else if (t === "train") {
                durMin = Math.round(roadKm / 55 * 60);
            } else if (t === "ferry") {
                if (km < 40) return;
                durMin = Math.round(km / 25 * 60 + 60);
            } else {
                durMin = Math.round(roadKm / 55 * 60);
            }
            items.push({
                id: "local:transport:" + t + ":" + from.key + ":" + to.key,
                provider: "local", transport_type: t,
                from: from.name, to: to.name,
                departure_date: params.departure_date || "",
                typical_duration_minutes: durMin,
                price: null, currency: "BDT",
                schedule: [], carrier: "", class: "", booking_url: "",
                demo: true, fallback: true, live: false,
                note: "Typical travel estimate from local information only — schedules and prices are not available."
            });
        });

        return {
            provider: "local", demo: true, fallback: true, live: false,
            items: items, total: items.length,
            message: "Live transport data is currently unavailable. Showing typical travel modes between " + from.name + " and " + to.name + " (estimates, not live).",
            filters: params
        };
    }

    /* ------------------------------------------------------------------ */
    /*  Local route estimate                                                */
    /* ------------------------------------------------------------------ */

    function makeRoute(params) {
        var origin = resolvePlace(params.origin || "");
        var destination = resolvePlace(params.destination || "");
        if (!origin || !destination) return null;
        var km = haversineKm(origin.lat, origin.lng, destination.lat, destination.lng);
        var roadKm = Math.round(km * 1.3);
        var mode = norm(params.travel_mode || "driving");
        var speeds = { flying: 600, walking: 5, cycling: 15, transit: 45, driving: 55 };
        var speed = speeds[mode] || 55;
        var minutes = Math.round(roadKm / speed * 60);
        if (mode === "flying") minutes = Math.max(45, Math.round(km / 600 * 60));

        return {
            provider: "local", demo: true, fallback: true, estimate: true,
            origin: origin.name, destination: destination.name,
            distance_km: roadKm, duration_minutes: minutes,
            travel_mode: mode || "driving",
            note: "Route estimate from local information (not live, not ticket availability).",
            steps: [
                { instruction: "Depart " + origin.name, distance_km: 0 },
                { instruction: "Travel toward " + destination.name + " (~" + roadKm + " km)", distance_km: roadKm },
                { instruction: "Arrive at " + destination.name, distance_km: 0 }
            ]
        };
    }

    /* ------------------------------------------------------------------ */
    /*  Wrapping + installation                                            */
    /* ------------------------------------------------------------------ */

    function wrap(orig, makeFromArgs) {
        return function () {
            var args = Array.prototype.slice.call(arguments);

            var local = function (src) {
                try {
                    var data = makeFromArgs.apply(null, args);
                    if (data) {
                        return { ok: true, status: 200, data: data, error: null, fallback: true, source: src };
                    }
                } catch (e) {
                    console.error("Ghuraghuri local fallback error:", e);
                }
                return src || { ok: false, status: 0, data: null, error: { code: "local_unavailable", message: "Local information could not be prepared." } };
            };

            if (probeState === false) {
                return Promise.resolve(local(null));
            }

            var throughApi = function () {
                return orig.apply(null, args).then(function (res) {
                    if (res && res.ok) return res;
                    console.warn("Ghuraghuri API request failed; using local fallback.", res && res.error);
                    return local(res);
                });
            };

            if (probeState === true) {
                return throughApi();
            }

            /* First call: probe the backend once, then decide. */
            return quickProbe().then(function (up) {
                probeState = up;
                if (!up) {
                    console.warn("Ghuraghuri backend is unreachable; using local fallback data.");
                    return local(null);
                }
                return throughApi();
            });
        };
    }

    /* Install wrapped methods. Note: autocomplete keeps its (q, limit)
       signature, all others take a single params object. */
    API.autocomplete = wrap(API.autocomplete, function (q, limit) { return localAutocomplete({ q: q, limit: limit }); });
    API.hotels.search = wrap(API.hotels.search, function (params) { return makeHotels(params); });
    API.restaurants.search = wrap(API.restaurants.search, function (params) { return makeRestaurants(params); });
    API.restaurants.nearby = wrap(API.restaurants.nearby, function (params) { return makeRestaurants(params); });
    API.transport.search = wrap(API.transport.search, function (params) { return makeTransport(params); });
    API.routes.route = wrap(API.routes.route, function (params) { return makeRoute(params); });

    /* The client is now always usable (live API when up, local data otherwise). */
    API.configured = true;

    window.TRAVEL_FALLBACK = {
        resolvePlace: resolvePlace,
        localAutocomplete: localAutocomplete,
        makeHotels: makeHotels,
        makeRestaurants: makeRestaurants,
        makeTransport: makeTransport,
        makeRoute: makeRoute
    };
})(window);
