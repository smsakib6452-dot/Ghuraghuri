/* ============================================================================
   GHURAGHURI - RESTAURANTS PAGE
   Search restaurants via the Ghuraghuri API with cuisine / price / rating
   filters, open-now toggle and pagination.
   ============================================================================ */

(function (window, document) {
    "use strict";

    var UI = window.TRAVEL_UI;
    var API = window.API;
    var resultEl = document.getElementById("rtResult");

    if (!API || !API.configured) {
        if (resultEl) resultEl.innerHTML = UI.error("The travel services API is not configured. Set API_BASE_URL in config.js.");
        return;
    }

    var state = { destination: "", cuisine: "", price_level: "", rating: "4.0", open_now: false, page: 1, limit: 8 };

    function readParams() {
        try {
            var p = new URLSearchParams(window.location.search);
            state.destination = p.get("destination") || "";
            state.page = parseInt(p.get("page"), 10) || 1;
        } catch (e) { /* ignore */ }
    }

    function bind() {
        UI.locationAutocomplete(document.getElementById("rtDestination"), function (item) {
            state.destination = item.name;
            state.page = 1;
            run();
        });

        ["rtCuisine", "rtPrice", "rtRating", "rtOpenNow"].forEach(function (id) {
            var el = document.getElementById(id);
            if (el) el.addEventListener("change", function () {
                if (id === "rtCuisine") state.cuisine = el.value;
                if (id === "rtPrice") state.price_level = el.value;
                if (id === "rtRating") state.rating = el.value;
                if (id === "rtOpenNow") state.open_now = el.checked;
                state.page = 1;
                run();
            });
        });

        document.getElementById("rtSearch").addEventListener("click", function () {
            state.destination = document.getElementById("rtDestination").value.trim();
            state.page = 1;
            run();
        });
        var dest = document.getElementById("rtDestination");
        if (dest) dest.addEventListener("keydown", function (e) {
            if (e.key === "Enter") {
                state.destination = dest.value.trim();
                state.page = 1;
                run();
            }
        });
    }

    function goPage(page) {
        state.page = page;
        run();
        window.scrollTo({ top: resultEl.offsetTop - 120, behavior: "smooth" });
    }

    function renderResult(res) {
        var data = res.data || {};
        var items = data.items || [];
        var isDemo = !!data.demo;
        var html = res.fallback ? UI.fallbackBanner() : UI.demoBanner(data.provider, isDemo);
        if (data.message) html += '<p class="travel-message">' + data.message + "</p>";
        if (!items.length) {
            resultEl.innerHTML = html + UI.empty(I18N ? I18N.t("restaurants.empty", "No restaurants found") : "No restaurants found");
            return;
        }
        html += '<div class="travel-count">' + (data.total || 0) + " " + (I18N ? I18N.t("restaurants.resultCount", "places found") : "places found") + "</div>";
        html += '<div class="travel-grid">' + items.map(UI.restaurantCard).join("") + "</div>";
        html += UI.pagination(data.page || 1, data.pages || 1, goPage);
        resultEl.innerHTML = html;
        UI.wirePagination(resultEl, goPage);
    }

    function run() {
        if (!state.destination) {
            resultEl.innerHTML = UI.empty(I18N ? I18N.t("travel.promptEat", "Where do you want to eat?") : "Where do you want to eat?");
            return;
        }
        var btn = document.getElementById("rtSearch");
        if (btn) btn.disabled = true;
        resultEl.innerHTML = UI.loading(I18N ? I18N.t("restaurants.loading", "Searching restaurants…") : "Searching restaurants…");
        API.restaurants.search({
            destination: state.destination,
            cuisine: state.cuisine || undefined,
            price_level: state.price_level || undefined,
            rating: state.rating || undefined,
            open_now: state.open_now ? "true" : undefined,
            page: state.page,
            limit: state.limit
        }).then(function (res) {
            if (btn) btn.disabled = false;
            if (!res.ok) {
                resultEl.innerHTML = UI.error(res.error.message);
                return;
            }
            renderResult(res);
        });
    }

    readParams();
    bind();
    document.getElementById("rtDestination").value = state.destination;
    if (state.destination) {
        run();
    } else {
        resultEl.innerHTML = UI.empty(I18N ? I18N.t("travel.promptEat", "Where do you want to eat?") : "Where do you want to eat?");
    }
})(window, document);