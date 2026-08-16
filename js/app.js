/* ============================================================================
   BANGLADESH TRAVEL EXPLORER - HOME PAGE LOGIC
   Search, category filters, sorting, destination grid, map and weather.
   ============================================================================ */

(function (window, document) {
    "use strict";

    var state = {
        category: "All",
        query: "",
        sort: "featured"
    };

    var grid = document.getElementById("destGrid");
    var searchInput = document.getElementById("searchInput");
    var sortSelect = document.getElementById("sortSelect");
    var resultCount = document.getElementById("resultCount");
    var emptyState = document.getElementById("emptyState");
    var statDestCount = document.getElementById("statDestCount");
    var statDivCount = document.getElementById("statDivCount");
    var statRatingAvg = document.getElementById("statRatingAvg");
    var marqueeTrack = document.getElementById("marqueeTrack");

    /* Curated slugs for the hero marquee (only destinations that exist in the DB). */
    var MARQUEE_SLUGS = [
        "coxs-bazar", "sajek-valley", "sylhet", "sundarbans", "bandarban",
        "rangamati", "saint-martins-island", "srimangal", "kuakata",
        "tanguar-haor", "jaflong", "sonargaon", "paharpur",
        "ratargul-swamp-forest", "inani-beach", "kaptai-lake", "madhabkunda"
    ];

    /* Build the list of unique categories from the data. */
    function buildFilters() {
        var bar = document.getElementById("filterBar");
        var cats = ["All"];
        DESTINATIONS.forEach(function (d) {
            d.categories.forEach(function (c) {
                if (cats.indexOf(c) === -1) cats.push(c);
            });
        });
        cats.sort(function (a, b) { return a.localeCompare(b); });

        bar.innerHTML = "";
        cats.forEach(function (c) {
            var btn = document.createElement("button");
            btn.className = "filter-chip" + (c === "All" ? " active" : "");
            btn.dataset.category = c;
            btn.textContent = (c === "All") ? I18N.t("filter.all") : c;
            btn.addEventListener("click", function () {
                state.category = c;
                var all = bar.querySelectorAll(".filter-chip");
                for (var i = 0; i < all.length; i++) all[i].classList.remove("active");
                btn.classList.add("active");
                render();
            });
            bar.appendChild(btn);
        });
    }

    function matches(d) {
        if (state.category !== "All" && d.categories.indexOf(state.category) === -1) return false;
        var q = state.query.trim().toLowerCase();
        if (!q) return true;
        var haystack = (d.name + " " + d.division + " " + d.district + " " +
            d.category + " " + d.shortDesc).toLowerCase();
        return q.split(/\s+/).every(function (word) { return haystack.indexOf(word) !== -1; });
    }

    function sortDestinations(list) {
        var sorted = list.slice();
        switch (state.sort) {
            case "rating":
                sorted.sort(function (a, b) { return b.rating - a.rating; });
                break;
            case "reviews":
                sorted.sort(function (a, b) { return b.reviews - a.reviews; });
                break;
            case "name":
                sorted.sort(function (a, b) { return a.name.localeCompare(b.name); });
                break;
            default:
                sorted.sort(function (a, b) { return a.id - b.id; });
        }
        return sorted;
    }

    function starsHTML(rating) {
        var out = "";
        for (var i = 0; i < 5; i++) out += i < Math.round(rating) ? "★" : "☆";
        return out;
    }

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
                    '<a class="card-link" href="destination.html?slug=' + d.slug + '">' + I18N.t("card.viewGuide") + "</a>" +
                    '<span class="card-loc">' + I18N.fmt("card.reviews", { r: d.reviews.toLocaleString() }) + "</span>" +
                "</div>" +
            "</div>" +
        "</article>";
    }

    /* Render the frequently-visited destinations (ranked by review count). */
    function renderPopular() {
        var popular = DESTINATIONS.slice()
            .sort(function (a, b) { return b.reviews - a.reviews; })
            .slice(0, 8);
        document.getElementById("popularGrid").innerHTML = popular.map(cardHTML).join("");
    }

    /* Update hero stats from live destination data. */
    function updateStats() {
        if (!statDestCount || !statDivCount || !statRatingAvg) return;
        var total = DESTINATIONS.length;
        var divisions = new Set(DESTINATIONS.map(function (d) { return d.division; })).size;
        var avgRating = (DESTINATIONS.reduce(function (sum, d) { return sum + d.rating; }, 0) / total).toFixed(1);
        statDestCount.textContent = total;
        statDivCount.textContent = divisions;
        statRatingAvg.textContent = avgRating;
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

    function render() {
        var filtered = DESTINATIONS.filter(matches);
        var sorted = sortDestinations(filtered);
        grid.innerHTML = sorted.map(cardHTML).join("");

        var total = DESTINATIONS.length;
        resultCount.textContent = I18N.fmt("resultCount", { a: sorted.length, t: total }) +
            (state.query ? I18N.fmt("resultCount.query", { q: state.query }) : "");

        emptyState.hidden = sorted.length > 0;

        /* Keep the map markers in sync with the filtered list. */
        MAP.renderMarkers(sorted);
    }

    function init() {
        buildFilters();
        renderPopular();
        updateStats();
        renderMarquee();

        /* Render weather once for the top-rated destinations. Clicking a
           weather card jumps to that destination's guide. */
        WEATHER.renderWeather(
            "weatherWrap",
            DESTINATIONS.slice().sort(function (a, b) { return b.rating - a.rating; }).slice(0, 8),
            function (dest) { window.location.href = "destination.html?slug=" + dest.slug; }
        );

        var debounceTimer = null;
        searchInput.addEventListener("input", function () {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(function () {
                state.query = searchInput.value;
                render();
            }, 180);
        });

        sortSelect.addEventListener("change", function () {
            state.sort = sortSelect.value;
            render();
        });

        document.getElementById("resetFilters").addEventListener("click", function () {
            state.query = "";
            state.category = "All";
            searchInput.value = "";
            sortSelect.value = "featured";
            state.sort = "featured";
            var bar = document.getElementById("filterBar");
            var all = bar.querySelectorAll(".filter-chip");
            for (var i = 0; i < all.length; i++) all[i].classList.remove("active");
            all[0].classList.add("active");
            render();
        });

        render();
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