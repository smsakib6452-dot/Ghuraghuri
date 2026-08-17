/* ============================================================================
   GHURAGHURI - TRAVEL HUB PAGE
   Unified search across hotels / restaurants / transport for a destination.
   Shows result counts per category and links out to the service pages.
   ============================================================================ */

(function (window, document) {
    "use strict";

    var UI = window.TRAVEL_UI;
    var API = window.API;
    var resultEl = document.getElementById("trvResult");

    if (!API || !API.configured) {
        if (resultEl) resultEl.innerHTML = UI.error("The travel services API is not configured. Set API_BASE_URL in config.js.");
        return;
    }

    var state = { destination: "", tab: "all" };

    function readParams() {
        try {
            var p = new URLSearchParams(window.location.search);
            var to = p.get("to");
            if (to) state.destination = to;
            var from = p.get("from");
            var type = p.get("type");
            if (from && to) state.tab = "transport";
            else if (type === "transport") state.tab = "transport";
            else if (type === "hotels") state.tab = "hotels";
            else if (type === "restaurants") state.tab = "restaurants";
        } catch (e) { /* ignore */ }
    }

    function setActiveTab(tab) {
        state.tab = tab;
        var tabs = document.querySelectorAll("#trvTabs .travel-tab");
        tabs.forEach(function (b) {
            var on = b.getAttribute("data-tab") === tab;
            b.classList.toggle("active", on);
            b.setAttribute("aria-selected", on ? "true" : "false");
        });
    }

    function bind() {
        UI.locationAutocomplete(document.getElementById("trvDestination"), function (item) {
            state.destination = item.name;
        });

        document.getElementById("trvSearch").addEventListener("click", run);
        var dest = document.getElementById("trvDestination");
        if (dest) dest.addEventListener("keydown", function (e) { if (e.key === "Enter") run(); });

        var tabs = document.querySelectorAll("#trvTabs .travel-tab");
        tabs.forEach(function (btn) {
            btn.addEventListener("click", function () {
                tabs.forEach(function (b) { b.classList.remove("active"); b.setAttribute("aria-selected", "false"); });
                btn.classList.add("active");
                btn.setAttribute("aria-selected", "true");
                state.tab = btn.getAttribute("data-tab");
                if (state.destination) run();
            });
        });
    }

    function sectionCard(tab, title, count, items, cardFn, link) {
        var html = '<section class="trv-section">';
        html += '<div class="trv-section-head">';
        html += '<h2>' + title + '</h2>';
        html += '<span class="trv-count">' + (count || 0) + "</span>";
        if (link) html += '<a class="trv-link" href="' + link + '">' + (I18N ? I18N.t("travel.seeAll", "See all") : "See all") + " →</a>";
        html += "</div>";
        if (items && items.length) {
            html += '<div class="travel-grid">' + items.map(cardFn).join("") + "</div>";
        } else {
            html += UI.empty(I18N ? I18N.fmt("travel.none", { s: tab }) : "No " + tab + " found for this destination.");
        }
        html += "</section>";
        return html;
    }

    function renderAll(data) {
        var hotels = data.hotels || {}, restaurants = data.restaurants || {}, transport = data.transport || {};
        var html = data.fallback ? UI.fallbackBanner() : UI.demoBanner("", data.demo);
        html += sectionCard("hotels",
            (I18N ? I18N.t("travel.section.hotels", "Hotels") : "Hotels"),
            hotels.total, hotels.items, UI.hotelCard,
            "hotels.html?destination=" + encodeURIComponent(state.destination));
        html += sectionCard("restaurants",
            (I18N ? I18N.t("travel.section.restaurants", "Restaurants") : "Restaurants"),
            restaurants.total, restaurants.items, UI.restaurantCard,
            "restaurants.html?destination=" + encodeURIComponent(state.destination));
        html += sectionCard("transport",
            (I18N ? I18N.t("travel.section.transport", "Transport") : "Transport"),
            transport.total, transport.items, UI.transportCard,
            "transport.html?from=" + encodeURIComponent("Dhaka") + "&to=" + encodeURIComponent(state.destination));
        resultEl.innerHTML = html;
    }

    function run() {
        state.destination = document.getElementById("trvDestination").value.trim();
        if (!state.destination) {
            resultEl.innerHTML = UI.empty(I18N ? I18N.t("travel.prompt", "Where do you want to go?") : "Where do you want to go?");
            return;
        }
        var btn = document.getElementById("trvSearch");
        if (btn) btn.disabled = true;
        resultEl.innerHTML = UI.loading(I18N ? I18N.t("travel.loading", "Searching travel options…") : "Searching travel options…");

        function done(res) {
            if (btn) btn.disabled = false;
            if (!res.ok) {
                resultEl.innerHTML = UI.error(res.error.message);
                return;
            }
            var data = res.data || {};
            var banner = res.fallback ? UI.fallbackBanner() : UI.demoBanner(data.provider, !!data.demo);
            if (state.tab === "hotels") {
                resultEl.innerHTML = banner + (data.total ? '<div class="travel-count">' + data.total + "</div>" : "") + (data.items && data.items.length ? '<div class="travel-grid">' + data.items.map(UI.hotelCard).join("") + "</div>" : UI.empty(I18N ? I18N.t("hotels.empty", "No hotels found") : "No hotels found"));
            } else if (state.tab === "restaurants") {
                resultEl.innerHTML = banner + (data.total ? '<div class="travel-count">' + data.total + "</div>" : "") + (data.items && data.items.length ? '<div class="travel-grid">' + data.items.map(UI.restaurantCard).join("") + "</div>" : UI.empty(I18N ? I18N.t("restaurants.empty", "No restaurants found") : "No restaurants found"));
            } else if (state.tab === "transport") {
                resultEl.innerHTML = banner + (data.items && data.items.length ? '<div class="travel-grid transport-grid">' + data.items.map(UI.transportCard).join("") + "</div>" : UI.empty(I18N ? I18N.t("transport.empty", "No transport options found") : "No transport options found"));
            } else {
                renderAll(data);
            }
        }

        if (state.tab === "hotels") {
            API.hotels.search({ destination: state.destination, limit: 6 }).then(done);
        } else if (state.tab === "restaurants") {
            API.restaurants.search({ destination: state.destination, limit: 6 }).then(done);
        } else if (state.tab === "transport") {
            API.transport.search({ from: "Dhaka", to: state.destination }).then(done);
        } else {
            Promise.all([
                API.hotels.search({ destination: state.destination, limit: 3 }),
                API.restaurants.search({ destination: state.destination, limit: 3 }),
                API.transport.search({ from: "Dhaka", to: state.destination })
            ]).then(function (results) {
                var anyFailed = results.some(function (r) { return !r.ok; });
                if (anyFailed) {
                    var msg = results.map(function (r) { return r.ok ? "" : r.error.message; }).filter(Boolean).join("; ");
                    resultEl.innerHTML = UI.error(msg);
                    return;
                }
                renderAll({
                    hotels: results[0].data, restaurants: results[1].data, transport: results[2].data,
                    demo: results[0].data.demo,
                    fallback: results.some(function (r) { return r.fallback; })
                });
            });
        }
    }

    readParams();
    setActiveTab(state.tab);
    bind();
    document.getElementById("trvDestination").value = state.destination;
    if (state.destination) {
        run();
    } else {
        resultEl.innerHTML = UI.empty(I18N ? I18N.t("travel.prompt", "Where do you want to go?") : "Where do you want to go?");
    }
})(window, document);