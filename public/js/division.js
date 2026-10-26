/**
 * ============================================================================
 *  MY CHATTOGRAM — EXPERIENCE 01: MY CHATTOGRAM DIVISION
 *  Viral Interactive Map Creator & Social Poster Engine
 *  Sakib's Creation Flagship Social Experience
 * ============================================================================
 *  100% Isolated State: ghuraghuri_ctg_division_progress
 *  Handles:
 *   1. 11 Districts of Chattogram Division (GeoJSON Normalized Cartography)
 *   2. Interactive SVG Map & Fast Mobile Selection Chips
 *   3. Real-time selection & Unseen Bangladesh-style Explorer Ranking
 *   4. 4 Curated Themes (Minimal Dark, Coastal Emerald, Heritage Ochre, Monochrome)
 *   5. Native HTML5 Canvas 2D Live Poster Engine (1200 × 1500 px · 4:5 Portrait)
 *   6. Lossless PNG Download & Viral Caption Copy
 * ============================================================================
 */

(function () {
    "use strict";

    // 1. Data mapping for Chattogram Division (11 districts) with manual anchor offsets
    const DISTRICT_MAP = {
        'Bandarban': { id: 'bandarban', name_bn: 'বান্দরবান', name_en: 'Bandarban', offset: { x: 0, y: 12 } },
        'Brahamanbaria': { id: 'brahmanbaria', name_bn: 'ব্রাহ্মণবাড়িয়া', name_en: 'Brahmanbaria', offset: { x: 0, y: 0 } },
        'Chandpur': { id: 'chandpur', name_bn: 'চাঁদপুর', name_en: 'Chandpur', offset: { x: -6, y: 0 } },
        'Chittagong': { id: 'chattogram', name_bn: 'চট্টগ্রাম', name_en: 'Chattogram', offset: { x: 0, y: -8 } },
        'Comilla': { id: 'cumilla', name_bn: 'কুমিল্লা', name_en: 'Cumilla', offset: { x: 0, y: -6 } },
        "Cox's Bazar": { id: 'coxsbazar', name_bn: 'কক্সবাজার', name_en: "Cox's Bazar", offset: { x: -22, y: 5 } },
        'Feni': { id: 'feni', name_bn: 'ফেনী', name_en: 'Feni', offset: { x: 0, y: -2 } },
        'Khagrachhari': { id: 'khagrachhari', name_bn: 'খাগড়াছড়ি', name_en: 'Khagrachhari', offset: { x: -16, y: -5 } },
        'Lakshmipur': { id: 'lakshmipur', name_bn: 'লক্ষ্মীপুর', name_en: 'Lakshmipur', offset: { x: -6, y: -2 } },
        'Noakhali': { id: 'noakhali', name_bn: 'নোয়াখালী', name_en: 'Noakhali', offset: { x: 0, y: 15 } },
        'Rangamati': { id: 'rangamati', name_bn: 'রাঙ্গামাটি', name_en: 'Rangamati', offset: { x: 10, y: 0 } }
    };

    // Landmark highlights for all 11 districts of Chattogram Division
    const DISTRICT_LANDMARKS = {
        'coxsbazar': { bn: 'কক্সবাজার', en: "Cox's Bazar", highlights: 'বিশ্বের দীর্ঘতম সমুদ্র সৈকত, হিমছড়ি ও সেন্টমার্টিন দ্বীপ' },
        'bandarban': { bn: 'বান্দরবান', en: 'Bandarban', highlights: 'নীলগিরি, কেওক্রাডং, বগালেক ও নাফাখুম ঝর্ণা' },
        'rangamati': { bn: 'রাঙ্গামাটি', en: 'Rangamati', highlights: 'কাপ্তাই হ্রদ, ঝুলন্ত সেতু ও সাজেক ভ্যালি' },
        'khagrachhari': { bn: 'খাগড়াছড়ি', en: 'Khagrachhari', highlights: 'আলুটিলা রহস্যময় গুহা, রিছাং ঝর্ণা ও পাহাড়ি ঝিরি' },
        'chattogram': { bn: 'চট্টগ্রাম', en: 'Chattogram', highlights: 'পতেঙ্গা সৈকত, ফয়েজ লেক, পারকি সৈকত ও কর্ণফুলী মোহনা' },
        'cumilla': { bn: 'কুমিল্লা', en: 'Cumilla', highlights: 'শালবন বৌদ্ধ বিহার, ময়নামতি প্রত্নতত্ত্ব ও লালমাই পাহাড়' },
        'brahmanbaria': { bn: 'ব্রাহ্মণবাড়িয়া', en: 'Brahmanbaria', highlights: 'তিতাস নদী, কালিকচ্ছ ও ছানামুখী মিষ্টি' },
        'chandpur': { bn: 'চাঁদপুর', en: 'Chandpur', highlights: 'পদ্মা-মেঘনা-ডাকাতিয়া মোহনা ও রুপালি ইলিশের বাড়ি' },
        'noakhali': { bn: 'নোয়াখালী', en: 'Noakhali', highlights: 'নিঝুম দ্বীপের চিত্রল হরিণ ও ঐতিহাসিক গান্ধী আশ্রম' },
        'feni': { bn: 'ফেনী', en: 'Feni', highlights: 'মুহুরী সেচ প্রকল্প ও রাজা শমসের গাজীর কেল্লা' },
        'lakshmipur': { bn: 'লক্ষ্মীপুর', en: 'Lakshmipur', highlights: 'রামগতির মেঘনা মোহনা ও দালাল বাজার জমিদার বাড়ি' }
    };

    // Golden Celebration Confetti Engine (Lightweight, pure canvas, zero dependencies)
    if (typeof window.triggerGoldenConfetti !== 'function') {
        window.triggerGoldenConfetti = function () {
            let canvas = document.getElementById('ctgConfettiCanvas');
            if (!canvas) {
                canvas = document.createElement('canvas');
                canvas.id = 'ctgConfettiCanvas';
                canvas.style.position = 'fixed';
                canvas.style.top = '0';
                canvas.style.left = '0';
                canvas.style.width = '100vw';
                canvas.style.height = '100vh';
                canvas.style.pointerEvents = 'none';
                canvas.style.zIndex = '999999';
                document.body.appendChild(canvas);
            }
            const ctx = canvas.getContext('2d');
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;

            const colors = ['#e9c46a', '#f4a261', '#e76f51', '#2a9d8f', '#ffffff', '#ffd166'];
            const particles = [];
            for (let i = 0; i < 75; i++) {
                particles.push({
                    x: canvas.width / 2 + (Math.random() - 0.5) * 220,
                    y: canvas.height * 0.4 + (Math.random() - 0.5) * 80,
                    vx: (Math.random() - 0.5) * 14,
                    vy: (Math.random() - 0.85) * 16,
                    size: Math.random() * 8 + 4,
                    color: colors[Math.floor(Math.random() * colors.length)],
                    rotation: Math.random() * Math.PI * 2,
                    rotSpeed: (Math.random() - 0.5) * 0.22,
                    alpha: 1,
                    gravity: 0.32
                });
            }

            let animId;
            const startTime = Date.now();
            function animate() {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                const elapsed = Date.now() - startTime;
                let alive = false;
                particles.forEach(p => {
                    p.x += p.vx;
                    p.y += p.vy;
                    p.vy += p.gravity;
                    p.rotation += p.rotSpeed;
                    if (elapsed > 1600) {
                        p.alpha = Math.max(0, 1 - (elapsed - 1600) / 900);
                    }
                    if (p.alpha > 0) {
                        alive = true;
                        ctx.save();
                        ctx.globalAlpha = p.alpha;
                        ctx.translate(p.x, p.y);
                        ctx.rotate(p.rotation);
                        ctx.fillStyle = p.color;
                        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
                        ctx.restore();
                    }
                });
                if (alive && elapsed < 2600) {
                    animId = requestAnimationFrame(animate);
                } else {
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
                }
            }
            animId = requestAnimationFrame(animate);
        };
    }

    // 2. Curated Aesthetic Themes (Identical Palette Architecture to Exp 02 & 03)
    const THEMES = {
        dark: {
            name: "Minimal Dark",
            bg: "#06130e",
            cardBg: "#0e271f",
            accent: "#e9c46a",
            accentSecondary: "#f4a261",
            textPrimary: "#ffffff",
            textMuted: "#95aea3",
            textDim: "#557065",
            unselectedFill: "#0a1c15",
            unselectedBorder: "rgba(233, 196, 106, 0.25)",
            glowTop: "rgba(233, 196, 106, 0.15)",
            glowBot: "rgba(42, 157, 143, 0.1)"
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
            unselectedFill: "#072017",
            unselectedBorder: "rgba(42, 157, 143, 0.3)",
            glowTop: "rgba(42, 157, 143, 0.2)",
            glowBot: "rgba(82, 183, 136, 0.12)"
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
            unselectedFill: "#1e140d",
            unselectedBorder: "rgba(244, 162, 97, 0.25)",
            glowTop: "rgba(244, 162, 97, 0.18)",
            glowBot: "rgba(231, 111, 81, 0.1)"
        },
        mono: {
            name: "Monochrome",
            bg: "#0d0d0d",
            cardBg: "#1c1c1c",
            accent: "#ffffff",
            accentSecondary: "#cccccc",
            textPrimary: "#ffffff",
            textMuted: "#a0a0a0",
            textDim: "#606060",
            unselectedFill: "#151515",
            unselectedBorder: "rgba(255, 255, 255, 0.22)",
            glowTop: "rgba(255, 255, 255, 0.08)",
            glowBot: "rgba(255, 255, 255, 0.04)"
        }
    };

    // 3. Isolated State
    const STORAGE_KEY = "ghuraghuri_ctg_division_progress";
    let state = {
        selected: [],
        photos: {},
        activeDistrictId: null,
        theme: "dark",
        title: "আমার চট্টগ্রাম বিভাগ"
    };

    function loadState() {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed.selected)) state.selected = parsed.selected;
                if (parsed.photos && typeof parsed.photos === 'object') state.photos = parsed.photos;
                if (parsed.theme && THEMES[parsed.theme]) state.theme = parsed.theme;
                if (typeof parsed.title === 'string' && parsed.title.trim()) {
                    state.title = (parsed.title === "My Chattogram Division") ? "আমার চট্টগ্রাম বিভাগ" : parsed.title;
                }
            }
        } catch(e) {
            console.error("Failed to load division state", e);
        }
    }

    function saveState() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify({
                selected: state.selected,
                photos: state.photos || {},
                theme: state.theme,
                title: state.title
            }));
        } catch(e) {
            console.error("Failed to save division state", e);
        }
    }

    // 4. Normalized Geometry Pipeline (500 × 880 viewBox, optimal for Chattogram division aspect ratio)
    const SVG_WIDTH = 500;
    const SVG_HEIGHT = 880;
    let projectedFeatures = [];

    async function loadGeometry() {
        try {
            const resp = await fetch('data/chattogram-division-districts.geojson');
            const geojson = await resp.json();
            processGeometry(geojson);
            renderInteractiveMap();
            renderDistrictChips();
            updateUI();
            renderPoster();
            bindEvents();
        } catch(e) {
            console.error("Failed to load or parse GeoJSON", e);
            const container = document.getElementById('divisionMapContainer');
            if (container) {
                container.innerHTML = '<div style="color:#f4a261; padding:20px; text-align:center;">মানচিত্রের ডেটা লোড হতে সমস্যা হয়েছে। অনুগ্রহ করে রিফ্রেশ করুন।</div>';
            }
        }
    }

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

        const paddingTop = 8;
        const paddingBottom = 32;
        const paddingX = 8;
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

        projectedFeatures = geojson.features.map(feature => {
            const rawName = feature.properties.shapeName;
            const meta = DISTRICT_MAP[rawName];
            if (!meta) return null;

            const geoms = feature.geometry.type === 'MultiPolygon' 
                ? feature.geometry.coordinates 
                : [feature.geometry.coordinates];
                
            let commands = [];
            let maxArea = 0;
            let centerPoint = { x: 0, y: 0 };

            geoms.forEach(polygon => {
                polygon.forEach((ring, ringIndex) => {
                    let ringMinX = Infinity, ringMaxX = -Infinity;
                    let ringMinY = Infinity, ringMaxY = -Infinity;

                    ring.forEach((coord, i) => {
                        const x = offsetX + (coord[0] - minLon) * aspect * scale;
                        const y = offsetY + (maxLat - coord[1]) * scale;
                        
                        commands.push({ type: i === 0 ? 'M' : 'L', x, y });
                        
                        if (x < ringMinX) ringMinX = x;
                        if (x > ringMaxX) ringMaxX = x;
                        if (y < ringMinY) ringMinY = y;
                        if (y > ringMaxY) ringMaxY = y;
                    });
                    commands.push({ type: 'Z' });

                    if (ringIndex === 0) {
                        const area = (ringMaxX - ringMinX) * (ringMaxY - ringMinY);
                        if (area > maxArea) {
                            maxArea = area;
                            centerPoint = { x: (ringMinX + ringMaxX)/2, y: (ringMinY + ringMaxY)/2 };
                        }
                    }
                });
            });

            centerPoint.x += meta.offset.x;
            centerPoint.y += meta.offset.y;

            let bMinX = Infinity, bMaxX = -Infinity, bMinY = Infinity, bMaxY = -Infinity;
            commands.forEach(c => {
                if (typeof c.x === 'number') {
                    if (c.x < bMinX) bMinX = c.x;
                    if (c.x > bMaxX) bMaxX = c.x;
                    if (c.y < bMinY) bMinY = c.y;
                    if (c.y > bMaxY) bMaxY = c.y;
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
        
        projectedFeatures.sort((a, b) => a.name_bn.localeCompare(b.name_bn, 'bn'));
    }

    function commandsToSvgPath(commands) {
        return commands.map(c => {
            if (c.type === 'Z') return 'Z';
            return `${c.type}${c.x.toFixed(2)},${c.y.toFixed(2)}`;
        }).join(' ');
    }

    // 5. Interactive SVG Map Rendering (Strict 2-Layer Architecture: Paths Layer + Labels Layer + Live Clipped Photos)
    function renderInteractiveMap() {
        const container = document.getElementById('divisionMapContainer');
        if (!container) return;

        const t = THEMES[state.theme] || THEMES.dark;
        let svgHTML = `<svg viewBox="0 0 ${SVG_WIDTH} ${SVG_HEIGHT}" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet" aria-label="চট্টগ্রাম বিভাগ মানচিত্র">`;
        
        // Defs for photo clipping
        svgHTML += `<defs>`;
        projectedFeatures.forEach(feat => {
            const pathStr = commandsToSvgPath(feat.commands);
            svgHTML += `<clipPath id="clip-div-${feat.id}"><path d="${pathStr}" /></clipPath>`;
        });
        svgHTML += `</defs>`;

        // LAYER 1: BASE DISTRICT PATHS (All 11 district shapes rendered first)
        svgHTML += `<g class="ctg-map-paths-layer">`;
        projectedFeatures.forEach(feat => {
            const pathStr = commandsToSvgPath(feat.commands);
            const isSelected = state.selected.includes(feat.id);
            const photo = state.photos && state.photos[feat.id];
            const hasPhoto = isSelected && photo && photo.dataUrl;
            const cls = isSelected 
                ? (hasPhoto ? 'ctg-district-path selected has-photo' : 'ctg-district-path selected') 
                : 'ctg-district-path';
            const ariaLabel = `${feat.name_bn} (${feat.name_en})`;
            
            svgHTML += `
                <path class="${cls}" data-id="${feat.id}" d="${pathStr}" role="button" tabindex="0" aria-label="${ariaLabel}" aria-pressed="${isSelected}" />
            `;

            // Live clipped image if photo uploaded
            if (isSelected && photo && photo.dataUrl && feat.bbox) {
                const zoom = (typeof photo.zoom === 'number') ? photo.zoom : 1.0;
                const panX = (typeof photo.panX === 'number') ? photo.panX : 0;
                const panY = (typeof photo.panY === 'number') ? photo.panY : 0;
                
                const bw = feat.bbox.width * zoom;
                const bh = feat.bbox.height * zoom;
                const cx = feat.bbox.minX + feat.bbox.width / 2 + panX;
                const cy = feat.bbox.minY + feat.bbox.height / 2 + panY;
                const imgX = cx - bw / 2;
                const imgY = cy - bh / 2;

                svgHTML += `
                    <image href="${photo.dataUrl}" data-id="${feat.id}" x="${imgX.toFixed(1)}" y="${imgY.toFixed(1)}" width="${bw.toFixed(1)}" height="${bh.toFixed(1)}" preserveAspectRatio="xMidYMid slice" clip-path="url(#clip-div-${feat.id})" class="ctg-map-clipped-photo" style="pointer-events: none;" />
                    <path d="${pathStr}" fill="rgba(0,0,0,0.22)" style="pointer-events: none;" />
                    <path d="${pathStr}" fill="none" stroke="${t.bg || '#06130e'}" stroke-width="2.5" style="pointer-events: none;" />
                `;
            }
        });
        svgHTML += `</g>`;

        // LAYER 2: FLOATING CARTOGRAPHIC LABELS (Strictly on top of all paths)
        svgHTML += `<g class="ctg-map-labels-layer">`;
        projectedFeatures.forEach(feat => {
            const isSelected = state.selected.includes(feat.id);
            const photo = state.photos && state.photos[feat.id];
            const hasPhoto = isSelected && photo && photo.dataUrl;

            // If photo has hidden label, don't render it so full photo shines through unobstructed
            if (hasPhoto && photo.hideLabel) {
                return;
            }

            const offX = hasPhoto ? (photo.labelOffsetX || 0) : 0;
            const offY = hasPhoto ? (photo.labelOffsetY || 0) : 0;
            const curX = feat.centroid.x + offX;
            const curY = feat.centroid.y + offY;

            const pillW = Math.max(feat.name_bn.length * 12, feat.name_en.length * 7.5) + 16;
            const pillH = 30;
            const cls = isSelected 
                ? (hasPhoto ? 'ctg-district-label-wrap selected has-photo' : 'ctg-district-label-wrap selected') 
                : 'ctg-district-label-wrap';
            
            svgHTML += `
                <g class="${cls}" data-id="${feat.id}" transform="translate(${curX.toFixed(1)}, ${curY.toFixed(1)})" role="button" tabindex="-1" aria-hidden="true">
                    <rect class="ctg-district-label-pill" x="${(-pillW / 2).toFixed(1)}" y="${(-pillH / 2).toFixed(1)}" width="${pillW.toFixed(1)}" height="${pillH}" rx="8" />
                    <text class="ctg-district-label-text" x="0" y="-1">${feat.name_bn}</text>
                    <text class="ctg-district-label-sub" x="0" y="10">${feat.name_en}</text>
                </g>
            `;
        });
        svgHTML += `</g>`;
        
        svgHTML += `</svg>`;
        container.innerHTML = svgHTML;
        
        const svgEl = container.querySelector('svg');
        function getSvgPoint(clientX, clientY) {
            if (!svgEl) return { x: clientX, y: clientY };
            const pt = svgEl.createSVGPoint();
            pt.x = clientX;
            pt.y = clientY;
            const ctm = svgEl.getScreenCTM();
            if (!ctm) return { x: clientX, y: clientY };
            return pt.matrixTransform(ctm.inverse());
        }

        // 1. Direct Drag-and-Drop for Labels (Touch & Mouse with Window Tracking)
        const labels = container.querySelectorAll('.ctg-district-label-wrap');
        labels.forEach(l => {
            const id = l.getAttribute('data-id');
            const feat = projectedFeatures.find(f => f.id === id);
            let isDragging = false;
            let startP = { x: 0, y: 0 };
            let initOffset = { x: 0, y: 0 };
            let hasMoved = false;

            l.addEventListener('pointerdown', (e) => {
                const photo = state.photos && state.photos[id];
                if (!photo || !photo.dataUrl) return; // Only draggable when photo exists
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
                    
                    // Real-time 60fps SVG transform update
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
                toggleDistrict(id);
            });
        });

        // 2. Direct Photo Panning & Wheel Zooming on District Paths
        const paths = container.querySelectorAll('.ctg-district-path');
        paths.forEach(p => {
            const id = p.getAttribute('data-id');
            const feat = projectedFeatures.find(f => f.id === id);
            let isPanning = false;
            let startP = { x: 0, y: 0 };
            let initPan = { x: 0, y: 0 };
            let hasMoved = false;

            p.addEventListener('pointerdown', (e) => {
                const photo = state.photos && state.photos[id];
                // Only pan if district has uploaded photo
                if (!photo || !photo.dataUrl) return;
                if (e.button !== 0 && e.pointerType === 'mouse') return;
                
                // Auto-activate district dock if not already active
                if (state.activeDistrictId !== id) {
                    state.activeDistrictId = id;
                    renderDistrictDock();
                }

                isPanning = true;
                hasMoved = false;
                startP = getSvgPoint(e.clientX, e.clientY);
                initPan = { x: photo.panX || 0, y: photo.panY || 0 };
                p.classList.add('is-panning');
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
                    p.classList.remove('is-panning');
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
                if (state.activeDistrictId !== id) {
                    state.activeDistrictId = id;
                    renderDistrictDock();
                }

                const delta = e.deltaY < 0 ? 0.08 : -0.08;
                photo.zoom = Math.min(3.5, Math.max(0.4, +(photo.zoom + delta).toFixed(2)));
                
                // Update live image and dock
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
                const zoomEl = document.getElementById('dockDivZoomVal');
                if (zoomEl) zoomEl.textContent = `${Math.round(photo.zoom * 100)}%`;
                saveState();
                renderPoster();
            };

            p.addEventListener('wheel', handleWheelZoom, { passive: false });
            const matchingLabel = container.querySelector(`.ctg-district-label-wrap[data-id="${id}"]`);
            if (matchingLabel) {
                matchingLabel.addEventListener('wheel', handleWheelZoom, { passive: false });
            }

            // Landmark Tooltip on Hover/Touch
            const showTooltip = (ev) => {
                let tt = document.getElementById('divisionMapTooltip');
                if (!tt) {
                    tt = document.createElement('div');
                    tt.id = 'divisionMapTooltip';
                    tt.className = 'ctg-landmark-tooltip';
                    container.appendChild(tt);
                }
                const lmk = DISTRICT_LANDMARKS[id] || { bn: feat.name_bn, en: feat.name_en, highlights: 'চট্টগ্রাম বিভাগের ঐতিহাসিক ও নয়নাভিরাম জেলা' };
                const isSel = state.selected.includes(id);
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
                const tt = document.getElementById('divisionMapTooltip');
                if (tt) tt.style.display = 'none';
            };

            p.addEventListener('mouseenter', showTooltip);
            p.addEventListener('mousemove', showTooltip);
            p.addEventListener('mouseleave', hideTooltip);

            p.addEventListener('click', (e) => {
                hideTooltip();
                if (hasMoved) {
                    e.stopPropagation();
                    e.preventDefault();
                    hasMoved = false;
                    return;
                }
                toggleDistrict(id);
            });

            p.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleDistrict(id);
                }
            });
        });

        // 3. Mobile Touch Pinch-to-Zoom on Map Stage
        let pinchDist = null;
        let pinchBaseZoom = 1.0;

        container.addEventListener('touchstart', (e) => {
            if (e.touches.length === 2 && state.activeDistrictId) {
                const photo = state.photos && state.photos[state.activeDistrictId];
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
            if (e.touches.length === 2 && pinchDist && state.activeDistrictId) {
                const photo = state.photos && state.photos[state.activeDistrictId];
                const feat = projectedFeatures.find(f => f.id === state.activeDistrictId);
                if (photo && photo.dataUrl && feat && feat.bbox) {
                    const currentDist = Math.hypot(
                        e.touches[0].clientX - e.touches[1].clientX,
                        e.touches[0].clientY - e.touches[1].clientY
                    );
                    const ratio = currentDist / pinchDist;
                    photo.zoom = Math.min(3.5, Math.max(0.4, +(pinchBaseZoom * ratio).toFixed(2)));

                    const imgEl = container.querySelector(`image[data-id="${state.activeDistrictId}"]`);
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
                    const zoomEl = document.getElementById('dockDivZoomVal');
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

    // 6. Fast Selection Chips with Optional Photo Upload
    function renderDistrictChips() {
        const chipsEl = document.getElementById('divDistrictChips');
        if (!chipsEl) return;

        chipsEl.innerHTML = '';
        projectedFeatures.forEach(feat => {
            const isSelected = state.selected.includes(feat.id);
            const hasPhoto = !!(state.photos && state.photos[feat.id]);
            const row = document.createElement('div');
            row.className = 'ctg-div-chip-row';
            row.setAttribute('data-id', feat.id);

            row.innerHTML = `
                <button type="button" class="ctg-div-chip ${isSelected ? 'active' : ''}" data-id="${feat.id}" aria-pressed="${isSelected ? 'true' : 'false'}">
                    <span class="ctg-div-chip-check">${isSelected ? '✓' : '+'}</span>
                    <span class="ctg-div-chip-bn">${feat.name_bn}</span>
                    <span class="ctg-div-chip-en">${feat.name_en}</span>
                </button>
            `;

            const mainBtn = row.querySelector('.ctg-div-chip');
            if (mainBtn) {
                mainBtn.addEventListener('click', () => toggleDistrict(feat.id));
            }

            chipsEl.appendChild(row);
        });
    }

    function toggleDistrict(id) {
        const hasPhoto = !!(state.photos && state.photos[id] && state.photos[id].dataUrl);
        const idx = state.selected.indexOf(id);
        if (idx > -1) {
            if (state.activeDistrictId === id) {
                if (hasPhoto) {
                    // Photo Protection: If area has an uploaded photo, never delete or deselect on map click!
                    renderDistrictPhotoDock(id);
                    return;
                }
                state.selected.splice(idx, 1);
                state.activeDistrictId = null;
                renderDistrictPhotoDock(null);
            } else {
                state.activeDistrictId = id;
                renderDistrictPhotoDock(id);
            }
        } else {
            state.selected.push(id);
            state.activeDistrictId = id;
            renderDistrictPhotoDock(id);
            if (state.selected.length === Object.keys(DISTRICT_MAP).length) {
                if (typeof window.triggerGoldenConfetti === 'function') {
                    window.triggerGoldenConfetti();
                }
            }
        }
        saveState();
        renderInteractiveMap();
        renderDistrictChips();
        updateUI();
        renderPoster();
    }

    // Photo Management Engine (100% Optional Viewer Decision)
    function handleDistrictPhotoUpload(districtId, file) {
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
                state.photos[districtId] = {
                    dataUrl: dataUrl,
                    filename: file.name,
                    zoom: 1.0,
                    panX: 0,
                    panY: 0
                };

                if (!state.selected.includes(districtId)) {
                    state.selected.push(districtId);
                }
                state.activeDistrictId = districtId;

                saveState();
                renderInteractiveMap();
                renderDistrictChips();
                renderDistrictPhotoDock(districtId);
                updateUI();
                renderPoster();
                showToast('ছবি সফলভাবে যুক্ত হয়েছে!');
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    function adjustDistrictPhoto(districtId, action) {
        const photo = state.photos && state.photos[districtId];
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
                delete state.photos[districtId];
                saveState();
                renderInteractiveMap();
                renderDistrictChips();
                renderDistrictPhotoDock(districtId);
                updateUI();
                renderPoster();
                showToast('ছবি সরানো হয়েছে');
                return;
        }

        saveState();
        renderInteractiveMap();
        renderPoster();
        renderDistrictPhotoDock(districtId);
    }

    function renderDistrictPhotoDock(districtId) {
        const dock = document.getElementById('divAreaDockContainer') || document.getElementById('divDistrictPhotoDock');
        if (!dock) return;

        if (!districtId) {
            dock.style.display = 'none';
            dock.innerHTML = '';
            return;
        }

        const feat = projectedFeatures.find(f => f.id === districtId);
        if (!feat) {
            dock.style.display = 'none';
            dock.innerHTML = '';
            return;
        }

        const isVisited = state.selected.includes(districtId);
        const photo = state.photos && state.photos[districtId];
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
                                    <span class="ctg-dock-tag">${isVisited ? '✓ নির্বাচিত জেলা' : 'চিহ্নিত জেলা'}</span>
                                </div>
                                <strong class="ctg-dock-title">${feat.name_bn} <span class="ctg-dock-title-en">· ${feat.name_en}</span></strong>
                            </div>
                        </div>
                        <div class="ctg-dock-action-row">
                            <label class="ctg-dock-btn-upload" title="জেলার ভ্রমণ ছবি যোগ করুন">
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:-1px;margin-right:2px;" aria-hidden="true"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg><span>ছবি যোগ করুন</span>
                                <input type="file" accept="image/*" class="ctg-dock-file-input" style="display:none;">
                            </label>
                            <button type="button" class="ctg-dock-btn-keep" id="btnDivDockKeepAsIs" title="ছবি ছাড়া শুধু জেলা চিহ্নিত রাখুন">
                                <span>✓ এভাবেই রাখুন</span>
                            </button>
                            <button class="ctg-dock-btn-close" id="btnDivDockClose" title="বন্ধ করুন" aria-label="Close">✕</button>
                        </div>
                    </div>
                    <div class="ctg-dock-hint-banner" role="status">
                        ✨ চাইলে ভ্রমণ ছবি যোগ করতে পারেন, অথবা এভাবেই সোনালী মানচিত্রে সুন্দর রাখতে পারেন!
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
                            <button class="ctg-dock-btn-delete" id="btnDivDockDelete" title="ছবি মুছুন">
                                <span class="ctg-dock-action-icon">🗑️</span>
                                <span>মুছুন</span>
                            </button>
                            <button class="ctg-dock-btn-close" id="btnDivDockClose" title="বন্ধ করুন" aria-label="Close">✕</button>
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
                                <span class="ctg-dock-zoom-val" id="dockDivZoomVal">${zoomPct}%</span>
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

        const btnKeep = dock.querySelector('#btnDivDockKeepAsIs');
        if (btnKeep) {
            btnKeep.addEventListener('click', () => {
                state.activeDistrictId = null;
                dock.style.display = 'none';
                dock.innerHTML = '';
            });
        }

        const btnClose = dock.querySelector('#btnDivDockClose');
        if (btnClose) {
            btnClose.addEventListener('click', () => {
                state.activeDistrictId = null;
                dock.style.display = 'none';
                dock.innerHTML = '';
            });
        }

        const btnDel = dock.querySelector('#btnDivDockDelete');
        if (btnDel) {
            btnDel.addEventListener('click', () => {
                adjustDistrictPhoto(districtId, 'remove');
            });
        }

        const inlineInput = dock.querySelector('.ctg-dock-file-input');
        if (inlineInput) {
            inlineInput.addEventListener('change', (e) => {
                if (e.target.files && e.target.files[0]) {
                    handleDistrictPhotoUpload(districtId, e.target.files[0]);
                }
            });
        }

        dock.querySelectorAll('button[data-action]').forEach(btn => {
            btn.addEventListener('click', () => {
                const act = btn.getAttribute('data-action');
                adjustDistrictPhoto(districtId, act);
            });
        });
    }

    // 7. Unseen Bangladesh-Style Traveler Ranking & Gamification
    function getExplorerRank(count) {
        if (count === 0) {
            return { title: "নবাগত পর্যটক", en: "NEW EXPLORER", percent: "০%" };
        } else if (count <= 3) {
            return { title: "প্রারম্ভিক অভিযাত্রী", en: "ROOKIE EXPLORER", percent: convertToBanglaNum(Math.round((count/11)*100)) + "%" };
        } else if (count <= 7) {
            return { title: "চট্টগ্রাম অভিযাত্রী", en: "CHATTOGRAM VOYAGER", percent: convertToBanglaNum(Math.round((count/11)*100)) + "%" };
        } else if (count <= 10) {
            return { title: "অভিজ্ঞ পর্যটক", en: "PRO TRAVELER", percent: convertToBanglaNum(Math.round((count/11)*100)) + "%" };
        } else {
            return { title: "চট্টগ্রাম বিশারদ (মাস্টার)", en: "MASTER EXPLORER · TOP 1%", percent: "১০০%" };
        }
    }

    function convertToBanglaNum(numStr) {
        const bnDigits = ['০','১','২','৩','৪','৫','৬','৭','৮','৯'];
        return String(numStr).replace(/\d/g, match => bnDigits[parseInt(match)]);
    }

    function updateUI() {
        const count = state.selected.length;
        const countBn = convertToBanglaNum(count.toString().padStart(2, '0'));
        
        // Counter displays
        const countDisplay = document.getElementById('divStatCountDisplay');
        if (countDisplay) countDisplay.textContent = `${countBn} / ১১`;

        // Rank updates
        const rank = getExplorerRank(count);
        const rankTitle = document.getElementById('divRankTitle');
        const rankPercent = document.getElementById('divRankPercent');
        const rankBarFill = document.getElementById('divRankBarFill');
        if (rankTitle) rankTitle.textContent = rank.title;
        if (rankPercent) rankPercent.textContent = `${rank.percent} সম্পন্ন`;
        if (rankBarFill) rankBarFill.style.width = `${Math.min(100, Math.round((count / 11) * 100))}%`;

        // Inclusion Badge in Poster Studio
        const incText = document.getElementById('divInclusionText');
        if (incText) {
            incText.textContent = `${countBn}টি জেলা পোস্টারে অন্তর্ভুক্ত`;
        }

        // Title Input Sync & Live Poster Studio Title Sync
        const titleInput = document.getElementById('inputDivisionTitle');
        if (titleInput && titleInput.value !== state.title) {
            titleInput.value = state.title;
        }
        const charCounter = document.getElementById('divTitleCharCounter');
        if (charCounter && titleInput) {
            charCounter.textContent = `${convertToBanglaNum(titleInput.value.length)} / ৩৫`;
        }
        const liveTitle = document.getElementById('divPosterLiveTitle');
        if (liveTitle) {
            liveTitle.textContent = (state.title && state.title.trim()) ? state.title : "আমার চট্টগ্রাম বিভাগ";
        }

        // Live Poster Studio Bottom Stats Sync
        const liveCount = document.getElementById('divPosterLiveCount');
        if (liveCount) {
            liveCount.textContent = `${count.toString().padStart(2, '0')} / 11`;
        }
        const liveRank = document.getElementById('divPosterLiveRank');
        if (liveRank) {
            liveRank.textContent = `★ ${rank.title}`;
        }

        // Theme Button Active Sync
        document.querySelectorAll('#divThemeSelector .ctg-theme-btn, #divPosterQuickBar .ctg-quick-swatch-dot, #divFloatingThemeBar .ctg-mf-chip').forEach(btn => {
            const isMatch = btn.getAttribute('data-theme') === state.theme;
            btn.classList.toggle('active', isMatch);
            btn.setAttribute('aria-checked', isMatch ? 'true' : 'false');
        });

        // Quick Title Input Sync
        const qTitle = document.getElementById('inputDivQuickTitle');
        const btnResetQTitle = document.getElementById('btnResetDivQuickTitle');
        if (qTitle && qTitle.value !== state.title) {
            qTitle.value = state.title;
        }
        if (btnResetQTitle) {
            btnResetQTitle.style.display = (state.title !== 'আমার চট্টগ্রাম বিভাগ') ? 'flex' : 'none';
        }

        // Frame, Panels & Layout Theme Sync (Unified Studio Sync)
        const posterFrame = document.getElementById('divPosterFrame');
        if (posterFrame) {
            posterFrame.setAttribute('data-theme', state.theme);
        }
        const divPanel = document.querySelector('.ctg-division-panel');
        if (divPanel) {
            divPanel.setAttribute('data-theme', state.theme);
        }
        const controlsPanel = document.querySelector('.ctg-division-controls-panel');
        if (controlsPanel) {
            controlsPanel.setAttribute('data-theme', state.theme);
        }
        const layoutEl = document.querySelector('.ctg-division-layout');
        if (layoutEl) {
            layoutEl.setAttribute('data-theme', state.theme);
        }

        // Viral Caption Generation
        updateSocialCaption(count, rank);

        // Mobile Thumb Bar Sync (Experience 01 Districts)
        if (window.updateMobileThumbBar) {
            window.updateMobileThumbBar(count, '11', rank.title, 'exp1');
        }
    }

    function updateSocialCaption(count, rank) {
        const captionArea = document.getElementById('captionDivisionTextArea');
        if (!captionArea) return;

        const countBn = convertToBanglaNum(count);
        const selectedNames = projectedFeatures
            .filter(f => state.selected.includes(f.id))
            .map(f => f.name_bn)
            .join(', ');

        const photoCount = Object.keys(state.photos || {}).filter(id => state.selected.includes(id)).length;
        const photoNote = photoCount > 0 ? ` (${convertToBanglaNum(photoCount)}টি স্মৃতি ছবি সংযুক্ত)` : '';

        const text = count === 0
            ? `আমি এখনো চট্টগ্রাম বিভাগের সব জেলা ঘুরে দেখিনি। আপনি কয়টি ঘুরেছেন?\n\nনিজের চট্টগ্রাম ম্যাপ তৈরি করুন: ${window.location.origin}${window.location.pathname}#exp1\n\n#MyChattogram #SakibsCreation #Ghuraghuri`
            : `চট্টগ্রাম বিভাগের ১১টি জেলার মধ্যে আমি ${countBn}টি জেলা ঘুরে দেখেছি! (${rank.title})${photoNote}\n\nঘুরে আসা জেলাগুলো: ${selectedNames || 'সবগুলো'}\n\nআপনি কয়টি জেলা ঘুরেছেন? নিজের মানচিত্র তৈরি করুন: ${window.location.origin}${window.location.pathname}#exp1\n\n#MyChattogram #ChattogramDivision #TravelBangladesh #SakibsCreation`;

        captionArea.value = text;
    }

    // 8. Live Canvas 2D Poster Engine (1200 × 1500 px · 4:5 Portrait)
    async function renderPoster() {
        const canvas = document.getElementById('divisionPosterCanvas');
        if (!canvas) return;

        if (document.fonts && document.fonts.ready) {
            await document.fonts.ready;
        }

        // Preload any uploaded district photos
        const photoEntries = Object.entries(state.photos || {});
        if (photoEntries.length > 0) {
            await Promise.all(photoEntries.map(([id, p]) => {
                if (!p || !p.dataUrl) return Promise.resolve();
                return new Promise(resolve => {
                    const im = new Image();
                    im.onload = () => { p._img = im; resolve(); };
                    im.onerror = () => resolve();
                    im.src = p.dataUrl;
                });
            }));
        }

        const ctx = canvas.getContext('2d');
        const W = 1200;
        const H = 1500;
        canvas.width = W;
        canvas.height = H;

        const t = THEMES[state.theme] || THEMES.dark;

        // Base Background
        ctx.fillStyle = t.bg;
        ctx.fillRect(0, 0, W, H);

        // Ambient Radial Glows
        const gradTop = ctx.createRadialGradient(W * 0.25, H * 0.12, 0, W * 0.25, H * 0.12, 650);
        gradTop.addColorStop(0, t.glowTop);
        gradTop.addColorStop(1, 'transparent');
        ctx.fillStyle = gradTop;
        ctx.fillRect(0, 0, W, H);

        const gradBot = ctx.createRadialGradient(W * 0.75, H * 0.88, 0, W * 0.75, H * 0.88, 750);
        gradBot.addColorStop(0, t.glowBot);
        gradBot.addColorStop(1, 'transparent');
        ctx.fillStyle = gradBot;
        ctx.fillRect(0, 0, W, H);

        // Technical Grid Pattern
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.025)';
        ctx.lineWidth = 1;
        const gridSize = 48;
        for (let x = 0; x < W; x += gridSize) {
            ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
        }
        for (let y = 0; y < H; y += gridSize) {
            ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
        }

        // Main Title (Left/Center balanced with top-right rating)
        ctx.fillStyle = t.textPrimary;
        ctx.font = 'bold 50px "Plus Jakarta Sans", "Hind Siliguri", sans-serif';
        ctx.textAlign = 'left';
        ctx.letterSpacing = '-0.5px';
        ctx.fillText(state.title || "আমার চট্টগ্রাম বিভাগ", 80, 105);

        // Subtitle
        ctx.fillStyle = t.textMuted;
        ctx.font = '500 20px "Hind Siliguri", sans-serif';
        ctx.textAlign = 'left';
        ctx.letterSpacing = '0px';
        ctx.fillText("১১টি জেলার ব্যক্তিগত ভ্রমণ মানচিত্র", 80, 142);

        // Top-Right Floating Rating & Progress Badge
        const ratingW = 270;
        const ratingH = 110;
        const ratingX = W - 80 - ratingW;
        const ratingY = 55;

        ctx.fillStyle = (state.theme === 'mono') ? 'rgba(20, 20, 20, 0.85)' : 'rgba(8, 26, 19, 0.82)';
        ctx.beginPath();
        if (typeof ctx.roundRect === 'function') {
            ctx.roundRect(ratingX, ratingY, ratingW, ratingH, 16);
        } else {
            ctx.rect(ratingX, ratingY, ratingW, ratingH);
        }
        ctx.fill();

        ctx.strokeStyle = (state.theme === 'mono') ? 'rgba(255, 255, 255, 0.25)' : 'rgba(233, 196, 106, 0.35)';
        ctx.lineWidth = 1.2;
        ctx.stroke();

        // Big Count inside Top-Right Badge
        const count = state.selected.length;
        const countStr = count.toString().padStart(2, '0');
        ctx.fillStyle = t.accent;
        ctx.font = 'bold 44px "Plus Jakarta Sans", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`${countStr} / 11`, ratingX + ratingW / 2, ratingY + 46);

        ctx.fillStyle = t.textMuted;
        ctx.font = 'bold 10.5px "Plus Jakarta Sans", sans-serif';
        ctx.letterSpacing = '2px';
        ctx.fillText('DISTRICTS EXPLORED', ratingX + ratingW / 2, ratingY + 68);

        // Rank Badge inside Top-Right Badge
        const rank = getExplorerRank(count);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
        ctx.font = 'bold 12px "Hind Siliguri", sans-serif';
        const rankW = ctx.measureText(`★ ${rank.title}`).width + 22;
        ctx.beginPath();
        if (typeof ctx.roundRect === 'function') {
            ctx.roundRect(ratingX + ratingW / 2 - rankW / 2, ratingY + 77, rankW, 22, 11);
        } else {
            ctx.rect(ratingX + ratingW / 2 - rankW / 2, ratingY + 77, rankW, 22);
        }
        ctx.fill();

        ctx.fillStyle = t.textPrimary;
        ctx.textAlign = 'center';
        ctx.fillText(`★ ${rank.title}`, ratingX + ratingW / 2, ratingY + 93);

        // Top Divider Line
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(80, 180);
        ctx.lineTo(W - 80, 180);
        ctx.stroke();

        // Scaled Cartography Map (Significantly Larger with Full Vertical Clearance)
        const mapScale = 1.34;
        const mapOffsetX = (W - SVG_WIDTH * mapScale) / 2;
        const mapOffsetY = 195;

        // PASS 1: Base District Polygons & Clipped Photos
        projectedFeatures.forEach(feat => {
            const isSelected = state.selected.includes(feat.id);
            const photo = state.photos && state.photos[feat.id];
            
            ctx.beginPath();
            feat.commands.forEach(c => {
                const px = mapOffsetX + c.x * mapScale;
                const py = mapOffsetY + c.y * mapScale;
                if (c.type === 'M') ctx.moveTo(px, py);
                else if (c.type === 'L') ctx.lineTo(px, py);
                else if (c.type === 'Z') ctx.closePath();
            });

            // Fill
            if (isSelected) {
                ctx.fillStyle = t.accent;
            } else {
                ctx.fillStyle = t.unselectedFill;
            }
            ctx.fill();

            // Photo Clipping if photo is uploaded for this selected district
            if (isSelected && photo && photo.dataUrl && feat.bbox) {
                ctx.save();
                ctx.clip(); // Clips inside the current district path!

                const img = photo._img || new Image();
                if (!photo._img) img.src = photo.dataUrl;
                if (img.complete && img.naturalWidth > 0) {
                    const zoom = (typeof photo.zoom === 'number') ? photo.zoom : 1.0;
                    const panX = (typeof photo.panX === 'number') ? photo.panX : 0;
                    const panY = (typeof photo.panY === 'number') ? photo.panY : 0;
                    
                    const bw = feat.bbox.width * mapScale * zoom;
                    const bh = feat.bbox.height * mapScale * zoom;
                    const cx = mapOffsetX + (feat.bbox.minX + feat.bbox.width / 2) * mapScale + panX;
                    const cy = mapOffsetY + (feat.bbox.minY + feat.bbox.height / 2) * mapScale + panY;
                    
                    const imgAspect = img.naturalWidth / img.naturalHeight;
                    const boxAspect = bw / bh;
                    let sw, sh;
                    if (boxAspect > imgAspect) {
                        sw = bw;
                        sh = bw / imgAspect;
                    } else {
                        sh = bh;
                        sw = bh * imgAspect;
                    }
                    
                    const posX = cx - sw / 2;
                    const posY = cy - sh / 2;
                    ctx.drawImage(img, posX, posY, sw, sh);
                    
                    // Subtle protective vignette overlay so label stands out
                    ctx.fillStyle = 'rgba(0, 0, 0, 0.22)';
                    ctx.fill();
                }
                ctx.restore();
            }

            // Stroke
            ctx.lineWidth = isSelected ? 3 : 1.5;
            ctx.strokeStyle = isSelected ? t.bg : t.unselectedBorder;
            ctx.stroke();
        });

        // PASS 2: District Labels (Strictly on top of all polygons)
        projectedFeatures.forEach(feat => {
            const isSelected = state.selected.includes(feat.id);
            const photo = state.photos && state.photos[feat.id];
            const hasPhoto = isSelected && photo && photo.dataUrl;

            if (hasPhoto && photo.hideLabel) {
                return; // Label hidden to let full photo shine unobstructed
            }

            const offX = hasPhoto ? ((photo.labelOffsetX || 0) * mapScale) : 0;
            const offY = hasPhoto ? ((photo.labelOffsetY || 0) * mapScale) : 0;
            const cx = mapOffsetX + feat.centroid.x * mapScale + offX;
            const cy = mapOffsetY + feat.centroid.y * mapScale + offY;

            if (isSelected) {
                // Sleek Floating Glass Pill for Label
                ctx.font = 'bold 18px "Hind Siliguri", sans-serif';
                const bnWidth = ctx.measureText(feat.name_bn).width;
                ctx.font = 'bold 11px "Plus Jakarta Sans", sans-serif';
                const enWidth = ctx.measureText(feat.name_en.toUpperCase()).width;
                const pillW = Math.max(bnWidth, enWidth) + 32;
                const pillH = 44;

                // Solid Opaque Pill Background to prevent polygon bleed
                ctx.fillStyle = (state.theme === 'mono') ? 'rgba(10, 10, 10, 0.98)' : 'rgba(6, 19, 14, 0.96)';
                ctx.beginPath();
                if (typeof ctx.roundRect === 'function') {
                    ctx.roundRect(cx - pillW / 2, cy - pillH / 2, pillW, pillH, 10);
                } else {
                    ctx.rect(cx - pillW / 2, cy - pillH / 2, pillW, pillH);
                }
                ctx.fill();

                ctx.strokeStyle = (state.theme === 'mono') ? '#ffffff' : t.accent;
                ctx.lineWidth = 1.5;
                ctx.stroke();

                // Text
                ctx.fillStyle = '#ffffff';
                ctx.font = 'bold 16px "Hind Siliguri", sans-serif';
                ctx.textAlign = 'center';
                ctx.fillText(feat.name_bn, cx, cy - 2);

                ctx.fillStyle = (state.theme === 'mono') ? '#cccccc' : t.accent;
                ctx.font = 'bold 10px "Plus Jakarta Sans", sans-serif';
                ctx.letterSpacing = '1px';
                ctx.fillText(feat.name_en.toUpperCase(), cx, cy + 12);
            } else {
                // Small subtle centroid pip for unselected
                ctx.beginPath();
                ctx.arc(cx, cy, 2.5, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
                ctx.fill();
            }
        });

        // Minimal Clean Split Footer Branding
        ctx.fillStyle = t.textDim;
        ctx.font = 'bold 15px "Plus Jakarta Sans", sans-serif';
        if ('letterSpacing' in ctx) ctx.letterSpacing = '3px';
        ctx.textAlign = 'left';
        ctx.fillText('#MYCHATTOGRAM', 80, H - 55);
        if ('letterSpacing' in ctx) ctx.letterSpacing = '0px';

        ctx.fillStyle = t.accent;
        ctx.font = 'bold 15px "Plus Jakarta Sans", sans-serif';
        if ('letterSpacing' in ctx) ctx.letterSpacing = '3px';
        ctx.textAlign = 'right';
        ctx.fillText("● SAKIB'S CREATION", W - 80, H - 55);
        if ('letterSpacing' in ctx) ctx.letterSpacing = '0px';
    }

    // 9. Event Binding
    function bindEvents() {
        const btnClear = document.getElementById('btnClearDivision');
        if (btnClear) {
            btnClear.addEventListener('click', () => {
                state.selected = [];
                state.activeDistrictId = null;
                renderDistrictPhotoDock(null);
                saveState();
                renderInteractiveMap();
                renderDistrictChips();
                updateUI();
                renderPoster();
            });
        }

        // Title Input Event & Real-time Live Poster Card Sync
        const titleInput = document.getElementById('inputDivisionTitle');
        if (titleInput) {
            titleInput.addEventListener('input', (e) => {
                state.title = e.target.value.slice(0, 35);
                saveState();
                const charCounter = document.getElementById('divTitleCharCounter');
                if (charCounter) {
                    charCounter.textContent = `${convertToBanglaNum(state.title.length)} / ৩৫`;
                }
                const liveTitle = document.getElementById('divPosterLiveTitle');
                if (liveTitle) {
                    liveTitle.textContent = (state.title && state.title.trim()) ? state.title : 'আমার চট্টগ্রাম বিভাগ';
                }
                renderPoster();
            });
        }

        const btnResetTitle = document.getElementById('btnResetDivTitle');
        if (btnResetTitle && titleInput) {
            btnResetTitle.addEventListener('click', () => {
                state.title = 'আমার চট্টগ্রাম বিভাগ';
                titleInput.value = state.title;
                const qTitle = document.getElementById('inputDivQuickTitle');
                if (qTitle) qTitle.value = state.title;
                const liveTitle = document.getElementById('divPosterLiveTitle');
                if (liveTitle) {
                    liveTitle.textContent = state.title;
                }
                saveState();
                updateUI();
                renderPoster();
            });
        }

        // Quick Title Input & Reset
        const qTitleInput = document.getElementById('inputDivQuickTitle');
        const btnResetQTitle = document.getElementById('btnResetDivQuickTitle');
        if (qTitleInput) {
            qTitleInput.addEventListener('input', (e) => {
                state.title = e.target.value.trim() || 'আমার চট্টগ্রাম বিভাগ';
                if (titleInput && titleInput.value !== e.target.value) {
                    titleInput.value = e.target.value;
                }
                const liveTitle = document.getElementById('divPosterLiveTitle');
                if (liveTitle) liveTitle.textContent = state.title;
                if (btnResetQTitle) {
                    btnResetQTitle.style.display = (e.target.value !== 'আমার চট্টগ্রাম বিভাগ' && e.target.value.length > 0) ? 'flex' : 'none';
                }
                saveState();
                renderPoster();
            });
        }
        if (btnResetQTitle && qTitleInput) {
            btnResetQTitle.addEventListener('click', () => {
                state.title = 'আমার চট্টগ্রাম বিভাগ';
                qTitleInput.value = state.title;
                if (titleInput) titleInput.value = state.title;
                const liveTitle = document.getElementById('divPosterLiveTitle');
                if (liveTitle) liveTitle.textContent = state.title;
                btnResetQTitle.style.display = 'none';
                saveState();
                updateUI();
                renderPoster();
            });
        }

        // Theme Switcher Buttons (Sidebar & Mobile Quick Bar)
        document.querySelectorAll('#divThemeSelector .ctg-theme-btn, #divPosterQuickBar .ctg-quick-swatch-dot, #divFloatingThemeBar .ctg-mf-chip').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const themeKey = btn.getAttribute('data-theme');
                if (THEMES[themeKey]) {
                    state.theme = themeKey;
                    saveState();
                    updateUI();
                    renderPoster();
                }
            });
        });

        // Select All & Clear Handlers for Division
        const btnSelectAllDiv = document.getElementById('btnSelectAllDivision');
        if (btnSelectAllDiv) {
            btnSelectAllDiv.addEventListener('click', () => {
                state.selected = Object.keys(DISTRICT_MAP).map(k => DISTRICT_MAP[k].id);
                if (typeof window.triggerGoldenConfetti === 'function') {
                    window.triggerGoldenConfetti();
                }
                saveState();
                renderInteractiveMap();
                renderDistrictChips();
                updateUI();
                renderPoster();
            });
        }

        const btnClearDiv = document.getElementById('btnClearDivision');
        if (btnClearDiv) {
            btnClearDiv.addEventListener('click', () => {
                state.selected = [];
                state.activeDistrictId = null;
                renderDistrictPhotoDock(null);
                saveState();
                renderInteractiveMap();
                renderDistrictChips();
                updateUI();
                renderPoster();
            });
        }

        // Multi-Format Download Handlers (PNG, JPG 100%, PDF)
        const setupDownloadBtn = (id, format) => {
            const btn = document.getElementById(id);
            if (btn) {
                btn.addEventListener('click', () => downloadPosterFile(format));
            }
        };

        setupDownloadBtn('btnDownloadDivPng', 'png');
        setupDownloadBtn('btnDownloadDivJpg', 'jpg');
        setupDownloadBtn('btnDownloadDivPdf', 'pdf');
        setupDownloadBtn('btnDownloadDivisionPoster', 'png');

        // Copy Caption Handler
        const btnCopyCaption = document.getElementById('btnCopyDivisionCaption');
        if (btnCopyCaption) {
            btnCopyCaption.addEventListener('click', () => {
                const captionArea = document.getElementById('captionDivisionTextArea');
                if (!captionArea) return;

                captionArea.select();
                navigator.clipboard.writeText(captionArea.value).then(() => {
                    const btnText = document.getElementById('copyDivBtnText');
                    if (btnText) {
                        const original = btnText.textContent;
                        btnText.textContent = 'কপি হয়েছে! ✓';
                        setTimeout(() => { btnText.textContent = original; }, 2000);
                    }
                }).catch(() => {
                    document.execCommand('copy');
                });
            });
        }

        // Web Share API Handler
        const btnShareDiv = document.getElementById('btnWebShareDivision');
        if (btnShareDiv && navigator.share) {
            btnShareDiv.style.display = 'inline-flex';
            btnShareDiv.addEventListener('click', () => {
                const canvas = document.getElementById('divisionPosterCanvas');
                const captionArea = document.getElementById('captionDivisionTextArea');
                const text = captionArea ? captionArea.value : '';
                if (canvas && canvas.toBlob && navigator.canShare) {
                    canvas.toBlob((blob) => {
                        const file = new File([blob], 'my-chattogram-division.png', { type: 'image/png' });
                        if (navigator.canShare({ files: [file] })) {
                            navigator.share({
                                title: 'My Chattogram Division',
                                text: text,
                                files: [file]
                            }).catch(() => {});
                            return;
                        }
                        navigator.share({
                            title: 'My Chattogram Division',
                            text: text,
                            url: window.location.href
                        }).catch(() => {});
                    }, 'image/png');
                } else {
                    navigator.share({
                        title: 'My Chattogram Division',
                        text: text,
                        url: window.location.href
                    }).catch(() => {});
                }
            });
        }

        // Optional District Photo File Input Handler
        const photoFileInput = document.getElementById('inputDistrictPhotoFile');
        if (photoFileInput) {
            photoFileInput.addEventListener('change', (e) => {
                if (e.target.files && e.target.files[0] && state.activeDistrictId) {
                    handleDistrictPhotoUpload(state.activeDistrictId, e.target.files[0]);
                }
            });
        }
    }

    // Multi-Format Lossless Exporter Engine
    function downloadPosterFile(format) {
        const canvas = document.getElementById('divisionPosterCanvas');
        if (!canvas) return;

        renderPoster();

        const timestamp = new Date().toISOString().slice(0, 10);
        const rawTitle = (state.title && state.title.trim()) ? state.title.trim() : 'My-Chattogram-Division';
        const sanitizedTitle = rawTitle.replace(/[^a-zA-Z0-9\u0980-\u09FF\-_]+/g, '-').replace(/^-+|-+$/g, '') || 'My-Chattogram';
        const baseFileName = `${sanitizedTitle}-${state.theme}-${timestamp}`;

        if (format === 'png') {
            const dataUrl = canvas.toDataURL('image/png');
            triggerDownload(dataUrl, `${baseFileName}.png`);
            showToast('✓ PNG পোস্টার ডাউনলোড শুরু হয়েছে (Ultra HD)');
        } else if (format === 'jpg' || format === 'jpeg') {
            // User requested 100% quality:
            const dataUrl = canvas.toDataURL('image/jpeg', 1.0);
            triggerDownload(dataUrl, `${baseFileName}.jpg`);
            showToast('✓ JPG পোস্টার ডাউনলোড সম্পন্ন (১০০% কোয়ালিটি)');
        } else if (format === 'pdf') {
            generateAndDownloadPdf(canvas, `${baseFileName}.pdf`);
        }
    }

    function triggerDownload(url, filename) {
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    function generateAndDownloadPdf(canvas, filename) {
        try {
            if (window.jspdf && window.jspdf.jsPDF) {
                const { jsPDF } = window.jspdf;
                // 4:5 Aspect Ratio Document in mm (210 x 262.5 mm)
                const pdf = new jsPDF({
                    orientation: 'portrait',
                    unit: 'mm',
                    format: [210, 262.5]
                });
                const imgData = canvas.toDataURL('image/jpeg', 1.0);
                pdf.addImage(imgData, 'JPEG', 0, 0, 210, 262.5);
                pdf.save(filename);
                showToast('✓ PDF পোস্টার তৈরি সম্পন্ন (প্রিন্ট রেডি)');
                return;
            }
        } catch(err) {
            console.warn('Direct jsPDF generation failed, using print fallback', err);
        }

        // Print-ready fallback
        const printWindow = window.open('', '_blank');
        if (printWindow) {
            const imgData = canvas.toDataURL('image/jpeg', 1.0);
            printWindow.document.write(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>${filename}</title>
                    <style>
                        @page { size: 210mm 262.5mm; margin: 0; }
                        body { margin: 0; background: #000; display: flex; align-items: center; justify-content: center; min-height: 100vh; }
                        img { width: 100%; max-width: 210mm; height: auto; display: block; }
                    </style>
                </head>
                <body>
                    <img src="${imgData}" onload="window.print();" />
                </body>
                </html>
            `);
            printWindow.document.close();
            showToast('✓ PDF প্রিন্ট উইন্ডো ওপেন হয়েছে');
        }
    }

    function showToast(msg) {
        let toast = document.getElementById('ctgGlobalToast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'ctgGlobalToast';
            toast.style.cssText = 'position:fixed;bottom:24px;left:50%;transform:translateX(-50%) translateY(20px);background:rgba(6,19,14,0.94);border:1px solid #e9c46a;color:#ffffff;padding:9px 18px;border-radius:99px;font-family:"Hind Siliguri",sans-serif;font-size:13px;font-weight:600;box-shadow:0 10px 30px rgba(0,0,0,0.6);z-index:99999;opacity:0;transition:all 0.3s cubic-bezier(0.16,1,0.3,1);pointer-events:none;backdrop-filter:blur(10px);';
            document.body.appendChild(toast);
        }
        toast.textContent = msg;
        toast.style.opacity = '1';
        toast.style.transform = 'translateX(-50%) translateY(0)';
        clearTimeout(toast._timeout);
        toast._timeout = setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(-50%) translateY(20px)';
        }, 2800);
    }

    // Expose for multi-experience switcher & automated testing
    window.renderDivisionPoster = renderPoster;
    window.updateDivisionUI = updateUI;
    window.handleDistrictPhotoUpload = handleDistrictPhotoUpload;
    window.adjustDistrictPhoto = adjustDistrictPhoto;
    window.ctgDivisionEngine = {
        state: state,
        saveState: saveState,
        renderInteractiveMap: renderInteractiveMap,
        renderDistrictChips: renderDistrictChips,
        renderDistrictPhotoDock: renderDistrictPhotoDock,
        renderPoster: renderPoster,
        handleDistrictPhotoUpload: handleDistrictPhotoUpload,
        adjustDistrictPhoto: adjustDistrictPhoto
    };

    window.addEventListener('DOMContentLoaded', () => {
        loadState();
        updateUI();
        loadGeometry();
    });

})();
