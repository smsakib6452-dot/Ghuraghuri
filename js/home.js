/* ============================================================================
   GHURAGHURI - HOME PAGE UI
   Navbar scroll state, mobile drawer, search dropdown, destination ticker,
   division explorer and scroll-reveal animations.
   Loaded AFTER map.js/weather.js and BEFORE app.js.
   ============================================================================ */

(function (window, document) {
    "use strict";

    /* Bangla numerals helper (mirrors I18N.toBnDigits) */
    var BN_DIGITS = "০১২৩৪৫৬৭৮৯";
    function bnNum(str) {
        if (!(window.I18N && I18N.isBn && I18N.isBn())) return String(str);
        return String(str).replace(/[0-9]/g, function (d) { return BN_DIGITS[d]; });
    }

    /* ---------- Navbar: compact on scroll ---------- */
    var header = document.getElementById("siteHeader");
    function onScroll() {
        if (!header) return;
        if (window.scrollY > 10) header.classList.add("is-scrolled");
        else header.classList.remove("is-scrolled");
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    /* ---------- Mobile drawer ---------- */
    var drawer = document.getElementById("mobileDrawer");
    var overlay = document.getElementById("drawerOverlay");
    var navToggle = document.getElementById("navToggle");
    var drawerClose = document.getElementById("drawerClose");

    function openDrawer() {
        drawer.classList.add("open");
        drawer.setAttribute("aria-hidden", "false");
        if ("inert" in drawer) drawer.inert = false;
        overlay.classList.add("open");
        if (navToggle) navToggle.setAttribute("aria-expanded", "true");
        document.body.style.overflow = "hidden";
        var firstLink = drawer.querySelector("a");
        if (firstLink) firstLink.focus();
    }
    function closeDrawer() {
        drawer.classList.remove("open");
        drawer.setAttribute("aria-hidden", "true");
        if ("inert" in drawer) drawer.inert = true;
        overlay.classList.remove("open");
        if (navToggle) navToggle.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
        if (navToggle) navToggle.focus();
    }
    if (drawer && "inert" in drawer) drawer.inert = true;
    if (navToggle) navToggle.addEventListener("click", function () {
        if (drawer.classList.contains("open")) closeDrawer();
        else openDrawer();
    });
    if (drawerClose) drawerClose.addEventListener("click", closeDrawer);
    if (overlay) overlay.addEventListener("click", closeDrawer);
    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && drawer && drawer.classList.contains("open")) closeDrawer();
    });
    if (drawer) drawer.querySelectorAll("a").forEach(function (a) {
        a.addEventListener("click", closeDrawer);
    });

    /* Sync drawer + mobile lang toggle with the desktop one */
    var mobileToggle = document.getElementById("langToggleMobile");
    if (mobileToggle) mobileToggle.addEventListener("click", function () {
        if (window.I18N && I18N.toggle) I18N.toggle();
    });

    /* ---------- Scroll reveal ---------- */
    var revealEls = document.querySelectorAll(".reveal");
    if ("IntersectionObserver" in window) {
        var ro = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                    ro.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12 });
        revealEls.forEach(function (el) { ro.observe(el); });
        /* Safety net: never leave content hidden if the observer stalls. */
        window.setTimeout(function () {
            revealEls.forEach(function (el) { el.classList.add("visible"); });
        }, 2500);
    } else {
        revealEls.forEach(function (el) { el.classList.add("visible"); });
    }

    /* ---------- Destination ticker ---------- */
    var TICKER_SLUGS = [
        "coxs-bazar", "sajek-valley", "sylhet", "bandarban", "sundarbans",
        "ratargul-swamp-forest", "paharpur", "saint-martins-island", "kuakata",
        "srimangal", "rangamati", "jaflong"
    ];
    var tickerTrack = document.getElementById("tickerTrack");
    function findDest(slug) {
        if (typeof DESTINATIONS === "undefined") return null;
        for (var i = 0; i < DESTINATIONS.length; i++) {
            if (DESTINATIONS[i].slug === slug) return DESTINATIONS[i];
        }
        return null;
    }
    function renderTicker() {
        if (!tickerTrack) return;
        var items = TICKER_SLUGS.map(findDest).filter(Boolean);
        if (!items.length) return;
        var pin = '<svg class="ti-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>';
        function itemHTML(d) {
            return '<a class="ticker-item" href="destination.html?slug=' + d.slug + '">' +
                pin + d.name + "</a>";
        }
        var set = items.map(itemHTML).join("");
        tickerTrack.innerHTML = set + set;
    }

    /* ---------- Hero search dropdown ---------- */
    var searchInput = document.getElementById("searchInput");
    var searchGo = document.getElementById("searchGo");
    var resultsBox = document.getElementById("searchResults");

    function searchDestinations(query) {
        if (typeof DESTINATIONS === "undefined") return [];
        var q = query.trim().toLowerCase();
        if (!q) return [];
        return DESTINATIONS.filter(function (d) {
            var haystack = (window.I18N && I18N.searchText)
                ? I18N.searchText(d)
                : (d.name + " " + d.name_bn + " " + d.division + " " + d.district + " " +
                    d.category + " " + d.shortDesc).toLowerCase();
            return haystack.indexOf(q) !== -1;
        }).slice(0, 6);
    }

    function openResults() {
        if (resultsBox) resultsBox.classList.add("open");
    }
    function closeResults() {
        if (resultsBox) resultsBox.classList.remove("open");
    }

    function renderResults(list) {
        if (!resultsBox) return;
        if (!list.length) {
            resultsBox.innerHTML = '<div class="sr-empty">' + (I18N ? I18N.t("search.empty") : "No destinations found") + "</div>";
            openResults();
            return;
        }
        resultsBox.innerHTML = list.map(function (d) {
            var pin = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="vertical-align:-2px"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>';
            return '<a class="sr-item" href="destination.html?slug=' + d.slug + '" role="option">' +
                '<img src="' + d.image + '" alt="" loading="lazy" />' +
                '<span class="sr-body"><span class="sr-name">' + d.name + "</span>" +
                '<span class="sr-meta">' + pin + " " + d.division + " · " + d.category + "</span></span>" +
                '<span class="sr-go">' + (I18N ? I18N.t("search.view") : "View") + "</span></a>";
        }).join("");
        openResults();
    }

    if (searchInput) {
        var debounce = null;
        searchInput.addEventListener("input", function () {
            var q = searchInput.value;
            if (window.I18N) { /* app.js also filters the grid; keep both in sync */ }
            clearTimeout(debounce);
            debounce = setTimeout(function () {
                var list = searchDestinations(q);
                if (q) renderResults(list);
                else closeResults();
            }, 120);
        });
        searchInput.addEventListener("focus", function () {
            var q = searchInput.value;
            if (q) renderResults(searchDestinations(q));
        });
        searchInput.addEventListener("keydown", function (e) {
            if (e.key === "Enter") {
                e.preventDefault();
                var list = searchDestinations(searchInput.value);
                if (list.length) window.location.href = "destination.html?slug=" + list[0].slug;
                else window.location.href = "destinations.html";
            } else if (e.key === "Escape") {
                closeResults();
            }
        });
        if (searchGo) searchGo.addEventListener("click", function () {
            var list = searchDestinations(searchInput.value);
            if (list.length) window.location.href = "destination.html?slug=" + list[0].slug;
            else window.location.href = "destinations.html";
        });
        document.addEventListener("click", function (e) {
            if (resultsBox && !resultsBox.contains(e.target) && e.target.id !== "searchInput") {
                closeResults();
            }
        });
    }

    /* ---------- Hero popular quick links ---------- */
    var POPULAR_SLUGS = ["coxs-bazar", "sajek-valley", "sylhet", "bandarban"];
    var popularLinks = document.getElementById("popularLinks");

    function renderPopularLinks() {
        if (!popularLinks || typeof DESTINATIONS === "undefined") return;
        var label = popularLinks.querySelector(".pl-label");
        POPULAR_SLUGS.forEach(function (slug) {
            var d = findDest(slug);
            if (!d) return;
            var a = document.createElement("a");
            a.href = "destination.html?slug=" + d.slug;
            a.textContent = d.name;
            popularLinks.appendChild(a);
        });
        /* Re-insert the label first if a language change re-renders */
        if (label && popularLinks.firstChild !== label) {
            popularLinks.insertBefore(label, popularLinks.firstChild);
        }
    }

    /* ---------- Explore by experience (quick navigation) ---------- */
    var EXPERIENCES = [
        { key: "beaches", emoji: "🏖", category: "Beach", title: "experience.beaches" },
        { key: "mountains", emoji: "⛰", category: "Mountain", title: "experience.mountains" },
        { key: "nature", emoji: "🌿", category: "Nature", title: "experience.nature" },
        { key: "heritage", emoji: "🏛", category: "Heritage", title: "experience.heritage" },
        { key: "islands", emoji: "🏝", category: "Island", title: "experience.islands" },
        { key: "spiritual", emoji: "🕌", category: "Religious", title: "experience.spiritual" }
    ];
    var experienceGrid = document.getElementById("experienceGrid");

    /* Compare against the canonical English category even when the global
       destination list is localized to Bangla. */
    function canonCategoriesOf(d) {
        var out = [];
        var dict = (window.I18N && I18N.taxonomy && I18N.taxonomy.category) ? I18N.taxonomy.category : {};
        (d.categories || []).forEach(function (c) {
            var en = c;
            var keys = Object.keys(dict);
            for (var i = 0; i < keys.length; i++) {
                if (dict[keys[i]] === c) { en = keys[i]; break; }
            }
            out.push(en);
        });
        return out;
    }
    function countByCategory(cat) {
        if (typeof DESTINATIONS === "undefined") return 0;
        return DESTINATIONS.filter(function (d) { return canonCategoriesOf(d).indexOf(cat) !== -1; }).length;
    }

    function renderExperience() {
        if (!experienceGrid) return;
        experienceGrid.innerHTML = EXPERIENCES.map(function (exp) {
            var count = countByCategory(exp.category);
            return '<a class="exp-card" href="destinations.html?category=' + encodeURIComponent(exp.category) + '">' +
                '<span class="exp-emoji" aria-hidden="true">' + exp.emoji + "</span>" +
                '<span class="exp-body">' +
                    '<span class="exp-name">' + (I18N ? I18N.t(exp.title) : exp.key) + "</span>" +
                    '<span class="exp-count">' + (I18N ? I18N.fmt("experience.count", { n: bnNum(count) }) : (count + " destinations")) + "</span>" +
                "</span>" +
                '<span class="exp-go">' +
                    (I18N ? I18N.t("experience.view") : "Explore") +
                    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>' +
                "</span>" +
            "</a>";
        }).join("");
    }

    /* ---------- Featured hotels & restaurants (via the travel API) ---------- */
    var SERVICES_SLUGS = ["Cox's Bazar", "Sylhet", "Bandarban"];

    function servicesFallback(message, page, linkKey) {
        return '<div class="featured-services-fallback">' +
            '<p class="fs-text">' + message + "</p>" +
            '<a class="btn btn-primary" href="' + page + '">' +
                '<span>' + (I18N ? I18N.t(linkKey) : linkKey) + "</span>" +
                '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>' +
            "</a>" +
        "</div>";
    }

    function renderFeaturedHotels() {
        var el = document.getElementById("featuredHotels");
        if (!el) return;
        if (!window.API || !API.configured || !window.TRAVEL_UI || typeof DESTINATIONS === "undefined") {
            el.innerHTML = servicesFallback(I18N.t("stay.prompt"), "hotels.html", "stay.link");
            return;
        }
        Promise.all(SERVICES_SLUGS.map(function (name) {
            return API.hotels.search({ destination: name, limit: 2 });
        })).then(function (results) {
            var items = [];
            results.forEach(function (res) {
                if (res.ok && res.data && res.data.items) items = items.concat(res.data.items.slice(0, 2));
            });
            if (!items.length) { el.innerHTML = servicesFallback(I18N.t("stay.prompt"), "hotels.html", "stay.link"); return; }
            el.innerHTML = '<div class="travel-grid home-services-grid">' +
                items.slice(0, 4).map(TRAVEL_UI.hotelCard).join("") +
            "</div>";
        }).catch(function () {
            el.innerHTML = servicesFallback(I18N.t("stay.prompt"), "hotels.html", "stay.link");
        });
    }

    function renderFeaturedRestaurants() {
        var el = document.getElementById("featuredRestaurants");
        if (!el) return;
        if (!window.API || !API.configured || !window.TRAVEL_UI || typeof DESTINATIONS === "undefined") {
            el.innerHTML = servicesFallback(I18N.t("eat.prompt"), "restaurants.html", "eat.link");
            return;
        }
        Promise.all(SERVICES_SLUGS.map(function (name) {
            return API.restaurants.search({ destination: name, limit: 2 });
        })).then(function (results) {
            var items = [];
            results.forEach(function (res) {
                if (res.ok && res.data && res.data.items) items = items.concat(res.data.items.slice(0, 2));
            });
            if (!items.length) { el.innerHTML = servicesFallback(I18N.t("eat.prompt"), "restaurants.html", "eat.link"); return; }
            el.innerHTML = '<div class="travel-grid home-services-grid">' +
                items.slice(0, 4).map(TRAVEL_UI.restaurantCard).join("") +
            "</div>";
        }).catch(function () {
            el.innerHTML = servicesFallback(I18N.t("eat.prompt"), "restaurants.html", "eat.link");
        });
    }

    /* ---------- Transport modes ---------- */
    var TRANSPORT_MODES = [
        { type: "bus", title: "move.bus", sub: "move.bus.sub", ico: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="3" width="16" height="12" rx="2"/><path d="M4 15v4M18 15v4M6 19h10M4 9h12"/><circle cx="7" cy="18" r="1.6"/><circle cx="15" cy="18" r="1.6"/></svg>' },
        { type: "train", title: "move.train", sub: "move.train.sub", ico: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="4" y="3" width="16" height="13" rx="3"/><path d="M4 12h16M9 19l-2 2M15 19l2 2M7 16h.01M17 16h.01"/></svg>' },
        { type: "ferry", title: "move.launch", sub: "move.launch.sub", ico: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 16l2 3h16l2-3M4 16l1-8h14l1 8M9 8l1-3h4l1 3M12 16v-8"/></svg>' },
        { type: "flight", title: "move.flight", sub: "move.flight.sub", ico: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10.5 13.5L3 10.5L2 12l6 3.5l3 2L17 21l1-2l-5.5-5.5L14 11l5.5 2.5L21 12l-2.5-5.5L17 5l-2 6l-2.5-2.5L12 4l-1.5 1l3 7.5z"/></svg>' },
        { type: "taxi", title: "move.local", sub: "move.local.sub", ico: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 11l1.5-4.5A2 2 0 0 1 8.4 5h7.2a2 2 0 0 1 1.9 1.5L19 11M5 11h14a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1h-1v2M5 11H4a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h1v2"/><circle cx="8" cy="17" r="1"/><circle cx="16" cy="17" r="1"/></svg>' }
    ];
    var transportGrid = document.getElementById("transportGrid");

    function renderTransport() {
        if (!transportGrid) return;
        transportGrid.innerHTML = TRANSPORT_MODES.map(function (mode) {
            return '<a class="move-card" href="transport.html?type=' + encodeURIComponent(mode.type) + '">' +
                '<span class="mv-ico">' + mode.ico + "</span>" +
                '<span class="mv-body">' +
                    '<span class="mv-name">' + (I18N ? I18N.t(mode.title) : mode.title) + "</span>" +
                    '<span class="mv-sub">' + (I18N ? I18N.t(mode.sub) : mode.sub) + "</span>" +
                "</span>" +
                '<svg class="mv-go" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>' +
            "</a>";
        }).join("");
    }

    /* ---------- Travel inspiration (editorial, data-backed) ---------- */
    var INSPIRATION_PICKS = [
        { slug: "coxs-bazar", title: "inspiration.card1.title", sub: "inspiration.card1.sub" },
        { slug: "sajek-valley", title: "inspiration.card2.title", sub: "inspiration.card2.sub" },
        { slug: "sundarbans", title: "inspiration.card3.title", sub: "inspiration.card3.sub" }
    ];
    var inspirationGrid = document.getElementById("inspirationGrid");

    function renderInspiration() {
        if (!inspirationGrid || typeof DESTINATIONS === "undefined") return;
        var card = function (d, copy) {
            var category = (window.I18N && I18N.mapTax) ? I18N.mapTax(d.category, I18N.taxonomy.category) : d.category;
            var best = (I18N ? I18N.t("inspiration.bestTime") : "Best time") + ": " + (d.bestTime || "—");
            return '<a class="insp-card" href="destination.html?slug=' + d.slug + '">' +
                '<div class="insp-media"><img src="' + d.image + '" alt="' + d.name + '" loading="lazy" />' +
                    '<span class="insp-tag">' + category + "</span>" +
                "</div>" +
                '<div class="insp-body">' +
                    "<h3>" + (I18N ? I18N.t(copy.title) : copy.title) + "</h3>" +
                    '<p class="insp-sub">' + (I18N ? I18N.t(copy.sub) : copy.sub) + "</p>" +
                    '<p class="insp-meta">' + d.name + " · " + best + "</p>" +
                "</div>" +
            "</a>";
        };
        var html = "";
        INSPIRATION_PICKS.forEach(function (copy) {
            var d = findDest(copy.slug);
            if (d) html += card(d, copy);
        });
        inspirationGrid.innerHTML = html || "";
    }

    /* ---------- Init ---------- */
    document.addEventListener("DOMContentLoaded", function () {
        renderTicker();
        renderPopularLinks();
        renderExperience();
        renderFeaturedHotels();
        renderFeaturedRestaurants();
        renderTransport();
        renderInspiration();
    });
})(window, document);
