/* ============================================================================
   GHURAGHURI - OUTPUT ENCODING HELPERS (XSS defence)
   Every dynamic string that is concatenated into an HTML template MUST pass
   through one of these helpers. Data from the travel API (Google Places etc.),
   localStorage (admin edits) and URL parameters is treated as untrusted.

     SAFE.html(str)   -> escape for element text / attribute values
     SAFE.url(str)    -> allow only http(s), relative and data:image URLs;
                         anything else (javascript:, vbscript:, data:text…)
                         collapses to "#" / "" and is then HTML-escaped
     SAFE.img(str)    -> same as url() but returns "" for unsafe values so
                         callers can fall back to a placeholder
   ============================================================================ */

(function (window) {
    "use strict";

    var MAP = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;", "`": "&#96;" };
    var RE = /[&<>"'`]/g;

    function html(value) {
        if (value === null || value === undefined) return "";
        return String(value).replace(RE, function (ch) { return MAP[ch]; });
    }

    /* Strip ASCII control chars + whitespace that browsers ignore inside a
       scheme (e.g. "java\tscript:"), then inspect the scheme. */
    function cleanScheme(value) {
        return String(value).replace(/[\u0000-\u0020\u007F-\u009F]+/g, "").toLowerCase();
    }

    function isSafeUrl(value, allowDataImage) {
        if (value === null || value === undefined) return false;
        var raw = String(value).trim();
        if (!raw) return false;
        var s = cleanScheme(raw);
        var scheme = s.match(/^([a-z][a-z0-9+.\-]*):/);
        if (!scheme) return true; /* relative URL, fragment or query */
        if (scheme[1] === "http" || scheme[1] === "https" || scheme[1] === "mailto" || scheme[1] === "tel") return true;
        if (allowDataImage && /^data:image\/(png|jpe?g|gif|webp|avif|svg\+xml)[;,]/.test(s)) return true;
        return false;
    }

    function url(value) {
        return isSafeUrl(value, false) ? html(String(value).trim()) : "#";
    }

    var PLACEHOLDER_SVG = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="800" height="500">' +
        '<defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#061a14"/><stop offset="100%" stop-color="#0e3d2c"/></linearGradient></defs>' +
        '<rect width="100%" height="100%" fill="url(#bg)"/>' +
        '<circle cx="400" cy="210" r="44" fill="#f4a340" opacity="0.15"/>' +
        '<circle cx="400" cy="210" r="32" fill="none" stroke="#f4a340" stroke-width="2.5" opacity="0.8"/>' +
        '<polygon points="400,185 407,210 400,205 393,210" fill="#f4a340"/>' +
        '<polygon points="400,235 407,210 400,215 393,210" fill="#c47a28"/>' +
        '<path d="M120 420 Q280 290 440 370 T760 360 L760 500 L120 500 Z" fill="#144d37" opacity="0.5"/>' +
        '<path d="M60 450 Q220 340 380 410 T740 430 L800 500 L60 500 Z" fill="#1b5e43" opacity="0.8"/>' +
        '<text x="400" y="290" text-anchor="middle" font-family="sans-serif" font-size="20" font-weight="700" fill="#e2f5ec" letter-spacing="3">GHURAGHURI</text>' +
        '<text x="400" y="318" text-anchor="middle" font-family="sans-serif" font-size="13" fill="#8cb9a6">Discover Bangladesh</text>' +
        '</svg>'
    );

    /* Universal fallback: catches any 404/broken <img> across all pages and recovers it gracefully */
    if (typeof document !== "undefined" && document.addEventListener) {
        document.addEventListener("error", function (e) {
            var el = e.target;
            if (el && el.tagName === "IMG" && !el.dataset.phApplied) {
                el.dataset.phApplied = "1";
                el.src = PLACEHOLDER_SVG;
            }
        }, true);
    }

    window.SAFE = Object.freeze({
        html: html,
        url: url,
        img: function (v) { return isSafeUrl(v, true) ? html(String(v).trim()) : PLACEHOLDER_SVG; },
        isSafeUrl: isSafeUrl,
        placeholder: PLACEHOLDER_SVG
    });
})(window);

