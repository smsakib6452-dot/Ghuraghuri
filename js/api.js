/* ============================================================================
   GHURAGHURI - TRAVEL SERVICES API CLIENT
   Thin fetch wrapper for the Ghuraghuri backend (api/). The frontend NEVER
   talks to an external provider directly — all requests go to our own API so
   API keys stay server-side.
   ============================================================================ */

(function (window) {
    "use strict";

    /* When API_BASE_URL is empty, derive it from the current page so the
       site works under any server/folder layout: the PHP backend always
       lives in the "api" directory next to the frontend pages. */
    function defaultBaseUrl() {
        try {
            var path = window.location.pathname || "/";
            var dir = path.replace(/[^/]*$/, "").replace(/\/+$/, "");
            return dir + "/api";
        } catch (e) {
            return "";
        }
    }

    var baseUrl = (window.CONFIG && window.CONFIG.API_BASE_URL) ? window.CONFIG.API_BASE_URL.replace(/\/+$/, "") : defaultBaseUrl();
    var configured = baseUrl !== "";

    function qs(params) {
        var parts = [];
        Object.keys(params || {}).forEach(function (k) {
            var v = params[k];
            if (v === undefined || v === null || v === "") return;
            parts.push(encodeURIComponent(k) + "=" + encodeURIComponent(v));
        });
        return parts.length ? "?" + parts.join("&") : "";
    }

    /* Friendly, specific error messages for common HTTP failures. */
    function httpErrorMessage(status) {
        if (status === 404) return "The travel services endpoint was not found on the server.";
        if (status === 401 || status === 403) return "The travel services server rejected the request (authentication error).";
        if (status === 408) return "The travel services request timed out.";
        if (status === 429) return "Too many requests to the travel services. Please wait a moment and try again.";
        if (status >= 500) return "The travel services server hit an error. Please try again shortly.";
        return "The travel services request failed (HTTP " + status + ").";
    }

    /* Core request. Returns { ok, status, data, error } and never throws. */
    function request(path, params) {
        if (!configured) {
            return Promise.resolve({
                ok: false,
                status: 0,
                data: null,
                error: { code: "api_not_configured", message: "The travel services API is not configured." }
            });
        }
        var url = baseUrl + path + qs(params);
        var controller = new AbortController();
        var timer = window.setTimeout(function () { controller.abort(); }, 20000);
        return fetch(url, { signal: controller.signal })
            .then(function (res) {
                return res.json().catch(function () { return null; }).then(function (data) {
                    if (!res.ok) {
                        var err = (data && data.error) || { code: "http_" + res.status, message: httpErrorMessage(res.status) };
                        console.warn("[ghuraghuri-api] " + path + " failed with HTTP " + res.status + ":", err.code);
                        return { ok: false, status: res.status, data: null, error: err };
                    }
                    return { ok: true, status: res.status, data: data, error: null };
                });
            })
            .catch(function (e) {
                var timedOut = !!(e && e.name === "AbortError");
                if (timedOut) {
                    console.warn("[ghuraghuri-api] " + path + " timed out after 20s.");
                    return {
                        ok: false, status: 0, data: null,
                        error: { code: "timeout", message: "The travel services took too long to respond. Please try again." }
                    };
                }
                console.warn("[ghuraghuri-api] " + path + " network error:", e && e.message);
                return {
                    ok: false, status: 0, data: null,
                    error: { code: "network_error", message: "Could not reach the travel services API. Is the backend running?" }
                };
            })
            .finally(function () { window.clearTimeout(timer); });
    }

    window.API = {
        configured: configured,
        baseUrl: baseUrl,

        health: function () { return request("/health"); },
        providers: function () { return request("/providers/status"); },

        autocomplete: function (q, limit) {
            return request("/locations/autocomplete", { q: q, limit: limit || 8 });
        },

        hotels: {
            search: function (p) { return request("/hotels/search", p); },
            details: function (id) { return request("/hotels/" + encodeURIComponent(id)); }
        },

        restaurants: {
            search: function (p) { return request("/restaurants/search", p); },
            nearby: function (p) { return request("/restaurants/nearby", p); },
            details: function (id) { return request("/restaurants/" + encodeURIComponent(id)); }
        },

        transport: {
            search: function (p) { return request("/transport/search", p); }
        },

        routes: {
            route: function (p) { return request("/routes", p); }
        }
    };
})(window);