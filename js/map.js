/* ============================================================================
   BANGLADESH TRAVEL EXPLORER - LEAFLET MAP HELPERS
   ============================================================================ */

(function (window) {
    "use strict";

    var MAP = {};

    var homeMap = null;
    var homeLayer = null;

    /* Build a Leaflet tile layer from CONFIG. */
    function createTileLayer() {
        return L.tileLayer(CONFIG.MAP_TILE_URL, {
            maxZoom: 18,
            attribution: CONFIG.MAP_ATTRIBUTION
        });
    }

    function popupHTML(d) {
        var img = '<img class="lp-img" src="' + d.image + '" alt="" />';
        var link = '<a class="lp-link" href="destination.html?slug=' + d.slug + '">View guide →</a>';
        return '<div>' + img +
            '<div class="lp-name">' + d.name + '</div>' +
            '<div class="lp-meta">' + d.category + ' · ' + d.district + '</div>' +
            link + '</div>';
    }

    /* Create the full interactive map for the home page and render markers
       for the given destinations. Rebuilding the layer keeps markers in
       sync with search/filter results. */
    MAP.renderMarkers = function (destinations) {
        var el = document.getElementById("mapContainer");
        if (!el) return;

        if (!homeMap) {
            homeMap = L.map("mapContainer", { scrollWheelZoom: false }).setView([23.6850, 90.3563], 7);
            createTileLayer().addTo(homeMap);
        }

        if (homeLayer) homeMap.removeLayer(homeLayer);

        homeLayer = L.layerGroup();
        destinations.forEach(function (d) {
            L.marker([d.latitude, d.longitude])
                .addTo(homeLayer)
                .bindPopup(popupHTML(d), { maxWidth: 260 });
        });
        homeLayer.addTo(homeMap);
    };

    /* Keep the map's tile grid aligned with the current container size. */
    MAP.invalidate = function () {
        if (homeMap) setTimeout(function () { homeMap.invalidateSize(); }, 50);
    };

    /* Create a single-destination map for the detail page. */
    MAP.createDetailMap = function (elId, destination) {
        var map = L.map(elId, { scrollWheelZoom: false }).setView(
            [destination.latitude, destination.longitude], 9
        );
        createTileLayer().addTo(map);
        L.marker([destination.latitude, destination.longitude])
            .addTo(map)
            .bindPopup("<strong>" + destination.name + "</strong>")
            .openPopup();
        return map;
    };

    window.MAP = MAP;
})(window);