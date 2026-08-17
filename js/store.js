/* ============================================================================
   BANGLADESH TRAVEL EXPLORER - ADMIN STORE + DATA MERGE
   Persists admin changes (add / edit / hide) in the browser's localStorage
   and merges them into the global DESTINATIONS list used by every page.
   Load AFTER data/destinations.js and BEFORE the page logic scripts.

   Store shape (key "ghuraghuri_admin_v1"):
   {
     custom:  [dest, ...],        // new destinations added by the admin
     updates: { slug: dest, ... },// full replacements for built-in entries
     hidden:  [slug, ...]         // built-in destinations hidden from the site
   }
   ============================================================================ */

(function (window) {
    "use strict";

    var KEY = "ghuraghuri_admin_v1";

    /* The original destinations shipped in data/destinations.js. */
    var BASE = (typeof DESTINATIONS !== "undefined") ? DESTINATIONS.slice() : [];

    function empty() {
        return { custom: [], updates: {}, hidden: [] };
    }

    function read() {
        try {
            var raw = window.localStorage.getItem(KEY);
            if (!raw) return empty();
            var data = JSON.parse(raw);
            data.custom = data.custom || [];
            data.updates = data.updates || {};
            data.hidden = data.hidden || [];
            return data;
        } catch (e) {
            return empty();
        }
    }

    function save(store) {
        try {
            window.localStorage.setItem(KEY, JSON.stringify(store));
        } catch (e) {
            /* Storage full / unavailable — silently degrade. */
        }
    }

    var store = read();

    /* Merge base + overrides into the public list. */
    function build() {
        var merged = BASE.slice();
        merged = merged.filter(function (d) {
            return store.hidden.indexOf(d.slug) === -1;
        });
        merged = merged.map(function (d) {
            return store.updates[d.slug] || d;
        });
        merged = merged.concat(store.custom);
        return merged;
    }

    /* Overwrite the global DESTINATIONS so app/map/detail/weather all see
       the admin-managed list. (destinations.js declares it with `var`.) */
    if (typeof DESTINATIONS !== "undefined") {
        DESTINATIONS = build();
    }

    /* Global helper used by detail.js to resolve a destination by slug from
       the (merged) live list. */
    window.getDestinationBySlug = function (slug) {
        if (typeof DESTINATIONS === "undefined") return null;
        for (var i = 0; i < DESTINATIONS.length; i++) {
            if (DESTINATIONS[i].slug === slug) return DESTINATIONS[i];
        }
        return null;
    };

    function isCustom(slug) {
        return store.custom.some(function (c) { return c.slug === slug; });
    }

    function isHidden(slug) {
        return store.hidden.indexOf(slug) !== -1;
    }

    function findBySlug(list, slug) {
        var out = null;
        list.forEach(function (d) { if (d.slug === slug) out = d; });
        return out;
    }

    /* Highest id currently in use, so admin-created entries stay unique. */
    function maxId() {
        var m = 0;
        var all = BASE.concat(store.custom);
        all.forEach(function (d) { if (Number(d.id) > m) m = Number(d.id); });
        return m;
    }

    /* ---- Admin mutation helpers ---- */

    function upsertBuiltIn(dest, prevSlug) {
        if (prevSlug && prevSlug !== dest.slug) {
            delete store.updates[prevSlug];
            var hi = store.hidden.indexOf(prevSlug);
            if (hi !== -1) { store.hidden.splice(hi, 1); store.hidden.push(dest.slug); }
        }
        store.updates[dest.slug] = dest;
        save(store);
    }

    function upsertCustom(dest, prevSlug) {
        if (prevSlug && prevSlug !== dest.slug) {
            store.custom = store.custom.filter(function (c) { return c.slug !== prevSlug; });
        }
        var existing = store.custom.some(function (c) { return c.slug === dest.slug; });
        if (!existing) store.custom.push(dest);
        save(store);
    }

    function hide(slug, flag) {
        var i = store.hidden.indexOf(slug);
        var has = i !== -1;
        if (flag && !has) store.hidden.push(slug);
        if (!flag && has) store.hidden.splice(i, 1);
        save(store);
    }

    function removeCustom(slug) {
        store.custom = store.custom.filter(function (c) { return c.slug !== slug; });
        save(store);
    }

    function reset() {
        store = empty();
        save(store);
    }

    window.ADMIN_STORE = {
        KEY: KEY,
        base: BASE,
        get: function () { return store; },
        save: save,
        read: read,
        build: build,
        isCustom: isCustom,
        isHidden: isHidden,
        findBySlug: findBySlug,
        maxId: maxId,
        upsertBuiltIn: upsertBuiltIn,
        upsertCustom: upsertCustom,
        hide: hide,
        removeCustom: removeCustom,
        reset: reset
    };
})(window);