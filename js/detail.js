/* ============================================================================
   BANGLADESH TRAVEL EXPLORER - DESTINATION DETAIL PAGE LOGIC
   ============================================================================ */

(function (window, document) {
    "use strict";

    var params = new URLSearchParams(window.location.search);
    var slug = params.get("slug");
    var dest = slug ? getDestinationBySlug(slug) : null;

    var DASH = "—";

    function starsHTML(rating) {
        var out = "";
        for (var i = 0; i < 5; i++) out += i < Math.round(rating) ? "★" : "☆";
        return out;
    }

    function chipList(items) {
        return items.map(function (t) {
            return '<span class="chip">' + t + "</span>";
        }).join("");
    }

    function orDash(val) {
        return (val === undefined || val === null || val === "") ? DASH : val;
    }

    function listHTML(items, fallback) {
        if (!items || !items.length) {
            return fallback ? fallback : "";
        }
        return items.map(function (a) { return "<li>" + a + "</li>"; }).join("");
    }

    function related(dest) {
        var others = DESTINATIONS.filter(function (x) {
            if (x.slug === dest.slug) return false;
            if (x.district === dest.district && x.division === dest.division) return true;
            if (x.district === dest.district) return true;
            var shared = (x.categories || []).filter(function (c) {
                return (dest.categories || []).indexOf(c) !== -1;
            });
            return shared.length >= 2;
        });
        var ranked = others.slice().sort(function (a, b) {
            var da = (a.district === dest.district) ? 1 : 0;
            var db = (b.district === dest.district) ? 1 : 0;
            if (db !== da) return db - da;
            return b.rating - a.rating;
        });
        return ranked.slice(0, 4);
    }

    function render() {
        dest = I18N.localizeDest(dest);
        document.getElementById("crumbName").textContent = dest.name;
        document.title = dest.name + " — " + (I18N.isBn() ? "ঘুরাঘুরি" : "Ghuraghuri");

        document.getElementById("detailImage").src = dest.imageLg;
        document.getElementById("detailImage").alt = dest.name;
        document.getElementById("detailName").textContent = dest.name;
        document.getElementById("detailLocation").textContent =
            "📍 " + dest.division + " · " + dest.district +
            (dest.upazila ? " · " + dest.upazila : "");
        document.getElementById("detailTags").innerHTML = chipList(dest.categories);
        document.getElementById("detailStars").textContent = starsHTML(dest.rating);
        document.getElementById("detailRatingText").textContent =
            dest.rating + " · " + I18N.fmt("detail.reviews", { r: dest.reviews.toLocaleString() });
        document.getElementById("detailShort").textContent = dest.shortDesc || "";
        document.getElementById("detailDesc").textContent = dest.description || "";

        var pin = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>';
        document.getElementById("detailNearby").innerHTML =
            (dest.nearby_destinations || []).map(function (s) {
                var near = null;
                for (var i = 0; i < DESTINATIONS.length; i++) {
                    if (DESTINATIONS[i].slug === s) { near = DESTINATIONS[i]; break; }
                }
                return '<a class="chip-link" href="destination.html?slug=' + s + '">' +
                    pin + " " + (near ? near.name : s) + "</a>";
            }).join("");

        document.getElementById("gmapsLink").href =
            CONFIG.GOOGLE_MAPS_SEARCH + encodeURIComponent(dest.name + " Bangladesh");

        document.getElementById("detailGallery").innerHTML = dest.gallery.map(function (src) {
            return '<img src="' + src + '" alt="' + dest.name + '" loading="lazy" />';
        }).join("");

        document.getElementById("detailActivities").innerHTML =
            listHTML(dest.things_to_do || dest.activities);
        document.getElementById("detailAttractions").innerHTML =
            listHTML(dest.what_to_see || dest.attractions);
        document.getElementById("detailTips").innerHTML =
            listHTML(dest.travel_tips || dest.tips);

        var ti = dest.travelInfo || {};
        document.getElementById("detailTravel").innerHTML =
            '<div class="ti-row"><span class="ti-label">' + I18N.t("ti.from") + '</span><span>' + orDash(ti.from) + "</span></div>" +
            '<div class="ti-row"><span class="ti-label">' + I18N.t("ti.distance") + '</span><span>' + ((ti.distanceKm === undefined || ti.distanceKm === null || ti.distanceKm === "") ? DASH : (ti.distanceKm + " km")) + "</span></div>" +
            '<div class="ti-row"><span class="ti-label">' + I18N.t("ti.duration") + '</span><span>' + orDash(ti.duration) + "</span></div>" +
            '<div class="ti-row"><span class="ti-label">' + I18N.t("ti.route") + '</span><span>' + orDash(ti.route) + "</span></div>" +
            '<div class="ti-row"><span class="ti-label">' + I18N.t("ti.transport") + '</span>' +
                ((ti.transport && ti.transport.length)
                    ? '<div class="ti-transport">' + ti.transport.map(function (t) {
                        return "<span>" + t + "</span>";
                    }).join("") + "</div>"
                    : "<span>" + DASH + "</span>") + "</div>" +
            (ti.flight ? '<div class="ti-row"><span class="ti-label">' + I18N.t("ti.flight") + '</span><span>' + ti.flight + "</span></div>" : "");

        document.getElementById("factDivision").textContent = dest.division;
        document.getElementById("factDistrict").textContent = dest.district;
        document.getElementById("factUpazila").textContent = orDash(dest.upazila);
        document.getElementById("factBestTime").textContent = orDash(dest.bestTime);
        document.getElementById("factDays").textContent = orDash(dest.recommendedDays);
        document.getElementById("factDifficulty").textContent = orDash(dest.difficulty);
        document.getElementById("factBudget").textContent = orDash(dest.budget);
        document.getElementById("factType").textContent = orDash(dest.travelType);

        document.getElementById("detailCoords").textContent =
            dest.latitude.toFixed(4) + "°N, " + dest.longitude.toFixed(4) + "°E";

        /* Related destinations ("You Might Also Like") */
        var rel = related(dest);
        document.getElementById("detailRelated").innerHTML = rel.map(function (r) {
            return '<a class="related-card" href="destination.html?slug=' + r.slug + '">' +
                '<img src="' + r.image + '" alt="' + r.name + '" loading="lazy" />' +
                '<div class="rc-body">' +
                    '<div class="rc-name">' + r.name + "</div>" +
                    '<div class="rc-meta">' + r.division + " · " + r.district + "</div>" +
                "</div></a>";
        }).join("");
        var relPanel = document.getElementById("detailRelated").parentElement;
        if (relPanel) relPanel.hidden = rel.length === 0;

        document.getElementById("detailHero").hidden = false;
        document.getElementById("detailBody").hidden = false;

        MAP.createDetailMap("detailMap", dest);
        WEATHER.renderSingleWeather("weatherCard", dest);

        loadTravelServices();
    }

    /* ------------------------------------------------------------------ */
    /*  Travel services panel (hotels / restaurants / transport)           */
    /* ------------------------------------------------------------------ */

    function tsMessage(text) {
        return '<p class="travel-message">' + text + "</p>";
    }

    function tsList(cards, emptyText) {
        if (!cards.length) return tsMessage(emptyText || "");
        return '<div class="ts-cards">' + cards.join("") + "</div>";
    }

    function loadTravelServices() {
        if (!window.API || !window.API.configured) {
            document.getElementById("travelServices").innerHTML =
                tsMessage(I18N ? I18N.t("travel.demo.text", "connect a provider in api/.env for live results") : "");
            return;
        }

        var hotelsEl = document.getElementById("tsHotels");
        var restEl = document.getElementById("tsRestaurants");
        var transEl = document.getElementById("tsTransport");

        var stayLink = '<a class="ts-link" href="hotels.html?destination=' + encodeURIComponent(dest.name) + '" data-i18n="detail.services.seeAll">' + (I18N ? I18N.t("detail.services.seeAll") : "See all →") + "</a>";
        var eatLink = '<a class="ts-link" href="restaurants.html?destination=' + encodeURIComponent(dest.name) + '" data-i18n="detail.services.seeAll">' + (I18N ? I18N.t("detail.services.seeAll") : "See all →") + "</a>";
        var transLink = '<a class="ts-link" href="transport.html?from=Dhaka&to=' + encodeURIComponent(dest.name) + '" data-i18n="detail.services.seeAll">' + (I18N ? I18N.t("detail.services.seeAll") : "See all →") + "</a>";

        function setHead(el, link) {
            var head = el.closest(".ts-section").querySelector(".ts-head");
            if (head) head.innerHTML = "<h3>" + (head.querySelector("h3") ? head.querySelector("h3").textContent : "") + "</h3>" + link;
        }

        hotelsEl.innerHTML = '<div class="travel-state"><div class="spinner" aria-hidden="true"></div></div>';
        restEl.innerHTML = '<div class="travel-state"><div class="spinner" aria-hidden="true"></div></div>';
        transEl.innerHTML = '<div class="travel-state"><div class="spinner" aria-hidden="true"></div></div>';

        API.hotels.search({ latitude: dest.latitude, longitude: dest.longitude, limit: 3 }).then(function (res) {
            setHead(hotelsEl, stayLink);
            if (!res.ok) {
                hotelsEl.innerHTML = tsMessage(res.error.message);
                return;
            }
            var items = (res.data && res.data.items) || [];
            hotelsEl.innerHTML = tsList(items.map(function (h) {
                return '<article class="ts-card">' +
                    '<div class="ts-img">' + (h.image
                        ? '<img src="' + h.image + '" alt="' + h.name + '" loading="lazy" />'
                        : '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>') + "</div>" +
                    '<div class="ts-body"><strong>' + h.name + "</strong>" +
                    '<span class="ts-rating">★ ' + (h.rating ? Number(h.rating).toFixed(1) : "—") + "</span>" +
                    (h.price ? '<span class="ts-price">৳' + Number(h.price).toLocaleString() + "</span>" : "") + "</div></article>";
            }), "");
        });

        API.restaurants.nearby({ latitude: dest.latitude, longitude: dest.longitude, limit: 3 }).then(function (res) {
            setHead(restEl, eatLink);
            if (!res.ok) {
                restEl.innerHTML = tsMessage(res.error.message);
                return;
            }
            var items = (res.data && res.data.items) || [];
            restEl.innerHTML = tsList(items.map(function (r) {
                return '<article class="ts-card">' +
                    '<div class="ts-img">' + (r.cover_image || r.image
                        ? '<img src="' + (r.cover_image || r.image) + '" alt="' + r.name + '" loading="lazy" />'
                        : '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 21v-7M5 10V4M9 21V10M9 4v4a2 2 0 0 1-2 2M19 21V9a4 4 0 0 0-4-4"/></svg>') + "</div>" +
                    '<div class="ts-body"><strong>' + r.name + "</strong>" +
                    '<span class="ts-rating">★ ' + (r.rating ? Number(r.rating).toFixed(1) : "—") + "</span>" +
                    (r.cuisine && r.cuisine.length ? '<span class="ts-cuisine">' + r.cuisine.slice(0, 2).join(" · ") + "</span>" : "") + "</div></article>";
            }), "");
        });

        API.routes.route({ origin: "Dhaka", destination: dest.name, travel_mode: "driving" }).then(function (res) {
            setHead(transEl, transLink);
            if (!res.ok) {
                transEl.innerHTML = tsMessage(res.error.message);
                return;
            }
            var route = res.data || {};
            var dur = UI.humanDuration(route.duration_minutes);
            transEl.innerHTML =
                '<div class="ts-route">' +
                '<div class="ts-origin">' + (I18N ? I18N.t("detail.services.origin") : "From Dhaka") + "</div>" +
                '<div class="ts-route-line">' + (route.origin || "Dhaka") + " → " + (route.destination || dest.name) + "</div>" +
                '<div class="ts-route-stats">' +
                    '<span><strong>' + (route.distance_km || "—") + " km</strong> " + (I18N ? I18N.t("transport.route.distance") : "Distance") + "</span>" +
                    '<span><strong>' + (dur || "—") + "</strong> " + (I18N ? I18N.t("transport.route.time") : "Est. time") + "</span>" +
                "</div>" +
                (route.note ? '<p class="travel-message">' + route.note + "</p>" : "") +
                "</div>";
        });
    }

    function init() {
        if (!dest) {
            document.getElementById("detailMissing").hidden = false;
            return;
        }
        render();
    }

    document.addEventListener("DOMContentLoaded", init);
})(window, document);