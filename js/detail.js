/* ============================================================================
   BANGLADESH TRAVEL EXPLORER - DESTINATION DETAIL PAGE LOGIC
   ============================================================================ */

(function (window, document) {
    "use strict";

    var params = new URLSearchParams(window.location.search);
    var slug = params.get("slug");
    var dest = slug ? getDestinationBySlug(slug) : null;

    function starsHTML(rating) {
        var out = "";
        for (var i = 0; i < 5; i++) out += i < Math.round(rating) ? "★" : "☆";
        return out;
    }

    function chipList(items) {
        return items.map(function (t) {
            return '<span class="chip">' + t + "</span>";
        }).join("");
    }

    function render() {
        dest = I18N.localizeDest(dest);
        document.getElementById("crumbName").textContent = dest.name;
        document.title = dest.name + " — " + (I18N.isBn() ? "বাংলাদেশ ট্রাভেল এক্সপ্লোরার" : "Bangladesh Travel Explorer");

        document.getElementById("detailImage").src = dest.imageLg;
        document.getElementById("detailImage").alt = dest.name;
        document.getElementById("detailName").textContent = dest.name;
        document.getElementById("detailLocation").textContent =
            "📍 " + dest.division + " · " + dest.district;
        document.getElementById("detailTags").innerHTML = chipList(dest.categories);
        document.getElementById("detailStars").textContent = starsHTML(dest.rating);
        document.getElementById("detailRatingText").textContent =
            dest.rating + " · " + I18N.fmt("detail.reviews", { r: dest.reviews.toLocaleString() });
        document.getElementById("detailShort").textContent = dest.shortDesc;
        document.getElementById("detailDesc").textContent = dest.description;

        document.getElementById("gmapsLink").href =
            CONFIG.GOOGLE_MAPS_SEARCH + encodeURIComponent(dest.name + " Bangladesh");

        document.getElementById("detailGallery").innerHTML = dest.gallery.map(function (src) {
            return '<img src="' + src + '" alt="' + dest.name + '" loading="lazy" />';
        }).join("");

        document.getElementById("detailActivities").innerHTML = dest.activities.map(function (a) {
            return "<li>" + a + "</li>";
        }).join("");

        document.getElementById("detailAttractions").innerHTML = dest.attractions.map(function (a) {
            return "<li>" + a + "</li>";
        }).join("");

        document.getElementById("detailTips").innerHTML = dest.tips.map(function (t) {
            return "<li>" + t + "</li>";
        }).join("");

        var ti = dest.travelInfo;
        document.getElementById("detailTravel").innerHTML =
            '<div class="ti-row"><span class="ti-label">' + I18N.t("ti.from") + '</span><span>' + ti.from + "</span></div>" +
            '<div class="ti-row"><span class="ti-label">' + I18N.t("ti.distance") + '</span><span>' + ti.distanceKm + " km</span></div>" +
            '<div class="ti-row"><span class="ti-label">' + I18N.t("ti.duration") + '</span><span>' + ti.duration + "</span></div>" +
            '<div class="ti-row"><span class="ti-label">' + I18N.t("ti.route") + '</span><span>' + ti.route + "</span></div>" +
            '<div class="ti-row"><span class="ti-label">' + I18N.t("ti.transport") + '</span>' +
                '<div class="ti-transport">' + ti.transport.map(function (t) {
                    return "<span>" + t + "</span>";
                }).join("") + "</div></div>" +
            (ti.flight ? '<div class="ti-row"><span class="ti-label">' + I18N.t("ti.flight") + '</span><span>' + ti.flight + "</span></div>" : "");

        document.getElementById("factDivision").textContent = dest.division;
        document.getElementById("factDistrict").textContent = dest.district;
        document.getElementById("factBestTime").textContent = dest.bestTime;
        document.getElementById("factDays").textContent = dest.recommendedDays;
        document.getElementById("factDifficulty").textContent = dest.difficulty;
        document.getElementById("factBudget").textContent = dest.budget;
        document.getElementById("factType").textContent = dest.travelType;

        document.getElementById("detailCoords").textContent =
            dest.latitude.toFixed(4) + "°N, " + dest.longitude.toFixed(4) + "°E";

        document.getElementById("detailHero").hidden = false;
        document.getElementById("detailBody").hidden = false;

        MAP.createDetailMap("detailMap", dest);
        WEATHER.renderSingleWeather("weatherCard", dest);
    }

    function init() {
        if (!dest) {
            document.getElementById("detailMissing").hidden = false;
            return;
        }
        render();
    }

    document.addEventListener("DOMContentLoaded", init);
})(window, document);