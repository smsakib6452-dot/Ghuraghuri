/* ============================================================================
   GHURAGHURI - TRANSPORT PAGE
   Transport options between two places + a point-to-point route estimate.
   Live schedules are only shown when a real provider is configured; otherwise
   the page shows typical travel modes, clearly labelled as demo.
   ============================================================================ */

(function (window, document) {
    "use strict";

    var UI = window.TRAVEL_UI;
    var API = window.API;
    var resultEl = document.getElementById("trResult");

    if (!API || !API.configured) {
        if (resultEl) resultEl.innerHTML = UI.error("The travel services API is not configured. Set API_BASE_URL in config.js.");
        return;
    }

    var state = { from: "", to: "", departure_date: "", passengers: 2, type: "", route: null };

    function readParams() {
        try {
            var p = new URLSearchParams(window.location.search);
            state.from = p.get("from") || "";
            state.to = p.get("to") || "";
            state.type = p.get("type") || "";
        } catch (e) { /* ignore */ }
    }

    function bind() {
        UI.locationAutocomplete(document.getElementById("trFrom"), function (item) { state.from = item.name; });
        UI.locationAutocomplete(document.getElementById("trTo"), function (item) { state.to = item.name; });

        ["trDate", "trPassengers", "trType"].forEach(function (id) {
            var el = document.getElementById(id);
            if (el) el.addEventListener("change", function () {
                if (id === "trDate") state.departure_date = el.value;
                if (id === "trPassengers") state.passengers = parseInt(el.value, 10) || 2;
                if (id === "trType") state.type = el.value;
            });
        });

        document.getElementById("trSearch").addEventListener("click", run);
        ["trFrom", "trTo"].forEach(function (id) {
            var el = document.getElementById(id);
            if (el) el.addEventListener("keydown", function (e) { if (e.key === "Enter") run(); });
        });
    }

    function routeCard(route) {
        if (!route) return "";
        var mode = route.travel_mode || "driving";
        var dur = UI.humanDuration(route.duration_minutes);
        return '<div class="route-card">' +
            '<h3>' + (I18N ? I18N.t("transport.route.title", "Route estimate") : "Route estimate") + "</h3>" +
            '<div class="route-line">' + route.origin + " → " + route.destination + "</div>" +
            '<div class="route-stats">' +
                '<div class="rs-stat"><span>' + (I18N ? I18N.t("transport.route.distance", "Distance") : "Distance") + '</span><strong>' + route.distance_km + " km</strong></div>" +
                '<div class="rs-stat"><span>' + (I18N ? I18N.t("transport.route.time", "Est. time") : "Est. time") + '</span><strong>' + dur + "</strong></div>" +
                '<div class="rs-stat"><span>' + (I18N ? I18N.t("transport.route.mode", "Mode") : "Mode") + '</span><strong>' + (I18N ? (I18N.t("transport." + mode, mode)) : mode) + "</strong></div>" +
            "</div>" +
            (route.note ? '<p class="travel-message">' + route.note + "</p>" : "") +
            (route.steps && route.steps.length
                ? '<ol class="route-steps">' + route.steps.map(function (s) { return "<li>" + s.instruction + "</li>"; }).join("") + "</ol>"
                : "") +
        "</div>";
    }

    function renderResult(res, route) {
        var data = res.data || {};
        var items = data.items || [];
        var html = "";

        html += res.fallback ? UI.fallbackBanner() : UI.demoBanner(data.provider, !!data.demo);
        if (data.message) html += '<p class="travel-message">' + data.message + "</p>";

        if (route) html += routeCard(route);

        if (!items.length) {
            html += UI.empty(I18N ? I18N.t("transport.empty", "No transport options found") : "No transport options found");
            resultEl.innerHTML = html;
            return;
        }
        html += '<div class="travel-grid transport-grid">' + items.map(UI.transportCard).join("") + "</div>";
        resultEl.innerHTML = html;
    }

    function run() {
        state.from = document.getElementById("trFrom").value.trim();
        state.to = document.getElementById("trTo").value.trim();
        if (!state.from || !state.to) {
            resultEl.innerHTML = UI.empty(I18N ? I18N.t("transport.prompt", "Enter both departure and destination.") : "Enter both departure and destination.");
            return;
        }
        var btn = document.getElementById("trSearch");
        if (btn) btn.disabled = true;
        resultEl.innerHTML = UI.loading(I18N ? I18N.t("transport.loading", "Searching transport options…") : "Searching transport options…");
        var params = {
            from: state.from, to: state.to,
            departure_date: state.departure_date || undefined,
            passengers: state.passengers,
            transport_type: state.type || undefined
        };
        API.transport.search(params).then(function (res) {
            if (btn) btn.disabled = false;
            if (!res.ok) {
                resultEl.innerHTML = UI.error(res.error.message);
                return;
            }
            /* Also fetch a driving route estimate for context. */
            API.routes.route({ origin: state.from, destination: state.to, travel_mode: "driving" }).then(function (routeRes) {
                renderResult(res, routeRes.ok ? routeRes.data : null);
            }).catch(function () {
                renderResult(res, null);
            });
        });
    }

    readParams();
    bind();
    document.getElementById("trFrom").value = state.from;
    document.getElementById("trTo").value = state.to;
    if (state.type) document.getElementById("trType").value = state.type;
    if (state.from && state.to) {
        run();
    } else {
        resultEl.innerHTML = UI.empty(I18N ? I18N.t("transport.prompt", "Enter both departure and destination.") : "Enter both departure and destination.");
    }
})(window, document);