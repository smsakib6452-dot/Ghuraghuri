/* ============================================================================
   GHURAGHURI - DISCOVERY PAGE (destinations.html)
   Search + filters (division / district / category / popularity / featured),
   sorting and a destination card grid over the full 64-district database.
   ============================================================================ */

(function (window, document) {
    "use strict";

    var TAX = (typeof TAXONOMY !== "undefined") ? TAXONOMY : null;

    var state = {
        query: "",
        division: "",
        district: "",
        category: "",
        popularity: "",
        featured: false,
        sort: "featured"
    };

    var grid = document.getElementById("discoverGrid");
    var count = document.getElementById("discoverCount");
    var empty = document.getElementById("discoverEmpty");
    var searchInput = document.getElementById("discoverSearch");
    var divSel = document.getElementById("dcDivision");
    var distSel = document.getElementById("dcDistrict");
    var catSel = document.getElementById("dcCategory");
    var popSel = document.getElementById("dcPopularity");
    var featCheck = document.getElementById("dcFeatured");
    var sortSel = document.getElementById("dcSort");

    var BN_DIGITS = "০১২৩৪৫৬৭৮৯";
    function bnNum(str) {
        if (!(window.I18N && I18N.isBn && I18N.isBn())) return String(str);
        return String(str).replace(/[0-9]/g, function (d) { return BN_DIGITS[d]; });
    }

    function t(key) { return (window.I18N && I18N.t) ? I18N.t(key) : ""; }
    function fmt(key, vals) { return (window.I18N && I18N.fmt) ? I18N.fmt(key, vals) : ""; }

    /* Map a localized value back to its canonical English key using the
       i18n taxonomy dict (works in both EN and BN mode). */
    function englishOf(value, dict) {
        if (!value || !dict) return value;
        var keys = Object.keys(dict);
        for (var i = 0; i < keys.length; i++) {
            if (dict[keys[i]] === value) return keys[i];
        }
        return value;
    }
    function localizedOf(value, dict) {
        if (!(window.I18N && I18N.mapTax)) return value;
        return I18N.mapTax(value, dict);
    }

    var divisionDict = (window.I18N && I18N.taxonomy) ? I18N.taxonomy.division : {};
    var districtDict = (window.I18N && I18N.taxonomy) ? I18N.taxonomy.district : {};
    var categoryDict = (window.I18N && I18N.taxonomy) ? I18N.taxonomy.category : {};

    function canDiv(d) { return englishOf(d.division, divisionDict); }
    function canDist(d) { return englishOf(d.district, districtDict); }

    /* Canonical (English) categories for a destination — robust in bn mode,
       where the global list is localized and filters use English values. */
    function canCats(d) {
        var out = [];
        (d.categories || []).forEach(function (c) { out.push(englishOf(c, categoryDict)); });
        return out;
    }
    function hasCat(d, cat) { return canCats(d).indexOf(cat) !== -1; }
    function hasAny(d, cats) { return cats.some(function (c) { return hasCat(d, c); }); }

    /* ---------- Populate filter options ---------- */
    function fillSelect(sel, options, dict) {
        sel.innerHTML = "";
        var all = document.createElement("option");
        all.value = "";
        all.textContent = t("filter.all") || "All";
        sel.appendChild(all);
        options.forEach(function (opt) {
            var o = document.createElement("option");
            o.value = opt;
            o.textContent = localizedOf(opt, dict);
            sel.appendChild(o);
        });
    }

    function buildControls() {
        var divisions = [];
        if (TAX) {
            TAX.DIVISIONS.forEach(function (d) { divisions.push(d.name); });
        } else {
            divisions = Object.keys(divisionDict);
        }
        fillSelect(divSel, divisions, divisionDict);

        var cats = [];
        if (TAX) {
            TAX.CATEGORIES.forEach(function (c) { cats.push(c.name); });
        } else {
            cats = Object.keys(categoryDict);
        }
        fillSelect(catSel, cats, categoryDict);

        fillSelect(popSel, ["very_high", "high", "medium", "low"], {
            "very_high": t("pop.very_high") || "Very popular",
            "high": t("pop.high") || "Popular",
            "medium": t("pop.medium") || "Moderately popular",
            "low": t("pop.low") || "Lesser known"
        });

        rebuildDistricts();
    }

    function rebuildDistricts() {
        var options = [];
        if (TAX) {
            var list = state.division
                ? TAX.DISTRICTS.filter(function (d) { return TAX.divisionOfDistrict(d.name) && TAX.divisionOfDistrict(d.name).name === state.division; })
                : TAX.DISTRICTS.slice();
            options = list.map(function (d) { return d.name; });
        } else {
            options = Object.keys(districtDict);
        }
        var prev = state.district;
        fillSelect(distSel, options, districtDict);
        distSel.value = (options.indexOf(prev) !== -1) ? prev : "";
        state.district = distSel.value;
    }

    /* ---------- Filtering & sorting ---------- */
    function matches(d) {
        if (state.division && canDiv(d) !== state.division) return false;
        if (state.district && canDist(d) !== state.district) return false;
        if (state.category && canCats(d).indexOf(state.category) === -1) return false;
        if (state.popularity && d.popularity !== state.popularity) return false;
        if (state.featured && !d.featured) return false;
        var q = state.query.trim().toLowerCase();
        if (!q) return true;
        var haystack = (window.I18N && I18N.searchText)
            ? I18N.searchText(d)
            : (d.name + " " + d.name_bn + " " + d.division + " " + d.district + " " +
                d.category + " " + d.shortDesc).toLowerCase();
        return q.split(/\s+/).every(function (word) { return haystack.indexOf(word) !== -1; });
    }

    function sorted(list) {
        var out = list.slice();
        switch (state.sort) {
            case "rating":
                out.sort(function (a, b) { return b.rating - a.rating; });
                break;
            case "reviews":
                out.sort(function (a, b) { return b.reviews - a.reviews; });
                break;
            case "popularity":
                out.sort(function (a, b) {
                    var order = { "very_high": 4, "high": 3, "medium": 2, "low": 1 };
                    var d = (order[b.popularity] || 0) - (order[a.popularity] || 0);
                    return d !== 0 ? d : b.reviews - a.reviews;
                });
                break;
            case "name":
                out.sort(function (a, b) { return a.name.localeCompare(b.name); });
                break;
            default:
                out.sort(function (a, b) {
                    var fb = (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
                    return fb !== 0 ? fb : a.id - b.id;
                });
        }
        return out;
    }

    function cardHTML(d) {
        var pin = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>';
        return '<article class="card">' +
            '<a class="card-img" href="destination.html?slug=' + d.slug + '">' +
                '<img src="' + d.image + '" alt="' + d.name + '" loading="lazy" />' +
                '<span class="card-tag">' + localizedOf(d.category, categoryDict) + "</span>" +
                '<span class="card-rating"><span class="star">★</span> ' + d.rating + "</span>" +
            "</a>" +
            '<div class="card-body">' +
                "<h3>" + d.name + "</h3>" +
                '<div class="card-loc">' + pin + " " + d.division + " · " + d.district + "</div>" +
                '<p class="card-desc">' + d.shortDesc + "</p>" +
                '<div class="card-footer">' +
                    '<a class="card-link" href="destination.html?slug=' + d.slug + '">' + (t("card.viewGuide") || "View guide") + ' <span class="cl-arrow"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg></span></a>' +
                "</div>" +
            "</div>" +
        "</article>";
    }

    function render() {
        var list = sorted(DESTINATIONS.filter(matches));
        grid.innerHTML = list.map(cardHTML).join("");
        count.textContent = fmt("discover.resultCount", { a: bnNum(list.length) });
        empty.hidden = list.length > 0;
    }

    /* ---------- Explore by division (below the grid) ---------- */
    var divisionGrid = document.getElementById("divisionGrid");
    var divisionCount = document.getElementById("divisionCount");

    function countByDivision(name) {
        return DESTINATIONS.filter(function (d) { return canDiv(d) === name; }).length;
    }

    function renderDivisions() {
        if (!divisionGrid || typeof DESTINATIONS === "undefined" || !TAX) return;
        var pin = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>';
        divisionGrid.innerHTML = TAX.DIVISIONS.map(function (div) {
            var name = div.name;
            var localized = localizedOf(name, divisionDict);
            var count = countByDivision(name);
            return '<a class="division-card" data-division="' + name + '" href="#" role="button">' +
                '<span class="dv-ico">' + pin + "</span>" +
                '<span class="dv-body"><span class="dv-name">' + localized + "</span>" +
                '<span class="dv-count">' + bnNum(count) + " " + (t("division.destinations") || "destinations") + "</span></span></a>";
        }).join("");
        if (divisionCount) {
            divisionCount.textContent = fmt("division.count", { d: bnNum(TAX.DIVISIONS.length), t: bnNum(DESTINATIONS.length) });
        }
        divisionGrid.querySelectorAll(".division-card").forEach(function (card) {
            card.addEventListener("click", function (e) {
                e.preventDefault();
                var name = card.getAttribute("data-division");
                window.location.href = "destinations.html?division=" + encodeURIComponent(name);
            });
        });
    }

    /* ---------- Explore by theme (below the grid) ---------- */
    var THEMES = [
        { key: "beaches", title: "home.section.beaches", category: "Beach", pick: function (d) { return hasCat(d, "Beach"); } },
        { key: "mountains", title: "home.section.mountains", category: "Mountain", pick: function (d) { return hasAny(d, ["Mountain", "Hill"]); } },
        { key: "nature", title: "home.section.nature", category: "Nature", pick: function (d) { return hasAny(d, ["Nature", "Forest", "Waterfall", "Lake", "Haor"]); } },
        { key: "historical", title: "home.section.historical", category: "Historical", pick: function (d) { return hasAny(d, ["Historical", "Archaeological", "Heritage", "Palace", "Mosque", "Religious"]); } },
        { key: "hidden", title: "home.section.hidden", category: null, pick: function (d) { return d.rating >= 4.0; } },
        { key: "islands", title: "home.section.islands", category: "Island", pick: function (d) { return hasCat(d, "Island"); } },
        { key: "cultural", title: "home.section.cultural", category: "Cultural", pick: function (d) { return hasAny(d, ["Cultural", "Museum", "Village"]); } }
    ];
    var usedThemeSlugs = {};
    var themeStrips = document.getElementById("themeStrips");

    function themePicks(config) {
        var used = usedThemeSlugs[config.key] || {};
        var list = DESTINATIONS.filter(function (d) {
            if (!config.pick(d)) return false;
            if (used[d.slug]) return false;
            if (Object.keys(usedThemeSlugs).some(function (k) { return usedThemeSlugs[k][d.slug]; })) return false;
            return true;
        }).sort(function (a, b) { return b.rating - a.rating; }).slice(0, 4);
        list.forEach(function (d) { used[d.slug] = true; });
        usedThemeSlugs[config.key] = used;
        return list;
    }

    function stripHTML(config, list) {
        var moreHref = config.category
            ? "destinations.html?category=" + encodeURIComponent(config.category)
            : "destinations.html";
        return '<div class="cat-strip-block">' +
            '<div class="cat-strip-head">' +
                "<h3>" + (t(config.title) || config.key) + "</h3>" +
                '<a class="chip-link" href="' + moreHref + '">' + (t("home.section.seeMore") || "See more") + " →</a>" +
            "</div>" +
            '<div class="cat-strip">' + list.map(cardHTML).join("") + "</div>" +
        "</div>";
    }

    function renderThemes() {
        if (!themeStrips || typeof DESTINATIONS === "undefined") return;
        usedThemeSlugs = {};
        themeStrips.innerHTML = THEMES.map(function (config) {
            return stripHTML(config, themePicks(config));
        }).join("");
    }

    /* ---------- Explore by district (below the grid) ---------- */
    var districtStrip = document.getElementById("districtStrip");
    var districtCount = document.getElementById("districtCount");

    function renderDistricts() {
        if (!districtStrip || typeof DESTINATIONS === "undefined" || !TAX) return;
        var districts = TAX.DISTRICTS.slice();
        if (!districts.length) {
            var seen = {};
            DESTINATIONS.forEach(function (d) {
                if (!seen[d.district]) { seen[d.district] = true; districts.push({ name: d.district }); }
            });
        }
        districtStrip.innerHTML = districts.map(function (di) {
            return '<a class="chip-link" href="destinations.html?district=' + encodeURIComponent(di.name) + '">' +
                localizedOf(di.name, districtDict) + "</a>";
        }).join("");
        if (districtCount) {
            districtCount.textContent = fmt("home.section.explore.districts", { n: bnNum(districts.length), t: bnNum(DESTINATIONS.length) });
        }
    }

    function wire() {
        var debounce = null;
        searchInput.addEventListener("input", function () {
            clearTimeout(debounce);
            debounce = setTimeout(function () {
                state.query = searchInput.value;
                render();
            }, 150);
        });

        divSel.addEventListener("change", function () {
            state.division = divSel.value;
            state.district = "";
            rebuildDistricts();
            render();
        });
        distSel.addEventListener("change", function () { state.district = distSel.value; render(); });
        catSel.addEventListener("change", function () { state.category = catSel.value; render(); });
        popSel.addEventListener("change", function () { state.popularity = popSel.value; render(); });
        featCheck.addEventListener("change", function () { state.featured = featCheck.checked; render(); });
        sortSel.addEventListener("change", function () { state.sort = sortSel.value; render(); });

        function reset() {
            state.query = ""; state.division = ""; state.district = ""; state.category = "";
            state.popularity = ""; state.featured = false; state.sort = "featured";
            searchInput.value = "";
            divSel.value = ""; catSel.value = ""; popSel.value = ""; sortSel.value = "featured";
            featCheck.checked = false;
            rebuildDistricts();
            render();
        }
        var clearBtn = document.getElementById("dcClear");
        var resetBtn = document.getElementById("discoverReset");
        if (clearBtn) clearBtn.addEventListener("click", reset);
        if (resetBtn) resetBtn.addEventListener("click", reset);
    }

    /* Apply optional query params (?division=..&district=..&category=..) */
    function applyQuery() {
        try {
            var params = new URLSearchParams(window.location.search);
            var division = params.get("division");
            var district = params.get("district");
            var category = params.get("category");
            if (division && divSel) {
                var divOptions = Array.prototype.slice.call(divSel.options).map(function (o) { return o.value; });
                if (divOptions.indexOf(division) !== -1) { state.division = division; divSel.value = division; rebuildDistricts(); }
            }
            if (district && distSel) {
                var distOptions = Array.prototype.slice.call(distSel.options).map(function (o) { return o.value; });
                if (distOptions.indexOf(district) !== -1) { state.district = district; distSel.value = district; }
            }
            if (category && catSel) {
                var catOptions = Array.prototype.slice.call(catSel.options).map(function (o) { return o.value; });
                if (catOptions.indexOf(category) !== -1) { state.category = category; catSel.value = category; }
            }
        } catch (e) { /* ignore */ }
    }

    document.addEventListener("DOMContentLoaded", function () {
        buildControls();
        wire();
        applyQuery();
        render();
        renderDivisions();
        renderThemes();
        renderDistricts();
    });
})(window, document);