/* ============================================================================
   GHURAGHURI - HOTELS PAGE
   Search hotels via the Ghuraghuri API. Debounced autocomplete, date/guest
   inputs, rating & budget filters, pagination and graceful states.
   ============================================================================ */

(function (window, document) {
    "use strict";

    var UI = window.TRAVEL_UI;
    var API = window.API;
    var resultEl = document.getElementById("htResult");

    if (!API || !API.configured) {
        if (resultEl) resultEl.innerHTML = UI.error("The travel services API is not configured. Set API_BASE_URL in config.js.");
        return;
    }

    var state = {
        destination: "", check_in: "", check_out: "", adults: 2, rooms: 1,
        rating: "4.0", max_price: "6000", hotel_type: "", page: 1, limit: 8
    };

    function readParams() {
        try {
            var p = new URLSearchParams(window.location.search);
            state.destination = p.get("destination") || "";
            state.page = parseInt(p.get("page"), 10) || 1;
        } catch (e) { /* ignore */ }
    }

    function bind() {
        UI.locationAutocomplete(document.getElementById("htDestination"), function (item) {
            state.destination = item.name;
            state.page = 1;
            run();
        });

        ["htCheckIn", "htCheckOut", "htAdults", "htRooms", "htRating", "htMaxPrice", "htType"].forEach(function (id) {
            var el = document.getElementById(id);
            if (el) el.addEventListener("change", function () {
                if (id === "htCheckIn") state.check_in = el.value;
                if (id === "htCheckOut") state.check_out = el.value;
                if (id === "htAdults") state.adults = parseInt(el.value, 10) || 2;
                if (id === "htRooms") state.rooms = parseInt(el.value, 10) || 1;
                if (id === "htRating") state.rating = el.value;
                if (id === "htMaxPrice") state.max_price = el.value;
                if (id === "htType") state.hotel_type = el.value;
                state.page = 1;
                run();
            });
        });

        document.getElementById("htSearch").addEventListener("click", function () {
            state.destination = document.getElementById("htDestination").value.trim();
            state.page = 1;
            run();
        });

        var dest = document.getElementById("htDestination");
        if (dest) dest.addEventListener("keydown", function (e) {
            if (e.key === "Enter") {
                state.destination = dest.value.trim();
                state.page = 1;
                run();
            }
        });
    }

    function renderResult(res) {
        var data = res.data || {};
        var items = data.items || [];
        var isDemo = !!data.demo;
        var message = data.message || null;

        var html = res.fallback ? UI.fallbackBanner() : UI.demoBanner(data.provider, isDemo);
        if (message) html += '<p class="travel-message">' + message + "</p>";

        if (!items.length) {
            resultEl.innerHTML = html + UI.empty(I18N ? I18N.t("hotels.empty", "No hotels found") : "No hotels found");
            return;
        }
        html += '<div class="travel-count">' + (data.total || 0) + " " + (I18N ? I18N.t("hotels.resultCount", "hotels found") : "hotels found") + "</div>";
        html += '<div class="travel-grid">' + items.map(UI.hotelCard).join("") + "</div>";
        html += UI.pagination(data.page || 1, data.pages || 1, goPage);
        resultEl.innerHTML = html;
        UI.wirePagination(resultEl, goPage);
    }

    function goPage(page) {
        state.page = page;
        run();
        window.scrollTo({ top: resultEl.offsetTop - 120, behavior: "smooth" });
    }

    function run() {
        if (!state.destination) {
            resultEl.innerHTML = UI.empty(I18N ? I18N.t("travel.prompt", "Where do you want to stay?") : "Where do you want to stay?");
            return;
        }
        var btn = document.getElementById("htSearch");
        if (btn) btn.disabled = true;
        resultEl.innerHTML = UI.loading(I18N ? I18N.t("hotels.loading", "Searching hotels…") : "Searching hotels…");
        var params = {
            destination: state.destination,
            check_in: state.check_in || undefined,
            check_out: state.check_out || undefined,
            adults: state.adults,
            rooms: state.rooms,
            rating: state.rating || undefined,
            max_price: state.max_price || undefined,
            hotel_type: state.hotel_type || undefined,
            page: state.page,
            limit: state.limit
        };
        API.hotels.search(params).then(function (res) {
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
    document.getElementById("htDestination").value = state.destination;
    if (state.destination) {
        run();
    } else {
        resultEl.innerHTML = UI.empty(I18N ? I18N.t("travel.prompt", "Where do you want to stay?") : "Where do you want to stay?");
    }
})(window, document);