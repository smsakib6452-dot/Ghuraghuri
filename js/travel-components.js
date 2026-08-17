/* ============================================================================
   GHURAGHURI - REUSABLE TRAVEL UI COMPONENTS
   Loading / Empty / Error states, Rating, Price, Image, Result cards,
   pagination, location autocomplete and small map helpers.
   Shared by hotels.html / restaurants.html / transport.html / travel.html
   and the destination-page panels. i18n-aware with safe fallbacks.
   ============================================================================ */

(function (window, document) {
    "use strict";

    function t(key, fb) { return (window.I18N && I18N.t) ? (I18N.t(key) || fb) : fb; }
    function fmt(key, vals, fb) { return (window.I18N && I18N.fmt) ? I18N.fmt(key, vals) : fb; }

    var API = window.API;

    /* ------------------------------------------------------------------ */
    /*  States                                                             */
    /* ------------------------------------------------------------------ */

    function loading(label) {
        return '<div class="travel-state"><div class="spinner" aria-hidden="true"></div>' +
            "<p>" + (label || t("travel.loading", "Loading…")) + "</p></div>";
    }

    function empty(label) {
        return '<div class="travel-state travel-empty">' +
            "<h3>" + (label || t("travel.empty", "Nothing found")) + "</h3>" +
            '<p>' + t("travel.empty.text", "Try a different location or filter.") + "</p></div>";
    }

    function error(message) {
        return '<div class="travel-state travel-error">' +
            '<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>' +
            "<h3>" + t("travel.error.title", "Something went wrong") + "</h3>" +
            "<p>" + (message || t("travel.error.text", "We couldn't load live data right now. Please try again in a moment.")) + "</p>" +
            '<button class="btn" data-travel-retry>' + t("travel.retry", "Try again") + "</button></div>";
    }

    function demoBanner(provider, isDemo) {
        if (!isDemo) return "";
        return '<div class="demo-banner">' +
            '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 9v4M12 17h.01"/><path d="M10.3 3.9L1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/></svg>' +
            '<span>' + t("travel.demo", "Demo data") + " — " + t("travel.demo.text", "connect a provider in api/.env for live results") + "</span></div>";
    }

    /* Banner shown when the live API is unreachable and local data is used.
       Clearly separates local information from live results. */
    function fallbackBanner() {
        return '<div class="demo-banner fallback-banner" role="status">' +
            '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="2" y1="2" x2="22" y2="22"/><path d="M8 8a4 4 0 0 0 8 0"/></svg>' +
            '<span>' + t("travel.fallback.label", "Local information") + " — " + t("travel.fallback.note", "the live travel service is currently unreachable, so this data may not be live") + "</span></div>";
    }

    /* ------------------------------------------------------------------ */
    /*  Rating + Price                                                     */
    /* ------------------------------------------------------------------ */

    function rating(value, count) {
        var v = Number(value) || 0;
        var full = Math.round(v);
        var stars = "";
        for (var i = 0; i < 5; i++) {
            stars += '<span class="star' + (i < full ? " on" : "") + '">★</span>';
        }
        return '<span class="travel-rating" title="' + v.toFixed(1) + ' / 5">' + stars +
            '<span class="tr-value">' + v.toFixed(1) + "</span>" +
            (count ? '<span class="tr-count">(' + Number(count).toLocaleString() + ")</span>" : "") + "</span>";
    }

    function price(value, currency, isDemo) {
        if (value === null || value === undefined || value === "") {
            return '<span class="travel-price-none">' + t("travel.price.unknown", "Price on request") + "</span>";
        }
        var sym = (currency === "BDT") ? "৳" : (currency || "") + " ";
        var label = sym + Number(value).toLocaleString();
        if (isDemo) label = t("travel.price.est", "Est.") + " " + label;
        return '<span class="travel-price">' + label + "</span>";
    }

    function priceLevel(level) {
        if (!level || level === "0") return "";
        var n = parseInt(level, 10);
        var out = "";
        for (var i = 0; i < n; i++) out += "৳";
        return '<span class="travel-price" title="' + t("travel.price_level", "Price level") + '">' + out + "</span>";
    }

    /* ------------------------------------------------------------------ */
    /*  Cards                                                              */
    /* ------------------------------------------------------------------ */

    var PLACEHOLDER_IMG = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(
        '<svg xmlns="http://www.w3.org/2000/svg" width="640" height="420"><rect width="100%" height="100%" fill="#0b1e16"/><circle cx="320" cy="185" r="46" fill="none" stroke="#2f7d5c" stroke-width="7"/><path d="M128 340l118-142 72 84 62-58 96 116z" fill="#2f7d5c"/></svg>'
    );

    function imgHTML(src, alt, cls) {
        return src
            ? '<img src="' + src + '" alt="' + alt + '" loading="lazy" class="' + (cls || "") + '" onerror="this.onerror=null;this.src=\'' + PLACEHOLDER_IMG + '\';" />'
            : '<div class="card-img-ph"><svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg></div>';
    }

    function hotelCard(h) {
        return '<article class="travel-card">' +
            '<div class="tc-media">' + imgHTML(h.image, h.name, "tc-img") +
                '<span class="tc-provider">' + h.provider + "</span>" +
            "</div>" +
            '<div class="tc-body">' +
                "<h3>" + h.name + "</h3>" +
                '<div class="tc-loc">' + (h.address || "") + "</div>" +
                rating(h.rating, h.review_count) +
                '<div class="tc-meta">' + price(h.price, h.currency, h.demo) + "</div>" +
                '<div class="tc-amenities">' + (h.amenities || []).slice(0, 4).map(function (a) { return '<span class="tc-chip">' + a + "</span>"; }).join("") + "</div>" +
                '<div class="tc-actions">' +
                    mapLink(h.latitude, h.longitude, h.name) +
                    directionsLink(h.latitude, h.longitude, h.name) +
                "</div>" +
            "</div>" +
        "</article>";
    }

    function restaurantCard(r) {
        return '<article class="travel-card">' +
            '<div class="tc-media">' + imgHTML(r.cover_image || r.image, r.name, "tc-img") +
                '<span class="tc-provider">' + r.provider + "</span>" +
            "</div>" +
            '<div class="tc-body">' +
                "<h3>" + r.name + "</h3>" +
                '<div class="tc-loc">' + (r.address || "") + "</div>" +
                rating(r.rating, r.review_count) + " " + priceLevel(r.price_level) +
                '<div class="tc-meta">' + (r.cuisine || []).slice(0, 3).map(function (c) { return '<span class="tc-chip">' + c + "</span>"; }).join("") + "</div>" +
                (r.open_now === true ? '<div class="tc-open">' + t("travel.open", "Open now") + "</div>" : "") +
                '<div class="tc-actions">' +
                    mapLink(r.latitude, r.longitude, r.name) +
                    directionsLink(r.latitude, r.longitude, r.name) +
                    (r.google_maps_url ? '<a class="btn btn-sm" target="_blank" rel="noopener" href="' + r.google_maps_url + '">' + t("travel.gmaps", "Google Maps") + "</a>" : "") +
                "</div>" +
            "</div>" +
        "</article>";
    }

    function transportCard(item) {
        var modeLabel = t("transport." + item.transport_type, item.transport_type);
        var dur = item.typical_duration_minutes
            ? '<span class="tc-chip">' + humanDuration(item.typical_duration_minutes) + "</span>" : "";
        return '<article class="travel-card transport-card">' +
            '<div class="tc-body">' +
                "<h3>" + modeLabel + "</h3>" +
                '<div class="tc-loc">' + item.from + " → " + item.to + "</div>" +
                '<div class="tc-meta">' + dur +
                    (item.departure_date ? '<span class="tc-chip">' + item.departure_date + "</span>" : "") + "</div>" +
                (item.note ? '<div class="tc-note">' + item.note + "</div>" : "") +
                '<div class="tc-actions">' +
                    '<a class="btn btn-sm" href="travel.html?from=' + encodeURIComponent(item.from) + "&to=" + encodeURIComponent(item.to) + '&type=' + item.transport_type + '">' + t("travel.refine", "Refine search") + "</a>" +
                "</div>" +
            "</div>" +
        "</article>";
    }

    function humanDuration(minutes) {
        if (!minutes) return "";
        if (minutes < 60) return minutes + " min";
        var h = Math.floor(minutes / 60);
        var m = minutes % 60;
        return h + "h" + (m ? " " + m + "m" : "");
    }

    function mapLink(lat, lng, name) {
        if (!lat || !lng) return "";
        var url = (window.CONFIG && window.CONFIG.GOOGLE_MAPS_SEARCH) ? window.CONFIG.GOOGLE_MAPS_SEARCH + encodeURIComponent(name) : "";
        return url ? '<a class="btn btn-sm" target="_blank" rel="noopener" href="' + url + '">' + t("travel.viewMap", "View on Map") + "</a>" : "";
    }

    function directionsLink(lat, lng, name) {
        if (!lat || !lng) return "";
        var cfg = window.CONFIG || {};
        var url = (cfg.GOOGLE_MAPS_DIR ? cfg.GOOGLE_MAPS_DIR + encodeURIComponent(name) + "&destination=" + encodeURIComponent(name) : "");
        return url ? '<a class="btn btn-sm" target="_blank" rel="noopener" href="' + url + '">' + t("travel.directions", "Get Directions") + "</a>" : "";
    }

    /* ------------------------------------------------------------------ */
    /*  Pagination                                                         */
    /* ------------------------------------------------------------------ */

    function pagination(page, pages, onGo) {
        if (pages <= 1) return "";
        var items = '<button class="pg-btn" data-page="' + (page - 1) + '"' + (page <= 1 ? " disabled" : "") + ">‹</button>";
        for (var i = 1; i <= pages; i++) {
            if (pages > 9 && i !== 1 && i !== pages && Math.abs(i - page) > 2) {
                if (i === 2 || i === pages - 1) items += '<span class="pg-ellipsis">…</span>';
                continue;
            }
            items += '<button class="pg-btn' + (i === page ? " active" : "") + '" data-page="' + i + '">' + i + "</button>";
        }
        items += '<button class="pg-btn" data-page="' + (page + 1) + '"' + (page >= pages ? " disabled" : "") + ">›</button>";
        return '<nav class="travel-pagination" aria-label="Pagination">' + items + "</nav>";
    }

    function wirePagination(container, onGo) {
        var el = container.querySelector(".travel-pagination");
        if (!el) return;
        el.addEventListener("click", function (e) {
            var btn = e.target.closest("[data-page]");
            if (!btn || btn.disabled) return;
            onGo(parseInt(btn.getAttribute("data-page"), 10));
        });
    }

    /* ------------------------------------------------------------------ */
    /*  Location autocomplete (English + Bangla, debounced)                */
    /* ------------------------------------------------------------------ */

    function locationAutocomplete(input, onPick) {
        if (!API || !API.configured) return null;
        var box = document.createElement("div");
        box.className = "ac-box";
        input.parentNode.insertBefore(box, input.nextSibling);
        var timer = null;

        function hide() { box.classList.remove("open"); }
        function show(items) {
            if (!items.length) {
                box.innerHTML = '<div class="ac-empty">' + t("travel.ac.empty", "No matches") + "</div>";
                box.classList.add("open");
                return;
            }
            box.innerHTML = items.map(function (it) {
                var label = it.name_bn ? it.name_bn + " · " + it.name : it.name;
                return '<button type="button" class="ac-item" data-idx="' + items.indexOf(it) + '">' +
                    '<span class="ac-name">' + label + "</span>" +
                    '<span class="ac-meta">' + (it.type || "") + (it.district ? " · " + it.district : "") + "</span></button>";
            }).join("");
            box.classList.add("open");
            box.querySelectorAll(".ac-item").forEach(function (btn) {
                btn.addEventListener("click", function () {
                    var it = items[parseInt(btn.getAttribute("data-idx"), 10)];
                    input.value = it.name;
                    hide();
                    if (onPick) onPick(it);
                });
            });
        }

        input.addEventListener("input", function () {
            clearTimeout(timer);
            var q = input.value.trim();
            if (!q) { hide(); return; }
            timer = setTimeout(function () {
                API.autocomplete(q, 8).then(function (res) {
                    if (res.ok) show(res.data.items || []);
                });
            }, 200);
        });
        input.addEventListener("blur", function () { setTimeout(hide, 200); });
        input.addEventListener("keydown", function (e) {
            if (e.key === "Escape") hide();
        });
        return { hide: hide, show: show };
    }

    /* ------------------------------------------------------------------ */
    /*  Map helper                                                         */
    /* ------------------------------------------------------------------ */

    function initMap(el, lat, lng, markerLabel) {
        if (!el || !window.L || !lat || !lng) return null;
        var cfg = window.CONFIG || {};
        var map = L.map(el).setView([lat, lng], 13);
        L.tileLayer(cfg.MAP_TILE_URL || "https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: cfg.MAP_ATTRIBUTION || "© OpenStreetMap contributors"
        }).addTo(map);
        L.marker([lat, lng]).addTo(map).bindPopup(markerLabel || "");
        return map;
    }

    window.TRAVEL_UI = {
        loading: loading, empty: empty, error: error, demoBanner: demoBanner, fallbackBanner: fallbackBanner,
        rating: rating, price: price, priceLevel: priceLevel,
        hotelCard: hotelCard, restaurantCard: restaurantCard, transportCard: transportCard,
        humanDuration: humanDuration,
        pagination: pagination, wirePagination: wirePagination,
        locationAutocomplete: locationAutocomplete,
        initMap: initMap
    };
})(window, document);