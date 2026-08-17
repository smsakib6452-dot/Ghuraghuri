/* ============================================================================
   BANGLADESH TRAVEL EXPLORER - ADMIN PANEL LOGIC
   Login gate + destination CRUD backed by ADMIN_STORE (localStorage).
   ============================================================================ */

(function (window, document) {
    "use strict";

    var AUTH_KEY = "ghuraghuri_admin_auth";
    var base = ADMIN_STORE.base;
    var store = ADMIN_STORE.get();

    var views = {
        login: document.getElementById("adminLogin"),
        dashboard: document.getElementById("adminDashboard"),
        editor: document.getElementById("adminEditor")
    };

    var searchValue = "";
    var statusFilter = "all";

    /* ---------- Helpers ---------- */

    function slugify(text) {
        return String(text).toLowerCase().trim()
            .replace(/['’]/g, "")
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "");
    }

    function isBuiltin(slug) {
        return ADMIN_STORE.findBySlug(base, slug) !== null;
    }

    function statusOf(d) {
        if (ADMIN_STORE.isHidden(d.slug)) return "hidden";
        if (ADMIN_STORE.isCustom(d.slug)) return "custom";
        return "builtin";
    }

    function escapeHTML(s) {
        return String(s).replace(/[&<>"']/g, function (c) {
            return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
        });
    }

    function splitLines(text) {
        return String(text).split(/\n+/).map(function (s) { return s.trim(); }).filter(Boolean);
    }

    function splitCSV(text) {
        return String(text).split(",").map(function (s) { return s.trim(); }).filter(Boolean);
    }

    function buildGallery(photoId, extra) {
        var ids = photoId ? [photoId] : [];
        splitCSV(extra).forEach(function (id) { if (id !== photoId) ids.push(id); });
        return ids.map(function (id) {
            return id.indexOf("http") === 0 ? id : u(id, 1200);
        });
    }

    function show(view) {
        Object.keys(views).forEach(function (k) { views[k].hidden = k !== view; });
        if (view === "dashboard") {
            renderAll();
            loadProviders();
        }
    }

    /* ---------- Travel service providers ---------- */

    function loadProviders() {
        var body = document.getElementById("adminProvidersBody");
        if (!body) return;
        if (!window.API || !window.API.configured) {
            body.innerHTML = '<p class="admin-provider-note">' + I18N.t("admin.providers.notConfigured") + "</p>";
            return;
        }
        body.innerHTML = '<p class="admin-provider-note">' + I18N.t("admin.providers.loading") + "</p>";
        API.providers().then(function (res) {
            if (!res.ok) {
                body.innerHTML = '<p class="admin-provider-note">' + I18N.t("admin.providers.error") + "</p>";
                return;
            }
            var list = (res.data && res.data.providers) || [];
            body.innerHTML = '<div class="provider-list">' + list.map(function (p) {
                var on = !!p.configured;
                var badge = on
                    ? '<span class="provider-badge on">' + I18N.t("admin.providers.on") + "</span>"
                    : '<span class="provider-badge">' + I18N.t("admin.providers.off") + "</span>";
                return '<div class="provider-row"><strong>' + p.provider + "</strong>" + badge + "</div>";
            }).join("") + "</div>";
        });
    }

    /* ---------- Auth ---------- */

    function isAuthed() {
        try { return window.localStorage.getItem(AUTH_KEY) === "1"; } catch (e) { return false; }
    }

    function isAdminRole() {
        try { return window.localStorage.getItem("ghuraghuri_admin_role") === CONFIG.ADMIN_ROLE; } catch (e) { return false; }
    }

    function initAuth() {
        if (CONFIG.ADMIN_ENABLED === false) {
            views.login.innerHTML =
                '<div class="admin-login"><h1>Admin disabled</h1>' +
                '<p class="admin-login-note">Set ADMIN_ENABLED to true in config to use the panel.</p></div>';
            views.login.hidden = false;
            return;
        }
        if (isAuthed() && isAdminRole()) { show("dashboard"); return; }
        show("login");
    }

    /* ---------- Table ---------- */

    function renderStats() {
        document.getElementById("statTotal").textContent = ADMIN_STORE.build().length;
        document.getElementById("statBuiltin").textContent =
            base.length - store.hidden.length;
        document.getElementById("statCustom").textContent = store.custom.length;
        document.getElementById("statHidden").textContent = store.hidden.length;
        document.getElementById("adminCount").textContent =
            I18N.fmt("admin.count", { n: ADMIN_STORE.build().length });
    }

    function renderTable() {
        var body = document.getElementById("adminTableBody");
        var all = ADMIN_STORE.build();
        var q = searchValue.trim().toLowerCase();

        var rows = all.filter(function (d) {
            if (statusFilter !== "all" && statusOf(d) !== statusFilter) return false;
            if (!q) return true;
            return (d.name + " " + d.division + " " + d.district + " " + d.slug)
                .toLowerCase().indexOf(q) !== -1;
        });

        if (!rows.length) {
            body.innerHTML = '<tr><td colspan="7" class="admin-note" style="text-align:center;padding:30px;">' +
                I18N.t("admin.empty") + "</td></tr>";
            return;
        }

        body.innerHTML = rows.map(function (d) {
            var st = statusOf(d);
            var badge = st === "custom"
                ? '<span class="badge badge-custom">' + I18N.t("admin.badge.custom") + "</span>"
                : st === "hidden"
                    ? '<span class="badge badge-hidden">' + I18N.t("admin.badge.hidden") + "</span>"
                    : '<span class="badge badge-builtin">' + I18N.t("admin.badge.builtin") + "</span>";

            var actions =
                '<a class="btn" href="destination.html?slug=' + d.slug + '" target="_blank" rel="noopener">' + I18N.t("admin.view") + "</a>" +
                '<button class="btn" data-act="edit" data-slug="' + d.slug + '">' + I18N.t("admin.edit") + "</button>" +
                '<button class="btn" data-act="toggle" data-slug="' + d.slug + '">' +
                    (st === "hidden" ? I18N.t("admin.show") : I18N.t("admin.hide")) + "</button>" +
                (st === "custom"
                    ? '<button class="btn btn-danger" data-act="delete" data-slug="' + d.slug + '">' + I18N.t("admin.delete") + "</button>"
                    : "");

            return '<tr class="' + (st === "hidden" ? "row-hidden" : "") + '">' +
                '<td class="name-cell">' + escapeHTML(d.name) + "<small>" + escapeHTML(d.slug) + "</small></td>" +
                "<td>" + escapeHTML(d.division) + " · " + escapeHTML(d.district) + "</td>" +
                "<td>" + escapeHTML(d.category) + "</td>" +
                "<td>" + d.rating + "</td>" +
                "<td>" + d.reviews.toLocaleString() + "</td>" +
                "<td>" + badge + "</td>" +
                '<td><div class="row-actions">' + actions + "</div></td>" +
                "</tr>";
        }).join("");
    }

    function renderAll() {
        renderStats();
        renderTable();
    }

    /* ---------- Editor ---------- */

    var editing = null; /* { mode: "new"|"builtin"|"custom", slug: string|null } */

    function openEditor(mode, dest) {
        editing = { mode: mode, slug: dest ? dest.slug : null };
        document.getElementById("editorEyebrow").textContent =
            mode === "new" ? I18N.t("admin.editor.add") : I18N.t("admin.editor.edit");
        document.getElementById("editorTitle").textContent =
            mode === "new" ? I18N.t("admin.editor.add") : dest.name;

        var f = dest || {
            name: "", slug: "", division: "Dhaka", district: "", category: "",
            categories: [], rating: 4.0, reviews: 0, latitude: "", longitude: "",
            photoId: "", gallery: [], shortDesc: "", description: "", bestTime: "",
            recommendedDays: "", difficulty: "Easy", budget: "", travelType: "",
            activities: [], attractions: [], tips: [],
            travelInfo: { from: "Dhaka", distanceKm: "", duration: "", route: "", transport: [], flight: "" },
            name_bn: "", upazila: "", tags: [], popularity: "medium", status: "active",
            featured: false, things_to_do: [], what_to_see: [], travel_tips: [],
            transport_options: [], nearby_destinations: [], nearby_hotels: []
        };

        var t = f.travelInfo || {};
        setVal("f-name", f.name);
        setVal("f-slug", f.slug);
        setVal("f-division", f.division || "Dhaka");
        setVal("f-district", f.district);
        setVal("f-category", f.category);
        setVal("f-categories", (f.categories || []).join(", "));
        setVal("f-name_bn", f.name_bn || "");
        setVal("f-upazila", f.upazila || "");
        setVal("f-tags", (f.tags || []).join(", "));
        setVal("f-popularity", f.popularity || "medium");
        setVal("f-status", f.status || "active");
        setVal("f-featured", f.featured ? "on" : "");
        setVal("f-rating", f.rating);
        setVal("f-reviews", f.reviews);
        setVal("f-latitude", f.latitude);
        setVal("f-longitude", f.longitude);
        setVal("f-photo", f.photoId || "");
        setVal("f-gallery", (f.galleryIds || []).join(", "));
        setVal("f-shortDesc", f.shortDesc);
        setVal("f-description", f.description);
        setVal("f-bestTime", f.bestTime);
        setVal("f-days", f.recommendedDays);
        setVal("f-difficulty", f.difficulty || "Easy");
        setVal("f-budget", f.budget);
        setVal("f-travelType", f.travelType);
        setVal("f-activities", (f.activities || []).join("\n"));
        setVal("f-attractions", (f.attractions || []).join("\n"));
        setVal("f-tips", (f.tips || []).join("\n"));
        setVal("f-ti-from", t.from);
        setVal("f-ti-distance", t.distanceKm);
        setVal("f-ti-duration", t.duration);
        setVal("f-ti-route", t.route);
        setVal("f-ti-transport", (t.transport || []).join(", "));
        setVal("f-ti-flight", t.flight || "");
        setVal("f-things_to_do", (f.things_to_do || []).join("\n"));
        setVal("f-what_to_see", (f.what_to_see || []).join("\n"));
        setVal("f-travel_tips", (f.travel_tips || []).join("\n"));
        setVal("f-transport_options", (f.transport_options || []).join(", "));
        setVal("f-nearby_destinations", (f.nearby_destinations || []).join(", "));
        setVal("f-nearby_hotels", (f.nearby_hotels || []).join(", "));
        updatePreview();
        show("editor");
    }

    function setVal(id, value) {
        var el = document.getElementById(id);
        if (el) el.value = value == null ? "" : value;
    }

    function collectForm() {
        var name = getVal("f-name").trim();
        var slug = getVal("f-slug").trim() || slugify(name);
        var photoId = getVal("f-photo").trim();

        var dest = {
            id: editing.mode === "new" ? ADMIN_STORE.maxId() + 1 :
                ADMIN_STORE.findBySlug(
                    editing.mode === "custom" ? store.custom : base, editing.slug).id,
            name: name,
            slug: slug,
            division: getVal("f-division").trim(),
            district: getVal("f-district").trim(),
            category: getVal("f-category").trim(),
            categories: splitCSV(getVal("f-categories")),
            rating: parseFloat(getVal("f-rating")) || 0,
            reviews: parseInt(getVal("f-reviews"), 10) || 0,
            latitude: parseFloat(getVal("f-latitude")),
            longitude: parseFloat(getVal("f-longitude")),
            shortDesc: getVal("f-shortDesc").trim(),
            description: getVal("f-description").trim(),
            bestTime: getVal("f-bestTime").trim(),
            recommendedDays: getVal("f-days").trim(),
            difficulty: getVal("f-difficulty").trim(),
            budget: getVal("f-budget").trim(),
            travelType: getVal("f-travelType").trim(),
            activities: splitLines(getVal("f-activities")),
            attractions: splitLines(getVal("f-attractions")),
            tips: splitLines(getVal("f-tips")),
            travelInfo: {
                from: getVal("f-ti-from").trim() || "Dhaka",
                distanceKm: parseInt(getVal("f-ti-distance"), 10) || 0,
                duration: getVal("f-ti-duration").trim(),
                route: getVal("f-ti-route").trim(),
                transport: splitCSV(getVal("f-ti-transport")),
                flight: getVal("f-ti-flight").trim() || null
            },
            name_bn: getVal("f-name_bn").trim(),
            upazila: getVal("f-upazila").trim(),
            tags: splitCSV(getVal("f-tags")),
            popularity: getVal("f-popularity").trim() || "medium",
            status: getVal("f-status").trim() || "active",
            featured: getVal("f-featured") === "on",
            things_to_do: splitLines(getVal("f-things_to_do")),
            what_to_see: splitLines(getVal("f-what_to_see")),
            travel_tips: splitLines(getVal("f-travel_tips")),
            transport_options: splitCSV(getVal("f-transport_options")),
            nearby_destinations: splitCSV(getVal("f-nearby_destinations")),
            nearby_hotels: splitCSV(getVal("f-nearby_hotels"))
        };

        /* Images: rebuild from a photo id, otherwise keep the existing ones. */
        var existing = editing.mode !== "new"
            ? ADMIN_STORE.findBySlug(editing.mode === "custom" ? store.custom : base, editing.slug)
            : null;
        if (photoId) {
            dest.photoId = photoId;
            dest.galleryIds = splitCSV(getVal("f-gallery"));
            dest.image = u(photoId, 1200);
            dest.imageLg = u(photoId, 1800);
            dest.gallery = buildGallery(photoId, getVal("f-gallery"));
        } else if (existing) {
            dest.photoId = existing.photoId || "";
            dest.galleryIds = existing.galleryIds || [];
            dest.image = existing.image;
            dest.imageLg = existing.imageLg;
            dest.gallery = existing.gallery;
        }
        return dest;
    }

    function validate(dest) {
        var errors = [];
        if (!dest.name) errors.push("Name is required");
        if (!dest.slug) errors.push("A valid slug is required");
        if (!dest.category) errors.push("Primary category is required");
        if (!dest.division) errors.push("Division is required");
        if (!dest.district) errors.push("District is required");
        if (isNaN(dest.latitude) || isNaN(dest.longitude)) errors.push("Coordinates are required");
        if (!dest.image) errors.push("Image is required (enter an Unsplash photo id)");
        if (dest.rating < 0 || dest.rating > 5) errors.push("Rating must be between 0 and 5");
        return errors;
    }

    function saveForm() {
        var dest = collectForm();
        var errors = validate(dest);
        if (errors.length) {
            alert("Please fix: " + errors.join("; "));
            return;
        }
        if (editing.mode === "builtin") {
            ADMIN_STORE.upsertBuiltIn(dest, editing.slug);
        } else {
            ADMIN_STORE.upsertCustom(dest, editing.slug);
        }
        store = ADMIN_STORE.get();
        show("dashboard");
    }

    function getVal(id) {
        var el = document.getElementById(id);
        return el ? el.value : "";
    }

    function updatePreview() {
        var id = getVal("f-photo").trim();
        var img = document.getElementById("previewImg");
        var holder = document.querySelector(".preview-placeholder");
        if (id) {
            img.src = id.indexOf("http") === 0 ? id : u(id, 400);
            img.hidden = false;
            if (holder) holder.hidden = true;
        } else {
            img.hidden = true;
            if (holder) holder.hidden = false;
        }
    }

    /* ---------- Route guard ---------- */

    function requireAdmin() {
        if (!isAuthed() || !isAdminRole()) {
            /* Remove auth token and role so login view reappears */
            try {
                window.localStorage.removeItem(AUTH_KEY);
                window.localStorage.removeItem("ghuraghuri_admin_role");
            } catch (e) {}
            show("login");
        }
    }

    /* ---------- Wire up ---------- */

    function wire() {
        document.getElementById("loginForm").addEventListener("submit", function (e) {
            e.preventDefault();
            var err = document.getElementById("loginError");
            if (getVal("adminPassword") === CONFIG.ADMIN_PASSWORD) {
                try {
                    window.localStorage.setItem(AUTH_KEY, "1");
                    window.localStorage.setItem("ghuraghuri_admin_role", CONFIG.ADMIN_ROLE);
                } catch (x) {}
                err.hidden = true;
                show("dashboard");
            } else {
                err.hidden = false;
            }
        });

        document.getElementById("adminSearch").addEventListener("input", function () {
            searchValue = this.value;
            renderTable();
        });
        document.getElementById("adminStatusFilter").addEventListener("change", function () {
            statusFilter = this.value;
            renderTable();
        });

        document.getElementById("adminAdd").addEventListener("click", function () {
            openEditor("new", null);
        });

        document.getElementById("adminImport").addEventListener("click", function () {
            document.getElementById("adminImportFile").click();
        });
        document.getElementById("adminImportFile").addEventListener("change", function () {
            var file = this.files && this.files[0];
            this.value = "";
            if (!file) return;
            var reader = new FileReader();
            reader.onload = function () {
                try {
                    var arr = JSON.parse(reader.result);
                    if (!Array.isArray(arr)) throw new Error("Not an array");
                    var count = 0;
                    arr.forEach(function (d) {
                        if (!d || !d.name || !d.slug) return;
                        d.featured = !!d.featured;
                        ADMIN_STORE.upsertCustom(d, d.slug);
                        count++;
                    });
                    store = ADMIN_STORE.get();
                    renderAll();
                    alert("Imported " + count + " destinations.");
                } catch (e) {
                    alert("Import failed: " + e.message);
                }
            };
            reader.readAsText(file);
        });

        document.getElementById("editorBack").addEventListener("click", function () { show("dashboard"); });
        document.getElementById("editorCancel").addEventListener("click", function () { show("dashboard"); });

        document.getElementById("editorForm").addEventListener("submit", function (e) {
            e.preventDefault();
            saveForm();
        });

        document.getElementById("f-name").addEventListener("input", function () {
            if (!getVal("f-slug").trim()) {
                setVal("f-slug", slugify(this.value));
            }
        });
        document.getElementById("f-photo").addEventListener("input", updatePreview);

        document.getElementById("adminReset").addEventListener("click", function () {
            if (!isAdminRole()) {
                alert(I18N.t("admin.disabled.note"));
                return;
            }
            if (confirm("Remove ALL admin changes (added, edited and hidden destinations)? This cannot be undone.")) {
                ADMIN_STORE.reset();
                store = ADMIN_STORE.get();
                renderAll();
            }
        });

        document.getElementById("adminTableBody").addEventListener("click", function (e) {
            var btn = e.target.closest("[data-act]");
            if (!btn) return;
            if (!isAdminRole()) {
                alert(I18N.t("admin.disabled.note"));
                return;
            }
            var slug = btn.dataset.slug;
            var act = btn.dataset.act;
            var all = ADMIN_STORE.build();
            var dest = ADMIN_STORE.findBySlug(all, slug);
            if (!dest) return;

            if (act === "edit") {
                openEditor(ADMIN_STORE.isCustom(slug) ? "custom" : "builtin", dest);
            } else if (act === "toggle") {
                ADMIN_STORE.hide(slug, !ADMIN_STORE.isHidden(slug));
                store = ADMIN_STORE.get();
                renderAll();
            } else if (act === "delete") {
                if (confirm("Delete custom destination \"" + dest.name + "\"?")) {
                    ADMIN_STORE.removeCustom(slug);
                    store = ADMIN_STORE.get();
                    renderAll();
                }
            }
        });
    }

    document.addEventListener("DOMContentLoaded", function () {
        wire();
        initAuth();
        requireAdmin();
    });
})(window, document);