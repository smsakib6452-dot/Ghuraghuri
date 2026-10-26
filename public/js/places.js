/**
 * My Chattogram — Experience 03: PLACES I'VE EXPLORED
 * Flagship Travel Exploration Layer & Social Map Creator
 * Sakib's Creation
 *
 * Dedicated State Namespace: ghuraghuri_ctg_places_progress
 */

(function () {
    "use strict";

    const STORAGE_KEY = "ghuraghuri_ctg_places_progress";
    const SVG_WIDTH = 540;
    const SVG_HEIGHT = 880;

    // District Bengali Names Dictionary
    const DISTRICT_NAMES_BN = {
        "Bandarban": "বান্দরবান",
        "Brahmanbaria": "ব্রাহ্মণবাড়িয়া",
        "Chandpur": "চাঁদপুর",
        "Chattogram": "চট্টগ্রাম",
        "Cumilla": "কুমিল্লা",
        "Cox's Bazar": "কক্সবাজার",
        "Feni": "ফেনী",
        "Khagrachhari": "খাগড়াছড়ি",
        "Lakshmipur": "লক্ষ্মীপুর",
        "Noakhali": "নোয়াখালী",
        "Rangamati": "রাঙ্গামাটি"
    };

    // Category Bengali Names Dictionary
    const CATEGORY_NAMES_BN = {
        "Beach": "সমুদ্র সৈকত",
        "Mountain": "পাহাড় ও পর্বত",
        "Nature": "প্রকৃতি",
        "Island": "দ্বীপ",
        "Historical": "ঐতিহাসিক স্থান",
        "Adventure": "অ্যাডভেঞ্চার",
        "Cultural": "সাংস্কৃতিক",
        "Waterfall": "ঝর্ণা ও জলপ্রপাত",
        "Family": "পারিবারিক",
        "River": "নদী ও মোহনা",
        "Hill": "পাহাড়",
        "Lake": "হ্রদ ও লেক",
        "Museum": "জাদুঘর ও স্মারক",
        "Village": "পল্লী ও লোকালয়",
        "National Park": "জাতীয় উদ্যান",
        "Religious": "ধর্মীয় ও তীর্থ"
    };

    // Helper: Safe Hex to RGBA conversion
    function hexToRgba(hex, alpha = 1, darken = false) {
        if (!hex || typeof hex !== 'string') return `rgba(6, 19, 14, ${alpha})`;
        let c = hex.replace('#', '').trim();
        if (c.length === 3) {
            c = c.split('').map(x => x + x).join('');
        }
        let r = parseInt(c.substring(0, 2), 16) || 0;
        let g = parseInt(c.substring(2, 4), 16) || 0;
        let b = parseInt(c.substring(4, 6), 16) || 0;
        if (darken) {
            r = Math.floor(r * 0.7);
            g = Math.floor(g * 0.7);
            b = Math.floor(b * 0.7);
        }
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }

    // Helper: Cross-browser rounded rectangle
    function drawRoundRect(ctx, x, y, w, h, r) {
        if (typeof ctx.roundRect === 'function') {
            ctx.beginPath();
            ctx.roundRect(x, y, w, h, r);
        } else {
            ctx.beginPath();
            ctx.moveTo(x + r, y);
            ctx.lineTo(x + w - r, y);
            ctx.quadraticCurveTo(x + w, y, x + w, y + r);
            ctx.lineTo(x + w, y + h - r);
            ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
            ctx.lineTo(x + r, y + h);
            ctx.quadraticCurveTo(x, y + h, x, y + h - r);
            ctx.lineTo(x, y + r);
            ctx.quadraticCurveTo(x, y, x + r, y);
            ctx.closePath();
        }
    }

    // Themes for Social Poster Generator
    const THEMES = {
        dark: {
            id: 'dark',
            bgTop: '#06130e',
            bgBottom: '#0a1c15',
            landFill: 'rgba(18, 52, 38, 0.95)',
            landStroke: 'rgba(233, 196, 106, 0.55)',
            divisionBorder: '#e9c46a',
            watermarkText: 'rgba(255, 255, 255, 0.32)',
            accent: '#e9c46a',
            accentGlow: 'rgba(233, 196, 106, 0.45)',
            textMain: '#ffffff',
            textSub: '#94aba1',
            textDim: '#5c746a',
            labelBg: 'rgba(6, 19, 14, 0.92)',
            labelBorder: 'rgba(233, 196, 106, 0.45)',
            unselectedDot: 'rgba(255, 255, 255, 0.22)'
        },
        emerald: {
            id: 'emerald',
            bgTop: '#04140f',
            bgBottom: '#08281d',
            landFill: 'rgba(14, 58, 44, 0.95)',
            landStroke: 'rgba(42, 157, 143, 0.65)',
            divisionBorder: '#2a9d8f',
            watermarkText: 'rgba(255, 255, 255, 0.32)',
            accent: '#2a9d8f',
            accentGlow: 'rgba(42, 157, 143, 0.5)',
            textMain: '#ffffff',
            textSub: '#a7f3d0',
            textDim: '#3a7d71',
            labelBg: 'rgba(4, 20, 15, 0.92)',
            labelBorder: 'rgba(42, 157, 143, 0.45)',
            unselectedDot: 'rgba(255, 255, 255, 0.22)'
        },
        ochre: {
            id: 'ochre',
            bgTop: '#150d08',
            bgBottom: '#24150c',
            landFill: 'rgba(52, 32, 20, 0.95)',
            landStroke: 'rgba(244, 162, 97, 0.65)',
            divisionBorder: '#f4a261',
            watermarkText: 'rgba(255, 255, 255, 0.32)',
            accent: '#f4a261',
            accentGlow: 'rgba(244, 162, 97, 0.5)',
            textMain: '#ffffff',
            textSub: '#eed5b7',
            textDim: '#7a5135',
            labelBg: 'rgba(21, 13, 8, 0.92)',
            labelBorder: 'rgba(244, 162, 97, 0.45)',
            unselectedDot: 'rgba(255, 255, 255, 0.22)'
        },
        mono: {
            id: 'mono',
            bgTop: '#0d0d0d',
            bgBottom: '#181818',
            landFill: 'rgba(34, 34, 34, 0.96)',
            landStroke: 'rgba(255, 255, 255, 0.5)',
            divisionBorder: '#ffffff',
            watermarkText: 'rgba(255, 255, 255, 0.35)',
            accent: '#ffffff',
            accentGlow: 'rgba(255, 255, 255, 0.45)',
            textMain: '#ffffff',
            textSub: '#a0a0a0',
            textDim: '#606060',
            labelBg: 'rgba(18, 18, 18, 0.92)',
            labelBorder: 'rgba(255, 255, 255, 0.35)',
            unselectedDot: 'rgba(255, 255, 255, 0.22)'
        }
    };

    function getActiveTheme() {
        if (currentTheme === 'custom') {
            const bg = document.getElementById("placesCustomBg")?.value || "#06130e";
            const accent = document.getElementById("placesCustomAccent")?.value || "#e9c46a";
            const text = document.getElementById("placesCustomText")?.value || "#ffffff";
            return {
                id: 'custom',
                bgTop: bg,
                bgBottom: hexToRgba(bg, 1, true),
                landFill: hexToRgba(bg, 0.88, false),
                landStroke: hexToRgba(accent, 0.35),
                accent: accent,
                accentGlow: hexToRgba(accent, 0.45),
                textMain: text,
                textSub: hexToRgba(text, 0.75),
                textDim: hexToRgba(text, 0.45),
                labelBg: hexToRgba(bg, 0.92, true),
                labelBorder: hexToRgba(accent, 0.5),
                unselectedDot: hexToRgba(text, 0.22)
            };
        }
        return THEMES[currentTheme] || THEMES.dark;
    }

    // State
    let state = {
        selectedPlaces: []
    };

    // Curated Landmark Destinations with Collision-Free Directional Offsets across all 11 Districts
    const LANDMARK_OFFSETS = {
        1:   { anchor: 'end',   dx: -10, dy: 4 },   // Cox's Bazar
        2:   { anchor: 'end',   dx: -10, dy: 4 },   // Sajek Valley
        8:   { anchor: 'end',   dx: -10, dy: -6 },  // Saint Martin's Island
        13:  { anchor: 'end',   dx: -10, dy: -4 },  // Nijhum Dwip (Noakhali)
        20:  { anchor: 'start', dx: 10,  dy: 4 },   // Mainamati (Cumilla)
        22:  { anchor: 'start', dx: 10,  dy: 4 },   // Foy's Lake
        24:  { anchor: 'start', dx: 10,  dy: 4 },   // Patenga Beach
        29:  { anchor: 'start', dx: 10,  dy: 4 },   // Alutila Cave
        53:  { anchor: 'start', dx: 10,  dy: 4 },   // Kaptai Lake
        57:  { anchor: 'start', dx: 10,  dy: 4 },   // Himchari National Park
        58:  { anchor: 'end',   dx: -10, dy: 4 },   // Inani Beach
        96:  { anchor: 'start', dx: 10,  dy: 4 },   // Chimbuk Hill
        107: { anchor: 'end',   dx: -10, dy: -4 },  // Chandranath Hill
        110: { anchor: 'start', dx: 10,  dy: 6 },   // Nilgiri
        111: { anchor: 'end',   dx: -10, dy: -4 },  // Boga Lake
        112: { anchor: 'start', dx: 10,  dy: 4 },   // Keokradong
        113: { anchor: 'start', dx: 10,  dy: 10 },  // Nafakhum
        114: { anchor: 'end',   dx: -10, dy: 8 },   // Amiakhum
        128: { anchor: 'start', dx: 10,  dy: -4 },  // Lalmai Hills (Cumilla)
        130: { anchor: 'start', dx: 10,  dy: 4 },   // Mini Cox's Bazar / Chandpur Sandbar
        133: { anchor: 'start', dx: 10,  dy: 4 },   // Titas River (Brahmanbaria)
        134: { anchor: 'start', dx: 10,  dy: 4 },   // Muhuri Dam & Char (Feni)
        136: { anchor: 'end',   dx: -10, dy: -4 },  // Ramgati (Lakshmipur)
        232: { anchor: 'end',   dx: -10, dy: 4 },   // Dalal Bazar Zamindar Bari (Lakshmipur)
        237: { anchor: 'start', dx: 10,  dy: -4 },  // Bijoy Singh Dighi (Feni)
        240: { anchor: 'end',   dx: -10, dy: 4 },   // Kalbhairab Temple (Brahmanbaria)
        245: { anchor: 'end',   dx: -10, dy: 4 },   // Bajra Shahi Mosque (Noakhali)
        257: { anchor: 'end',   dx: -10, dy: 8 }    // Guliakhali Sea Beach
    };

    let showPlaceLabels = true;
    let ctgPlaces = []; // Filtered destination records strictly from data/destinations.js
    let geojsonData = null;
    let projParams = null; // Projection bounds & scales
    let currentTheme = 'dark';
    let isInitialized = false;

    // Load progress from localStorage
    function loadState() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (raw) {
                const parsed = JSON.parse(raw);
                if (parsed && Array.isArray(parsed.selectedPlaces)) {
                    state.selectedPlaces = parsed.selectedPlaces;
                }
            }
        } catch (e) {
            console.error("Error reading places state from localStorage:", e);
        }
        if (!Array.isArray(state.selectedPlaces)) {
            state.selectedPlaces = [];
        }
    }

    // Save progress to localStorage
    function saveState() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify({
                selectedPlaces: state.selectedPlaces
            }));
        } catch (e) {
            console.error("Error saving places state to localStorage:", e);
        }
    }

    // Convert ASCII digits to Bengali numerals with leading zeroes
    function toBanglaDigits(num, padLength = 2) {
        const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
        let str = num.toString();
        if (padLength && str.length < padLength) {
            str = str.padStart(padLength, '0');
        }
        return str.replace(/\d/g, d => bnDigits[parseInt(d, 10)]);
    }

    // Filter valid Chattogram destinations from global DESTINATIONS
    function initData() {
        if (typeof DESTINATIONS !== 'undefined' && Array.isArray(DESTINATIONS)) {
            ctgPlaces = DESTINATIONS.filter(d => 
                d.division === "Chattogram" && 
                typeof d.latitude === "number" && 
                typeof d.longitude === "number" &&
                !isNaN(d.latitude) && 
                !isNaN(d.longitude)
            );
            // Sort by Bengali name or English name for clean scannability
            ctgPlaces.sort((a, b) => (a.name_bn || a.name).localeCompare(b.name_bn || b.name, 'bn'));
        }
    }

    // Load GeoJSON and render map
    async function initMap() {
        if (isInitialized) return;
        try {
            const resp = await fetch("data/chattogram-division-districts.geojson");
            geojsonData = await resp.json();
            processGeometry(geojsonData);
            renderInteractiveMap();
            populateFilters();
            renderPlacesList();
            updateUI();
            isInitialized = true;
        } catch (err) {
            console.error("Failed to load Chattogram Division GeoJSON:", err);
            const container = document.getElementById("placesMapContainer");
            if (container) {
                container.innerHTML = `<div style="color: #e9c46a; padding: 30px; text-align: center;">মানচিত্র লোড হতে সমস্যা হয়েছে। অনুগ্রহ করে পৃষ্ঠাটি রিফ্রেশ করুন।</div>`;
            }
        }
    }

    // Project GeoJSON and marker coordinates into 800x800 SVG box
    function processGeometry(geojson) {
        let minLon = Infinity, maxLon = -Infinity;
        let minLat = Infinity, maxLat = -Infinity;

        geojson.features.forEach(feature => {
            const geoms = feature.geometry.type === 'MultiPolygon'
                ? feature.geometry.coordinates
                : [feature.geometry.coordinates];

            geoms.forEach(polygon => {
                polygon.forEach(ring => {
                    ring.forEach(coord => {
                        const lon = coord[0], lat = coord[1];
                        if (lon < minLon) minLon = lon;
                        if (lon > maxLon) maxLon = lon;
                        if (lat < minLat) minLat = lat;
                        if (lat > maxLat) maxLat = lat;
                    });
                });
            });
        });

        const paddingTop = 16;
        const paddingBottom = 45;
        const paddingX = 16;
        const availableW = SVG_WIDTH - paddingX * 2;
        const availableH = SVG_HEIGHT - paddingTop - paddingBottom;

        const lonRange = maxLon - minLon;
        const latRange = maxLat - minLat;

        const avgLat = (minLat + maxLat) / 2;
        const aspect = Math.cos(avgLat * Math.PI / 180);

        const scaledLonRange = lonRange * aspect;
        const scale = Math.min(availableW / scaledLonRange, availableH / latRange);

        const contentW = scaledLonRange * scale;
        const contentH = latRange * scale;

        const offsetX = paddingX + (availableW - contentW) / 2;
        const offsetY = paddingTop + (availableH - contentH) / 2;

        projParams = { minLon, maxLat, aspect, scale, offsetX, offsetY };
    }

    // Map geographic coordinates to SVG canvas space
    function project(lon, lat) {
        if (!projParams) return { x: 0, y: 0 };
        const x = projParams.offsetX + (lon - projParams.minLon) * projParams.aspect * projParams.scale;
        const y = projParams.offsetY + (projParams.maxLat - lat) * projParams.scale;
        return { x, y };
    }

    // Render interactive SVG map with district polygons and 105 destination markers
    function renderInteractiveMap() {
        const pathsGroup = document.getElementById('placesDistrictPaths');
        const labelsGroup = document.getElementById('placesDistrictLabels');
        const markersGroup = document.getElementById('placesMarkers');
        const placeLabelsGroup = document.getElementById('placesLabels');
        const tooltip = document.getElementById('placesTooltip');
        const mapContainer = document.getElementById('placesMapContainer');

        if (!pathsGroup || !markersGroup || !geojsonData) return;

        pathsGroup.innerHTML = '';
        if (labelsGroup) labelsGroup.innerHTML = '';
        markersGroup.innerHTML = '';
        if (placeLabelsGroup) placeLabelsGroup.innerHTML = '';

        // Draw District Boundaries
        geojsonData.features.forEach(feature => {
            const geoms = feature.geometry.type === 'MultiPolygon'
                ? feature.geometry.coordinates
                : [feature.geometry.coordinates];

            let pathD = '';
            let ringSumX = 0, ringSumY = 0, ptCount = 0;

            geoms.forEach(polygon => {
                polygon.forEach((ring, ringIdx) => {
                    ring.forEach((coord, i) => {
                        const pt = project(coord[0], coord[1]);
                        pathD += (i === 0 ? 'M' : 'L') + pt.x.toFixed(1) + ',' + pt.y.toFixed(1) + ' ';
                        if (ringIdx === 0) {
                            ringSumX += pt.x;
                            ringSumY += pt.y;
                            ptCount++;
                        }
                    });
                    pathD += 'Z ';
                });
            });

            const pathNode = document.createElementNS("http://www.w3.org/2000/svg", "path");
            pathNode.setAttribute("class", "ctg-places-district-path");
            pathNode.setAttribute("d", pathD);
            pathsGroup.appendChild(pathNode);

            // Subtle district label
            if (labelsGroup && ptCount > 0) {
                const shapeName = feature.properties?.shapeName || "";
                const bnName = DISTRICT_NAMES_BN[shapeName];
                if (bnName) {
                    const cx = ringSumX / ptCount;
                    const cy = ringSumY / ptCount;
                    const labelText = document.createElementNS("http://www.w3.org/2000/svg", "text");
                    labelText.setAttribute("class", "ctg-places-district-label");
                    labelText.setAttribute("x", cx.toFixed(1));
                    labelText.setAttribute("y", cy.toFixed(1));
                    labelText.textContent = bnName;
                    labelsGroup.appendChild(labelText);
                }
            }
        });

        // Cartographic Sea Watermark (Bay of Bengal)
        if (labelsGroup) {
            const seaG = document.createElementNS("http://www.w3.org/2000/svg", "g");
            seaG.setAttribute("class", "ctg-places-sea-watermark");
            seaG.setAttribute("pointer-events", "none");
            seaG.innerHTML = `
                <text x="65" y="670" class="ctg-places-sea-bn">বঙ্গোপসাগর</text>
                <text x="65" y="688" class="ctg-places-sea-en">BAY OF BENGAL</text>
            `;
            labelsGroup.appendChild(seaG);
        }

        // Draw Destination Markers for all 105 spots
        ctgPlaces.forEach(place => {
            const pt = project(place.longitude, place.latitude);
            place._pt = pt;
            const isSelected = state.selectedPlaces.includes(place.id);

            const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
            g.setAttribute("class", "ctg-place-marker" + (isSelected ? " selected" : ""));
            g.setAttribute("data-id", place.id);
            g.setAttribute("transform", `translate(${pt.x.toFixed(1)}, ${pt.y.toFixed(1)})`);
            g.setAttribute("role", "button");
            g.setAttribute("tabindex", "0");
            g.setAttribute("aria-label", `${place.name_bn || place.name} (${place.district})`);
            g.setAttribute("aria-pressed", isSelected ? "true" : "false");

            // Invisible expanded hit area for effortless touch targets on mobile
            const hitArea = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            hitArea.setAttribute("class", "marker-hit");
            hitArea.setAttribute("r", "26");
            g.appendChild(hitArea);

            // Glowing Halo (visible when selected or on hover)
            const glow = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            glow.setAttribute("class", "marker-glow");
            glow.setAttribute("r", "14");
            g.appendChild(glow);

            // Mid accent ring
            const ring = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            ring.setAttribute("class", "marker-ring");
            ring.setAttribute("r", "6.5");
            g.appendChild(ring);

            // Core visible dot
            const core = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            core.setAttribute("class", "marker-core");
            core.setAttribute("r", "3.5");
            g.appendChild(core);

            // Tooltip presentation
            const showTooltip = () => {
                if (!tooltip || !mapContainer) return;
                const distBn = DISTRICT_NAMES_BN[place.district] || place.district;
                const catBn = CATEGORY_NAMES_BN[place.category] || place.category || "দর্শনীয় স্থান";
                const currentlySelected = state.selectedPlaces.includes(place.id);

                tooltip.innerHTML = `
                    <span class="ctg-tooltip-name-bn">${place.name_bn || place.name}</span>
                    <span class="ctg-tooltip-name-en">${place.name}</span>
                    <div class="ctg-tooltip-meta">
                        <span class="ctg-tooltip-tag">${distBn}</span>
                        <span class="ctg-tooltip-tag">${catBn}</span>
                    </div>
                    <div class="ctg-tooltip-status ${currentlySelected ? 'active' : ''}">
                        ${currentlySelected ? '✓ ঘুরে এসেছেন (ক্লিক করে বাদ দিন)' : '+ যাননি (ক্লিক করে নির্বাচন করুন)'}
                    </div>
                `;
                tooltip.style.display = 'block';

                // Position tooltip relative to container
                const mapSvg = document.getElementById('placesMapSvg');
                if (mapSvg) {
                    const rect = mapSvg.getBoundingClientRect();
                    const containerRect = mapContainer.getBoundingClientRect();
                    const scaleX = rect.width / SVG_WIDTH;
                    const scaleY = rect.height / SVG_HEIGHT;

                    let clientX = (rect.left - containerRect.left) + pt.x * scaleX;
                    let clientY = (rect.top - containerRect.top) + pt.y * scaleY;

                    // Boundary-aware positioning:
                    const flipBelow = clientY < 130;
                    if (flipBelow) {
                        tooltip.style.transform = 'translate(-50%, 20px)';
                    } else {
                        tooltip.style.transform = 'translate(-50%, -115%)';
                    }

                    // Clamp horizontally so tooltip does not clip container edges
                    const halfW = 125;
                    const minX = halfW + 12;
                    const maxX = containerRect.width - halfW - 12;
                    if (clientX < minX) clientX = minX;
                    if (clientX > maxX) clientX = maxX;

                    tooltip.style.left = `${clientX}px`;
                    tooltip.style.top = `${clientY}px`;
                }

                // Sync hover on label
                const labelEl = document.querySelector(`.ctg-place-label[data-id="${place.id}"]`);
                if (labelEl) labelEl.classList.add('hovered');
            };

            const hideTooltip = () => {
                if (tooltip) tooltip.style.display = 'none';
                const labelEl = document.querySelector(`.ctg-place-label[data-id="${place.id}"]`);
                if (labelEl) labelEl.classList.remove('hovered');
            };

            // Event bindings
            g.addEventListener('mouseenter', showTooltip);
            g.addEventListener('mouseleave', hideTooltip);

            g.addEventListener('click', (e) => {
                e.stopPropagation();
                togglePlace(place.id);
                showTooltip(); // Refresh status in tooltip
            });

            g.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    togglePlace(place.id);
                }
            });

            markersGroup.appendChild(g);
        });

        // Hide tooltip when clicking on blank canvas
        mapContainer.addEventListener('click', () => {
            if (tooltip) tooltip.style.display = 'none';
        });

        // Render collision-free place labels on interactive map
        updatePlaceLabels();

        // Eagerly render poster once map geometry and projection are ready
        renderPoster();
    }

    // Draw / Refresh collision-free, high-contrast place labels on interactive SVG map
    function updatePlaceLabels() {
        const labelsGroup = document.getElementById('placesLabels');
        if (!labelsGroup || !ctgPlaces.length) return;
        labelsGroup.innerHTML = '';

        if (!showPlaceLabels) return;

        const selCat = document.getElementById("placesCategoryFilter")?.value || "";

        const unselectedLabels = [];
        const selectedLabels = [];

        ctgPlaces.forEach(place => {
            const isSelected = state.selectedPlaces.includes(place.id);
            const isLandmark = Boolean(LANDMARK_OFFSETS[place.id]);
            const isCatMatch = Boolean(selCat && place.category === selCat && !isSelected && !isLandmark);

            if (isSelected) {
                selectedLabels.push({ place, type: 'selected' });
            } else if (isLandmark) {
                unselectedLabels.push({ place, type: 'landmark' });
            } else if (isCatMatch) {
                unselectedLabels.push({ place, type: 'category-match' });
            }
        });

        // Sort selectedLabels to prioritize Landmark places, then well-spaced distribution
        selectedLabels.sort((a, b) => {
            const aLandmark = Boolean(LANDMARK_OFFSETS[a.place.id]);
            const bLandmark = Boolean(LANDMARK_OFFSETS[b.place.id]);
            if (aLandmark && !bLandmark) return -1;
            if (!aLandmark && bLandmark) return 1;
            return a.place.id - b.place.id;
        });

        const placedRects = [];
        const canPlaceLabel = (rx, ry, rw, rh) => {
            const pad = 3;
            for (const r of placedRects) {
                if (rx < r.x + r.w + pad && rx + rw + pad > r.x &&
                    ry < r.y + r.h + pad && ry + rh + pad > r.y) {
                    return false;
                }
            }
            return true;
        };

        const drawLabel = (item) => {
            const { place, type } = item;
            const pt = place._pt || project(place.longitude, place.latitude);
            place._pt = pt;

            const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
            g.setAttribute("class", `ctg-place-label ${type}`);
            g.setAttribute("data-id", place.id);
            g.setAttribute("role", "button");
            g.setAttribute("tabindex", "0");
            g.setAttribute("aria-label", place.name_bn || place.name);

            // Compute smart placement
            const customOffset = LANDMARK_OFFSETS[place.id];
            let anchor = 'start';
            let labelX = pt.x + 9;
            let labelY = pt.y + 3.5;

            if (customOffset) {
                anchor = customOffset.anchor;
                labelX = pt.x + customOffset.dx;
                labelY = pt.y + customOffset.dy;
            } else if (pt.x > 360) {
                anchor = 'end';
                labelX = pt.x - 9;
            }

            // Boundary clamping for 540x880 viewBox
            if (labelY < 24) labelY = 24;
            if (labelY > 865) labelY = 865;

            const labelText = (type === 'selected' ? '✓ ' : '') + (place.name_bn || place.name);
            const approxCharWidth = (type === 'selected') ? 7.2 : 6.5;
            const approxWidth = Math.max(42, labelText.length * approxCharWidth + 14);
            const rectHeight = (type === 'selected') ? 20 : 17;
            const rectY = labelY - 14.5;
            let rectX = labelX - 6;
            if (anchor === 'end') rectX = labelX - approxWidth + 6;
            else if (anchor === 'middle') rectX = labelX - approxWidth / 2;

            // Collision avoidance on the live web SVG stage:
            // If the label would overlap an already placed label, skip the text badge on screen so the map remains clear!
            // The marker dot remains fully active, pulsing, and reveals its tooltip on hover!
            if (!canPlaceLabel(rectX, rectY, approxWidth, rectHeight)) {
                return;
            }
            placedRects.push({ x: rectX, y: rectY, w: approxWidth, h: rectHeight });

            // Draw glowing pill backdrop for selected places
            if (type === 'selected') {
                const bgRect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
                bgRect.setAttribute("class", "label-bg");
                bgRect.setAttribute("x", rectX.toFixed(1));
                bgRect.setAttribute("y", rectY.toFixed(1));
                bgRect.setAttribute("width", approxWidth.toFixed(1));
                bgRect.setAttribute("height", rectHeight.toFixed(1));
                bgRect.setAttribute("rx", "5");
                bgRect.setAttribute("ry", "5");
                g.appendChild(bgRect);
            }

            const textNode = document.createElementNS("http://www.w3.org/2000/svg", "text");
            textNode.setAttribute("class", "label-text");
            textNode.setAttribute("x", labelX.toFixed(1));
            textNode.setAttribute("y", labelY.toFixed(1));
            textNode.setAttribute("text-anchor", anchor);
            textNode.textContent = labelText;
            g.appendChild(textNode);

            // Click to toggle place
            g.addEventListener('click', (e) => {
                e.stopPropagation();
                togglePlace(place.id);
            });

            // Hover interactions
            g.addEventListener('mouseenter', () => {
                g.classList.add('hovered');
                const m = document.querySelector(`.ctg-place-marker[data-id="${place.id}"]`);
                if (m) m.classList.add('hovered');
            });
            g.addEventListener('mouseleave', () => {
                g.classList.remove('hovered');
                const m = document.querySelector(`.ctg-place-marker[data-id="${place.id}"]`);
                if (m) m.classList.remove('hovered');
            });

            labelsGroup.appendChild(g);
        };

        selectedLabels.forEach(drawLabel);
        unselectedLabels.forEach(drawLabel);
    }

    // Toggle destination selection
    function togglePlace(id) {
        const placeId = parseInt(id, 10);
        const index = state.selectedPlaces.indexOf(placeId);
        if (index > -1) {
            state.selectedPlaces.splice(index, 1);
        } else {
            state.selectedPlaces.push(placeId);
        }

        saveState();
        updateUI();
    }

    // Synchronize UI states (markers, list, counts, poster)
    function updateUI() {
        const count = state.selectedPlaces.length;
        const total = ctgPlaces.length;
        const countBn = toBanglaDigits(count, 2);
        const totalBn = toBanglaDigits(total, 2);
        const countText = `${countBn} / ${totalBn}`;

        // Header and Map Counter Badges
        const headerCountEl = document.getElementById('placesStatCountDisplay');
        if (headerCountEl) headerCountEl.textContent = countText;

        const mapCountEl = document.getElementById('placesMapCount');
        if (mapCountEl) mapCountEl.textContent = countText;

        // Update SVG Markers
        ctgPlaces.forEach(place => {
            const isSelected = state.selectedPlaces.includes(place.id);
            const g = document.querySelector(`.ctg-place-marker[data-id="${place.id}"]`);
            if (g) {
                if (isSelected) {
                    g.classList.add("selected");
                    g.setAttribute("aria-pressed", "true");
                } else {
                    g.classList.remove("selected");
                    g.setAttribute("aria-pressed", "false");
                }
            }
        });

        // Update Left Destination List Items
        document.querySelectorAll('.ctg-places-item').forEach(item => {
            const id = parseInt(item.getAttribute('data-id'), 10);
            if (state.selectedPlaces.includes(id)) {
                item.classList.add("selected");
            } else {
                item.classList.remove("selected");
            }
        });

        // Update SVG Place Labels & Pills
        updatePlaceLabels();

        // Sync Quick Label Toggle Button
        const btnToggleLabels = document.getElementById("btnTogglePlaceLabels");
        const toggleLabelsText = document.getElementById("placeLabelsToggleText");
        if (btnToggleLabels) {
            btnToggleLabels.classList.toggle("active", showPlaceLabels);
            btnToggleLabels.setAttribute("aria-pressed", showPlaceLabels ? "true" : "false");
        }
        if (toggleLabelsText) {
            toggleLabelsText.textContent = showPlaceLabels ? "নাম দৃশ্যমান" : "নাম লুকানো";
        }

        // Update Caption Box
        updateCaption();

        // Frame Theme Sync (Live Poster Studio)
        const placesFrame = document.getElementById('placesPosterFrame');
        if (placesFrame) {
            placesFrame.setAttribute('data-theme', currentTheme);
        }

        // Live WYSIWYG Poster Elements Sync (Experience 04)
        const liveTitleEl = document.getElementById('placesPosterLiveTitle');
        const nameInputEl = document.getElementById('placesPosterName');
        const quickNameInputEl = document.getElementById('inputPlacesQuickName');
        const activeNameInput = (nameInputEl && nameInputEl.value.trim()) ? nameInputEl : quickNameInputEl;
        if (liveTitleEl) {
            const raw = activeNameInput ? activeNameInput.value.trim() : "";
            const isDefault = !raw || raw.toLowerCase() === "places i've explored" || raw.toLowerCase().includes("explored's") || raw === "আমার ঘোরা জায়গাগুলো";
            liveTitleEl.textContent = isDefault ? "আমার ঘোরা জায়গাগুলো" : `${raw} — ঘোরা জায়গাগুলো`;
        }
        const liveCountEl = document.getElementById('placesPosterLiveCount');
        if (liveCountEl) {
            liveCountEl.textContent = `${countBn} / ${totalBn}`;
        }
        const liveRankEl = document.getElementById('placesPosterLiveRank');
        function getPlacesRank(c) {
            if (c === 0) return { title: "নবাগত পথিক 🎒", badge: "★ নবাগত", quote: "ভ্রমণ বাকেটলিস্ট শুরু হোক!" };
            if (c <= 5) return { title: "পাহাড়-সাগরের ট্রাভেলার 🌊", badge: "★ ট্রাভেলার", quote: "সফর সবে শুরু হলো!" };
            if (c <= 15) return { title: "চাটগাঁইয়া যাযাবর 🧭", badge: "★ যাযাবর", quote: "অ্যাডভেঞ্চারের স্বাদ পেয়ে গেছেন!" };
            if (c <= 30) return { title: "অভিজ্ঞ বনচারী ও নাবিক ⛵", badge: "★ অভিজ্ঞ নাবিক", quote: "বাকেটলিস্টের সেরা স্পটগুলো আপনার চেনা!" };
            if (c <= 50) return { title: "পাহাড় ও ঝর্ণার রাজা 👑", badge: "★ রাজা", quote: "৮০% ভ্রমণপিপাসু থেকে আপনি এগিয়ে!" };
            if (c <= 75) return { title: "চাটগাঁর এক্সট্রিম ট্র্যাকার 🔥", badge: "★ এক্সট্রিম ট্র্যাকার", quote: "টপ ৫% অভিযাত্রীদের একজন আপনি!" };
            if (c < (total || 105)) return { title: "বাংলার মার্কো পোলো 🌍", badge: "★ মার্কো পোলো", quote: "চট্টগ্রামের প্রতিটি গিরি-সৈকত আপনার পদচিহ্নে আঁকা!" };
            return { title: "গ্র্যান্ড ট্রাভেল লেজেন্ড 🏆", badge: "★ লেজেন্ড", quote: "১০৫/১০৫ আনলকড — আপনি অপরাজেয় সুলতান!" };
        }

        const rankObj = getPlacesRank(count);
        const rankTitle = rankObj.title;
        if (liveRankEl) {
            liveRankEl.textContent = rankObj.badge + " · " + rankTitle;
        }

        // Rank Card Sync (Left Panel)
        const placesRankTitle = document.getElementById("placesRankTitle");
        const placesRankPercent = document.getElementById("placesRankPercent");
        const placesRankBarFill = document.getElementById("placesRankBarFill");
        if (placesRankTitle) placesRankTitle.textContent = rankTitle;
        if (placesRankPercent) {
            const pct = total > 0 ? Math.round((count / total) * 100) : 0;
            placesRankPercent.textContent = `${toBanglaDigits(pct, 0)}% সম্পন্ন`;
            placesRankPercent.title = rankObj.quote;
        }
        if (placesRankBarFill) {
            const pctVal = total > 0 ? Math.min(100, Math.round((count / total) * 100)) : 0;
            placesRankBarFill.style.width = `${pctVal}%`;
        }

        // Selected Filter Chip Sync
        const selFilterChip = document.getElementById("placesSelectedFilterChip");
        if (selFilterChip) {
            selFilterChip.innerHTML = `নির্বাচিত (${countBn}) ✦`;
        }

        // Subtitle Total Sync
        const placesTotalSubtitle = document.getElementById("placesTotalSubtitle");
        if (placesTotalSubtitle) {
            placesTotalSubtitle.textContent = `${totalBn}টি দর্শনীয় স্থান`;
        }

        // Title char counter sync
        const nameInput = document.getElementById('placesPosterName');
        const titleCharCounter = document.getElementById('placesTitleCharCounter');
        if (nameInput && titleCharCounter) {
            const currentLen = nameInput.value.length;
            const maxLen = nameInput.maxLength > 0 ? nameInput.maxLength : 32;
            titleCharCounter.textContent = `${toBanglaDigits(currentLen, 0)} / ${toBanglaDigits(maxLen, 0)}`;
        }

        // Layout Theme Attribute Sync
        const exp3Layout = document.getElementById("exp3Layout");
        if (exp3Layout) exp3Layout.setAttribute("data-theme", currentTheme);
        const placesPosterStage = document.getElementById("placesPosterStage");
        if (placesPosterStage) placesPosterStage.setAttribute("data-theme", currentTheme);
        const placesMapContainer = document.getElementById("placesMapContainer");
        if (placesMapContainer) placesMapContainer.setAttribute("data-theme", currentTheme);
        const placesControlsPanel = document.querySelector(".ctg-exp3-layout .ctg-division-controls-panel");
        if (placesControlsPanel) placesControlsPanel.setAttribute("data-theme", currentTheme);
        const placesLeftPanel = document.querySelector(".ctg-exp3-layout .ctg-division-panel");
        if (placesLeftPanel) placesLeftPanel.setAttribute("data-theme", currentTheme);

        // Theme Button Active Sync
        document.querySelectorAll('#placesThemeSelector .ctg-theme-btn, #placesPosterQuickBar .ctg-quick-swatch-dot, #placesFloatingThemeBar .ctg-mf-chip').forEach(btn => {
            const isTh = btn.getAttribute('data-theme') === currentTheme;
            btn.classList.toggle('active', isTh);
            btn.setAttribute('aria-checked', isTh ? 'true' : 'false');
        });

        // Quick Name Input Sync
        const qName = document.getElementById('inputPlacesQuickName');
        const mainNameInput = document.getElementById('placesPosterName');
        const btnResetQName = document.getElementById('btnResetPlacesQuickName');
        const curName = mainNameInput ? (mainNameInput.value || "Places I've Explored") : "Places I've Explored";
        if (qName && qName.value !== curName) {
            qName.value = curName;
        }
        if (btnResetQName) {
            btnResetQName.style.display = (curName !== "Places I've Explored" && curName.length > 0) ? 'flex' : 'none';
        }

        // Render Live Poster Preview
        renderPoster();

        // Sync Mobile Thumb Bar (Experience 04 Spots)
        if (window.updateMobileThumbBar) {
            window.updateMobileThumbBar(count, total, rankTitle, 'exp4');
        }
    }

    // Update natural Facebook viral caption
    function updateCaption() {
        const count = state.selectedPlaces.length;
        const total = ctgPlaces.length;
        const countBn = toBanglaDigits(count, 0);
        const totalBn = toBanglaDigits(total, 0);
        const rank = (count === 0) ? "নবাগত পথিক 🎒" : (count <= 10 ? "পাহাড়-সাগরের ট্রাভেলার 🌊" : (count <= 30 ? "চাটগাঁইয়া যাযাবর 🧭" : (count <= 60 ? "পাহাড় ও ঝর্ণার রাজা 👑" : "গ্র্যান্ড ট্রাভেল লেজেন্ড 🏆")));

        const selectedSpots = ctgPlaces.filter(p => state.selectedPlaces.includes(p.id));
        const sampleNames = selectedSpots.slice(0, 5).map(p => p.name_bn || p.name).join(', ');
        const moreTxt = count > 5 ? ` এবং আরও ${toBanglaDigits(count - 5, 0)}টি স্থান` : '';

        const captionText = count === 0
            ? `চট্টগ্রাম বিভাগের ${totalBn}টি ঐতিহাসিক ও প্রাকৃতিক দর্শনীয় স্থান নিয়ে তৈরি করুন নিজের ট্রাভেল বাকেটলিস্ট পোস্টার!\n\nনিজের ট্রাভেল ম্যাপ তৈরি করুন: ${window.location.origin}${window.location.pathname}?exp=4\n\n#MyChattogram #PlacesIveExplored #SakibsCreation #Ghuraghuri`
            : `সাগর থেকে সাজেক, পাহাড় থেকে ঝর্ণা—চট্টগ্রাম বিভাগের ${totalBn}টি বাকেটলিস্টের মধ্যে আমি ${countBn}টি স্থান চষে ফেলেছি! 🌊⛰️\n\n🏆 ট্রাভেল স্ট্যাটাস: ${rank}\n📍 ঘুরে আসা কয়েকটি স্পট: ${sampleNames}${moreTxt}\n\nআপনি কয়টি ঘুরেছেন? নিজের ট্রাভেল পোস্টার তৈরি করুন:\n${window.location.origin}${window.location.pathname}?exp=4\n\n#MyChattogram #PlacesIveExplored #SakibsCreation #Ghuraghuri #TravelBangladesh`;

        const captionArea = document.getElementById('captionPlacesTextArea');
        if (captionArea) {
            captionArea.value = captionText;
        }
    }

    // Populate District and Category filter dropdowns & chips
    function populateFilters() {
        const distFilter = document.getElementById("placesDistrictFilter");
        const catFilter = document.getElementById("placesCategoryFilter");
        const chipsContainer = document.getElementById("placesCategoryChips");

        // Collect unique districts that actually exist in ctgPlaces
        const districts = [...new Set(ctgPlaces.map(p => p.district).filter(Boolean))].sort();
        if (distFilter && distFilter.options.length <= 1) {
            districts.forEach(d => {
                const opt = document.createElement("option");
                opt.value = d;
                const bnName = DISTRICT_NAMES_BN[d] || d;
                opt.textContent = `${bnName} (${d})`;
                distFilter.appendChild(opt);
            });
        }

        // Collect unique categories that actually exist in ctgPlaces
        const categories = [...new Set(ctgPlaces.map(p => p.category).filter(Boolean))].sort();
        if (catFilter && catFilter.options.length <= 1) {
            const selOpt = document.createElement("option");
            selOpt.value = "__selected__";
            selOpt.textContent = "নির্বাচিত স্থান";
            catFilter.appendChild(selOpt);

            categories.forEach(c => {
                const opt = document.createElement("option");
                opt.value = c;
                const bnCat = CATEGORY_NAMES_BN[c] || c;
                opt.textContent = `${bnCat} (${c})`;
                catFilter.appendChild(opt);
            });
        }

        // Quick Category Filter Chips
        if (chipsContainer && chipsContainer.children.length === 0) {
            const allChip = document.createElement("button");
            allChip.type = "button";
            allChip.className = "ctg-chip active";
            allChip.textContent = "সব জায়গা";
            allChip.dataset.cat = "";
            chipsContainer.appendChild(allChip);

            const selChip = document.createElement("button");
            selChip.type = "button";
            selChip.id = "placesSelectedFilterChip";
            selChip.className = "ctg-chip ctg-chip-selected-filter";
            const initialCount = state.selectedPlaces ? state.selectedPlaces.length : 0;
            selChip.innerHTML = `নির্বাচিত (${toBanglaDigits(initialCount, 0)}) ✦`;
            selChip.dataset.cat = "__selected__";
            chipsContainer.appendChild(selChip);

            const popularOrder = ["Beach", "Mountain", "Waterfall", "Island", "Nature", "Historical", "River", "Hill", "Lake", "Museum", "Village", "National Park", "Adventure", "Cultural", "Family", "Religious"];
            const sortedCats = [...categories].sort((a, b) => {
                const idxA = popularOrder.indexOf(a);
                const idxB = popularOrder.indexOf(b);
                return (idxA !== -1 ? idxA : 99) - (idxB !== -1 ? idxB : 99);
            });

            sortedCats.forEach(cat => {
                const chip = document.createElement("button");
                chip.type = "button";
                chip.className = "ctg-chip";
                chip.textContent = CATEGORY_NAMES_BN[cat] || cat;
                chip.dataset.cat = cat;
                chipsContainer.appendChild(chip);
            });

            // Bind chips click
            chipsContainer.querySelectorAll(".ctg-chip").forEach(chip => {
                chip.addEventListener("click", () => {
                    chipsContainer.querySelectorAll(".ctg-chip").forEach(c => c.classList.remove("active"));
                    chip.classList.add("active");
                    if (catFilter) {
                        catFilter.value = chip.dataset.cat || "";
                    }
                    renderPlacesList();
                    updatePlaceLabels();
                });
            });
        }
    }

    // Render filtered list of destinations on the left panel
    function renderPlacesList() {
        const list = document.getElementById("placesList");
        if (!list) return;

        const search = (document.getElementById("placesSearch")?.value || "").trim().toLowerCase();
        const selDist = document.getElementById("placesDistrictFilter")?.value || "";
        let selCat = document.getElementById("placesCategoryFilter")?.value || "";
        const activeChip = document.querySelector("#placesCategoryChips .ctg-chip.active");
        if (activeChip) {
            selCat = activeChip.dataset.cat || "";
        }

        const filtered = ctgPlaces.filter(place => {
            const nameEn = (place.name || "").toLowerCase();
            const nameBn = (place.name_bn || "").toLowerCase();
            const dist = (place.district || "").toLowerCase();
            const distBn = (DISTRICT_NAMES_BN[place.district] || "").toLowerCase();
            const cat = (place.category || "").toLowerCase();
            const catBn = (CATEGORY_NAMES_BN[place.category] || "").toLowerCase();

            const matchesSearch = !search || 
                nameEn.includes(search) || 
                nameBn.includes(search) || 
                dist.includes(search) || 
                distBn.includes(search) || 
                cat.includes(search) || 
                catBn.includes(search);

            const matchesDist = !selDist || place.district === selDist;
            const isSelected = state.selectedPlaces.includes(place.id);
            const matchesCat = (selCat === "__selected__") ? isSelected : (!selCat || place.category === selCat);

            return matchesSearch && matchesDist && matchesCat;
        });

        list.innerHTML = "";

        if (filtered.length === 0) {
            if (selCat === "__selected__") {
                list.innerHTML = `
                    <li class="ctg-places-empty-selected">
                        <div class="ctg-empty-icon" aria-hidden="true">📍</div>
                        <strong class="ctg-empty-title">এখনও কোনো স্থান নির্বাচন করা হয়নি!</strong>
                        <p class="ctg-empty-desc">তালিকা থেকে আপনার ঘুরে আসা স্থানগুলোতে ক্লিক করে টিক দিন।</p>
                        <button type="button" class="ctg-btn-reset-cat" id="btnResetSelectedFilter">সব স্থান দেখুন</button>
                    </li>
                `;
                const btnReset = document.getElementById("btnResetSelectedFilter");
                if (btnReset) {
                    btnReset.addEventListener("click", () => {
                        const allChip = document.querySelector('#placesCategoryChips .ctg-chip[data-cat=""]');
                        if (allChip) allChip.click();
                    });
                }
            } else {
                list.innerHTML = `<li class="ctg-places-empty">কোনো পর্যটন স্থান পাওয়া যায়নি। ফিল্টার পরিবর্তন করে পুনরায় চেষ্টা করুন।</li>`;
            }
            return;
        }

        filtered.forEach(place => {
            const isSelected = state.selectedPlaces.includes(place.id);
            const li = document.createElement("li");
            li.className = "ctg-places-item" + (isSelected ? " selected" : "");
            li.setAttribute("data-id", place.id);
            li.setAttribute("role", "option");
            li.setAttribute("aria-selected", isSelected ? "true" : "false");

            const distBn = DISTRICT_NAMES_BN[place.district] || place.district;
            const catBn = CATEGORY_NAMES_BN[place.category] || place.category || "দর্শনীয়";

            li.innerHTML = `
                <div class="ctg-place-info">
                    <span class="ctg-place-title-bn">${place.name_bn || place.name}</span>
                    <div class="ctg-place-meta">
                        <span class="ctg-place-district-tag">${distBn}</span>
                        <span class="ctg-place-dot">•</span>
                        <span class="ctg-place-cat-badge">${catBn}</span>
                    </div>
                </div>
                <div class="ctg-place-check" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                </div>
            `;

            li.addEventListener("click", () => {
                togglePlace(place.id);
            });

            li.addEventListener("mouseenter", () => {
                const marker = document.querySelector(`.ctg-place-marker[data-id="${place.id}"]`);
                if (marker) marker.classList.add("hovered");
                const label = document.querySelector(`.ctg-place-label[data-id="${place.id}"]`);
                if (label) label.classList.add("hovered");
            });

            li.addEventListener("mouseleave", () => {
                const marker = document.querySelector(`.ctg-place-marker[data-id="${place.id}"]`);
                if (marker) marker.classList.remove("hovered");
                const label = document.querySelector(`.ctg-place-label[data-id="${place.id}"]`);
                if (label) label.classList.remove("hovered");
            });

            list.appendChild(li);
        });
    }

    // -------------------------------------------------------------------------
    // 1200 × 1500 HIGH RESOLUTION SOCIAL POSTER GENERATOR
    // -------------------------------------------------------------------------
    async function renderPoster() {
        const canvas = document.getElementById("placesExportCanvas");
        if (!canvas || !geojsonData || !projParams) return;

        // Ensure web fonts are completely ready before drawing
        if (document.fonts && document.fonts.ready) {
            try {
                await document.fonts.ready;
            } catch (e) {
                // Ignore font loading errors and continue
            }
        }

        const ctx = canvas.getContext("2d");
        const W = 1200;
        const H = 1500;
        canvas.width = W;
        canvas.height = H;

        const th = getActiveTheme();

        // 1. Background Gradient
        const bgGrad = ctx.createLinearGradient(0, 0, 0, H);
        bgGrad.addColorStop(0, th.bgTop);
        bgGrad.addColorStop(1, th.bgBottom);
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, W, H);

        // 2. Ambient Lighting Glows
        const radGlowTop = ctx.createRadialGradient(W * 0.25, H * 0.12, 0, W * 0.25, H * 0.12, 650);
        radGlowTop.addColorStop(0, th.accentGlow);
        radGlowTop.addColorStop(1, 'transparent');
        ctx.fillStyle = radGlowTop;
        ctx.fillRect(0, 0, W, H);

        const radGlowBot = ctx.createRadialGradient(W * 0.8, H * 0.88, 0, W * 0.8, H * 0.88, 700);
        radGlowBot.addColorStop(0, hexToRgba(th.accent, 0.12));
        radGlowBot.addColorStop(1, 'transparent');
        ctx.fillStyle = radGlowBot;
        ctx.fillRect(0, 0, W, H);

        // 3. Subtle Cartographic Grid Pattern
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.025)';
        ctx.lineWidth = 1;
        for (let x = 0; x < W; x += 50) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, H);
            ctx.stroke();
        }
        for (let y = 0; y < H; y += 50) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(W, y);
            ctx.stroke();
        }

        // 4. Poster Header
        ctx.textAlign = 'center';

        // Tagline: MY CHATTOGRAM
        ctx.fillStyle = th.accent;
        ctx.font = '700 22px "Plus Jakarta Sans", sans-serif';
        if ('letterSpacing' in ctx) ctx.letterSpacing = '5px';
        ctx.fillText('MY CHATTOGRAM', W / 2, 110);
        if ('letterSpacing' in ctx) ctx.letterSpacing = '0px';

        // Main Title: আমার ঘোরা জায়গাগুলো (Dynamic Measurement to prevent horizontal clipping)
        const maxTitleWidth = 1000;
        let titleFontSize = 58;
        ctx.font = `700 ${titleFontSize}px "Hind Siliguri", "Noto Sans Bengali", sans-serif`;
        let titleMetrics = ctx.measureText('আমার ঘোরা জায়গাগুলো');
        if (titleMetrics.width > maxTitleWidth) {
            titleFontSize = Math.floor(titleFontSize * (maxTitleWidth / titleMetrics.width));
            ctx.font = `700 ${titleFontSize}px "Hind Siliguri", "Noto Sans Bengali", sans-serif`;
        }
        ctx.fillStyle = th.textMain;
        ctx.fillText('আমার ঘোরা জায়গাগুলো', W / 2, 180);

        // Optional Traveler Name
        const userName = (document.getElementById("placesPosterName")?.value || "").trim();
        let mapOffsetY = 215;
        if (userName) {
            ctx.fillStyle = th.accent;
            ctx.font = 'italic 500 22px "Plus Jakarta Sans", "Hind Siliguri", sans-serif';
            ctx.fillText(`— ${userName} —`, W / 2, 222);
            mapOffsetY = 250;
        }

        // 5. Geographic Map Render
        const mapScale = 1.10;
        const mapOffsetX = (W - (SVG_WIDTH * mapScale)) / 2;

        ctx.save();
        ctx.translate(mapOffsetX, mapOffsetY);
        ctx.scale(mapScale, mapScale);

        // A. Draw Landmass with Elevation Drop Shadow
        ctx.save();
        ctx.shadowColor = 'rgba(0, 0, 0, 0.75)';
        ctx.shadowBlur = 28;
        ctx.shadowOffsetY = 12;
        ctx.fillStyle = th.landFill;

        geojsonData.features.forEach(feature => {
            const geoms = feature.geometry.type === 'MultiPolygon'
                ? feature.geometry.coordinates
                : [feature.geometry.coordinates];

            ctx.beginPath();
            geoms.forEach(polygon => {
                polygon.forEach(ring => {
                    ring.forEach((coord, i) => {
                        const pt = project(coord[0], coord[1]);
                        if (i === 0) ctx.moveTo(pt.x, pt.y);
                        else ctx.lineTo(pt.x, pt.y);
                    });
                });
            });
            ctx.fill();
        });
        ctx.restore();

        // B. Draw District Boundaries with Clean Cartographic Lines
        ctx.lineWidth = 1.8;
        ctx.strokeStyle = th.landStroke;
        ctx.lineJoin = 'round';
        geojsonData.features.forEach(feature => {
            const geoms = feature.geometry.type === 'MultiPolygon'
                ? feature.geometry.coordinates
                : [feature.geometry.coordinates];

            ctx.beginPath();
            geoms.forEach(polygon => {
                polygon.forEach(ring => {
                    ring.forEach((coord, i) => {
                        const pt = project(coord[0], coord[1]);
                        if (i === 0) ctx.moveTo(pt.x, pt.y);
                        else ctx.lineTo(pt.x, pt.y);
                    });
                });
            });
            ctx.stroke();
        });

        // C. Draw District Names as Cartographic Watermarks
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = th.watermarkText || 'rgba(255, 255, 255, 0.32)';
        ctx.font = '700 13px "Hind Siliguri", "Noto Sans Bengali", sans-serif';
        geojsonData.features.forEach(feature => {
            const shapeName = feature.properties?.shapeName || "";
            const bnName = DISTRICT_NAMES_BN[shapeName];
            if (!bnName) return;
            const geoms = feature.geometry.type === 'MultiPolygon'
                ? feature.geometry.coordinates
                : [feature.geometry.coordinates];
            let sumX = 0, sumY = 0, count = 0;
            geoms.forEach(polygon => {
                if (polygon[0]) {
                    polygon[0].forEach(coord => {
                        const pt = project(coord[0], coord[1]);
                        sumX += pt.x;
                        sumY += pt.y;
                        count++;
                    });
                }
            });
            if (count > 0) {
                ctx.fillText(bnName, sumX / count, sumY / count);
            }
        });

        // D. Draw Maritime / Bay of Bengal Orientation Watermark
        ctx.textAlign = 'left';
        ctx.fillStyle = th.textDim;
        ctx.font = 'italic 700 16px "Hind Siliguri", sans-serif';
        ctx.fillText('বঙ্গোপসাগর', 45, 680);
        ctx.font = '700 11px "Plus Jakarta Sans", sans-serif';
        ctx.fillText('BAY OF BENGAL', 45, 698);

        // E. Draw Unselected Destinations as subtle cartographic nodes
        ctx.fillStyle = th.unselectedDot;
        ctgPlaces.forEach(place => {
            if (!state.selectedPlaces.includes(place.id)) {
                const pt = project(place.longitude, place.latitude);
                ctx.beginPath();
                ctx.arc(pt.x, pt.y, 2.5, 0, Math.PI * 2);
                ctx.fill();
            }
        });

        ctx.restore();

        // 6. Draw Selected Destinations: Luminous Markers & Radial-Dispersed Collision-Free Bengali Labels
        const statY = 1245;
        const selectedDestinations = ctgPlaces.filter(place => state.selectedPlaces.includes(place.id));

        // Helper: Calculate perimeter anchor point of a box closest to (mx, my)
        function getBoxPerimeterAnchor(mx, my, bx, by, boxW, boxH) {
            const cx = bx + boxW / 2;
            const cy = by + boxH / 2;
            const dx = mx - cx;
            const dy = my - cy;

            if (Math.abs(dx) * boxH > Math.abs(dy) * boxW) {
                // Connects to left or right vertical edge
                return {
                    x: dx < 0 ? bx : bx + boxW,
                    y: Math.max(by + 3, Math.min(by + boxH - 3, my))
                };
            } else {
                // Connects to top or bottom horizontal edge
                return {
                    x: Math.max(bx + 4, Math.min(bx + boxW - 4, mx)),
                    y: dy < 0 ? by : by + boxH
                };
            }
        }

        // Helper: Quick line-box intersection to prevent leader lines slicing through existing labels
        function lineIntersectsBox(p1, p2, box) {
            const minX = Math.min(p1.x, p2.x);
            const maxX = Math.max(p1.x, p2.x);
            const minY = Math.min(p1.y, p2.y);
            const maxY = Math.max(p1.y, p2.y);
            if (maxX < box.x || minX > box.x + box.w || maxY < box.y || minY > box.y + box.h) return false;
            // Midpoint check inside box
            const midX = (p1.x + p2.x) / 2;
            const midY = (p1.y + p2.y) / 2;
            return (midX >= box.x && midX <= box.x + box.w && midY >= box.y && midY <= box.y + box.h);
        }

        // A. Draw Geographic Markers at exact locations
        selectedDestinations.forEach(place => {
            const pt = project(place.longitude, place.latitude);
            const mx = mapOffsetX + pt.x * mapScale;
            const my = mapOffsetY + pt.y * mapScale;

            // Outer luminous halo gradient
            const haloGrad = ctx.createRadialGradient(mx, my, 2, mx, my, 18);
            haloGrad.addColorStop(0, th.accent);
            haloGrad.addColorStop(0.5, th.accentGlow);
            haloGrad.addColorStop(1, 'transparent');

            ctx.fillStyle = haloGrad;
            ctx.beginPath();
            ctx.arc(mx, my, 18, 0, Math.PI * 2);
            ctx.fill();

            // Mid ring
            ctx.beginPath();
            ctx.arc(mx, my, 7.5, 0, Math.PI * 2);
            ctx.strokeStyle = th.accent;
            ctx.lineWidth = 1.8;
            ctx.stroke();

            // Crisp white core
            ctx.beginPath();
            ctx.arc(mx, my, 4, 0, Math.PI * 2);
            ctx.fillStyle = '#ffffff';
            ctx.fill();
        });

        // B. Prepare Destination Items with Cluster Detection & Density
        const items = selectedDestinations.map(place => {
            const pt = project(place.longitude, place.latitude);
            return {
                place,
                mx: mapOffsetX + pt.x * mapScale,
                my: mapOffsetY + pt.y * mapScale,
                density: 0,
                centroid: null,
                outwardAngle: null
            };
        });

        // Compute local density and cluster centroids
        items.forEach(it => {
            let neighborSumX = it.mx;
            let neighborSumY = it.my;
            let count = 0;

            items.forEach(other => {
                if (other !== it) {
                    const dist = Math.hypot(it.mx - other.mx, it.my - other.my);
                    if (dist < 85) {
                        count++;
                        neighborSumX += other.mx;
                        neighborSumY += other.my;
                    }
                }
            });

            it.density = count;
            if (count >= 1) {
                const cx = neighborSumX / (count + 1);
                const cy = neighborSumY / (count + 1);
                it.centroid = { cx, cy };
                it.outwardAngle = Math.atan2(it.my - cy, it.mx - cx);
            }
        });

        // Deterministic sorting: places in densest clusters placed first so they claim optimal outward escape vectors
        items.sort((a, b) => {
            if (b.density !== a.density) return b.density - a.density;
            if (b.place.latitude !== a.place.latitude) return b.place.latitude - a.place.latitude;
            return a.place.longitude - b.place.longitude;
        });

        // C. Multi-Tier Radial Dispersal Label Placement
        const placedBoxes = [];
        const minBoundX = 30;
        const maxBoundX = W - 30;
        const minBoundY = mapOffsetY - 5;
        const maxBoundY = statY - 30;

        items.forEach(item => {
            const { place, mx, my } = item;
            const nameText = (place.name_bn || place.name || '').trim();
            if (!nameText) return;

            // Compact Bengali typography
            let fontSize = 12;
            if (nameText.length > 14) fontSize = 10.5;
            else if (nameText.length > 10) fontSize = 11.5;
            const labelFont = `600 ${fontSize}px "Hind Siliguri", "Noto Sans Bengali", sans-serif`;
            ctx.font = labelFont;

            const textMetrics = ctx.measureText(nameText);
            const textW = Math.ceil(textMetrics.width);
            const boxPadX = 7;
            const boxPadY = 4;
            const boxH = Math.round(fontSize + boxPadY * 2 + 1); // ~19-20px
            const boxW = textW + boxPadX * 2;

            // Generate 16 angular directions (22.5 deg intervals)
            const angleCount = 16;
            const baseAngles = [];
            const centerAngle = (item.outwardAngle !== null) ? item.outwardAngle : 0;

            // Alternating angles fanning away from the center angle: 0, +d, -d, +2d, -2d, ...
            for (let i = 0; i < angleCount; i++) {
                const step = Math.ceil(i / 2);
                const sign = (i % 2 === 1) ? 1 : -1;
                const offset = (i === 0) ? 0 : sign * step * (Math.PI * 2 / angleCount);
                baseAngles.push(centerAngle + offset);
            }

            // Multi-tier radial distances (closer for sparse spots, progressively farther for dense clusters)
            const radialTiers = (item.density >= 3)
                ? [24, 44, 68, 96, 130, 165]
                : (item.density >= 1)
                    ? [20, 38, 60, 88, 120]
                    : [18, 34, 52, 75];

            let bestCandidate = null;
            let lowestScore = Infinity;

            for (const R of radialTiers) {
                for (const angle of baseAngles) {
                    const cx = mx + Math.cos(angle) * (R + boxW / 2);
                    const cy = my + Math.sin(angle) * (R + boxH / 2);
                    const bx = cx - boxW / 2;
                    const by = cy - boxH / 2;

                    let score = 0;

                    // 1. Boundary penalty
                    if (bx < minBoundX || bx + boxW > maxBoundX || by < minBoundY || by + boxH > maxBoundY) {
                        score += 20000000;
                    }

                    // 2. Overlap with placed boxes (strictly forbidden)
                    const buffer = 4;
                    for (const pb of placedBoxes) {
                        const xOverlap = Math.max(0, Math.min(bx + boxW + buffer, pb.x + pb.w + buffer) - Math.max(bx - buffer, pb.x - buffer));
                        const yOverlap = Math.max(0, Math.min(by + boxH + buffer, pb.y + pb.h + buffer) - Math.max(by - buffer, pb.y - buffer));
                        if (xOverlap > 0 && yOverlap > 0) {
                            score += 10000000 + (xOverlap * yOverlap * 200);
                        }
                    }

                    // 3. Proximity to any marker core
                    for (const other of items) {
                        if (other.mx >= bx - 8 && other.mx <= bx + boxW + 8 && other.my >= by - 8 && other.my <= by + boxH + 8) {
                            score += 600000;
                        }
                    }

                    // 4. Line obstruction check
                    const anchor = getBoxPerimeterAnchor(mx, my, bx, by, boxW, boxH);
                    for (const pb of placedBoxes) {
                        if (lineIntersectsBox({ x: mx, y: my }, anchor, pb)) {
                            score += 300000;
                        }
                    }

                    // 5. Distance cost (prefer closer placement when free)
                    score += R * 1.5;

                    if (score === 0 || score < 500) {
                        // Found a clean, non-overlapping candidate at this tier
                        bestCandidate = { bx, by, boxW, boxH, fontSize, labelFont, anchor, R };
                        lowestScore = score;
                        break;
                    }

                    if (score < lowestScore) {
                        lowestScore = score;
                        bestCandidate = { bx, by, boxW, boxH, fontSize, labelFont, anchor, R };
                    }
                }

                if (lowestScore < 500) {
                    // Early exit once a clean position in the lowest possible tier is found
                    break;
                }
            }

            if (!bestCandidate) {
                const defaultAnchor = { x: mx + 18, y: my };
                bestCandidate = { bx: mx + 18, by: my - boxH / 2, boxW, boxH, fontSize, labelFont, anchor: defaultAnchor, R: 18 };
            }

            // Clamp safely inside canvas map bounds
            bestCandidate.bx = Math.max(minBoundX, Math.min(maxBoundX - boxW, bestCandidate.bx));
            bestCandidate.by = Math.max(minBoundY, Math.min(maxBoundY - boxH, bestCandidate.by));

            placedBoxes.push({
                x: bestCandidate.bx,
                y: bestCandidate.by,
                w: boxW,
                h: boxH
            });

            // Recalculate anchor point on clamped box perimeter
            const finalAnchor = getBoxPerimeterAnchor(mx, my, bestCandidate.bx, bestCandidate.by, boxW, boxH);

            // Draw thin elegant leader line
            ctx.save();
            ctx.strokeStyle = th.accent;
            ctx.lineWidth = 1.0;
            ctx.globalAlpha = 0.65;
            ctx.beginPath();
            ctx.moveTo(mx, my);
            ctx.lineTo(finalAnchor.x, finalAnchor.y);
            ctx.stroke();
            ctx.restore();

            // Draw translucent capsule background with subtle elevation
            ctx.save();
            ctx.fillStyle = th.labelBg || 'rgba(6, 19, 14, 0.90)';
            ctx.strokeStyle = th.labelBorder || th.accent;
            ctx.lineWidth = 1.0;
            ctx.shadowColor = 'rgba(0, 0, 0, 0.65)';
            ctx.shadowBlur = 6;
            ctx.shadowOffsetY = 2;

            drawRoundRect(ctx, bestCandidate.bx, bestCandidate.by, boxW, boxH, 5);
            ctx.fill();
            ctx.stroke();
            ctx.restore();

            // Draw crisp Bengali label text inside capsule
            ctx.save();
            ctx.fillStyle = th.textMain;
            ctx.font = bestCandidate.labelFont;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(nameText, bestCandidate.bx + boxW / 2, bestCandidate.by + boxH / 2 + 1);
            ctx.restore();
        });

        // 7. Stats & Exploration Counter
        const count = state.selectedPlaces.length;
        const total = ctgPlaces.length;
        const countBn = toBanglaDigits(count, 2);
        const totalBn = toBanglaDigits(total, 2);
        const statStr = `${countBn} / ${totalBn}`;

        // Big Count
        ctx.textAlign = 'center';
        ctx.fillStyle = th.accent;
        ctx.font = '800 74px "Plus Jakarta Sans", "Hind Siliguri", sans-serif';
        ctx.fillText(statStr, W / 2, statY);

        // Sublabel: PLACES EXPLORED
        ctx.fillStyle = th.textMain;
        ctx.font = '700 20px "Plus Jakarta Sans", sans-serif';
        if ('letterSpacing' in ctx) ctx.letterSpacing = '5px';
        ctx.fillText('PLACES EXPLORED', W / 2, statY + 36);
        if ('letterSpacing' in ctx) ctx.letterSpacing = '0px';

        // Tagline: চট্টগ্রাম বিভাগের পথে পথে
        ctx.fillStyle = th.textSub;
        ctx.font = '500 20px "Hind Siliguri", sans-serif';
        ctx.fillText('চট্টগ্রাম বিভাগের পথে পথে', W / 2, statY + 72);

        // 8. Footer Branding (Split Left/Right Luxury Branding)
        const footerY = H - 65;
        ctx.fillStyle = th.textDim;
        ctx.font = 'bold 16px "Plus Jakarta Sans", sans-serif';
        if ('letterSpacing' in ctx) ctx.letterSpacing = '3px';
        ctx.textAlign = 'left';
        ctx.fillText('#MYCHATTOGRAM', 90, footerY);
        if ('letterSpacing' in ctx) ctx.letterSpacing = '0px';

        ctx.fillStyle = th.accent;
        ctx.font = 'bold 16px "Plus Jakarta Sans", sans-serif';
        if ('letterSpacing' in ctx) ctx.letterSpacing = '3px';
        ctx.textAlign = 'right';
        ctx.fillText("● SAKIB'S CREATION", W - 90, footerY);
        if ('letterSpacing' in ctx) ctx.letterSpacing = '0px';
    }

    // Bind event listeners for Experience 03
    function bindEvents() {
        // Search Filter
        const searchInput = document.getElementById("placesSearch");
        const clearSearchBtn = document.getElementById("btnClearSearch");

        if (searchInput) {
            searchInput.addEventListener("input", () => {
                if (clearSearchBtn) {
                    clearSearchBtn.style.display = searchInput.value ? "block" : "none";
                }
                renderPlacesList();
            });
        }

        if (clearSearchBtn) {
            clearSearchBtn.addEventListener("click", () => {
                if (searchInput) {
                    searchInput.value = "";
                    clearSearchBtn.style.display = "none";
                    searchInput.focus();
                }
                renderPlacesList();
            });
        }

        // District Filter
        const distFilter = document.getElementById("placesDistrictFilter");
        if (distFilter) {
            distFilter.addEventListener("change", () => {
                renderPlacesList();
                updatePlaceLabels();
            });
        }

        // Category Filter
        const catFilter = document.getElementById("placesCategoryFilter");
        if (catFilter) {
            catFilter.addEventListener("change", () => {
                // Sync chip active state
                const val = catFilter.value;
                document.querySelectorAll("#placesCategoryChips .ctg-chip").forEach(chip => {
                    if (chip.dataset.cat === val) {
                        chip.classList.add("active");
                    } else {
                        chip.classList.remove("active");
                    }
                });
                renderPlacesList();
                updatePlaceLabels();
            });
        }

        // Clear Selection
        const btnClear = document.getElementById("btnClearPlaces");
        if (btnClear) {
            btnClear.addEventListener("click", () => {
                if (state.selectedPlaces.length === 0) return;
                state.selectedPlaces = [];
                saveState();
                updateUI();
            });
        }

        // Select All Places
        const btnSelectAll = document.getElementById("btnSelectAllPlaces");
        if (btnSelectAll) {
            btnSelectAll.addEventListener("click", () => {
                state.selectedPlaces = ctgPlaces.map(p => p.id);
                saveState();
                updateUI();
            });
        }

        // Toggle Place Labels Visibility Button
        const btnToggleLabels = document.getElementById("btnTogglePlaceLabels");
        const toggleLabelsText = document.getElementById("placeLabelsToggleText");
        if (btnToggleLabels) {
            btnToggleLabels.addEventListener("click", () => {
                showPlaceLabels = !showPlaceLabels;
                btnToggleLabels.classList.toggle("active", showPlaceLabels);
                btnToggleLabels.setAttribute("aria-pressed", showPlaceLabels ? "true" : "false");
                if (toggleLabelsText) {
                    toggleLabelsText.textContent = showPlaceLabels ? "নাম দৃশ্যমান" : "নাম লুকানো";
                }
                updatePlaceLabels();
            });
        }

        // Poster Name Input & Quick Input Bi-directional Sync
        const nameInput = document.getElementById("placesPosterName");
        const quickNameInput = document.getElementById("inputPlacesQuickName");
        const btnResetPlacesName = document.getElementById("btnResetPlacesName");
        const btnResetPlacesQuickName = document.getElementById("btnResetPlacesQuickName");
        const titleCharCounter = document.getElementById("placesTitleCharCounter");

        function handlePlacesNameUpdate(val) {
            const raw = (val || "").trim();
            if (nameInput && nameInput.value !== raw) nameInput.value = raw;
            if (quickNameInput && quickNameInput.value !== raw) quickNameInput.value = raw;
            if (titleCharCounter) {
                titleCharCounter.textContent = `${toBanglaDigits(raw.length, 1)} / ৩২`;
            }
            if (btnResetPlacesName) {
                btnResetPlacesName.style.display = raw.length > 0 ? "inline-block" : "none";
            }
            if (btnResetPlacesQuickName) {
                btnResetPlacesQuickName.style.display = raw.length > 0 ? "inline-block" : "none";
            }
            const liveTitleEl = document.getElementById("placesPosterLiveTitle");
            if (liveTitleEl) {
                const isDefault = !raw || raw.toLowerCase() === "places i've explored" || raw.toLowerCase().includes("explored's") || raw === "আমার ঘোরা জায়গাগুলো";
                liveTitleEl.textContent = isDefault ? "আমার ঘোরা জায়গাগুলো" : `${raw} — ঘোরা জায়গাগুলো`;
            }
            renderPoster();
        }

        if (nameInput) {
            nameInput.addEventListener("input", (e) => handlePlacesNameUpdate(e.target.value));
        }
        if (quickNameInput) {
            quickNameInput.addEventListener("input", (e) => handlePlacesNameUpdate(e.target.value));
        }
        if (btnResetPlacesName) {
            btnResetPlacesName.addEventListener("click", () => handlePlacesNameUpdate(""));
        }
        if (btnResetPlacesQuickName) {
            btnResetPlacesQuickName.addEventListener("click", () => handlePlacesNameUpdate(""));
        }

        // Theme Selector & Custom Theme
        const themeSelector = document.getElementById("placesThemeSelector");
        const customThemeSection = document.getElementById("placesCustomThemeSection");
        const btnToggleCustomTheme = document.getElementById("btnToggleCustomTheme");
        const txtCustomThemeStatus = document.getElementById("txtCustomThemeStatus");
        const customBgInput = document.getElementById("placesCustomBg");
        const customAccentInput = document.getElementById("placesCustomAccent");
        const customTextInput = document.getElementById("placesCustomText");
        const customBgHex = document.getElementById("placesCustomBgHex");
        const customAccentHex = document.getElementById("placesCustomAccentHex");
        const customTextHex = document.getElementById("placesCustomTextHex");

        function activateCustomTheme() {
            if (themeSelector) {
                themeSelector.querySelectorAll(".ctg-theme-btn").forEach(b => {
                    b.classList.remove("active");
                    b.setAttribute("aria-checked", "false");
                });
            }
            if (customThemeSection) customThemeSection.classList.add("active");
            if (btnToggleCustomTheme) {
                btnToggleCustomTheme.setAttribute("aria-pressed", "true");
            }
            if (txtCustomThemeStatus) txtCustomThemeStatus.textContent = "সক্রিয় রয়েছে";
            currentTheme = 'custom';
            renderPoster();
        }

        function deactivateCustomTheme() {
            if (customThemeSection) customThemeSection.classList.remove("active");
            if (btnToggleCustomTheme) {
                btnToggleCustomTheme.setAttribute("aria-pressed", "false");
            }
            if (txtCustomThemeStatus) txtCustomThemeStatus.textContent = "কাস্টম মোড";
        }

        document.querySelectorAll("#placesThemeSelector .ctg-theme-btn, #placesPosterQuickBar .ctg-quick-swatch-dot, #placesFloatingThemeBar .ctg-mf-chip").forEach(btn => {
            btn.addEventListener("click", () => {
                deactivateCustomTheme();
                currentTheme = btn.getAttribute("data-theme") || "dark";
                updateUI();
            });
        });

        if (btnToggleCustomTheme) {
            btnToggleCustomTheme.addEventListener("click", () => {
                if (currentTheme === 'custom') {
                    // Switch back to default dark
                    deactivateCustomTheme();
                    const darkBtn = themeSelector?.querySelector('[data-theme="dark"]');
                    if (darkBtn) {
                        darkBtn.classList.add("active");
                        darkBtn.setAttribute("aria-checked", "true");
                    }
                    currentTheme = 'dark';
                    renderPoster();
                } else {
                    activateCustomTheme();
                }
            });
        }

        [
            { input: customBgInput, hex: customBgHex },
            { input: customAccentInput, hex: customAccentHex },
            { input: customTextInput, hex: customTextHex }
        ].forEach(({ input, hex }) => {
            if (input) {
                input.addEventListener("input", () => {
                    if (hex) hex.textContent = input.value;
                    activateCustomTheme();
                });
            }
        });

        // Multi-Format Exporter Helpers for Experience 03
        function triggerPlacesDownload(url, filename) {
            const a = document.createElement("a");
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }

        function showPlacesToast(msg) {
            const toast = document.createElement('div');
            toast.className = 'ctg-toast';
            toast.style.cssText = 'position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:rgba(4,20,15,0.92);border:1px solid #2a9d8f;color:#fff;padding:10px 20px;border-radius:30px;font-size:13px;font-weight:700;z-index:99999;box-shadow:0 8px 24px rgba(0,0,0,0.5);backdrop-filter:blur(8px);';
            toast.textContent = msg;
            document.body.appendChild(toast);
            setTimeout(() => { toast.remove(); }, 2500);
        }

        function generateAndDownloadPlacesPdf(canvas, filename) {
            try {
                if (window.jspdf && window.jspdf.jsPDF) {
                    const { jsPDF } = window.jspdf;
                    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: [210, 262.5] });
                    const imgData = canvas.toDataURL('image/jpeg', 0.98);
                    pdf.addImage(imgData, 'JPEG', 0, 0, 210, 262.5);
                    pdf.save(filename);
                    showPlacesToast('✓ PDF প্রিন্ট-রেডি ফাইল ডাউনলোড হয়েছে');
                } else {
                    const dataUrl = canvas.toDataURL('image/png');
                    triggerPlacesDownload(dataUrl, filename.replace('.pdf', '.png'));
                    showPlacesToast('✓ PNG ডাউনলোড সম্পন্ন (PDF লাইব্রেরি লোড না হওয়ায়)');
                }
            } catch (e) {
                console.error('PDF generation failed:', e);
                const dataUrl = canvas.toDataURL('image/png');
                triggerPlacesDownload(dataUrl, filename.replace('.pdf', '.png'));
            }
        }

        function downloadPlacesPoster(format) {
            const canvas = document.getElementById("placesExportCanvas");
            if (!canvas) return;
            renderPoster();
            const timestamp = new Date().toISOString().slice(0, 10);
            const nameInputEl = document.getElementById('placesPosterName');
            const rawTitle = (nameInputEl && nameInputEl.value.trim()) ? nameInputEl.value.trim() : 'Places-Ive-Explored';
            const sanitizedTitle = rawTitle.replace(/[^a-zA-Z0-9\u0980-\u09FF\-_]+/g, '-').replace(/^-+|-+$/g, '') || 'My-Chattogram-Places';
            const baseFileName = `${sanitizedTitle}-${currentTheme}-${timestamp}`;

            if (format === 'png') {
                const dataUrl = canvas.toDataURL('image/png');
                triggerPlacesDownload(dataUrl, `${baseFileName}.png`);
                showPlacesToast('✓ PNG পোস্টার ডাউনলোড শুরু হয়েছে (Ultra HD)');
            } else if (format === 'jpg' || format === 'jpeg') {
                const dataUrl = canvas.toDataURL('image/jpeg', 1.0);
                triggerPlacesDownload(dataUrl, `${baseFileName}.jpg`);
                showPlacesToast('✓ JPG পোস্টার ডাউনলোড সম্পন্ন (১০০% কোয়ালিটি)');
            } else if (format === 'pdf') {
                generateAndDownloadPlacesPdf(canvas, `${baseFileName}.pdf`);
            }
        }

        const setupPlacesDownloadBtn = (id, format) => {
            const btn = document.getElementById(id);
            if (btn) {
                btn.addEventListener("click", () => downloadPlacesPoster(format));
            }
        };
        setupPlacesDownloadBtn('btnDownloadPlacesPng', 'png');
        setupPlacesDownloadBtn('btnDownloadPlacesJpg', 'jpg');
        setupPlacesDownloadBtn('btnDownloadPlacesPdf', 'pdf');

        // Download Poster (PNG)
        const btnDownload = document.getElementById("btnDownloadPlacesPoster");
        if (btnDownload) {
            btnDownload.addEventListener("click", () => {
                const canvas = document.getElementById("placesExportCanvas");
                if (!canvas) return;

                const countStr = toBanglaDigits(state.selectedPlaces.length, 2);
                const filename = `my-chattogram-places-${countStr}.png`;

                if (canvas.toBlob) {
                    canvas.toBlob((blob) => {
                        if (!blob) return;
                        const url = URL.createObjectURL(blob);
                        const link = document.createElement("a");
                        link.href = url;
                        link.download = filename;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                        setTimeout(() => URL.revokeObjectURL(url), 2000);
                    }, 'image/png');
                } else {
                    const link = document.createElement("a");
                    link.href = canvas.toDataURL("image/png");
                    link.download = filename;
                    link.click();
                }
            });
        }

        // Copy Caption
        const btnCopyCaption = document.getElementById("btnCopyPlacesCaption");
        if (btnCopyCaption) {
            btnCopyCaption.addEventListener("click", async () => {
                const captionArea = document.getElementById("captionPlacesTextArea");
                const copyBtnText = document.getElementById("copyPlacesBtnText");
                const text = captionArea?.value || "";

                try {
                    if (navigator.clipboard && navigator.clipboard.writeText) {
                        await navigator.clipboard.writeText(text);
                    } else if (captionArea) {
                        captionArea.select();
                        document.execCommand("copy");
                    }

                    if (copyBtnText) {
                        const original = copyBtnText.textContent;
                        copyBtnText.textContent = "কপি হয়েছে!";
                        btnCopyCaption.style.color = "var(--ctg-accent-gold)";
                        setTimeout(() => {
                            copyBtnText.textContent = original;
                            btnCopyCaption.style.color = "";
                        }, 2000);
                    }
                } catch (err) {
                    console.error("Failed to copy caption:", err);
                }
            });
        }

        // Native Web Share API (Mobile)
        const btnShare = document.getElementById("btnWebSharePlaces");
        if (btnShare && navigator.share) {
            btnShare.style.display = "inline-flex";
            btnShare.addEventListener("click", async () => {
                const canvas = document.getElementById("placesExportCanvas");
                const captionArea = document.getElementById("captionPlacesTextArea");
                const text = captionArea?.value || "";

                try {
                    if (canvas && canvas.toBlob && navigator.canShare) {
                        canvas.toBlob(async (blob) => {
                            const file = new File([blob], "my-chattogram-places.png", { type: "image/png" });
                            if (navigator.canShare({ files: [file] })) {
                                await navigator.share({
                                    title: "My Chattogram — আমার ঘোরা জায়গাগুলো",
                                    text: text,
                                    files: [file]
                                });
                                return;
                            }
                            await navigator.share({
                                title: "My Chattogram — আমার ঘোরা জায়গাগুলো",
                                text: text,
                                url: window.location.href
                            });
                        }, "image/png");
                    } else {
                        await navigator.share({
                            title: "My Chattogram — আমার ঘোরা জায়গাগুলো",
                            text: text,
                            url: window.location.href
                        });
                    }
                } catch (e) {
                    // User canceled or share failed
                }
            });
        }

        // Navigation trigger: listen when user clicks Experience 04 card
        const btnExp4 = document.getElementById("btnExp4");
        if (btnExp4) {
            btnExp4.addEventListener("click", () => {
                if (!isInitialized) {
                    initData();
                    initMap();
                } else {
                    renderPoster();
                }
            });
        }
        window.renderPlacesPoster = renderPoster;
    }

    // Initialize module on DOM ready
    window.addEventListener("DOMContentLoaded", () => {
        loadState();
        initData();
        bindEvents();
        initMap(); // Eagerly preload geometry and markers so Experience 03 is ready instantly

        // Check if page loaded with #exp3 or ?exp=3
        if (window.location.hash === '#exp4' || window.location.search.includes('exp=4')) {
            if (typeof window.switchCtgExperience === 'function') {
                window.switchCtgExperience('exp4', false);
            } else {
                const exp4View = document.getElementById("experience4View");
                const landingView = document.getElementById("landingView");
                if (landingView) landingView.style.display = "none";
                if (exp4View) exp4View.style.display = "block";
                document.body.classList.remove("on-landing");
            }

            const urlParams = new URLSearchParams(window.location.search);
            if (urlParams.has('sample_places')) {
                // Preload dense diverse Chattogram destinations (Cox's Bazar, Bandarban, Rangamati, Khagrachhari, Chattogram)
                state.selectedPlaces = [1, 8, 57, 58, 64, 3, 54, 55, 110, 111, 112, 2, 4, 53, 29, 22, 23, 24];
                saveState();
                updateUI();
            }

            if (urlParams.has('custom_bg')) {
                const bgInput = document.getElementById("placesCustomBg");
                if (bgInput) bgInput.value = urlParams.get('custom_bg');
            }
            if (urlParams.has('custom_accent')) {
                const accentInput = document.getElementById("placesCustomAccent");
                if (accentInput) accentInput.value = urlParams.get('custom_accent');
            }
            if (urlParams.has('custom_text')) {
                const textInput = document.getElementById("placesCustomText");
                if (textInput) textInput.value = urlParams.get('custom_text');
            }

            if (urlParams.has('theme')) {
                const reqTheme = urlParams.get('theme');
                if (THEMES[reqTheme] || reqTheme === 'custom') {
                    currentTheme = reqTheme;
                    const themeSelector = document.getElementById("placesThemeSelector");
                    const customThemeSection = document.getElementById("placesCustomThemeSection");
                    const btnToggleCustomTheme = document.getElementById("btnToggleCustomTheme");

                    document.querySelectorAll("#placesThemeSelector .ctg-theme-btn, #placesFloatingThemeBar .ctg-mf-chip").forEach(b => {
                        const isMatch = b.getAttribute("data-theme") === reqTheme;
                        b.classList.toggle("active", isMatch);
                        b.setAttribute("aria-checked", isMatch ? "true" : "false");
                    });

                    if (reqTheme === 'custom') {
                        if (customThemeSection) customThemeSection.classList.add("active");
                        if (btnToggleCustomTheme) btnToggleCustomTheme.setAttribute("aria-pressed", "true");
                    }
                    renderPoster();
                }
            }

            if (urlParams.has('poster_only')) {
                const layoutSection = document.querySelector(".ctg-places-layout-section");
                if (layoutSection) layoutSection.style.display = "none";
                const backBtnContainer = document.querySelector("#experience4View > .ctg-container");
                if (backBtnContainer) backBtnContainer.style.display = "none";
                window.scrollTo(0, 0);
            }
        }
    });

    // Expose for multi-experience switcher
    window.renderPlacesPoster = renderPoster;
    window.updatePlacesStats = updateUI;
    window.initPlacesMap = initMap;

})();

