/* ============================================================================
   GHURAGHURI - HOME PAGE LOGIC
   Renders the popular-destinations teaser, hero stats, the destination
   ticker, weather cards and the map. Destination browsing (search, filters,
   sorting) lives on the single destinations.html page via js/discover.js.
   ============================================================================ */

(function (window, document) {
    "use strict";

    var statDestCount = document.getElementById("statDestCount");
    var statDivCount = document.getElementById("statDivCount");
    var statDistrictCount = document.getElementById("statDistrictCount");
    var marqueeTrack = document.getElementById("marqueeTrack");

    /* Bangla numerals helper (mirrors home.js / I18N.toBnDigits). */
    var BN_DIGITS = "০১২৩৪৫৬৭৮৯";
    function bnNum(str) {
        if (!(window.I18N && I18N.isBn && I18N.isBn())) return String(str);
        return String(str).replace(/[0-9]/g, function (d) { return BN_DIGITS[d]; });
    }

    /* Curated slugs for the hero marquee (only destinations that exist in the DB). */
    var MARQUEE_SLUGS = [
        "coxs-bazar", "sajek-valley", "sylhet", "sundarbans", "bandarban",
        "rangamati", "saint-martins-island", "srimangal", "kuakata",
        "tanguar-haor", "jaflong", "sonargaon", "paharpur",
        "ratargul-swamp-forest", "inani-beach", "kaptai-lake", "madhabkunda"
    ];

    /* Curated "Travel Picks" shown on the home page (all exist in the DB). */
    var FEATURED_SLUGS = [
        "coxs-bazar", "sundarbans", "sajek-valley",
        "bandarban", "sylhet", "saint-martins-island"
    ];

    function cardHTML(d) {
        return '<article class="card">' +
            '<a class="card-img" href="destination.html?slug=' + d.slug + '">' +
                '<img src="' + d.image + '" alt="' + d.name + '" loading="lazy" />' +
                '<span class="card-tag">' + d.category + "</span>" +
                '<span class="card-rating"><span class="star">★</span> ' + d.rating + "</span>" +
            "</a>" +
            '<div class="card-body">' +
                "<h3>" + d.name + "</h3>" +
                '<div class="card-loc">📍 ' + d.division + " · " + d.district + "</div>" +
                '<p class="card-desc">' + d.shortDesc + "</p>" +
                '<div class="card-footer">' +
                    '<a class="card-link" href="destination.html?slug=' + d.slug + '">' + (window.I18N ? I18N.t("card.viewGuide") : "View guide") + "</a>" +
                    '<span class="card-loc">' + (window.I18N ? I18N.fmt("card.reviews", { r: d.reviews.toLocaleString() }) : (d.reviews.toLocaleString() + " reviews")) + "</span>" +
                "</div>" +
            "</div>" +
        "</article>";
    }

    /* Render the curated home-page picks by slug (falls back gracefully if a
       slug is ever missing). The map shows the same featured set. */
    function renderFeatured() {
        var grid = document.getElementById("featuredGrid");
        if (!grid || typeof DESTINATIONS === "undefined") return;
        var items = FEATURED_SLUGS.map(function (slug) {
            for (var i = 0; i < DESTINATIONS.length; i++) {
                if (DESTINATIONS[i].slug === slug) return DESTINATIONS[i];
            }
            return null;
        }).filter(Boolean);
        if (!items.length) return;
        grid.innerHTML = items.map(cardHTML).join("");
        if (window.MAP && MAP.renderMarkers) MAP.renderMarkers(items);
    }

    /* Update hero stats from live destination/taxonomy data. */
    function updateStats() {
        if (!statDestCount || !statDivCount || !statDistrictCount) return;
        var total = DESTINATIONS.length;
        var divisions = (typeof TAXONOMY !== "undefined" && TAXONOMY.DIVISIONS)
            ? TAXONOMY.DIVISIONS.length
            : new Set(DESTINATIONS.map(function (d) { return d.division; })).size;
        var districts = (typeof TAXONOMY !== "undefined" && TAXONOMY.DISTRICTS)
            ? TAXONOMY.DISTRICTS.length
            : 64;
        statDestCount.textContent = bnNum(total);
        statDivCount.textContent = bnNum(divisions);
        statDistrictCount.textContent = bnNum(districts);
    }

    /* Render the hero destination marquee from existing destination data. */
    function renderMarquee() {
        if (!marqueeTrack) return;
        var items = MARQUEE_SLUGS.map(function (slug) {
            var d = null;
            DESTINATIONS.forEach(function (x) { if (x.slug === slug) d = x; });
            return d;
        }).filter(Boolean);
        if (!items.length) return;

        function itemHTML(d) {
            return '<a class="marquee-item" href="destination.html?slug=' + d.slug + '">' +
                d.name + '<span class="marquee-dot" aria-hidden="true">•</span></a>';
        }

        var set = items.map(itemHTML).join("");
        /* Duplicate the set so the loop is seamless (translateX -50%). */
        marqueeTrack.innerHTML = set + set;
    }

    function init() {
        renderFeatured();
        updateStats();
        renderMarquee();

        /* Render weather once for the top-rated destinations. Clicking a
           weather card jumps to that destination's guide. */
        if (window.WEATHER && WEATHER.renderWeather) {
            WEATHER.renderWeather(
                "weatherWrap",
                DESTINATIONS.slice().sort(function (a, b) { return b.rating - a.rating; }).slice(0, 8),
                function (dest) { window.location.href = "destination.html?slug=" + dest.slug; }
            );
        }
    }

    document.addEventListener("DOMContentLoaded", init);

    /* Debounced resize so Leaflet stays valid in hidden containers. */
    var resizeTimer = null;
    window.addEventListener("resize", function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function () {
            if (window.MAP && MAP.invalidate) MAP.invalidate();
        }, 200);
    });
})(window, document);