/**
 * ============================================================================
 *  MY CHATTOGRAM — VIRAL INTERACTIVE MAP CREATOR & SOCIAL POSTER ENGINE
 *  Sakib's Creation Flagship Social Experience
 * ============================================================================
 *  100% Isolated. Zero dependencies on Ghuraghuri core logic.
 *  Handles:
 *   1. Verified 15-Upazila Dataset (Layer A)
 *   2. Verified City Areas Dataset (Layer B - Strictly separated)
 *   3. Real-time selection & exploration stats
 *   4. Minimal personalization (Title & 4 Themes)
 *   5. Native HTML5 Canvas 2D Poster Engine (1200 × 1500 px)
 *   6. PNG Download & Viral Caption Copy
 *   7. Isolated localStorage (ghuraghuri_ctg_progress)
 * ============================================================================
 */

(function () {
    "use strict";

    /* --------------------------------------------------------------------------
       1. DATASETS
       -------------------------------------------------------------------------- */
    // Official 15 Administrative Upazilas of Chattogram District (BBS / DC Office verified)
    
    const UPAZILA_MAP = {
        'Mirsharai': { id: 'mirsharai', name_bn: 'মিরসরাই', name_en: 'Mirsharai', offset: { x: 0, y: 0 } },
        'Sitakunda': { id: 'sitakunda', name_bn: 'সীতাকুণ্ড', name_en: 'Sitakunda', offset: { x: 0, y: 0 } },
        'Fatikchhari': { id: 'fatikchhari', name_bn: 'ফটিকছড়ি', name_en: 'Fatikchhari', offset: { x: 0, y: 0 } },
        'Sandwip': { id: 'sandwip', name_bn: 'সন্দ্বীপ', name_en: 'Sandwip', offset: { x: 0, y: 0 } },
        'Hathazari': { id: 'hathazari', name_bn: 'হাটহাজারী', name_en: 'Hathazari', offset: { x: 0, y: 0 } },
        'Raozan': { id: 'raozan', name_bn: 'রাউজান', name_en: 'Raozan', offset: { x: 0, y: 0 } },
        'Rangunia': { id: 'rangunia', name_bn: 'রাঙ্গুনিয়া', name_en: 'Rangunia', offset: { x: 0, y: 0 } },
        'Karnaphuli': { id: 'karnaphuli', name_bn: 'কর্ণফুলী', name_en: 'Karnaphuli', offset: { x: -4, y: 0 } },
        'Boalkhali': { id: 'boalkhali', name_bn: 'বোয়ালখালী', name_en: 'Boalkhali', offset: { x: 14, y: 0 } },
        'Anwara': { id: 'anwara', name_bn: 'আনোয়ারা', name_en: 'Anwara', offset: { x: 0, y: 0 } },
        'Patiya': { id: 'patiya', name_bn: 'পটিয়া', name_en: 'Patiya', offset: { x: 0, y: 0 } },
        'Chandanaish': { id: 'chandanaish', name_bn: 'চন্দনাইশ', name_en: 'Chandanaish', offset: { x: -8, y: 0 } },
        'Banshkhali': { id: 'banshkhali', name_bn: 'বাঁশখালী', name_en: 'Banshkhali', offset: { x: 0, y: 0 } },
        'Satkania': { id: 'satkania', name_bn: 'সাতকানিয়া', name_en: 'Satkania', offset: { x: 0, y: 0 } },
        'Lohagara': { id: 'lohagara', name_bn: 'লোহাগাড়া', name_en: 'Lohagara', offset: { x: 0, y: 0 } },
        // Fallbacks for alternative spellings in HDX
        'Anowara': { id: 'anwara', name_bn: 'আনোয়ারা', name_en: 'Anwara', offset: { x: 0, y: 0 } },
        'Karnafuli': { id: 'karnaphuli', name_bn: 'কর্ণফুলী', name_en: 'Karnaphuli', offset: { x: -4, y: 0 } },
        'Mirsarai': { id: 'mirsharai', name_bn: 'মিরসরাই', name_en: 'Mirsharai', offset: { x: 0, y: 0 } }
    };

    // Landmark highlights for all 15 upazilas of Chattogram District
    const UPAZILA_LANDMARKS = {
        'sitakunda': { bn: 'সীতাকুণ্ড', en: 'Sitakunda', highlights: 'চন্দ্রনাথ পাহাড়, গুলিয়াখালী সি-বীচ ও বাঁশবাড়িয়া জেটি' },
        'mirsharai': { bn: 'মীরসরাই', en: 'Mirsharai', highlights: 'মহামায়া লেক কায়াকিং, খৈয়াছড়া ও নাপিত্তাছড়া ঝর্ণা' },
        'sandwip': { bn: 'সন্দ্বীপ', en: 'Sandwip', highlights: 'ঐতিহাসিক সবুজ উপকূলীয় দ্বীপ ও কেওড়া বনের মোহনা' },
        'fatikchhari': { bn: 'ফটিকছড়ি', en: 'Fatikchhari', highlights: 'সবুজ চা বাগান ও আধ্যাত্মিক মাইজভাণ্ডার দরবার' },
        'hathazari': { bn: 'হাটহাজারী', en: 'Hathazari', highlights: 'চট্টগ্রাম বিশ্ববিদ্যালয় সবুজ ক্যাম্পাস ও হালদা নদী' },
        'raozan': { bn: 'রাউজান', en: 'Raozan', highlights: 'মাস্টারদা সূর্য সেন স্মৃতি ও ঐতিহ্যবাহী পাহাড়ি ঢাল' },
        'rangunia': { bn: 'রাঙ্গুনিয়া', en: 'Rangunia', highlights: 'কর্ণফুলী নদীর তীর, চন্দ্রঘোনা ও বেতবুনিয়া ভূ-উপগ্রহ কেন্দ্র' },
        'boalkhali': { bn: 'বোয়ালখালী', en: 'Boalkhali', highlights: 'ঐতিহাসিক কালুরঘাট রেল সেতু ও মেধা মুনির আশ্রম' },
        'patiya': { bn: 'পটিয়া', en: 'Patiya', highlights: 'ঐতিহাসিক বিপ্লবীদের স্মৃতিবিজড়িত মাটি ও ক্ষীর-মিষ্টি' },
        'anwara': { bn: 'আনোয়ারা', en: 'Anwara', highlights: 'পারকি সমুদ্র সৈকত ও কর্ণফুলী বঙ্গবন্ধু টানেল সংযোগ' },
        'karnaphuli': { bn: 'কর্ণফুলী', en: 'Karnaphuli', highlights: 'কর্ণফুলী নদী, শিপইয়ার্ড, ড্রাই ডক ও মোহনা' },
        'chandanaish': { bn: 'চন্দনাইশ', en: 'Chandanaish', highlights: 'গাছবাড়িয়া পেয়ারা বাগান ও পাহাড়ি সবুজ উপত্যকা' },
        'satkania': { bn: 'সাতকানিয়া', en: 'Satkania', highlights: 'ঐতিহাসিক বাইতুল ইজ্জত ও সাতকানিয়া পাহাড়ি রেঞ্জ' },
        'lohagara': { bn: 'লোহাগাড়া', en: 'Lohagara', highlights: 'চুনতি বন্যপ্রাণী অভয়ারণ্য ও প্রাকৃতিক সবুজ অরণ্য' },
        'banshkhali': { bn: 'বাঁশখালী', en: 'Banshkhali', highlights: 'বাঁশখালী ইকোপার্ক, ঝুলন্ত সেতু ও বিশাল সমুদ্র উপকূল' }
    };


    // Key Metropolitan Neighborhoods (Separated from Upazila layer; NO fake totals!)
    

    // Aesthetic Themes for 1200x1500 Poster
    var THEMES = {
        dark: {
            name: "Minimal Dark",
            bg: "#06130e",
            cardBg: "#0e271f",
            accent: "#e9c46a",
            accentSecondary: "#f4a261",
            textPrimary: "#ffffff",
            textMuted: "#95aea3",
            textDim: "#557065",
            gridBorder: "rgba(233, 196, 106, 0.22)",
            activeTileBg: "#e9c46a",
            activeTileText: "#06130e",
            unselectedTileBg: "rgba(255, 255, 255, 0.04)",
            unselectedTileBorder: "rgba(255, 255, 255, 0.12)"
        },
        emerald: {
            name: "Coastal Emerald",
            bg: "#04140f",
            cardBg: "#0a2d21",
            accent: "#2a9d8f",
            accentSecondary: "#52b788",
            textPrimary: "#ffffff",
            textMuted: "#88c4b0",
            textDim: "#447868",
            gridBorder: "rgba(42, 157, 143, 0.3)",
            activeTileBg: "#2a9d8f",
            activeTileText: "#ffffff",
            unselectedTileBg: "rgba(42, 157, 143, 0.06)",
            unselectedTileBorder: "rgba(42, 157, 143, 0.2)"
        },
        ochre: {
            name: "Heritage Ochre",
            bg: "#150d08",
            cardBg: "#291c13",
            accent: "#f4a261",
            accentSecondary: "#e76f51",
            textPrimary: "#ffffff",
            textMuted: "#b89f8f",
            textDim: "#735c4f",
            gridBorder: "rgba(244, 162, 97, 0.25)",
            activeTileBg: "#f4a261",
            activeTileText: "#150d08",
            unselectedTileBg: "rgba(244, 162, 97, 0.05)",
            unselectedTileBorder: "rgba(244, 162, 97, 0.18)"
        },
        mono: {
            name: "Monochrome",
            bg: "#0d0d0d",
            cardBg: "#171717",
            accent: "#ffffff",
            accentSecondary: "#cccccc",
            textPrimary: "#ffffff",
            textMuted: "#a0a0a0",
            textDim: "#555555",
            gridBorder: "rgba(255, 255, 255, 0.18)",
            activeTileBg: "#ffffff",
            activeTileText: "#0d0d0d",
            unselectedTileBg: "rgba(255, 255, 255, 0.03)",
            unselectedTileBorder: "rgba(255, 255, 255, 0.1)"
        }
    };

    /* --------------------------------------------------------------------------
       2. STATE & STORAGE
       -------------------------------------------------------------------------- */
    var STORAGE_KEY = "ghuraghuri_ctg_progress";

    var state = {
        upazilas: [],
        cityAreas: [],
        title: "আমার চট্টগ্রাম জেলা",
        theme: "dark",
        photos: {},
        activeUpazilaId: null
    };

    var BN_DIGITS = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
    function toBn(num, pad) {
        var str = String(num);
        if (pad && num < 10 && str.length === 1) str = "0" + str;
        return str.replace(/[0-9]/g, function (d) {
            return BN_DIGITS[parseInt(d, 10)] || d;
        });
    }

    function loadState() {
        try {
            var raw = window.localStorage.getItem(STORAGE_KEY);
            if (raw) {
                var parsed = JSON.parse(raw);
                if (Array.isArray(parsed.upazilas)) state.upazilas = parsed.upazilas;
                if (Array.isArray(parsed.cityAreas)) state.cityAreas = parsed.cityAreas;
                if (typeof parsed.title === "string" && parsed.title.trim()) {
                    state.title = (parsed.title === "My Chattogram" || parsed.title === "MY CHATTOGRAM") ? "আমার চট্টগ্রাম জেলা" : parsed.title;
                }
                if (THEMES[parsed.theme]) state.theme = parsed.theme;
                if (parsed.photos && typeof parsed.photos === 'object') {
                    state.photos = parsed.photos;
                }
            }
        } catch (e) {
            console.warn("[My Chattogram] Could not read localStorage:", e);
        }
    }

    function saveState() {
        try {
            var payload = {
                upazilas: state.upazilas,
                cityAreas: state.cityAreas,
                title: state.title,
                theme: state.theme,
                photos: state.photos,
                lastUpdated: new Date().toISOString()
            };
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
        } catch (e) {
            console.warn("[My Chattogram] Could not write localStorage:", e);
        }
    }

    /* --------------------------------------------------------------------------
       3. DOM ELEMENTS
       -------------------------------------------------------------------------- */
    var upazilaGrid = document.getElementById("upazilaGrid");
    var cityGrid = document.getElementById("cityGrid");
    var statCountDisplay = document.getElementById("statCountDisplay");
    var cityStatContainer = document.getElementById("cityStatContainer");
    var statCityDisplay = document.getElementById("statCityDisplay");
    var inputMapTitle = document.getElementById("inputMapTitle");
    var captionTextArea = document.getElementById("captionTextArea");
    var posterCanvas = document.getElementById("posterCanvas");
    var btnDownloadPoster = document.getElementById("btnDownloadPoster");
    var btnCopyCaption = document.getElementById("btnCopyCaption");
    var btnWebShare = document.getElementById("btnWebShare") || document.getElementById("btnWebShareUpazila");

    /* --------------------------------------------------------------------------
       4. SELECTION UI BUILDER
       -------------------------------------------------------------------------- */
    
    let viewBoxWidth = 640;
    let viewBoxHeight = 850;
    let projectedFeatures = [];
    let cityCorpFeature = null;

    async function loadGeometry() {
        try {
            const [respUpazilas, respCity] = await Promise.all([
                fetch('data/chattogram-district-upazilas.geojson'),
                fetch('data/chattogram-city-corp.geojson').catch(() => null)
            ]);
            const geojson = await respUpazilas.json();
            let cityGeojson = null;
            if (respCity && respCity.ok) {
                try {
                    cityGeojson = await respCity.json();
                } catch (e) {
                    console.warn("Could not parse city corp GeoJSON:", e);
                }
            }
            processGeometry(geojson, cityGeojson);
            renderInteractiveMap();
            onStateUpdated();
        } catch(e) {
            console.error("Failed to load or parse GeoJSON", e);
            const c = document.getElementById('upazilaMapContainer');
            if (c) c.innerHTML = '<div style="color:red; padding:20px;">Failed to load map geometry.</div>';
        }
    }

    /**
     * Robust visual interior center (pole of inaccessibility) calculation.
     * Identifies the point inside the polygon with maximum clearance from all boundaries.
     * Guarantees that labels and centroid dots never touch or cross polygon boundaries,
     * even for narrow, curved, or irregular geometries (e.g. Hathazari, Boalkhali, Karnaphuli, Anwara).
     */
    function computePolygonCentroid(rings) {
        if (!rings || rings.length === 0) return { x: 0, y: 0 };

        // 1. Identify primary ring by maximum boundary area
        let maxArea = 0;
        let bestRing = rings[0];
        rings.forEach(ring => {
            let area = 0;
            const n = ring.length;
            for (let i = 0; i < n - 1; i++) {
                area += (ring[i][0] * ring[i+1][1] - ring[i+1][0] * ring[i][1]);
            }
            area = Math.abs(area) / 2;
            if (area > maxArea) {
                maxArea = area;
                bestRing = ring;
            }
        });

        // 2. Strict point-in-polygon ray casting
        function isPointInRing(x, y, ring) {
            let inside = false;
            for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
                const xi = ring[i][0], yi = ring[i][1];
                const xj = ring[j][0], yj = ring[j][1];
                const intersect = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
                if (intersect) inside = !inside;
            }
            return inside;
        }

        // 3. Minimum distance from point to polygon boundary edges
        function distToEdges(px, py, ring) {
            let minDist = Infinity;
            for (let i = 0; i < ring.length - 1; i++) {
                const x1 = ring[i][0], y1 = ring[i][1];
                const x2 = ring[i+1][0], y2 = ring[i+1][1];
                const dx = x2 - x1, dy = y2 - y1;
                const lenSq = dx * dx + dy * dy;
                let t = lenSq === 0 ? 0 : ((px - x1) * dx + (py - y1) * dy) / lenSq;
                t = Math.max(0, Math.min(1, t));
                const projX = x1 + t * dx, projY = y1 + t * dy;
                const d = Math.hypot(px - projX, py - projY);
                if (d < minDist) minDist = d;
            }
            return minDist;
        }

        // 4. Bounding box of best ring
        let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
        bestRing.forEach(pt => {
            if (pt[0] < minX) minX = pt[0];
            if (pt[0] > maxX) maxX = pt[0];
            if (pt[1] < minY) minY = pt[1];
            if (pt[1] > maxY) maxY = pt[1];
        });

        // 5. Grid search for maximum clearance interior point
        let bestPt = { x: (minX + maxX) / 2, y: (minY + maxY) / 2 };
        let bestDist = -1;
        const step = Math.max(2, Math.min(maxX - minX, maxY - minY) / 32);
        for (let x = minX + step; x < maxX; x += step) {
            for (let y = minY + step; y < maxY; y += step) {
                if (isPointInRing(x, y, bestRing)) {
                    const d = distToEdges(x, y, bestRing);
                    if (d > bestDist) {
                        bestDist = d;
                        bestPt = { x, y };
                    }
                }
            }
        }

        return bestPt;
    }

    function processGeometry(geojson, cityGeojson) {
        let minLon = Infinity, maxLon = -Infinity;
        let minLat = Infinity, maxLat = -Infinity;

        const allFeatures = [...geojson.features];
        if (cityGeojson && cityGeojson.features) {
            allFeatures.push(...cityGeojson.features);
        }

        allFeatures.forEach(feature => {
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

        // Dynamic portrait viewBox calculation with optimal edge margin (1:1 ground scale)
        const targetH = 880;
        const paddingY = 12;
        const availH = targetH - paddingY * 2;
        
        const lonRange = maxLon - minLon;
        const latRange = maxLat - minLat;
        const avgLat = (minLat + maxLat) / 2;
        const aspect = Math.cos(avgLat * Math.PI / 180);
        const scaledLonRange = lonRange * aspect;
        
        const scale = availH / latRange;
        const availW = scaledLonRange * scale;
        
        const paddingX = 18;
        viewBoxHeight = targetH;
        viewBoxWidth = Math.round(availW + paddingX * 2);
        
        const offsetX = paddingX;
        const offsetY = paddingY;

        // Project City Corporation background feature (non-interactive visual layer)
        if (cityGeojson && cityGeojson.features && cityGeojson.features.length > 0) {
            const cityFeat = cityGeojson.features[0];
            const geoms = cityFeat.geometry.type === 'MultiPolygon' 
                ? cityFeat.geometry.coordinates 
                : [cityFeat.geometry.coordinates];
            
            const projectedRings = [];
            let commands = [];
            geoms.forEach(polygon => {
                polygon.forEach(ring => {
                    const pRing = [];
                    ring.forEach((coord, i) => {
                        const x = offsetX + (coord[0] - minLon) * aspect * scale;
                        const y = offsetY + (maxLat - coord[1]) * scale;
                        commands.push({ type: i === 0 ? 'M' : 'L', x, y });
                        pRing.push([x, y]);
                    });
                    commands.push({ type: 'Z' });
                    projectedRings.push(pRing);
                });
            });

            cityCorpFeature = {
                id: 'city-corporation',
                name_en: 'Chattogram City Corporation',
                name_bn: 'চট্টগ্রাম সিটি কর্পোরেশন',
                commands: commands,
                centroid: computePolygonCentroid(projectedRings)
            };
        } else {
            cityCorpFeature = null;
        }

        // Project exactly the 15 official Upazilas
        projectedFeatures = geojson.features.map(feature => {
            const rawName = feature.properties.shapeName;
            const meta = UPAZILA_MAP[rawName];
            if (!meta) return null;

            const geoms = feature.geometry.type === 'MultiPolygon' 
                ? feature.geometry.coordinates 
                : [feature.geometry.coordinates];
                
            const projectedRings = [];
            let commands = [];

            geoms.forEach(polygon => {
                polygon.forEach(ring => {
                    const pRing = [];
                    ring.forEach((coord, i) => {
                        const x = offsetX + (coord[0] - minLon) * aspect * scale;
                        const y = offsetY + (maxLat - coord[1]) * scale;
                        commands.push({ type: i === 0 ? 'M' : 'L', x, y });
                        pRing.push([x, y]);
                    });
                    commands.push({ type: 'Z' });
                    projectedRings.push(pRing);
                });
            });

            const centerPoint = computePolygonCentroid(projectedRings);
            if (meta.offset) {
                centerPoint.x += meta.offset.x;
                centerPoint.y += meta.offset.y;
            }

            let bMinX = Infinity, bMaxX = -Infinity, bMinY = Infinity, bMaxY = -Infinity;
            commands.forEach(cmd => {
                if (cmd.x !== undefined) {
                    if (cmd.x < bMinX) bMinX = cmd.x;
                    if (cmd.x > bMaxX) bMaxX = cmd.x;
                }
                if (cmd.y !== undefined) {
                    if (cmd.y < bMinY) bMinY = cmd.y;
                    if (cmd.y > bMaxY) bMaxY = cmd.y;
                }
            });

            return {
                id: meta.id,
                name_en: meta.name_en,
                name_bn: meta.name_bn,
                commands,
                centroid: centerPoint,
                bbox: {
                    minX: bMinX,
                    maxX: bMaxX,
                    minY: bMinY,
                    maxY: bMaxY,
                    width: bMaxX - bMinX,
                    height: bMaxY - bMinY
                }
            };
        }).filter(Boolean);
        
        projectedFeatures.sort((a, b) => a.name_en.localeCompare(b.name_en));
    }

    function commandsToSvgPath(commands) {
        return commands.map(c => {
            if (c.type === 'Z') return 'Z';
            return `${c.type}${c.x.toFixed(2)},${c.y.toFixed(2)}`;
        }).join(' ');
    }

    function renderInteractiveMap() {
        const container = document.getElementById('upazilaMapContainer');
        if (!container) return;

        let svgHTML = `<svg viewBox="0 0 ${viewBoxWidth} ${viewBoxHeight}" xmlns="http://www.w3.org/2000/svg">`;
        
        // Defs for geometric polygon clipping of uploaded travel photos
        let defsHTML = '<defs>';
        projectedFeatures.forEach(feat => {
            const pathStr = commandsToSvgPath(feat.commands);
            defsHTML += `<clipPath id="clip-upazila-${feat.id}"><path d="${pathStr}" /></clipPath>`;
        });
        defsHTML += '</defs>';
        svgHTML += defsHTML;

        // Visual background layer: Chattogram City Corporation (Purely visual, non-interactive)
        if (cityCorpFeature) {
            const cityPathStr = commandsToSvgPath(cityCorpFeature.commands);
            svgHTML += `
                <g class="ctg-city-corp-layer" pointer-events="none" aria-hidden="true">
                    <path class="ctg-city-corp-path" d="${cityPathStr}" />
                    <text class="ctg-city-corp-label" x="${cityCorpFeature.centroid.x.toFixed(2)}" y="${(cityCorpFeature.centroid.y - 4.5).toFixed(2)}">
                        CHATTOGRAM
                        <tspan x="${cityCorpFeature.centroid.x.toFixed(2)}" dy="8.5">CITY CORPORATION</tspan>
                    </text>
                </g>
            `;
        }

        // 15 Selectable Upazilas
        let upazilaLabelsSvg = '';
        projectedFeatures.forEach(feat => {
            const pathStr = commandsToSvgPath(feat.commands);
            const isSelected = state.upazilas.includes(feat.id);
            const cls = isSelected ? 'ctg-district-path selected' : 'ctg-district-path';
            const ariaLabel = `${feat.name_bn} (${feat.name_en})`;
            const photo = state.photos && state.photos[feat.id];
            
            let imageMarkup = '';
            if (isSelected && photo && photo.dataUrl) {
                const b = feat.bbox || { minX: 0, minY: 0, width: 100, height: 100 };
                const zoom = (photo.zoom !== undefined) ? photo.zoom : 1.0;
                const panX = photo.panX || 0;
                const panY = photo.panY || 0;
                const bw = b.width;
                const bh = b.height;
                const imgW = bw * zoom;
                const imgH = bh * zoom;
                const imgX = b.minX + (bw - imgW) / 2 + panX;
                const imgY = b.minY + (bh - imgH) / 2 + panY;

                imageMarkup = `
                    <image href="${photo.dataUrl}"
                        data-id="${feat.id}"
                        x="${imgX.toFixed(2)}" y="${imgY.toFixed(2)}"
                        width="${imgW.toFixed(2)}" height="${imgH.toFixed(2)}"
                        preserveAspectRatio="xMidYMid slice"
                        clip-path="url(#clip-upazila-${feat.id})"
                        opacity="0.95"
                        pointer-events="none" />
                    <path d="${pathStr}" fill="rgba(6, 19, 14, 0.22)" clip-path="url(#clip-upazila-${feat.id})" pointer-events="none" />
                `;
            }

            const hasPhoto = isSelected && photo && photo.dataUrl;

            if (!hasPhoto || !photo.hideLabel) {
                const offX = hasPhoto ? (photo.labelOffsetX || 0) : 0;
                const offY = hasPhoto ? (photo.labelOffsetY || 0) : 0;
                const curX = feat.centroid.x + offX;
                const curY = feat.centroid.y + offY;

                const pillW = Math.max(feat.name_bn.length * 10, feat.name_en.length * 6.5) + 16;
                const pillH = 26;
                const pillMarkup = hasPhoto 
                    ? `<rect class="ctg-district-label-pill" x="${(-pillW / 2).toFixed(1)}" y="${(-pillH / 2).toFixed(1)}" width="${pillW.toFixed(1)}" height="${pillH}" rx="6" />` 
                    : `<circle cx="0" cy="-13" r="${feat.id === 'karnaphuli' ? '2' : '2.5'}" class="ctg-district-dot" pointer-events="none"/>`;

                upazilaLabelsSvg += `
                    <g class="ctg-upazila-label-wrap ${isSelected ? 'selected' : ''} ${hasPhoto ? 'has-photo' : ''}" data-id="${feat.id}" transform="translate(${curX.toFixed(2)}, ${curY.toFixed(2)})">
                        ${pillMarkup}
                        <text class="ctg-district-label-text" x="0" y="${hasPhoto ? '-1' : '-3'}">
                            ${feat.name_bn}
                            <tspan class="ctg-district-label-sub" x="0" dy="${hasPhoto ? '11' : '12'}">${feat.name_en}</tspan>
                        </text>
                    </g>
                `;
            }

            svgHTML += `
                <g class="ctg-district-group ${hasPhoto ? 'has-photo' : ''}" data-id="${feat.id}" role="button" tabindex="0" aria-label="${ariaLabel}" aria-pressed="${isSelected}">
                    <path class="${cls}" d="${pathStr}" />
                    ${imageMarkup}
                </g>
            `;
        });
        
        svgHTML += `
            <g class="ctg-map-labels-layer">
                ${upazilaLabelsSvg}
            </g>
        `;
        svgHTML += `</svg>`;
        container.innerHTML = svgHTML;

        const svg = container.querySelector('svg');

        function getSvgPoint(clientX, clientY) {
            if (!svg) return { x: clientX, y: clientY };
            const pt = svg.createSVGPoint();
            pt.x = clientX;
            pt.y = clientY;
            const ctm = svg.getScreenCTM();
            if (ctm) {
                return pt.matrixTransform(ctm.inverse());
            }
            return { x: clientX, y: clientY };
        }

        // 1. Direct Upazila Label Dragging (60fps Unified PointerEvents with Window Tracking)
        const labels = container.querySelectorAll('.ctg-upazila-label-wrap');
        labels.forEach(l => {
            const id = l.getAttribute('data-id');
            const feat = projectedFeatures.find(f => f.id === id);
            let isDragging = false;
            let startP = { x: 0, y: 0 };
            let initOffset = { x: 0, y: 0 };
            let hasMoved = false;

            l.addEventListener('pointerdown', (e) => {
                const photo = state.photos && state.photos[id];
                if (!photo || !photo.dataUrl) return;
                if (e.button !== 0 && e.pointerType === 'mouse') return;
                isDragging = true;
                hasMoved = false;
                startP = getSvgPoint(e.clientX, e.clientY);
                initOffset = {
                    x: typeof photo.labelOffsetX === 'number' ? photo.labelOffsetX : 0,
                    y: typeof photo.labelOffsetY === 'number' ? photo.labelOffsetY : 0
                };
                l.classList.add('is-dragging');
                e.stopPropagation();

                const onMove = (ev) => {
                    if (!isDragging) return;
                    const ph = state.photos && state.photos[id];
                    if (!ph || !feat) return;
                    const curP = getSvgPoint(ev.clientX, ev.clientY);
                    const dx = curP.x - startP.x;
                    const dy = curP.y - startP.y;
                    if (Math.hypot(dx, dy) > 3) hasMoved = true;

                    ph.labelOffsetX = Math.round(initOffset.x + dx);
                    ph.labelOffsetY = Math.round(initOffset.y + dy);

                    // Real-time 60fps transform update on the label <g>
                    const curX = feat.centroid.x + ph.labelOffsetX;
                    const curY = feat.centroid.y + ph.labelOffsetY;
                    l.setAttribute('transform', `translate(${curX.toFixed(1)}, ${curY.toFixed(1)})`);
                };

                const onUp = (ev) => {
                    window.removeEventListener('pointermove', onMove);
                    window.removeEventListener('pointerup', onUp);
                    window.removeEventListener('pointercancel', onUp);
                    if (!isDragging) return;
                    isDragging = false;
                    l.classList.remove('is-dragging');
                    if (hasMoved) {
                        saveState();
                        renderPoster();
                    }
                };

                window.addEventListener('pointermove', onMove, { passive: false });
                window.addEventListener('pointerup', onUp);
                window.addEventListener('pointercancel', onUp);
            });

            l.addEventListener('click', (e) => {
                if (hasMoved) {
                    e.stopPropagation();
                    e.preventDefault();
                    hasMoved = false;
                    return;
                }
                toggleUpazila(id);
            });
        });

        // 2. Direct Photo Panning and Wheel Zoom on Upazila Groups
        const groups = container.querySelectorAll('.ctg-district-group');
        groups.forEach(g => {
            const id = g.getAttribute('data-id');
            const feat = projectedFeatures.find(f => f.id === id);
            let isPanning = false;
            let startP = { x: 0, y: 0 };
            let initPan = { x: 0, y: 0 };
            let hasMoved = false;

            g.addEventListener('pointerdown', (e) => {
                const photo = state.photos && state.photos[id];
                // Only pan if upazila has uploaded photo
                if (!photo || !photo.dataUrl) return;
                if (e.button !== 0 && e.pointerType === 'mouse') return;
                
                // Auto-activate upazila dock if not already active
                if (state.activeUpazilaId !== id) {
                    state.activeUpazilaId = id;
                    renderUpazilaDock();
                }

                isPanning = true;
                hasMoved = false;
                startP = getSvgPoint(e.clientX, e.clientY);
                initPan = { x: photo.panX || 0, y: photo.panY || 0 };
                g.classList.add('is-panning');
                e.stopPropagation();

                const onMove = (ev) => {
                    if (!isPanning) return;
                    const ph = state.photos && state.photos[id];
                    if (!ph || !feat || !feat.bbox) return;
                    const curP = getSvgPoint(ev.clientX, ev.clientY);
                    const dx = curP.x - startP.x;
                    const dy = curP.y - startP.y;
                    if (Math.hypot(dx, dy) > 3) hasMoved = true;

                    ph.panX = Math.round(initPan.x + dx);
                    ph.panY = Math.round(initPan.y + dy);

                    // Real-time 60fps image repositioning in SVG
                    const imgEl = container.querySelector(`image[data-id="${id}"]`);
                    if (imgEl) {
                        const zoom = ph.zoom || 1.0;
                        const bw = feat.bbox.width * zoom;
                        const bh = feat.bbox.height * zoom;
                        const cx = feat.bbox.minX + feat.bbox.width / 2 + ph.panX;
                        const cy = feat.bbox.minY + feat.bbox.height / 2 + ph.panY;
                        imgEl.setAttribute('x', (cx - bw / 2).toFixed(1));
                        imgEl.setAttribute('y', (cy - bh / 2).toFixed(1));
                    }
                };

                const onUp = (ev) => {
                    window.removeEventListener('pointermove', onMove);
                    window.removeEventListener('pointerup', onUp);
                    window.removeEventListener('pointercancel', onUp);
                    if (!isPanning) return;
                    isPanning = false;
                    g.classList.remove('is-panning');
                    if (hasMoved) {
                        saveState();
                        renderPoster();
                    }
                };

                window.addEventListener('pointermove', onMove, { passive: false });
                window.addEventListener('pointerup', onUp);
                window.addEventListener('pointercancel', onUp);
            });

            // Desktop Mouse Wheel Zoom
            const handleWheelZoom = (e) => {
                const photo = state.photos && state.photos[id];
                if (!photo || !photo.dataUrl) return;
                e.preventDefault();
                e.stopPropagation();
                
                // Auto-activate dock
                if (state.activeUpazilaId !== id) {
                    state.activeUpazilaId = id;
                    renderUpazilaDock();
                }

                const delta = e.deltaY < 0 ? 0.08 : -0.08;
                photo.zoom = Math.min(3.5, Math.max(0.4, +(photo.zoom + delta).toFixed(2)));

                const imgEl = container.querySelector(`image[data-id="${id}"]`);
                if (imgEl && feat && feat.bbox) {
                    const bw = feat.bbox.width * photo.zoom;
                    const bh = feat.bbox.height * photo.zoom;
                    const cx = feat.bbox.minX + feat.bbox.width / 2 + (photo.panX || 0);
                    const cy = feat.bbox.minY + feat.bbox.height / 2 + (photo.panY || 0);
                    imgEl.setAttribute('x', (cx - bw / 2).toFixed(1));
                    imgEl.setAttribute('y', (cy - bh / 2).toFixed(1));
                    imgEl.setAttribute('width', bw.toFixed(1));
                    imgEl.setAttribute('height', bh.toFixed(1));
                }
                const zoomEl = document.getElementById('dockUpazilaZoomVal');
                if (zoomEl) zoomEl.textContent = `${Math.round(photo.zoom * 100)}%`;
                saveState();
                renderPoster();
            };

            g.addEventListener('wheel', handleWheelZoom, { passive: false });
            const matchingLabel = container.querySelector(`.ctg-upazila-label-wrap[data-id="${id}"]`);
            if (matchingLabel) {
                matchingLabel.addEventListener('wheel', handleWheelZoom, { passive: false });
            }

            // Landmark Tooltip on Hover/Touch
            const showTooltip = (ev) => {
                let tt = document.getElementById('upazilaMapTooltip');
                if (!tt) {
                    tt = document.createElement('div');
                    tt.id = 'upazilaMapTooltip';
                    tt.className = 'ctg-landmark-tooltip';
                    container.appendChild(tt);
                }
                const lmk = UPAZILA_LANDMARKS[id] || { bn: feat.name_bn, en: feat.name_en, highlights: 'চট্টগ্রাম জেলার ঐতিহ্যবাহী ও প্রাকৃতিক উপজেলা' };
                const isSel = state.upazilas.includes(id);
                tt.innerHTML = `
                    <div class="ctg-lt-head">
                        <span class="ctg-lt-title-bn">${lmk.bn}</span>
                        <span class="ctg-lt-title-en">${lmk.en}</span>
                    </div>
                    <div class="ctg-lt-highlights">📍 ${lmk.highlights}</div>
                    <div class="ctg-lt-status ${isSel ? 'active' : ''}">
                        ${isSel ? '✓ ভ্রমণ করেছেন (ক্লিক করে বাদ দিন)' : '+ যাননি (ক্লিক করে যোগ করুন)'}
                    </div>
                `;
                tt.style.display = 'block';

                const rect = container.getBoundingClientRect();
                let x = ev.clientX - rect.left;
                let y = ev.clientY - rect.top;

                const halfW = 130;
                if (x < halfW + 10) x = halfW + 10;
                if (x > rect.width - halfW - 10) x = rect.width - halfW - 10;
                if (y < 95) {
                    tt.style.transform = 'translate(-50%, 15px)';
                } else {
                    tt.style.transform = 'translate(-50%, -120%)';
                }
                tt.style.left = `${x}px`;
                tt.style.top = `${y}px`;
            };

            const hideTooltip = () => {
                const tt = document.getElementById('upazilaMapTooltip');
                if (tt) tt.style.display = 'none';
            };

            g.addEventListener('mouseenter', showTooltip);
            g.addEventListener('mousemove', showTooltip);
            g.addEventListener('mouseleave', hideTooltip);

            g.addEventListener('click', (e) => {
                hideTooltip();
                if (hasMoved) {
                    e.stopPropagation();
                    e.preventDefault();
                    hasMoved = false;
                    return;
                }
                toggleUpazila(id);
            });

            g.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleUpazila(id);
                }
            });
        });

        // 3. Mobile Touch Pinch-to-Zoom on Map Stage
        let pinchDist = null;
        let pinchBaseZoom = 1.0;

        container.addEventListener('touchstart', (e) => {
            if (e.touches.length === 2 && state.activeUpazilaId) {
                const photo = state.photos && state.photos[state.activeUpazilaId];
                if (photo && photo.dataUrl) {
                    pinchDist = Math.hypot(
                        e.touches[0].clientX - e.touches[1].clientX,
                        e.touches[0].clientY - e.touches[1].clientY
                    );
                    pinchBaseZoom = photo.zoom || 1.0;
                }
            }
        }, { passive: true });

        container.addEventListener('touchmove', (e) => {
            if (e.touches.length === 2 && pinchDist && state.activeUpazilaId) {
                const photo = state.photos && state.photos[state.activeUpazilaId];
                const feat = projectedFeatures.find(f => f.id === state.activeUpazilaId);
                if (photo && photo.dataUrl && feat && feat.bbox) {
                    const currentDist = Math.hypot(
                        e.touches[0].clientX - e.touches[1].clientX,
                        e.touches[0].clientY - e.touches[1].clientY
                    );
                    const ratio = currentDist / pinchDist;
                    photo.zoom = Math.min(3.5, Math.max(0.4, +(pinchBaseZoom * ratio).toFixed(2)));

                    const imgEl = container.querySelector(`image[data-id="${state.activeUpazilaId}"]`);
                    if (imgEl) {
                        const bw = feat.bbox.width * photo.zoom;
                        const bh = feat.bbox.height * photo.zoom;
                        const cx = feat.bbox.minX + feat.bbox.width / 2 + (photo.panX || 0);
                        const cy = feat.bbox.minY + feat.bbox.height / 2 + (photo.panY || 0);
                        imgEl.setAttribute('x', (cx - bw / 2).toFixed(1));
                        imgEl.setAttribute('y', (cy - bh / 2).toFixed(1));
                        imgEl.setAttribute('width', bw.toFixed(1));
                        imgEl.setAttribute('height', bh.toFixed(1));
                    }
                    const zoomEl = document.getElementById('dockUpazilaZoomVal');
                    if (zoomEl) zoomEl.textContent = `${Math.round(photo.zoom * 100)}%`;
                }
            }
        }, { passive: true });

        container.addEventListener('touchend', (e) => {
            if (pinchDist) {
                pinchDist = null;
                saveState();
                renderPoster();
            }
        }, { passive: true });
    }

    function toggleUpazila(id) {
        const hasPhoto = !!(state.photos && state.photos[id] && state.photos[id].dataUrl);
        var idx = state.upazilas.indexOf(id);
        if (idx === -1) {
            state.upazilas.push(id);
            state.activeUpazilaId = id;
            if (state.upazilas.length === (projectedFeatures ? projectedFeatures.length : 15)) {
                if (typeof window.triggerGoldenConfetti === 'function') {
                    window.triggerGoldenConfetti();
                }
            }
        } else {
            if (state.activeUpazilaId === id) {
                if (hasPhoto) {
                    // Photo Protection: If area has an uploaded photo, never delete or deselect on map click!
                    renderUpazilaDock(id);
                    return;
                }
                state.upazilas.splice(idx, 1);
                state.activeUpazilaId = null;
                renderUpazilaDock(null);
            } else {
                state.activeUpazilaId = id;
            }
        }
        saveState();
        onStateUpdated();
        renderInteractiveMap();
        renderPoster();
        renderUpazilaDock(state.activeUpazilaId);
    }

    function renderUpazilaDock(upazilaId) {
        const dock = document.getElementById('upazilaAreaDockContainer');
        if (!dock) return;

        if (!upazilaId) {
            dock.style.display = 'none';
            dock.innerHTML = '';
            return;
        }

        const feat = projectedFeatures.find(f => f.id === upazilaId);
        if (!feat) {
            dock.style.display = 'none';
            dock.innerHTML = '';
            return;
        }

        const isVisited = state.upazilas.includes(upazilaId);
        const photo = state.photos && state.photos[upazilaId];
        dock.style.display = 'block';

        if (!photo || !photo.dataUrl) {
            dock.innerHTML = `
                <div class="ctg-area-floating-dock ctg-dock-luxury ctg-dock-with-hint">
                    <div class="ctg-dock-top-bar">
                        <div class="ctg-dock-info">
                            <div class="ctg-dock-pulse-dot"></div>
                            <div class="ctg-dock-text">
                                <div class="ctg-dock-status-pill">
                                    <span class="ctg-dock-status-dot ctg-pulse-amber"></span>
                                    <span class="ctg-dock-tag">${isVisited ? '✓ নির্বাচিত উপজেলা' : 'চিহ্নিত উপজেলা'}</span>
                                </div>
                                <strong class="ctg-dock-title">${feat.name_bn} <span class="ctg-dock-title-en">· ${feat.name_en}</span></strong>
                            </div>
                        </div>
                        <div class="ctg-dock-action-row">
                            <label class="ctg-dock-btn-upload" title="উপজেলার ভ্রমণ ছবি যোগ করুন">
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:-1px;margin-right:2px;" aria-hidden="true"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg><span>ছবি যোগ করুন</span>
                                <input type="file" accept="image/*" class="ctg-dock-file-input" style="display:none;">
                            </label>
                            <button type="button" class="ctg-dock-btn-keep" id="btnUpazilaDockKeepAsIs" title="ছবি ছাড়া শুধু উপজেলা চিহ্নিত রাখুন">
                                <span>✓ এভাবেই রাখুন</span>
                            </button>
                            <button class="ctg-dock-btn-close" id="btnUpazilaDockClose" title="বন্ধ করুন" aria-label="Close">✕</button>
                        </div>
                    </div>
                    <div class="ctg-dock-hint-banner" role="status">
                        ✨ চাইলে ভ্রমণ ছবি যোগ করতে পারেন, অথবা এভাবেই মানচিত্রে সুন্দর রাখতে পারেন!
                    </div>
                </div>
            `;
        } else {
            const zoomPct = Math.round(((photo.zoom !== undefined) ? photo.zoom : 1.0) * 100);
            dock.innerHTML = `
                <div class="ctg-area-floating-dock ctg-dock-luxury">
                    <div class="ctg-dock-top-bar">
                        <div class="ctg-dock-info">
                            <div class="ctg-dock-thumb-wrap">
                                <img src="${photo.dataUrl}" alt="${feat.name_bn}" class="ctg-dock-thumb">
                                <span class="ctg-dock-thumb-badge" title="মেমোরি সক্রিয়">✨</span>
                            </div>
                            <div class="ctg-dock-text">
                                <div class="ctg-dock-status-pill">
                                    <span class="ctg-dock-status-dot"></span>
                                    <span class="ctg-dock-tag ctg-dock-tag-ok">মেমোরি সংরক্ষিত</span>
                                </div>
                                <strong class="ctg-dock-title">${feat.name_bn} <span class="ctg-dock-title-en">· ${feat.name_en}</span></strong>
                            </div>
                        </div>
                        <div class="ctg-dock-action-row">
                            <label class="ctg-dock-btn-change" title="ছবি পরিবর্তন করুন">
                                <span class="ctg-dock-action-icon">🔄</span>
                                <span>পরিবর্তন</span>
                                <input type="file" accept="image/*" class="ctg-dock-file-input" style="display:none;">
                            </label>
                            <button class="ctg-dock-btn-delete" id="btnUpazilaDockDelete" title="ছবি মুছুন">
                                <span class="ctg-dock-action-icon">🗑️</span>
                                <span>মুছুন</span>
                            </button>
                            <button class="ctg-dock-btn-close" id="btnUpazilaDockClose" title="বন্ধ করুন" aria-label="Close">✕</button>
                        </div>
                    </div>

                    <div class="ctg-dock-hint-banner ctg-dock-gesture-hint" role="status" style="margin-top: 6px; margin-bottom: 2px;">
                        💡 সরাসরি ম্যাপে আঙুল বা মাউস টেনে ছবি ও নাম সরান, হুইল/পিঞ্চ দিয়ে জুম করুন
                    </div>

                    <div class="ctg-dock-divider"></div>

                    <div class="ctg-dock-controls-strip">
                        <!-- Pan Segment -->
                        <div class="ctg-dock-pill-segment">
                            <span class="ctg-dock-segment-title">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 9l-3 3 3 3M9 5l3-3 3 3M15 19l-3 3-3-3M19 9l3 3-3 3M2 12h20M12 2v20"/></svg>
                                প্যান
                            </span>
                            <div class="ctg-dock-segmented-group">
                                <button class="ctg-dock-seg-btn" data-action="pan-left" title="ছবি বাঁয়ে নিন" aria-label="Pan Left">◀</button>
                                <button class="ctg-dock-seg-btn" data-action="pan-up" title="ছবি উপরে নিন" aria-label="Pan Up">▲</button>
                                <button class="ctg-dock-seg-btn" data-action="pan-down" title="ছবি নিচে নিন" aria-label="Pan Down">▼</button>
                                <button class="ctg-dock-seg-btn" data-action="pan-right" title="ছবি ডানে নিন" aria-label="Pan Right">▶</button>
                            </div>
                        </div>

                        <!-- Zoom Segment -->
                        <div class="ctg-dock-pill-segment">
                            <span class="ctg-dock-segment-title">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.35-4.35"/></svg>
                                জুম
                            </span>
                            <div class="ctg-dock-segmented-group">
                                <button class="ctg-dock-seg-btn" data-action="zoom-out" title="জুম কমান" aria-label="Zoom Out">−</button>
                                <span class="ctg-dock-zoom-val" id="dockUpazilaZoomVal">${zoomPct}%</span>
                                <button class="ctg-dock-seg-btn" data-action="zoom-in" title="জুম বাড়ান" aria-label="Zoom In">+</button>
                                <button class="ctg-dock-seg-btn ctg-dock-seg-reset" data-action="reset" title="জুম ও প্যান রিসেট" aria-label="Reset">↺</button>
                            </div>
                        </div>

                        <!-- Label Segment -->
                        <div class="ctg-dock-pill-segment">
                            <span class="ctg-dock-segment-title">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M4 7V4h16v3M9 20h6M12 4v16"/></svg>
                                লেবেল
                            </span>
                            <div class="ctg-dock-segmented-group">
                                <button class="ctg-dock-seg-btn" data-action="label-left" title="নাম বাঁয়ে নিন" aria-label="Label Left">◀</button>
                                <button class="ctg-dock-seg-btn" data-action="label-up" title="নাম উপরে নিন" aria-label="Label Up">▲</button>
                                <button class="ctg-dock-seg-btn" data-action="label-down" title="নাম নিচে নিন" aria-label="Label Down">▼</button>
                                <button class="ctg-dock-seg-btn" data-action="label-right" title="নাম ডানে নিন" aria-label="Label Right">▶</button>
                                <button class="ctg-dock-seg-btn ctg-dock-seg-toggle ${photo.hideLabel ? 'is-off' : ''}" data-action="label-toggle" title="${photo.hideLabel ? 'নাম দেখান' : 'নাম লুকান'}" aria-label="Toggle Label">${photo.hideLabel ? '🙈' : '👁️'}</button>
                                <button class="ctg-dock-seg-btn ctg-dock-seg-reset" data-action="label-reset" title="নামের স্থান রিসেট" aria-label="Reset Label">↺</button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }

        const btnKeep = dock.querySelector('#btnUpazilaDockKeepAsIs');
        if (btnKeep) {
            btnKeep.addEventListener('click', () => {
                state.activeUpazilaId = null;
                dock.style.display = 'none';
                dock.innerHTML = '';
            });
        }

        const btnClose = dock.querySelector('#btnUpazilaDockClose');
        if (btnClose) {
            btnClose.addEventListener('click', () => {
                state.activeUpazilaId = null;
                dock.style.display = 'none';
                dock.innerHTML = '';
            });
        }

        const btnDel = dock.querySelector('#btnUpazilaDockDelete');
        if (btnDel) {
            btnDel.addEventListener('click', () => {
                adjustUpazilaPhoto(upazilaId, 'remove');
            });
        }

        const inlineInput = dock.querySelector('.ctg-dock-file-input');
        if (inlineInput) {
            inlineInput.addEventListener('change', (e) => {
                if (e.target.files && e.target.files[0]) {
                    handleUpazilaPhotoUpload(upazilaId, e.target.files[0]);
                }
            });
        }

        dock.querySelectorAll('button[data-action]').forEach(btn => {
            btn.addEventListener('click', () => {
                const act = btn.getAttribute('data-action');
                adjustUpazilaPhoto(upazilaId, act);
            });
        });
    }

    function handleUpazilaPhotoUpload(upazilaId, file) {
        if (!file || !file.type.startsWith('image/')) return;
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = new Image();
            img.onload = function() {
                const canvas = document.createElement('canvas');
                const MAX_DIM = 1200;
                let w = img.width;
                let h = img.height;
                if (w > h && w > MAX_DIM) {
                    h = Math.round((h * MAX_DIM) / w);
                    w = MAX_DIM;
                } else if (h > MAX_DIM) {
                    w = Math.round((w * MAX_DIM) / h);
                    h = MAX_DIM;
                }
                canvas.width = w;
                canvas.height = h;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, w, h);

                const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
                if (!state.photos) state.photos = {};
                state.photos[upazilaId] = {
                    dataUrl: dataUrl,
                    filename: file.name,
                    zoom: 1.0,
                    panX: 0,
                    panY: 0
                };

                if (!state.upazilas.includes(upazilaId)) {
                    state.upazilas.push(upazilaId);
                }
                state.activeUpazilaId = upazilaId;

                saveState();
                renderInteractiveMap();
                onStateUpdated();
                renderUpazilaDock(upazilaId);
                renderPoster();
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    function adjustUpazilaPhoto(upazilaId, action) {
        const photo = state.photos && state.photos[upazilaId];
        if (!photo) return;
        if (typeof photo.zoom !== 'number') photo.zoom = 1.0;
        if (typeof photo.panX !== 'number') photo.panX = 0;
        if (typeof photo.panY !== 'number') photo.panY = 0;
        if (typeof photo.labelOffsetX !== 'number') photo.labelOffsetX = 0;
        if (typeof photo.labelOffsetY !== 'number') photo.labelOffsetY = 0;

        const PAN_STEP = 12;
        const ZOOM_STEP = 0.15;
        const LABEL_STEP = 8;

        switch(action) {
            case 'zoom-in':
                photo.zoom = Math.min(3.0, +(photo.zoom + ZOOM_STEP).toFixed(2));
                break;
            case 'zoom-out':
                photo.zoom = Math.max(0.6, +(photo.zoom - ZOOM_STEP).toFixed(2));
                break;
            case 'pan-left':
                photo.panX -= PAN_STEP;
                break;
            case 'pan-right':
                photo.panX += PAN_STEP;
                break;
            case 'pan-up':
                photo.panY -= PAN_STEP;
                break;
            case 'pan-down':
                photo.panY += PAN_STEP;
                break;
            case 'label-left':
                photo.labelOffsetX -= LABEL_STEP;
                break;
            case 'label-right':
                photo.labelOffsetX += LABEL_STEP;
                break;
            case 'label-up':
                photo.labelOffsetY -= LABEL_STEP;
                break;
            case 'label-down':
                photo.labelOffsetY += LABEL_STEP;
                break;
            case 'label-toggle':
                photo.hideLabel = !photo.hideLabel;
                break;
            case 'label-reset':
                photo.labelOffsetX = 0;
                photo.labelOffsetY = 0;
                photo.hideLabel = false;
                break;
            case 'reset':
                photo.zoom = 1.0;
                photo.panX = 0;
                photo.panY = 0;
                photo.labelOffsetX = 0;
                photo.labelOffsetY = 0;
                photo.hideLabel = false;
                break;
            case 'remove':
                delete state.photos[upazilaId];
                saveState();
                renderInteractiveMap();
                onStateUpdated();
                renderUpazilaDock(upazilaId);
                renderPoster();
                return;
        }

        saveState();
        renderInteractiveMap();
        onStateUpdated();
        renderPoster();
        renderUpazilaDock(upazilaId);
    }



    /* --------------------------------------------------------------------------
       5. STATE UPDATER & STATS ENGINE
       -------------------------------------------------------------------------- */
    function onStateUpdated() {
        saveState();

        // 1. Update Grid selection DOM classes
        
        // Update SVG path class & container theme attribute
        const container = document.getElementById('upazilaMapContainer');
        const posterFrame = document.getElementById('upazilaPosterFrame');
        if (posterFrame) {
            posterFrame.setAttribute('data-theme', state.theme);
        }
        if (container) {
            container.setAttribute('data-theme', state.theme);
            projectedFeatures.forEach(f => {
                const g = container.querySelector(`[data-id="${f.id}"]`);
                if (g) {
                    const path = g.querySelector('path');
                    if (state.upazilas.includes(f.id)) {
                        path.classList.add('selected');
                        g.setAttribute('aria-pressed', 'true');
                    } else {
                        path.classList.remove('selected');
                        g.setAttribute('aria-pressed', 'false');
                    }
                }
            });
        }

        // Sync tray theme attribute
        const selectedTray = document.querySelector('.ctg-exp2-selected-tray');
        if (selectedTray) {
            selectedTray.setAttribute('data-theme', state.theme);
        }

        // Sync theme buttons active state
        document.querySelectorAll('#upazilaThemeSelector .ctg-theme-btn[data-theme], #upazilaPosterQuickBar .ctg-quick-swatch-dot[data-theme], #upazilaFloatingThemeBar .ctg-mf-chip[data-theme]').forEach(btn => {
            const isTh = (btn.getAttribute('data-theme') === state.theme);
            if (isTh) {
                btn.classList.add('active');
                btn.setAttribute('aria-checked', 'true');
            } else {
                btn.classList.remove('active');
                btn.setAttribute('aria-checked', 'false');
            }
        });

        // Sync quick title input
        const qTitleInput = document.getElementById('inputUpazilaQuickTitle');
        const btnResetQTitle = document.getElementById('btnResetUpazilaQuickTitle');
        if (qTitleInput && qTitleInput.value !== state.title) {
            qTitleInput.value = state.title;
        }
        if (btnResetQTitle) {
            btnResetQTitle.style.display = (state.title !== 'আমার চট্টগ্রাম জেলা') ? 'flex' : 'none';
        }
        
        // Render 15 Upazilas as single-column selectable chips (Direct full view without search obstruction)
        const listEl = document.getElementById('upazilaSelectedList');
        if (listEl) {
            listEl.innerHTML = '';

            projectedFeatures.forEach(f => {
                const isSelected = state.upazilas.includes(f.id);
                const hasPhoto = !!(state.photos && state.photos[f.id]);
                const row = document.createElement('div');
                row.className = 'ctg-div-chip-row';
                row.setAttribute('data-id', f.id);

                row.innerHTML = `
                    <button type="button" class="ctg-div-chip ${isSelected ? 'active' : ''}" data-id="${f.id}" aria-pressed="${isSelected ? 'true' : 'false'}">
                        <span class="ctg-div-chip-check">${isSelected ? '✓' : '+'}</span>
                        <span class="ctg-div-chip-bn">${f.name_bn}</span>
                        <span class="ctg-div-chip-en">${f.name_en}</span>
                    </button>
                `;

                const mainBtn = row.querySelector('.ctg-div-chip');
                if (mainBtn) {
                    mainBtn.addEventListener('click', () => toggleUpazila(f.id));
                }

                listEl.appendChild(row);
            });
        }

        // 2. Real-time stats display (Exact verified 15 Upazilas count)
        var count = state.upazilas.length;
        if (statCountDisplay) {
            statCountDisplay.textContent = toBn(count) + " / ১৫";
        }
        var posterInclusionText = document.getElementById('posterInclusionText');
        if (posterInclusionText) {
            var rawCountBn = String(count).replace(/[0-9]/g, function (d) {
                return BN_DIGITS[parseInt(d, 10)] || d;
            });
            posterInclusionText.textContent = rawCountBn + "টি উপজেলা পোস্টারে অন্তর্ভুক্ত";
        }

        // Live WYSIWYG Poster Elements Sync (Experience 02)
        var upazilaPosterLiveTitle = document.getElementById('upazilaPosterLiveTitle');
        if (upazilaPosterLiveTitle) {
            var currentTitle = (inputMapTitle && inputMapTitle.value.trim()) ? inputMapTitle.value.trim() : (state.title || "My Chattogram");
            upazilaPosterLiveTitle.textContent = currentTitle;
        }
        var upazilaPosterLiveCount = document.getElementById('upazilaPosterLiveCount');
        if (upazilaPosterLiveCount) {
            upazilaPosterLiveCount.textContent = toBn(count) + " / ১৫";
        }
        var upazilaPosterLiveRank = document.getElementById('upazilaPosterLiveRank');
        var rankTitle = (count === 0) ? "নবাগত পর্যটক" : (count <= 5 ? "প্রারম্ভিক অভিযাত্রী" : (count <= 10 ? "চট্টগ্রাম অভিযাত্রী" : (count < 15 ? "অভিজ্ঞ পর্যটক" : "চট্টগ্রাম মাস্টার (শীর্ষ ১%)")));
        if (upazilaPosterLiveRank) {
            upazilaPosterLiveRank.textContent = "★ " + rankTitle;
        }

        // Rank Card Sync (Left Panel)
        var rankCardTitle = document.getElementById("upazilaRankTitle");
        var rankCardPercent = document.getElementById("upazilaRankPercent");
        var rankCardBar = document.getElementById("upazilaRankBarFill");
        var upazilaSubtitle = document.getElementById("upazilaSubtitle");
        if (upazilaSubtitle) {
            upazilaSubtitle.textContent = (count === 0) ? "১৫টি উপজেলা" : `১৫টির মধ্যে ${toBn(count)}টি সম্পন্ন`;
        }
        if (rankCardTitle) rankCardTitle.textContent = rankTitle;
        if (rankCardPercent) {
            var pct = Math.round((count / 15) * 100);
            rankCardPercent.textContent = toBn(pct) + "% সম্পন্ন";
        }
        if (rankCardBar) {
            var pctVal = Math.min(100, Math.round((count / 15) * 100));
            rankCardBar.style.width = pctVal + "%";
        }

        // Layout Theme Attribute Sync
        var exp2Layout = document.getElementById("exp2Layout");
        if (exp2Layout) exp2Layout.setAttribute("data-theme", state.theme);
        var upazilaPosterStage = document.getElementById("upazilaPosterStage");
        if (upazilaPosterStage) upazilaPosterStage.setAttribute("data-theme", state.theme);
        var upazilaControlsPanel = document.querySelector(".ctg-exp2-layout .ctg-division-controls-panel");
        if (upazilaControlsPanel) upazilaControlsPanel.setAttribute("data-theme", state.theme);
        var upazilaLeftPanel = document.querySelector(".ctg-exp2-layout .ctg-division-panel");
        if (upazilaLeftPanel) upazilaLeftPanel.setAttribute("data-theme", state.theme);

        // 3. City areas display (NO fake total! Shows only actual selected count)
        

        // 4. Update viral social caption
        updateCaption();

        // 5. Re-render Canvas Poster
        renderPoster();

        // 6. Update Mobile Thumb Bar (Experience 02 Upazilas)
        if (window.updateMobileThumbBar) {
            window.updateMobileThumbBar(count, 15, rankTitle, 'exp2');
        }
    }

    function updateCaption() {
        if (!captionTextArea) return;
        var count = state.upazilas.length;
        var photoCount = Object.keys(state.photos || {}).filter(k => state.upazilas.includes(k)).length;
        
        var text = "আমি চট্টগ্রামের ১৫টি উপজেলার মধ্যে " + count + "টি উপজেলা ঘুরে দেখেছি! 🗺️✨";
        if (photoCount > 0) {
            text += "\nএর মধ্যে " + photoCount + "টি উপজেলার রোমাঞ্চকর ভ্রমণ ছবি মানচিত্রে যুক্ত করেছি!";
        }
        text += "\n\nচট্টগ্রামকে আপনি কতটা চেনেন? নিজের মানচিত্র তৈরি করুন।";
        text += "\n\n#MyChattogram #SakibsCreation";

        captionTextArea.value = text;
    }

    /* --------------------------------------------------------------------------
       6. NATIVE HTML5 CANVAS 2D POSTER ENGINE (1200 × 1500 px)
       -------------------------------------------------------------------------- */
    async function renderPoster() {
        if (!posterCanvas) return;
        var ctx = posterCanvas.getContext("2d");
        if (!ctx) return;

        var W = 1200;
        var H = 1500;
        posterCanvas.width = W;
        posterCanvas.height = H;

        var th = THEMES[state.theme] || THEMES.dark;

        // Preload any uploaded photos for selected upazilas
        const preloadedImages = {};
        if (state.photos) {
            const photoPromises = state.upazilas.map(id => {
                const p = state.photos[id];
                if (p && p.dataUrl) {
                    return new Promise(resolve => {
                        const img = new Image();
                        img.onload = () => {
                            preloadedImages[id] = img;
                            resolve();
                        };
                        img.onerror = resolve;
                        img.src = p.dataUrl;
                    });
                }
                return Promise.resolve();
            });
            await Promise.all(photoPromises);
        }

        // 1. Background
        ctx.fillStyle = th.bg;
        ctx.fillRect(0, 0, W, H);

        // Subtle Ambient Radial Glow
        var radGrad = ctx.createRadialGradient(W / 2, H * 0.42, 50, W / 2, H * 0.42, 650);
        radGrad.addColorStop(0, th.cardBg);
        radGrad.addColorStop(1, th.bg);
        ctx.fillStyle = radGrad;
        ctx.fillRect(0, 0, W, H);

        // Outer Architectural Poster Border
        ctx.strokeStyle = th.gridBorder;
        ctx.lineWidth = 2;
        ctx.strokeRect(50, 50, W - 100, H - 100);

        // Subtle Inner Accent Frame Line
        ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
        ctx.lineWidth = 1;
        ctx.strokeRect(58, 58, W - 116, H - 116);

        // 2. Header Area
        // Main Poster Title (Custom user name or default)
        var titleText = (state.title && state.title !== "MY CHATTOGRAM" && state.title !== "My Chattogram") ? state.title : "আমার চট্টগ্রাম জেলা";
        ctx.font = "700 56px 'Hind Siliguri', 'Plus Jakarta Sans', system-ui, sans-serif";
        ctx.fillStyle = th.textPrimary;
        ctx.fillText(titleText, W / 2, 205);

        // Subtitle line
        ctx.font = "500 20px 'Hind Siliguri', 'Plus Jakarta Sans', system-ui, sans-serif";
        ctx.fillStyle = th.textMuted;
        ctx.fillText("১৫টি উপজেলার ব্যক্তিগত ভ্রমণ মানচিত্র", W / 2, 250);

        // Divider
        ctx.strokeStyle = th.gridBorder;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(W / 2 - 120, 280);
        ctx.lineTo(W / 2 + 120, 280);
        ctx.stroke();

        // 3. THE MAP / TERRITORY CANVAS (The Dominant Visual Hero, 60% of vertical height)
        // Bounding Map Area: Y = 320 to 1080 (height = 760px)
        var mapBoxX = 90;
        var mapBoxY = 320;
        var mapBoxW = W - 180;
        var mapBoxH = 760;

        // Background container for Map Matrix
        ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
        ctx.fillRect(mapBoxX, mapBoxY, mapBoxW, mapBoxH);
        ctx.strokeStyle = "rgba(255, 255, 255, 0.04)";
        ctx.lineWidth = 1;
        ctx.strokeRect(mapBoxX, mapBoxY, mapBoxW, mapBoxH);

        // Subtle Topographic Matrix Guidelines
        ctx.strokeStyle = "rgba(255, 255, 255, 0.025)";
        ctx.lineWidth = 1;
        for (var gl = 1; gl < 6; gl++) {
            ctx.beginPath();
            ctx.moveTo(mapBoxX, mapBoxY + gl * 125);
            ctx.lineTo(mapBoxX + mapBoxW, mapBoxY + gl * 125);
            ctx.stroke();
        }

        // Compass / Geo Metadata
        ctx.font = "700 13px 'Plus Jakarta Sans', monospace";
        ctx.fillStyle = th.textDim;
        ctx.textAlign = "left";
        ctx.fillText("GEO-MATRIX: 22.3569° N, 91.7832° E · CHATTOGRAM DISTRICT", mapBoxX + 24, mapBoxY + 36);

        ctx.textAlign = "right";
        ctx.fillText("TERRITORY DISCOVERY LAYER", mapBoxX + mapBoxW - 24, mapBoxY + 36);

        // The Map: scaled to fit elegantly within mapBox area
        const innerMargin = 40;
        const availMapW = mapBoxW - innerMargin;
        const availMapH = mapBoxH - innerMargin;
        const scaleX = availMapW / (viewBoxWidth || 640);
        const scaleY = availMapH / (viewBoxHeight || 850);
        const mapScale = Math.min(scaleX, scaleY);

        const offsetX = mapBoxX + (mapBoxW - (viewBoxWidth || 640) * mapScale) / 2;
        const offsetY = mapBoxY + (mapBoxH - (viewBoxHeight || 850) * mapScale) / 2;

        // Draw City Corporation visual background layer on poster (Passive, non-interactive)
        if (cityCorpFeature) {
            ctx.save();
            ctx.translate(offsetX, offsetY);
            ctx.scale(mapScale, mapScale);
            const cityPath2D = new Path2D(commandsToSvgPath(cityCorpFeature.commands));
            ctx.fillStyle = "rgba(255, 255, 255, 0.035)";
            ctx.fill(cityPath2D);
            ctx.strokeStyle = "rgba(255, 255, 255, 0.16)";
            ctx.lineWidth = 1;
            ctx.setLineDash([4, 4]);
            ctx.stroke(cityPath2D);
            ctx.restore();

            const ccx = offsetX + cityCorpFeature.centroid.x * mapScale;
            const ccy = offsetY + cityCorpFeature.centroid.y * mapScale;
            ctx.save();
            ctx.font = "600 11px 'Plus Jakarta Sans', sans-serif";
            ctx.fillStyle = "rgba(255, 255, 255, 0.32)";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText("CHATTOGRAM", ccx, ccy - 6.5);
            ctx.fillText("CITY CORPORATION", ccx, ccy + 6.5);
            ctx.restore();
        }

        // 1. Draw all 15 Upazila polygon tiles
        projectedFeatures.forEach(feat => {
            const isSel = state.upazilas.includes(feat.id);
            const path2D = new Path2D(commandsToSvgPath(feat.commands));
            
            ctx.save();
            ctx.translate(offsetX, offsetY);
            ctx.scale(mapScale, mapScale);
            
            if (isSel && preloadedImages[feat.id]) {
                const img = preloadedImages[feat.id];
                const photo = state.photos[feat.id] || {};
                const zoom = (photo.zoom !== undefined) ? photo.zoom : 1.0;
                const panX = photo.panX || 0;
                const panY = photo.panY || 0;

                ctx.save();
                ctx.clip(path2D);

                const b = feat.bbox || { minX: 0, minY: 0, width: 100, height: 100 };
                const bw = b.width;
                const bh = b.height;
                const baseScale = Math.max(bw / img.width, bh / img.height);
                const dw = img.width * baseScale * zoom;
                const dh = img.height * baseScale * zoom;
                const dx = b.minX + (bw - dw) / 2 + panX;
                const dy = b.minY + (bh - dh) / 2 + panY;

                ctx.drawImage(img, dx, dy, dw, dh);
                ctx.fillStyle = "rgba(6, 19, 14, 0.22)";
                ctx.fillRect(b.minX - 10, b.minY - 10, bw + 20, bh + 20);
                ctx.restore();

                ctx.strokeStyle = th.accent;
                ctx.lineWidth = 2.5;
                ctx.stroke(path2D);
            } else if (isSel) {
                ctx.fillStyle = th.activeTileBg;
                ctx.fill(path2D);
                
                ctx.strokeStyle = th.accentSecondary;
                ctx.lineWidth = 2;
                ctx.stroke(path2D);
            } else {
                ctx.fillStyle = th.unselectedTileBg;
                ctx.fill(path2D);
                
                ctx.strokeStyle = th.unselectedTileBorder;
                ctx.lineWidth = 1;
                ctx.stroke(path2D);
            }
            
            ctx.restore();
        });

        // 2. Draw all 15 Upazila labels with authoritative 2-level typography (Primary Bengali + Secondary English)
        projectedFeatures.forEach(feat => {
            const isSel = state.upazilas.includes(feat.id);
            const hasPhoto = isSel && preloadedImages[feat.id];

            // Calibrated typography and interior safe-point clearance
            let bnFontSize = 20;
            let enFontSize = 12;
            let nudgePosterX = 0;
            let nudgePosterY = 0;

            if (feat.id === 'karnaphuli' || feat.id === 'boalkhali') {
                bnFontSize = 15;
                enFontSize = 9.5;
                if (feat.id === 'karnaphuli') {
                    nudgePosterX = 3.5;
                }
            } else if (feat.id === 'hathazari') {
                bnFontSize = 17.5;
                enFontSize = 11;
                nudgePosterX = -4.5;
            } else if (feat.id === 'raozan') {
                bnFontSize = 18;
                enFontSize = 11.5;
                nudgePosterX = 2.5;
            }

            const photo = state.photos && state.photos[feat.id];
            if (hasPhoto && photo && photo.hideLabel) {
                return; // Omit label so full photo shines through unobstructed
            }

            const offX = (hasPhoto && photo) ? ((photo.labelOffsetX || 0) * mapScale) : 0;
            const offY = (hasPhoto && photo) ? ((photo.labelOffsetY || 0) * mapScale) : 0;

            const cx = offsetX + feat.centroid.x * mapScale + nudgePosterX + offX;
            const cy = offsetY + feat.centroid.y * mapScale + nudgePosterY + offY;

            ctx.save();
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";

            const bnY = (feat.id === 'karnaphuli' || feat.id === 'boalkhali') ? (cy - 5) : (cy - 6.5);
            const enY = (feat.id === 'karnaphuli' || feat.id === 'boalkhali') ? (cy + 6.5) : (cy + 8.5);

            if (hasPhoto) {
                // Crisp high-contrast shadow halo when rendering over uploaded travel photo
                ctx.shadowColor = "rgba(0, 0, 0, 0.95)";
                ctx.shadowBlur = 6;
                ctx.shadowOffsetX = 0;
                ctx.shadowOffsetY = 1;

                // Primary Bengali Line
                ctx.font = `700 ${bnFontSize}px 'Hind Siliguri', sans-serif`;
                ctx.fillStyle = "#ffffff";
                ctx.fillText(feat.name_bn, cx, bnY);

                // Secondary English Line
                ctx.font = `700 ${enFontSize}px 'Plus Jakarta Sans', sans-serif`;
                ctx.fillStyle = th.accent;
                ctx.fillText(feat.name_en, cx, enY);

            } else if (isSel) {
                // High contrast selected state typography
                let primaryTextColor = "#06130e";
                let secondaryTextColor = "#143227";

                if (state.theme === 'emerald') {
                    primaryTextColor = "#ffffff";
                    secondaryTextColor = "#e2ede7";
                    ctx.shadowColor = "rgba(0, 0, 0, 0.6)";
                    ctx.shadowBlur = 4;
                } else if (state.theme === 'ochre') {
                    primaryTextColor = "#150d08";
                    secondaryTextColor = "#2d1b10";
                } else if (state.theme === 'mono') {
                    primaryTextColor = "#0d0d0d";
                    secondaryTextColor = "#2a2a2a";
                }

                // Primary Bengali Line
                ctx.font = `700 ${bnFontSize}px 'Hind Siliguri', sans-serif`;
                ctx.fillStyle = primaryTextColor;
                ctx.fillText(feat.name_bn, cx, bnY);

                // Secondary English Line
                ctx.font = `700 ${enFontSize}px 'Plus Jakarta Sans', sans-serif`;
                ctx.fillStyle = secondaryTextColor;
                ctx.fillText(feat.name_en, cx, enY);

            } else {
                // High contrast unselected state typography (Crisp White + Accent with subtle dark halo)
                ctx.shadowColor = "rgba(0, 0, 0, 0.95)";
                ctx.shadowBlur = 4;
                ctx.shadowOffsetX = 0;
                ctx.shadowOffsetY = 1;

                // Primary Bengali Line
                ctx.font = `700 ${bnFontSize}px 'Hind Siliguri', sans-serif`;
                ctx.fillStyle = "#ffffff";
                ctx.fillText(feat.name_bn, cx, bnY);

                // Secondary English Line
                ctx.font = `700 ${enFontSize}px 'Plus Jakarta Sans', sans-serif`;
                ctx.fillStyle = th.accent;
                ctx.globalAlpha = 0.92;
                ctx.fillText(feat.name_en, cx, enY);
            }

            ctx.restore();
        });
        
        var countStr = toBn(state.upazilas.length) + " / ১৫";
        ctx.textAlign = "center";
        ctx.font = "800 58px 'Plus Jakarta Sans', 'Hind Siliguri', sans-serif";
        ctx.fillStyle = th.accent;
        ctx.fillText(countStr, W / 2, 1175);


        ctx.font = "700 18px 'Plus Jakarta Sans', sans-serif";
        ctx.fillStyle = th.textPrimary;
        ctx.fillText("UPAZILAS EXPLORED", W / 2, 1215);

        // Optional City Areas Line (NO fake denominator!)
        var cityCount = state.cityAreas.length;
        if (cityCount > 0) {
            ctx.font = "600 16px 'Hind Siliguri', sans-serif";
            ctx.fillStyle = th.accentSecondary;
            ctx.fillText("+ " + cityCount + "টি সিটি এলাকা অন্বেষণ সম্পন্ন", W / 2, 1248);
        }

        // Exploration Motto
        ctx.font = "italic 500 18px 'Hind Siliguri', sans-serif";
        ctx.fillStyle = th.textMuted;
        ctx.fillText("Still exploring Chattogram...", W / 2, cityCount > 0 ? 1285 : 1260);

        // 5. Signature Creator Watermark & Footer
        ctx.strokeStyle = th.gridBorder;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(90, 1370);
        ctx.lineTo(W - 90, 1370);
        ctx.stroke();

        ctx.font = "800 18px 'Plus Jakarta Sans', sans-serif";
        ctx.fillStyle = th.textPrimary;
        ctx.textAlign = "left";
        ctx.fillText("#MYCHATTOGRAM", 90, 1415);

        ctx.font = "800 18px 'Plus Jakarta Sans', sans-serif";
        if ('letterSpacing' in ctx) ctx.letterSpacing = '3px';
        ctx.fillStyle = th.accent;
        ctx.textAlign = "right";
        ctx.fillText("● SAKIB'S CREATION", W - 90, 1415);
        if ('letterSpacing' in ctx) ctx.letterSpacing = '0px';
    }

    // Canvas RoundRect Helper
    function roundRect(ctx, x, y, width, height, radius) {
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
    }

    /* --------------------------------------------------------------------------
       7. ACTIONS: DOWNLOAD & SHARING
       -------------------------------------------------------------------------- */
    
    function initActions() {
        const searchInput = document.getElementById('upazilaSearch');
        const clearSearchBtn = document.getElementById('btnClearUpazilaSearch');
        if (searchInput) {
            const filterMap = () => {
                const val = (searchInput.value || '').trim().toLowerCase();
                const container = document.getElementById('upazilaMapContainer');
                if (clearSearchBtn) {
                    clearSearchBtn.style.display = val.length > 0 ? 'inline-block' : 'none';
                }
                if (!container) return;
                
                projectedFeatures.forEach(f => {
                    const match = !val || f.name_en.toLowerCase().includes(val) || f.name_bn.includes(val);
                    const g = container.querySelector(`[data-id="${f.id}"]`);
                    if (g) {
                        g.style.opacity = match ? "1" : "0.2";
                        g.style.pointerEvents = match ? "auto" : "none";
                    }
                });
            };

            searchInput.addEventListener('input', filterMap);

            if (clearSearchBtn) {
                clearSearchBtn.addEventListener('click', () => {
                    searchInput.value = '';
                    filterMap();
                    onStateUpdated();
                    searchInput.focus();
                });
            }
            searchInput.addEventListener('input', () => {
                onStateUpdated();
            });
        }

        // Scroll to poster CTA button
        const btnScrollToPoster = document.getElementById('btnScrollToPoster');
        if (btnScrollToPoster) {
            btnScrollToPoster.addEventListener('click', (e) => {
                const posterEl = document.getElementById('poster');
                if (posterEl) {
                    e.preventDefault();
                    posterEl.scrollIntoView({ behavior: 'smooth' });
                }
            });
        }

        // Experience Navigation & Central Router
        var landingView = document.getElementById("landingView");
        var exp1View = document.getElementById("experience1View");
        var exp2View = document.getElementById("experience2View");
        var exp3View = document.getElementById("experience3View");
        var exp4View = document.getElementById("experience4View");
        var btnExp1 = document.getElementById("btnExp1");
        var btnExp2 = document.getElementById("btnExp2");
        var btnExp3 = document.getElementById("btnExp3");
        var btnExp4 = document.getElementById("btnExp4");

        function updateNavPills(activeExp) {
            document.querySelectorAll(".ctg-exp-nav-pill").forEach(function (pill) {
                var expAttr = pill.getAttribute("data-exp");
                var isActive = (expAttr === String(activeExp));
                if (isActive) {
                    pill.classList.add("active");
                    pill.setAttribute("aria-selected", "true");
                } else {
                    pill.classList.remove("active");
                    pill.setAttribute("aria-selected", "false");
                }
            });
        }

        function showView(target, updateHash) {
            var viewKey = 'landing';
            if (target === exp1View || target === 'exp1' || target === '1') viewKey = 'exp1';
            else if (target === exp2View || target === 'exp2' || target === '2') viewKey = 'exp2';
            else if (target === exp3View || target === 'exp3' || target === '3') viewKey = 'exp3';
            else if (target === exp4View || target === 'exp4' || target === '4') viewKey = 'exp4';
            else if (target === landingView || target === 'landing' || target === 'home') viewKey = 'landing';

            window.__currentCtgExp = viewKey;

            // STRICT AUDIO ISOLATION GUARD: If switching away from Exp 3, silence audio BEFORE any DOM manipulation!
            if (viewKey !== 'exp3') {
                if (window.ctgCityEngine) {
                    if (typeof window.ctgCityEngine.forceSilence === 'function') {
                        window.ctgCityEngine.forceSilence();
                    } else if (typeof window.ctgCityEngine.stopAudioPlayback === 'function') {
                        window.ctgCityEngine.stopAudioPlayback(true);
                    }
                }
            }

            if (landingView) landingView.style.display = (viewKey === 'landing') ? "block" : "none";
            if (exp1View) exp1View.style.display = (viewKey === 'exp1') ? "block" : "none";
            if (exp2View) exp2View.style.display = (viewKey === 'exp2') ? "block" : "none";
            if (exp3View) exp3View.style.display = (viewKey === 'exp3') ? "block" : "none";
            if (exp4View) exp4View.style.display = (viewKey === 'exp4') ? "block" : "none";

            if (viewKey === 'landing') {
                document.body.classList.add("on-landing");
                if (updateHash) {
                    if (window.location.hash) {
                        history.pushState(null, '', window.location.pathname + window.location.search);
                    }
                }
            } else {
                document.body.classList.remove("on-landing");
                var expNum = viewKey.replace('exp', '');
                updateNavPills(expNum);
                if (updateHash) {
                    if (window.location.hash !== '#' + viewKey) {
                        history.pushState(null, '', '#' + viewKey);
                    }
                }
            }

            // Sync Top Navbar Brand Title & Language Toggle
            var navSubTitle = document.getElementById("ctgNavSubTitle");
            var navLangBtn = document.getElementById("btnCityLangToggle");
            if (navSubTitle) {
                if (viewKey === 'exp3') {
                    var isStd = (window.ctgCityEngine && window.ctgCityEngine.state && window.ctgCityEngine.state.lang === 'standard_bn');
                    navSubTitle.textContent = isStd ? "আমার চট্টগ্রাম শহর" : "আঁর চাটগাঁ শহর";
                } else if (viewKey === 'exp1') {
                    navSubTitle.textContent = "MY CHATTOGRAM DIVISION";
                } else if (viewKey === 'exp4') {
                    navSubTitle.textContent = "PLACES I'VE EXPLORED";
                } else {
                    navSubTitle.textContent = "MY CHATTOGRAM";
                }
            }
            if (navLangBtn) {
                navLangBtn.style.display = (viewKey === 'exp3') ? "inline-flex" : "none";
            }

            window.__currentCtgExp = viewKey;
            window.scrollTo(0, 0);

            // Toggle body class for experience-specific styling
            document.body.classList.toggle("on-exp3", viewKey === 'exp3');

            // Hardened Audio Control: Isolate Floating Pill and strictly force silence outside Exp 3
            var floatingPill = document.getElementById("ctgFloatingAudioPill");
            if (floatingPill) {
                floatingPill.style.display = (viewKey === 'exp3') ? "inline-flex" : "none";
            }

            if (viewKey !== 'exp3') {
                if (window.ctgCityEngine) {
                    if (typeof window.ctgCityEngine.forceSilence === 'function') {
                        window.ctgCityEngine.forceSilence();
                    } else if (typeof window.ctgCityEngine.stopAudioPlayback === 'function') {
                        window.ctgCityEngine.stopAudioPlayback(true);
                    }
                }
            }

            // Re-render poster or refresh state for active experience
            if (viewKey === 'exp1') {
                if (window.updateDivisionUI) window.updateDivisionUI();
                if (window.renderDivisionPoster) window.renderDivisionPoster();
            } else if (viewKey === 'exp2') {
                onStateUpdated();
                renderPoster();
            } else if (viewKey === 'exp3') {
                if (window.ctgCityEngine) {
                    if (typeof window.ctgCityEngine.updateUI === 'function') window.ctgCityEngine.updateUI();
                    if (typeof window.ctgCityEngine.onEnterExp3 === 'function') {
                        window.ctgCityEngine.onEnterExp3();
                    } else if (typeof window.ctgCityEngine.startAudioPlayback === 'function') {
                        window.ctgCityEngine.startAudioPlayback();
                    }
                }
            } else if (viewKey === 'exp4') {
                if (typeof window.initPlacesMap === 'function') window.initPlacesMap();
                if (window.updatePlacesStats) window.updatePlacesStats();
                if (window.renderPlacesPoster) window.renderPlacesPoster();
            }

            // Sync Mobile Sticky Action Dock
            var thumbBar = document.getElementById("ctgMobileThumbBar");
            if (thumbBar) {
                if (viewKey === 'landing') {
                    thumbBar.style.display = "none";
                    thumbBar.setAttribute("aria-hidden", "true");
                } else {
                    thumbBar.style.display = "";
                    thumbBar.setAttribute("aria-hidden", "false");
                    if (window.__ctgExpStats && window.__ctgExpStats[viewKey]) {
                        var cached = window.__ctgExpStats[viewKey];
                        window.updateMobileThumbBar(cached.count, cached.total, cached.rankTitle, viewKey);
                    }
                }
            }
        }

        // Global Mobile Thumb Bar Dispatcher with Experience-Isolation
        window.__ctgExpStats = window.__ctgExpStats || {};
        window.updateMobileThumbBar = function (count, total, rankTitle, expKey) {
            var thumbBar = document.getElementById("ctgMobileThumbBar");
            var countEl = document.getElementById("ctgMtbCount");
            var rankEl = document.getElementById("ctgMtbRank");
            if (!thumbBar || !countEl) return;

            var callerExp = expKey;
            if (!callerExp) {
                var numTotal = parseInt(total, 10);
                if (numTotal === 11) callerExp = 'exp1';
                else if (numTotal === 15) callerExp = 'exp2';
                else if (numTotal === 21) callerExp = 'exp3';
                else if (numTotal > 50) callerExp = 'exp4';
                else callerExp = window.__currentCtgExp || 'exp2';
            }

            window.__ctgExpStats[callerExp] = { count: count, total: total, rankTitle: rankTitle };

            var activeExp = window.__currentCtgExp;
            if (!activeExp) {
                var hash = (window.location.hash || '').toLowerCase();
                if (hash === '#exp1') activeExp = 'exp1';
                else if (hash === '#exp3') activeExp = 'exp3';
                else if (hash === '#exp4') activeExp = 'exp4';
                else if (hash === '#landing') activeExp = 'landing';
                else activeExp = 'exp2';
            }

            if (activeExp === 'landing') {
                thumbBar.style.display = "none";
                return;
            }
            if (callerExp !== activeExp) {
                return;
            }

            thumbBar.style.display = "";

            var rawCountBn = String(count).replace(/[0-9]/g, function (d) {
                return BN_DIGITS[parseInt(d, 10)] || d;
            });
            var rawTotalBn = String(total).replace(/[0-9]/g, function (d) {
                return BN_DIGITS[parseInt(d, 10)] || d;
            });

            var unitLabel = "নির্বাচিত";
            if (activeExp === 'exp1') unitLabel = "জেলা নির্বাচিত";
            else if (activeExp === 'exp2') unitLabel = "উপজেলা নির্বাচিত";
            else if (activeExp === 'exp3') unitLabel = "এলাকা নির্বাচিত";
            else if (activeExp === 'exp4') unitLabel = "স্পট নির্বাচিত";

            countEl.textContent = rawCountBn + " / " + rawTotalBn + " " + unitLabel;
            if (rankEl && rankTitle) rankEl.textContent = rankTitle;
        };

        // Jump button click handler for mobile thumb bar
        var btnMtbJump = document.getElementById("btnMtbJumpToPoster");
        if (btnMtbJump) {
            btnMtbJump.addEventListener("click", function () {
                var hash = (window.location.hash || '').toLowerCase();
                var targetId = 'upazilaPosterStage';
                if (hash === '#exp1') targetId = 'divPosterStage';
                else if (hash === '#exp4') targetId = 'placesPosterStage';
                if (hash === '#exp3') {
                    var dl = document.querySelector('.ctg-control-box-download');
                    if (dl) {
                        dl.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        return;
                    }
                    targetId = 'cityPosterStage';
                }
                
                var target = document.getElementById(targetId);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        }

        window.switchCtgExperience = showView;

        function handleRoute() {
            var hash = (window.location.hash || '').toLowerCase();
            var search = (window.location.search || '').toLowerCase();
            if (hash === '#exp1' || search.includes('exp=1')) {
                showView('exp1', false);
            } else if (hash === '#exp2' || search.includes('exp=2')) {
                showView('exp2', false);
            } else if (hash === '#exp3' || search.includes('exp=3')) {
                showView('exp3', false);
            } else if (hash === '#exp4' || search.includes('exp=4')) {
                showView('exp4', false);
            } else {
                showView('landing', false);
            }
        }

        function applyExperienceSignatureTheme(expKey) {
            setTimeout(function () {
                if (expKey === 'exp1') {
                    var targetBtn = document.querySelector('#divPosterQuickBar .ctg-quick-swatch-dot[data-theme="dark"], #divThemeSelector .ctg-theme-btn[data-theme="dark"]');
                    if (targetBtn) targetBtn.click();
                } else if (expKey === 'exp2') {
                    var targetBtn = document.querySelector('#upazilaPosterQuickBar .ctg-quick-swatch-dot[data-theme="emerald"], #upazilaThemeSelector .ctg-theme-btn[data-theme="emerald"]');
                    if (targetBtn) targetBtn.click();
                } else if (expKey === 'exp3') {
                    var targetBtn = document.querySelector('#cityPosterQuickBar .ctg-quick-swatch-dot[data-theme="pothochitro"], #cityThemeSelector .ctg-theme-btn[data-theme="pothochitro"]');
                    if (targetBtn) targetBtn.click();
                } else if (expKey === 'exp4') {
                    var targetBtn = document.querySelector('#placesPosterQuickBar .ctg-quick-swatch-dot[data-theme="dark"], #placesThemeSelector .ctg-theme-btn[data-theme="dark"]');
                    if (targetBtn) targetBtn.click();
                }
            }, 60);
        }

        if (btnExp1) {
            btnExp1.addEventListener("click", function () {
                showView('exp1', true);
                applyExperienceSignatureTheme('exp1');
            });
        }
        if (btnExp2) {
            btnExp2.addEventListener("click", function () {
                showView('exp2', true);
                applyExperienceSignatureTheme('exp2');
            });
        }
        if (btnExp3) {
            btnExp3.addEventListener("click", function () {
                showView('exp3', true);
                applyExperienceSignatureTheme('exp3');
            });
        }
        if (btnExp4) {
            btnExp4.addEventListener("click", function () {
                showView('exp4', true);
                applyExperienceSignatureTheme('exp4');
            });
        }

        // Delegate clicks for pill selectors & back buttons
        document.addEventListener("click", function (e) {
            var backBtn = e.target.closest(".ctg-btn-back-home");
            if (backBtn) {
                e.preventDefault();
                showView('landing', true);
                return;
            }

            var pill = e.target.closest(".ctg-exp-nav-pill");
            if (pill) {
                e.preventDefault();
                var exp = pill.getAttribute("data-exp");
                if (exp) {
                    showView('exp' + exp, true);
                }
            }
        });

        window.addEventListener("hashchange", handleRoute);
        window.addEventListener("popstate", handleRoute);

        // Initial route resolution
        handleRoute();
        if (window.__currentCtgExp !== 'exp3') {
            if (window.ctgCityEngine && typeof window.ctgCityEngine.forceSilence === 'function') {
                window.ctgCityEngine.forceSilence();
            }
        }

        // Multi-Format Exporter Helpers
        function triggerCtgDownload(url, filename) {
            var a = document.createElement("a");
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }

        function showCtgToast(msg) {
            var toast = document.createElement('div');
            toast.className = 'ctg-toast';
            toast.style.cssText = 'position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:rgba(4,20,15,0.92);border:1px solid #2a9d8f;color:#fff;padding:10px 20px;border-radius:30px;font-size:13px;font-weight:700;z-index:99999;box-shadow:0 8px 24px rgba(0,0,0,0.5);backdrop-filter:blur(8px);';
            toast.textContent = msg;
            document.body.appendChild(toast);
            setTimeout(function () { toast.remove(); }, 2500);
        }

        function generateAndDownloadExp2Pdf(canvas, filename) {
            try {
                if (window.jspdf && window.jspdf.jsPDF) {
                    var jsPDF = window.jspdf.jsPDF;
                    var pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: [210, 262.5] });
                    var imgData = canvas.toDataURL('image/jpeg', 0.98);
                    pdf.addImage(imgData, 'JPEG', 0, 0, 210, 262.5);
                    pdf.save(filename);
                    showCtgToast('✓ PDF প্রিন্ট-রেডি ফাইল ডাউনলোড হয়েছে');
                } else {
                    var dataUrl = canvas.toDataURL('image/png');
                    triggerCtgDownload(dataUrl, filename.replace('.pdf', '.png'));
                    showCtgToast('✓ PNG ডাউনলোড সম্পন্ন (PDF লাইব্রেরি লোড না হওয়ায়)');
                }
            } catch (e) {
                console.error('PDF generation failed:', e);
                var dataUrl = canvas.toDataURL('image/png');
                triggerCtgDownload(dataUrl, filename.replace('.pdf', '.png'));
            }
        }

        function downloadExp2Poster(format) {
            if (!posterCanvas) return;
            renderPoster();
            var timestamp = new Date().toISOString().slice(0, 10);
            var rawTitle = (state.title && state.title.trim()) ? state.title.trim() : 'My-Chattogram';
            var sanitizedTitle = rawTitle.replace(/[^a-zA-Z0-9\u0980-\u09FF\-_]+/g, '-').replace(/^-+|-+$/g, '') || 'My-Chattogram';
            var baseFileName = sanitizedTitle + '-' + state.theme + '-' + timestamp;

            if (format === 'png') {
                var dataUrl = posterCanvas.toDataURL('image/png');
                triggerCtgDownload(dataUrl, baseFileName + '.png');
                showCtgToast('✓ PNG পোস্টার ডাউনলোড শুরু হয়েছে (Ultra HD)');
            } else if (format === 'jpg' || format === 'jpeg') {
                var dataUrl = posterCanvas.toDataURL('image/jpeg', 1.0);
                triggerCtgDownload(dataUrl, baseFileName + '.jpg');
                showCtgToast('✓ JPG পোস্টার ডাউনলোড সম্পন্ন (১০০% কোয়ালিটি)');
            } else if (format === 'pdf') {
                generateAndDownloadExp2Pdf(posterCanvas, baseFileName + '.pdf');
            }
        }

        var setupExp2DownloadBtn = function (id, format) {
            var btn = document.getElementById(id);
            if (btn) {
                btn.addEventListener("click", function () { downloadExp2Poster(format); });
            }
        };
        setupExp2DownloadBtn('btnDownloadExp2Png', 'png');
        setupExp2DownloadBtn('btnDownloadExp2Jpg', 'jpg');
        setupExp2DownloadBtn('btnDownloadExp2Pdf', 'pdf');

        // Download PNG
        if (btnDownloadPoster && posterCanvas) {
            var originalBtnHtml = btnDownloadPoster.innerHTML;
            var isDownloadBusy = false;

            btnDownloadPoster.addEventListener("click", function () {
                if (isDownloadBusy) return;
                try {
                    isDownloadBusy = true;
                    btnDownloadPoster.classList.add("is-downloading");
                    btnDownloadPoster.innerHTML = '<svg class="ctg-spin" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9" stroke-opacity="0.25"></circle><path d="M12 3a9 9 0 0 1 9 9"></path></svg><span>প্রস্তুত হচ্ছে...</span>';

                    var sanitizedTitle = (state.title || "my-chattogram").toLowerCase().replace(/[^a-z0-9_-]/g, "-");
                    var filename = sanitizedTitle + "-poster.png";

                    var handleDownloadSuccess = function () {
                        btnDownloadPoster.classList.remove("is-downloading");
                        btnDownloadPoster.classList.add("is-success");
                        btnDownloadPoster.innerHTML = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"></polyline></svg><span>ডাউনলোড সম্পন্ন! ✓</span>';
                        setTimeout(function () {
                            btnDownloadPoster.classList.remove("is-success");
                            btnDownloadPoster.innerHTML = originalBtnHtml;
                            isDownloadBusy = false;
                        }, 2500);
                    };

                    if (posterCanvas.toBlob) {
                        posterCanvas.toBlob(function (blob) {
                            if (!blob) {
                                throw new Error("Canvas blob generation failed");
                            }
                            var url = URL.createObjectURL(blob);
                            var a = document.createElement("a");
                            a.href = url;
                            a.download = filename;
                            document.body.appendChild(a);
                            a.click();
                            document.body.removeChild(a);
                            setTimeout(function () { URL.revokeObjectURL(url); }, 3000);
                            handleDownloadSuccess();
                        }, "image/png");
                    } else {
                        var dataUrl = posterCanvas.toDataURL("image/png");
                        var a = document.createElement("a");
                        a.href = dataUrl;
                        a.download = filename;
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        handleDownloadSuccess();
                    }
                } catch (e) {
                    console.error("[My Chattogram] Poster download failed:", e);
                    btnDownloadPoster.classList.remove("is-downloading", "is-success");
                    btnDownloadPoster.innerHTML = originalBtnHtml;
                    isDownloadBusy = false;
                    alert("পোস্টার ডাউনলোড করতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।");
                }
            });
        }

        // Copy Caption
        if (btnCopyCaption && captionTextArea) {
            btnCopyCaption.addEventListener("click", function () {
                captionTextArea.select();
                captionTextArea.setSelectionRange(0, 99999);

                var copyBtnText = document.getElementById("copyBtnText");

                if (navigator.clipboard && navigator.clipboard.writeText) {
                    navigator.clipboard.writeText(captionTextArea.value).then(function () {
                        if (copyBtnText) copyBtnText.textContent = "কপি করা হয়েছে! ✓";
                        setTimeout(function () {
                            if (copyBtnText) copyBtnText.textContent = "ক্যাপশন কপি করুন";
                        }, 2500);
                    }).catch(function () {
                        document.execCommand("copy");
                        if (copyBtnText) copyBtnText.textContent = "কপি করা হয়েছে! ✓";
                        setTimeout(function () {
                            if (copyBtnText) copyBtnText.textContent = "ক্যাপশন কপি করুন";
                        }, 2500);
                    });
                } else {
                    document.execCommand("copy");
                    if (copyBtnText) copyBtnText.textContent = "কপি করা হয়েছে! ✓";
                    setTimeout(function () {
                        if (copyBtnText) copyBtnText.textContent = "ক্যাপশন কপি করুন";
                    }, 2500);
                }
            });
        }

        // Web Share API (if supported on mobile browsers)
        if (btnWebShare && navigator.share) {
            btnWebShare.style.display = "inline-flex";
            btnWebShare.addEventListener("click", function () {
                if (posterCanvas.toBlob) {
                    posterCanvas.toBlob(function (blob) {
                        var file = new File([blob], "my-chattogram.png", { type: "image/png" });
                        var shareData = {
                            title: state.title || "My Chattogram",
                            text: captionTextArea.value,
                            files: [file]
                        };
                        if (navigator.canShare && navigator.canShare(shareData)) {
                            navigator.share(shareData).catch(function () {});
                        } else {
                            navigator.share({
                                title: state.title || "My Chattogram",
                                text: captionTextArea.value
                            }).catch(function () {});
                        }
                    }, "image/png");
                }
            });
        }

        // Personalization: Map Title input & Character Counter
        var titleCharCounter = document.getElementById("titleCharCounter");
        function updateTitleCharCounter() {
            if (!titleCharCounter || !inputMapTitle) return;
            var currentLen = inputMapTitle.value.length;
            var maxLen = inputMapTitle.maxLength > 0 ? inputMapTitle.maxLength : 32;
            var lenBn = String(currentLen).replace(/[0-9]/g, function (d) { return BN_DIGITS[parseInt(d, 10)] || d; });
            var maxBn = String(maxLen).replace(/[0-9]/g, function (d) { return BN_DIGITS[parseInt(d, 10)] || d; });
            titleCharCounter.textContent = lenBn + " / " + maxBn;
        }

        if (inputMapTitle) {
            inputMapTitle.value = state.title;
            updateTitleCharCounter();
            inputMapTitle.addEventListener("input", function () {
                state.title = inputMapTitle.value.trim() || "আমার চট্টগ্রাম জেলা";
                updateTitleCharCounter();
                onStateUpdated();
            });
        }

        var btnResetTitle = document.getElementById("btnResetTitle");
        if (btnResetTitle && inputMapTitle) {
            btnResetTitle.addEventListener("click", function () {
                inputMapTitle.value = "আমার চট্টগ্রাম জেলা";
                state.title = "আমার চট্টগ্রাম জেলা";
                var qTitle = document.getElementById("inputUpazilaQuickTitle");
                if (qTitle) qTitle.value = "আমার চট্টগ্রাম জেলা";
                updateTitleCharCounter();
                onStateUpdated();
            });
        }

        // Quick Title input & reset (Experience 02)
        var qTitleInput = document.getElementById("inputUpazilaQuickTitle");
        var btnResetQTitle = document.getElementById("btnResetUpazilaQuickTitle");
        if (qTitleInput) {
            qTitleInput.addEventListener("input", function (e) {
                state.title = e.target.value.trim() || "আমার চট্টগ্রাম জেলা";
                if (inputMapTitle && inputMapTitle.value !== e.target.value) {
                    inputMapTitle.value = e.target.value;
                }
                updateTitleCharCounter();
                if (btnResetQTitle) {
                    btnResetQTitle.style.display = (e.target.value !== "আমার চট্টগ্রাম জেলা" && e.target.value.length > 0) ? "flex" : "none";
                }
                onStateUpdated();
            });
        }
        if (btnResetQTitle && qTitleInput) {
            btnResetQTitle.addEventListener("click", function () {
                state.title = "আমার চট্টগ্রাম জেলা";
                qTitleInput.value = "আমার চট্টগ্রাম জেলা";
                if (inputMapTitle) inputMapTitle.value = "আমার চট্টগ্রাম জেলা";
                btnResetQTitle.style.display = "none";
                updateTitleCharCounter();
                onStateUpdated();
            });
        }

        // Personalization: Theme buttons (scoped to Experience 02 + quick bar + floating bar)
        var themeBtns = document.querySelectorAll("#upazilaThemeSelector .ctg-theme-btn, #upazilaPosterQuickBar .ctg-quick-swatch-dot, #upazilaFloatingThemeBar .ctg-mf-chip");
        themeBtns.forEach(function (btn) {
            btn.addEventListener("click", function () {
                var th = btn.getAttribute("data-theme");
                if (!THEMES[th]) return;

                state.theme = th;
                onStateUpdated();
            });
        });

        // Layer Tabs Switcher (Upazilas vs City)
        var tabUpazilas = document.getElementById("tabUpazilas");
        var tabCity = document.getElementById("tabCity");
        var viewUpazilas = document.getElementById("viewUpazilas");
        var viewCity = document.getElementById("viewCity");

        if (tabUpazilas && tabCity && viewUpazilas && viewCity) {
            tabUpazilas.addEventListener("click", function () {
                tabUpazilas.classList.add("active");
                tabUpazilas.setAttribute("aria-selected", "true");
                tabCity.classList.remove("active");
                tabCity.setAttribute("aria-selected", "false");

                viewUpazilas.classList.add("active");
                viewCity.classList.remove("active");
            });

            tabCity.addEventListener("click", function () {
                tabCity.classList.add("active");
                tabCity.setAttribute("aria-selected", "true");
                tabUpazilas.classList.remove("active");
                tabUpazilas.setAttribute("aria-selected", "false");

                viewCity.classList.add("active");
                viewUpazilas.classList.remove("active");
            });
        }

        // Quick Selection Action Buttons
        var btnSelectAllUpazilas = document.getElementById("btnSelectAllUpazilas");
        if (btnSelectAllUpazilas) {
            btnSelectAllUpazilas.addEventListener("click", function () {
                state.upazilas = projectedFeatures.map(f => f.id);
                if (typeof window.triggerGoldenConfetti === 'function') {
                    window.triggerGoldenConfetti();
                }
                saveState();
                onStateUpdated();
                renderInteractiveMap();
                renderPoster();
            });
        }

        var btnClearUpazilas = document.getElementById("btnClearUpazilas");
        if (btnClearUpazilas) {
            btnClearUpazilas.addEventListener("click", function () {
                state.upazilas = [];
                state.activeUpazilaId = null;
                saveState();
                onStateUpdated();
                renderInteractiveMap();
                renderPoster();
                renderUpazilaDock(null);
            });
        }

        // Collapsible Chips Tray Toggle
        var btnToggleChipsTray = document.getElementById("btnToggleChipsTray");
        var traySummaryBar = document.getElementById("traySummaryBar");
        var upazilaSelectedList = document.getElementById("upazilaSelectedList");
        var btnToggleChipsText = document.getElementById("btnToggleChipsText");

        function toggleChipsExpansion() {
            if (!upazilaSelectedList) return;
            var isCurrentlyCollapsed = upazilaSelectedList.classList.contains("collapsed");
            if (isCurrentlyCollapsed) {
                upazilaSelectedList.classList.remove("collapsed");
                if (btnToggleChipsTray) btnToggleChipsTray.setAttribute("aria-expanded", "true");
                if (btnToggleChipsText) btnToggleChipsText.textContent = "চিপস লুকান ▴";
            } else {
                upazilaSelectedList.classList.add("collapsed");
                if (btnToggleChipsTray) btnToggleChipsTray.setAttribute("aria-expanded", "false");
                var countBn = toBn(state.upazilas.length);
                if (btnToggleChipsText) btnToggleChipsText.textContent = `বিস্তারিত চিপস দেখুন (${countBn}) ▾`;
            }
        }

        if (btnToggleChipsTray) {
            btnToggleChipsTray.addEventListener("click", function (e) {
                e.stopPropagation();
                toggleChipsExpansion();
            });
        }
        if (traySummaryBar) {
            traySummaryBar.addEventListener("click", toggleChipsExpansion);
        }

        // Sticky Controls Toolbar Scroll Observer
        var controlsDeck = document.querySelector(".ctg-exp2-controls-deck");
        if (controlsDeck) {
            var handleDeckSticky = function () {
                var rect = controlsDeck.getBoundingClientRect();
                if (rect.top <= 74 && window.scrollY > 80) {
                    controlsDeck.classList.add("is-stuck");
                } else if (window.scrollY <= 80 || rect.top > 74) {
                    controlsDeck.classList.remove("is-stuck");
                }
            };
            window.addEventListener("scroll", handleDeckSticky, { passive: true });
            document.addEventListener("scroll", handleDeckSticky, { passive: true });
            window.addEventListener("resize", handleDeckSticky, { passive: true });
            handleDeckSticky();
        }

        // Explainer Modal
        var btnHowItWorks = document.getElementById("btnHowItWorks");
        var explainerModal = document.getElementById("explainerModal");
        var btnCloseModal = document.getElementById("btnCloseModal");
        var btnModalStart = document.getElementById("btnModalStart");

        if (btnHowItWorks && explainerModal) {
            btnHowItWorks.addEventListener("click", function () {
                explainerModal.classList.add("active");
                explainerModal.setAttribute("aria-hidden", "false");
            });

            function closeModal() {
                explainerModal.classList.remove("active");
                explainerModal.setAttribute("aria-hidden", "true");
            }

            if (btnCloseModal) btnCloseModal.addEventListener("click", closeModal);
            if (btnModalStart) btnModalStart.addEventListener("click", closeModal);

            explainerModal.addEventListener("click", function (e) {
                if (e.target === explainerModal) closeModal();
            });
        }

        // Sticky Header Scroll
        var header = document.getElementById("ctgHeader");
        if (header) {
            window.addEventListener("scroll", function () {
                if (window.scrollY > 30) {
                    header.classList.add("scrolled");
                } else {
                    header.classList.remove("scrolled");
                }
            }, { passive: true });
        }

        // Scroll reveals
        if ("IntersectionObserver" in window) {
            var observer = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("ctg-revealed");
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1 });

            document.querySelectorAll(".ctg-reveal").forEach(function (el) {
                observer.observe(el);
            });
        } else {
            document.querySelectorAll(".ctg-reveal").forEach(function (el) {
                el.classList.add("ctg-revealed");
            });
        }
    }

    /* --------------------------------------------------------------------------
       8. INITIALIZATION
       -------------------------------------------------------------------------- */
    function init() {
        loadState();
        loadGeometry();

        // Sync Experience 02 theme button
        var activeThemeBtn = document.querySelector('#upazilaThemeSelector .ctg-theme-btn[data-theme="' + state.theme + '"], #upazilaFloatingThemeBar .ctg-mf-chip[data-theme="' + state.theme + '"]');
        if (activeThemeBtn) {
            document.querySelectorAll("#upazilaThemeSelector .ctg-theme-btn, #upazilaFloatingThemeBar .ctg-mf-chip").forEach(function (b) {
                b.classList.remove("active");
                b.setAttribute("aria-checked", "false");
            });
            activeThemeBtn.classList.add("active");
            activeThemeBtn.setAttribute("aria-checked", "true");
        }

        initActions();
        onStateUpdated();

        // Ensure fonts are loaded before first canvas render
        if (document.fonts && document.fonts.ready) {
            document.fonts.ready.then(function () {
                renderPoster();
            });
        }

        // Expose for multi-experience switcher & automated testing
        window.ctgUpazilaEngine = {
            state: state,
            saveState: saveState,
            renderInteractiveMap: renderInteractiveMap,
            onStateUpdated: onStateUpdated,
            renderUpazilaDock: renderUpazilaDock,
            renderPoster: renderPoster,
            handleUpazilaPhotoUpload: handleUpazilaPhotoUpload,
            adjustUpazilaPhoto: adjustUpazilaPhoto
        };
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();
