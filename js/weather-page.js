/* ============================================================================
   BANGLADESH TRAVEL EXPLORER - WEATHER PAGE LOGIC
   Shows live weather for every destination, with search and refresh.
   ============================================================================ */

(function (window, document) {
    "use strict";

    var searchInput = document.getElementById("weatherSearch");
    var refreshBtn = document.getElementById("weatherRefresh");
    var count = document.getElementById("weatherCount");
    var query = "";

    function filtered() {
        var q = query.trim().toLowerCase();
        if (!q) return DESTINATIONS.slice();
        return DESTINATIONS.filter(function (d) {
            return (d.name + " " + d.division + " " + d.district + " " + d.shortDesc)
                .toLowerCase().indexOf(q) !== -1;
        });
    }

    function render() {
        var list = filtered();
        count.textContent = I18N.fmt("weather.count", {
            a: list.length,
            t: DESTINATIONS.length
        });
        WEATHER.renderWeatherAll("weatherAll", list, {
            onSelect: function (dest) {
                window.location.href = "destination.html?slug=" + dest.slug;
            }
        });
    }

    function init() {
        render();

        var debounceTimer = null;
        searchInput.addEventListener("input", function () {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(function () {
                query = searchInput.value;
                render();
            }, 180);
        });

        refreshBtn.addEventListener("click", function () {
            WEATHER.clearCache();
            render();
        });
    }

    document.addEventListener("DOMContentLoaded", init);
})(window, document);