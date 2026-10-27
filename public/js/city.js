/**
 * MY CHATTOGRAM CITY (EXPERIENCE 04) ENGINE
 * Dual-language engine: Authentic Chattōgaiyā ⇄ Standard Bengali
 * Pothochitro-inspired optional client-side photo upload & 3-format export engine
 * Scoped safely, zero global pollution
 */

(function() {
    'use strict';

    const STORAGE_KEY = 'ghuraghuri_ctg_city_progress';

    // State
    const state = {
        lang: 'chatgaya', // 'chatgaya' or 'standard_bn'
        theme: 'pothochitro', // 'pothochitro', 'dark', 'emerald', 'ochre'
        visited: new Set(),
        photos: {}, // placeId -> { dataUrl, filename }
        activeAreaId: null, // Currently selected area for floating dock
        thanaFilter: '',
        categoryFilter: '',
        areaFilter: 'all',
        searchQuery: '',
        posterTitle: '',
        authorName: '',
        posterMode: 'map', // 'map' or 'collage'
        isPlayingAudio: false,
        isUserPaused: false
    };

    // Audio synthesizer & player
    let audioCtx = null;
    let audioInterval = null;
    let localAudioElem = null;

    function init() {
        if (!window.ctgCityData) {
            console.error('[CityEngine] ctgCityData not found!');
            return;
        }

        loadState();
        populateFilters();
        renderPlacesList();
        setupEventListeners();
        updateUI();
        if (isExp3Active()) {
            attemptAutoplay();
        } else {
            forceSilence();
        }

        console.log('[CityEngine] Experience 04 initialized successfully');
    }

    // 1. Persistence
    function loadState() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (raw) {
                const parsed = JSON.parse(raw);
                const validPlaces = (window.ctgCityData && window.ctgCityData.places) ? window.ctgCityData.places : [];
                const validIds = new Set(validPlaces.map(p => p.id));
                if (Array.isArray(parsed.visited)) {
                    state.visited = new Set(parsed.visited.filter(id => validIds.has(id)));
                }
                if (parsed.photos && typeof parsed.photos === 'object') {
                    state.photos = {};
                    for (const id in parsed.photos) {
                        if (validIds.has(id)) {
                            state.photos[id] = parsed.photos[id];
                        }
                    }
                }
                if (parsed.theme) state.theme = parsed.theme;
                if (parsed.lang) state.lang = parsed.lang;
                if (parsed.posterTitle) state.posterTitle = parsed.posterTitle;
                if (parsed.authorName) state.authorName = parsed.authorName;
                if (parsed.posterMode) state.posterMode = parsed.posterMode;
            }
        } catch (e) {
            console.warn('[CityEngine] Could not load state from localStorage:', e);
        }

        const dict = window.ctgCityData.dictionary[state.lang];
        if (!state.posterTitle || (state.lang === 'chatgaya' && state.posterTitle === 'আমার চট্টগ্রাম শহর')) {
            state.posterTitle = dict.posterDefaultTitle;
        }
    }

    function saveState() {
        try {
            const toSave = {
                visited: Array.from(state.visited),
                photos: state.photos,
                theme: state.theme,
                lang: state.lang,
                posterTitle: state.posterTitle,
                authorName: state.authorName,
                posterMode: state.posterMode
            };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
        } catch (e) {
            console.warn('[CityEngine] Could not save state to localStorage:', e);
        }
    }

    // Strict Experience 03 View Guard (Prevents ANY audio leakage on landing page or other experiences)
    function isExp3Active() {
        if (typeof window.__currentCtgExp !== 'undefined') {
            return window.__currentCtgExp === 'exp3';
        }
        if (window.location.hash && window.location.hash !== '#exp3') {
            return false;
        }
        const exp3View = document.getElementById('experience3View');
        if (!exp3View) return false;
        const disp = window.getComputedStyle ? window.getComputedStyle(exp3View).display : exp3View.style.display;
        return disp === 'block';
    }

    // 2. Authentic Folk Audio Player ("কালুরঘাটত্তুন চইড়্যে বাস") — Pure Headless Audio (0:13 Start)
    let ytPlayer = null;
    let ytApiInitialized = false;
    let ytPendingPlay = false;
    let unlockListenerAttached = false;
    const SONG_START_SECONDS = 13; // Skip Coke Studio intro talk; start right when instrumentals begin at 13s

    function cleanupUnlockListeners() {
        if (unlockListenerAttached) {
            window.removeEventListener('click', unlockOnInteraction, true);
            window.removeEventListener('touchstart', unlockOnInteraction, true);
            unlockListenerAttached = false;
        }
    }

    function unlockOnInteraction(e) {
        // Strict Navigation Guard: If clicking navigation pills, back home or cards, ABORT immediately!
        if (e && e.target && e.target.closest && e.target.closest('.ctg-exp-nav-pill, .ctg-btn-back-home, .ctg-exp-card, #btnExp1, #btnExp2, #btnExp4, .ctg-back-btn, [data-exp]')) {
            cleanupUnlockListeners();
            return;
        }
        // If not actively inside Exp 3, or if paused by user, IMMEDIATELY abort and clean up
        if (!isExp3Active() || window.__currentCtgExp !== 'exp3' || state.isUserPaused) {
            cleanupUnlockListeners();
            return;
        }
        if (e && e.target && e.target.closest && e.target.closest('#btnToggleCityAudio, #btnFloatingPlayPause, #ctgFloatingAudioPill')) {
            return;
        }
        if (!state.isPlayingAudio) {
            startAudioPlayback();
        }
        cleanupUnlockListeners();
    }

    let songStartWatchdog = null;
    function enforceSongStartTime(player) {
        if (!player) return;
        try {
            if (typeof player.mute === 'function') player.mute();
            if (typeof player.seekTo === 'function') player.seekTo(SONG_START_SECONDS, true);

            if (songStartWatchdog) clearInterval(songStartWatchdog);
            const startTime = Date.now();
            songStartWatchdog = setInterval(() => {
                try {
                    if (!player || typeof player.getCurrentTime !== 'function') {
                        clearInterval(songStartWatchdog);
                        songStartWatchdog = null;
                        return;
                    }
                    const cur = player.getCurrentTime();
                    if (cur < SONG_START_SECONDS - 0.2) {
                        player.mute();
                        player.seekTo(SONG_START_SECONDS, true);
                    } else {
                        // Reached 13 seconds! Unmute and let folk rhythm kick in
                        if (!state.isUserPaused && isExp3Active() && window.__currentCtgExp === 'exp3') {
                            player.unMute();
                            player.setVolume(100);
                        }
                        clearInterval(songStartWatchdog);
                        songStartWatchdog = null;
                    }
                    if (Date.now() - startTime > 3500) {
                        clearInterval(songStartWatchdog);
                        songStartWatchdog = null;
                        if (!state.isUserPaused && isExp3Active() && window.__currentCtgExp === 'exp3') {
                            player.unMute();
                            player.setVolume(100);
                        }
                    }
                } catch (e) {
                    clearInterval(songStartWatchdog);
                    songStartWatchdog = null;
                }
            }, 50);
        } catch (err) {
            console.warn('[CityEngine] enforceSongStartTime note:', err);
        }
    }

    function initYtPlayer(onReadyCb, isPrewarm = false) {
        if (ytPlayer && typeof ytPlayer.playVideo === 'function') {
            if (onReadyCb && typeof onReadyCb === 'function') onReadyCb(ytPlayer);
            return;
        }
        const playerDiv = document.getElementById('cityBgMusicPlayer');
        if (!playerDiv || !window.YT || !window.YT.Player) return;

        try {
            ytApiInitialized = true;
            ytPlayer = new YT.Player('cityBgMusicPlayer', {
                height: '180',
                width: '240',
                videoId: 'LQ3677p5NWg',
                host: 'https://www.youtube.com',
                playerVars: {
                    origin: window.location.origin,
                    autoplay: 0,
                    start: SONG_START_SECONDS,
                    controls: 0,
                    playsinline: 1,
                    rel: 0,
                    modestbranding: 1,
                    disablekb: 1,
                    enablejsapi: 1
                },
                events: {
                    onReady: function(e) {
                        console.log('[CityEngine] YouTube Folk Audio pre-warmed & ready (start @ 13s)');
                        try {
                            const iframe = e.target.getIFrame ? e.target.getIFrame() : document.querySelector('#cityBgMusicPlayerContainer iframe');
                            if (iframe) {
                                iframe.setAttribute('allow', 'autoplay; encrypted-media');
                            }
                            // HARDENED SILENCE GUARD: If not actively inside Exp 3 or user paused, strictly mute & pause!
                            if (!isExp3Active() || window.__currentCtgExp !== 'exp3' || state.isUserPaused) {
                                try {
                                    if (typeof e.target.mute === 'function') e.target.mute();
                                    if (typeof e.target.pauseVideo === 'function') e.target.pauseVideo();
                                } catch (silenceErr) {}
                                ytPendingPlay = false;
                                return;
                            }
                            enforceSongStartTime(e.target);
                            if (ytPendingPlay && !state.isUserPaused && isExp3Active() && window.__currentCtgExp === 'exp3') {
                                ytPendingPlay = false;
                                e.target.playVideo();
                            } else {
                                ytPendingPlay = false;
                            }
                        } catch (err) {
                            console.warn('[CityEngine] onReady note:', err);
                        }
                        if (onReadyCb && typeof onReadyCb === 'function') {
                            onReadyCb(e.target);
                        }
                    },
                    onStateChange: function(e) {
                        if (e.data === YT.PlayerState.PLAYING) {
                            // If playing while NOT on Exp 3, kill audio and mute immediately!
                            if (!isExp3Active() || window.__currentCtgExp !== 'exp3' || state.isUserPaused) {
                                try {
                                    if (typeof e.target.mute === 'function') e.target.mute();
                                    if (typeof e.target.stopVideo === 'function') e.target.stopVideo();
                                    if (typeof e.target.pauseVideo === 'function') e.target.pauseVideo();
                                } catch (err) {}
                                state.isPlayingAudio = false;
                            } else {
                                state.isPlayingAudio = true;
                                if (typeof e.target.getCurrentTime === 'function' && e.target.getCurrentTime() < SONG_START_SECONDS - 0.2) {
                                    enforceSongStartTime(e.target);
                                } else {
                                    e.target.unMute();
                                    e.target.setVolume(100);
                                }
                            }
                            updateAudioButtonUI();
                        } else if (e.data === YT.PlayerState.PAUSED || e.data === YT.PlayerState.ENDED) {
                            state.isPlayingAudio = false;
                            updateAudioButtonUI();
                        }
                    },
                    onError: function(e) {
                        console.warn('[CityEngine] YouTube Player note (error ' + e.data + ')');
                    }
                }
            });
        } catch (err) {
            console.warn('[CityEngine] YT Player instantiation note:', err);
        }
    }

    // Click-to-load YouTube facade: do NOT load scripts or pre-warm until user clicks play
    window.__ytIframeApiReady = false;
    let ytScriptLoading = false;

    function loadYtScriptAndInit(onReadyCb) {
        if (window.YT && window.YT.Player) {
            initYtPlayer(onReadyCb, false);
            return;
        }
        if (ytScriptLoading) return;
        ytScriptLoading = true;

        window.onYouTubeIframeAPIReady = function() {
            window.__ytIframeApiReady = true;
            ytScriptLoading = false;
            initYtPlayer(onReadyCb, false);
        };

        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        tag.async = true;
        document.head.appendChild(tag);
    }

    function setupAudio() {
        // Dormant by default: no background pre-warming to save initial network & memory
    }

    let folkAudioCtx = null;
    function playAmbientFolkChime() {
        // STRICT GUARD: Never play chord chime if not on Experience 3
        if (!isExp3Active()) return;

        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (!AudioContext) return;
            if (!folkAudioCtx) folkAudioCtx = new AudioContext();
            if (folkAudioCtx.state === 'suspended') folkAudioCtx.resume();

            // Warm folk tuning chord (E4, B4, E5)
            const freqs = [329.63, 493.88, 659.25];
            freqs.forEach((freq, idx) => {
                const osc = folkAudioCtx.createOscillator();
                const gain = folkAudioCtx.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, folkAudioCtx.currentTime);
                gain.gain.setValueAtTime(0, folkAudioCtx.currentTime);
                gain.gain.linearRampToValueAtTime(0.04 / (idx + 1), folkAudioCtx.currentTime + 0.15);
                gain.gain.exponentialRampToValueAtTime(0.0001, folkAudioCtx.currentTime + 2.5);
                osc.connect(gain);
                gain.connect(folkAudioCtx.destination);
                osc.start();
                osc.stop(folkAudioCtx.currentTime + 2.6);
            });
        } catch (e) {
            console.warn('[CityEngine] Audio note:', e);
        }
    }

    function toggleAudio() {
        if (state.isPlayingAudio) {
            stopAudioPlayback(true);
        } else {
            startAudioPlayback();
        }
    }

    function startAudioPlayback() {
        // STRICT GUARD: Only start playback if actively inside Experience 3
        if (!isExp3Active() || (window.__currentCtgExp && window.__currentCtgExp !== 'exp3')) {
            console.log('[CityEngine] startAudioPlayback suppressed: not in Experience 03');
            ytPendingPlay = false;
            forceSilence();
            return;
        }

        state.isUserPaused = false;
        ytPendingPlay = true;
        playAmbientFolkChime();

        if (ytPlayer && typeof ytPlayer.playVideo === 'function') {
            try {
                enforceSongStartTime(ytPlayer);
                ytPlayer.playVideo();
                ytPendingPlay = false;
            } catch (err) {
                console.warn('[CityEngine] ytPlayer.playVideo note:', err);
            }
        } else {
            loadYtScriptAndInit((player) => {
                if (!state.isUserPaused && isExp3Active() && window.__currentCtgExp === 'exp3') {
                    try {
                        enforceSongStartTime(player);
                        player.playVideo();
                    } catch (err) {}
                }
            });
        }
        console.log('[CityEngine] Authentic folk song playback requested (start @ 0:13)');
    }

    function forceSilence() {
        if (songStartWatchdog) {
            clearInterval(songStartWatchdog);
            songStartWatchdog = null;
        }
        state.isUserPaused = true;
        ytPendingPlay = false;
        state.isPlayingAudio = false;
        cleanupUnlockListeners();
        updateAudioButtonUI();

        if (ytPlayer) {
            try {
                if (typeof ytPlayer.mute === 'function') ytPlayer.mute();
                if (typeof ytPlayer.pauseVideo === 'function') ytPlayer.pauseVideo();
                if (typeof ytPlayer.stopVideo === 'function') ytPlayer.stopVideo();
            } catch (err) {}
        }
        // Direct postMessage fallback directly to iframe window
        const iframe = document.querySelector('#cityBgMusicPlayerContainer iframe');
        if (iframe && iframe.contentWindow) {
            try {
                iframe.contentWindow.postMessage('{"event":"command","func":"mute","args":""}', '*');
                iframe.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
                iframe.contentWindow.postMessage('{"event":"command","func":"stopVideo","args":""}', '*');
            } catch (postErr) {}
        }
        if (folkAudioCtx && folkAudioCtx.state === 'running') {
            try { folkAudioCtx.suspend(); } catch (e) {}
        }
        console.log('[CityEngine] Force silence applied');
    }

    function stopAudioPlayback(isUserAction = true) {
        if (songStartWatchdog) {
            clearInterval(songStartWatchdog);
            songStartWatchdog = null;
        }
        if (isUserAction) {
            state.isUserPaused = true;
        }
        ytPendingPlay = false;
        state.isPlayingAudio = false;
        cleanupUnlockListeners();
        updateAudioButtonUI();

        if (ytPlayer) {
            try {
                if (typeof ytPlayer.mute === 'function') ytPlayer.mute();
                if (typeof ytPlayer.pauseVideo === 'function') ytPlayer.pauseVideo();
                if (typeof ytPlayer.stopVideo === 'function') ytPlayer.stopVideo();
            } catch (err) {
                console.warn('[CityEngine] ytPlayer.pauseVideo note:', err);
            }
        }
        const iframe = document.querySelector('#cityBgMusicPlayerContainer iframe');
        if (iframe && iframe.contentWindow) {
            try {
                iframe.contentWindow.postMessage('{"event":"command","func":"mute","args":""}', '*');
                iframe.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
            } catch (postErr) {}
        }
        if (folkAudioCtx && folkAudioCtx.state === 'running') {
            try { folkAudioCtx.suspend(); } catch (e) {}
        }
        console.log('[CityEngine] Authentic folk song playback paused');
    }

    function updateAudioButtonUI() {
        const btn = document.getElementById('btnToggleCityAudio');
        const waves = document.getElementById('citySoundWaves');
        const floatingPill = document.getElementById('ctgFloatingAudioPill');
        const floatingPlayIcon = document.getElementById('floatingPlayIcon');
        const dict = (window.ctgCityData && window.ctgCityData.dictionary) ? window.ctgCityData.dictionary[state.lang] : { musicPause: 'গান থামান', musicPlay: 'গান বাজান' };

        if (state.isPlayingAudio) {
            // Sidebar Controls
            if (btn) {
                btn.classList.add('playing');
                btn.setAttribute('aria-pressed', 'true');
                btn.innerHTML = `<span class="ctg-audio-icon">⏸</span> <span>${dict.musicPause}</span>`;
            }
            if (waves) waves.classList.add('is-active');

            // Floating Luxury Pill
            if (floatingPill) floatingPill.classList.add('is-playing');
            if (floatingPlayIcon) floatingPlayIcon.textContent = '⏸';
        } else {
            // Sidebar Controls
            if (btn) {
                btn.classList.remove('playing');
                btn.setAttribute('aria-pressed', 'false');
                btn.innerHTML = `<span class="ctg-audio-icon">▶</span> <span>${dict.musicPlay}</span>`;
            }
            if (waves) waves.classList.remove('is-active');

            // Floating Luxury Pill
            if (floatingPill) floatingPill.classList.remove('is-playing');
            if (floatingPlayIcon) floatingPlayIcon.textContent = '▶';
        }
    }

    function attemptAutoplay() {
        if (!isExp3Active() || window.__currentCtgExp !== 'exp3' || state.isUserPaused) {
            cleanupUnlockListeners();
            return;
        }

        // Try direct playback if YouTube player is ready
        if (ytPlayer && typeof ytPlayer.playVideo === 'function') {
            startAudioPlayback();
            return;
        }

        // Fallback: unlock on first user click/touch inside Exp 3
        cleanupUnlockListeners();
        window.addEventListener('click', unlockOnInteraction, { once: true, capture: true });
        window.addEventListener('touchstart', unlockOnInteraction, { once: true, capture: true });
        unlockListenerAttached = true;
    }

    // Active Watchdog: continuously enforces silence whenever user is outside Experience 03
    setInterval(() => {
        if ((window.__currentCtgExp && window.__currentCtgExp !== 'exp3') || !isExp3Active()) {
            if (state.isPlayingAudio) {
                forceSilence();
            }
        }
    }, 400);

    function onEnterExp3() {
        state.isUserPaused = false;
        attemptAutoplay();
        startAudioPlayback();
    }

    // 3. Populate Thana Filter Dropdown
    function populateFilters() {
        const filterSelect = document.getElementById('cityThanaFilter');
        if (!filterSelect) return;

        filterSelect.innerHTML = '';
        const dict = window.ctgCityData.dictionary[state.lang];

        const allOpt = document.createElement('option');
        allOpt.value = '';
        allOpt.textContent = dict.filterAllThanas;
        filterSelect.appendChild(allOpt);

        window.ctgCityData.thanas.forEach(th => {
            const opt = document.createElement('option');
            opt.value = th.id;
            opt.textContent = state.lang === 'chatgaya' ? th.name_cg : th.name_bn;
            if (state.thanaFilter === th.id) opt.selected = true;
            filterSelect.appendChild(opt);
        });
    }

    // 4. Render Places List & Photo Attachments (21 Iconic Areas)
    function renderPlacesList() {
        const listEl = document.getElementById('cityPlacesList');
        if (!listEl) return;

        listEl.innerHTML = '';
        const areas = window.ctgCityData.areas || window.ctgCityData.places || [];
        const filtered = areas;

        if (filtered.length === 0) {
            const emptyEl = document.createElement('div');
            emptyEl.className = 'ctg-empty-search';
            emptyEl.textContent = state.lang === 'chatgaya' ? 'খুজি কোন এলাকা ন পাইলাম বাজি!' : 'কোনো এলাকা খুঁজে পাওয়া যায়নি!';
            listEl.appendChild(emptyEl);
            return;
        }

        filtered.forEach(a => {
            const isVisited = state.visited.has(a.id);
            const photoObj = state.photos[a.id];
            const areaName = state.lang === 'chatgaya' ? a.name_cg : a.name_bn;
            const areaDesc = state.lang === 'chatgaya' ? a.desc_cg : a.desc_bn;

            const item = document.createElement('li');
            item.className = `ctg-city-place-item ${isVisited ? 'selected' : ''} ${photoObj ? 'has-photo' : ''} ${a.id === state.activeAreaId ? 'is-active-area' : ''}`;
            item.setAttribute('data-id', a.id);
            item.setAttribute('tabindex', '0');
            item.setAttribute('role', 'checkbox');
            item.setAttribute('aria-checked', isVisited ? 'true' : 'false');

            item.innerHTML = `
                <div class="ctg-cpi-main">
                    <div class="ctg-cpi-check-wrap">
                        ${photoObj && photoObj.dataUrl ? `<img src="${photoObj.dataUrl}" class="ctg-cpi-avatar" alt="${areaName}" />` : `<span class="ctg-cpi-check">${isVisited ? '✓' : ''}</span>`}
                    </div>
                    <span class="ctg-cpi-icon" aria-hidden="true">${a.icon || '📍'}</span>
                    <div class="ctg-cpi-body">
                        <strong class="ctg-cpi-name">${areaName}</strong>
                    </div>
                    ${photoObj ? `
                        <div class="ctg-cpi-photo-actions" onclick="event.stopPropagation();">
                            <label class="ctg-cpi-btn-action ctg-cpi-btn-swap" title="${state.lang === 'chatgaya' ? 'ছবি বদলান' : 'ছবি পরিবর্তন'}">
                                🔄
                                <input type="file" accept="image/*" class="ctg-cpi-inline-file" data-id="${a.id}" style="display:none;">
                            </label>
                            <button type="button" class="ctg-cpi-btn-action ctg-cpi-btn-del" data-id="${a.id}" title="${state.lang === 'chatgaya' ? 'ছবি মুচুন' : 'ছবি মুছুন'}">
                                🗑️
                            </button>
                        </div>
                    ` : `
                        <div class="ctg-cpi-photo-actions" onclick="event.stopPropagation();">
                            <label class="ctg-cpi-btn-action ctg-cpi-btn-add" title="${state.lang === 'chatgaya' ? 'ছবি লাগান' : 'ছবি যোগ করুন'}">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>
                                <input type="file" accept="image/*" class="ctg-cpi-inline-file" data-id="${a.id}" style="display:none;">
                            </label>
                        </div>
                    `}
                </div>
            `;

            // Inline photo upload and delete handlers
            const inlineFile = item.querySelector('.ctg-cpi-inline-file');
            if (inlineFile) {
                inlineFile.addEventListener('change', (e) => {
                    e.stopPropagation();
                    if (e.target.files && e.target.files[0]) {
                        handlePhotoUpload(a.id, e.target.files[0]);
                    }
                });
            }
            const btnDelInline = item.querySelector('.ctg-cpi-btn-del');
            if (btnDelInline) {
                btnDelInline.addEventListener('click', (e) => {
                    e.stopPropagation();
                    removePhoto(a.id);
                });
            }

            // Toggle visit on item click
            item.addEventListener('click', () => {
                togglePlaceVisited(a.id);
            });

            item.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    togglePlaceVisited(a.id);
                }
            });

            // Hover sync with map polygon
            item.addEventListener('mouseenter', () => {
                const mapGroup = document.querySelector(`.ctg-area-group[data-area-id="${a.id}"]`);
                if (mapGroup) {
                    mapGroup.classList.add('is-hovered');
                    const stroke = mapGroup.querySelector('.ctg-area-stroke');
                    if (stroke) stroke.style.stroke = '#f4a261';
                }
            });
            item.addEventListener('mouseleave', () => {
                const mapGroup = document.querySelector(`.ctg-area-group[data-area-id="${a.id}"]`);
                if (mapGroup) {
                    mapGroup.classList.remove('is-hovered');
                    const stroke = mapGroup.querySelector('.ctg-area-stroke');
                    if (stroke) stroke.style.stroke = '';
                }
            });

            listEl.appendChild(item);
        });
    }

    // 5. Visited & Photo Handlers
    function togglePlaceVisited(placeId) {
        const hasPhoto = !!(state.photos && state.photos[placeId] && state.photos[placeId].dataUrl);
        if (state.visited.has(placeId)) {
            if (state.activeAreaId === placeId) {
                if (hasPhoto) {
                    // Photo Protection: If area has an uploaded photo, do NOT un-visit on map click!
                    renderAreaDock(placeId);
                    return;
                }
                state.visited.delete(placeId);
                state.activeAreaId = null;
            } else {
                state.activeAreaId = placeId;
            }
        } else {
            state.visited.add(placeId);
            state.activeAreaId = placeId;
        }
        saveState();
        renderPlacesList();
        updateUI();
        renderAreaDock(state.activeAreaId);
    }

    function handlePhotoUpload(placeId, file) {
        if (!file || !file.type.startsWith('image/')) return;

        const reader = new FileReader();
        reader.onload = function(e) {
            const img = new Image();
            img.onload = function() {
                // Client-side auto-crop & resize for memory safety (max 1000px)
                const canvas = document.createElement('canvas');
                const MAX_DIM = 1000;
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
                state.photos[placeId] = {
                    dataUrl: dataUrl,
                    filename: file.name,
                    zoom: 1.0,
                    panX: 0,
                    panY: 0
                };

                // Auto-mark visited when photo is added
                state.visited.add(placeId);
                state.activeAreaId = placeId;

                saveState();
                renderPlacesList();
                updateUI();
                renderAreaDock(placeId);
                showToast(state.lang === 'chatgaya' ? 'ছবি লাগানি অইয়ে!' : 'ছবি সফলভাবে যুক্ত হয়েছে!');
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    function removePhoto(placeId) {
        delete state.photos[placeId];
        saveState();
        renderPlacesList();
        updateUI();
        renderAreaDock(placeId);
        showToast(state.lang === 'chatgaya' ? 'ছবি মুচি দেওয়া অইয়ে!' : 'ছবি সরানো হয়েছে!');
    }

    function adjustPhoto(placeId, action) {
        const photo = state.photos[placeId];
        if (!photo) return;
        if (typeof photo.zoom !== 'number') photo.zoom = 1.0;
        if (typeof photo.panX !== 'number') photo.panX = 0;
        if (typeof photo.panY !== 'number') photo.panY = 0;
        if (typeof photo.labelOffsetX !== 'number') photo.labelOffsetX = 0;
        if (typeof photo.labelOffsetY !== 'number') photo.labelOffsetY = 0;

        const PAN_STEP = 8;
        const ZOOM_STEP = 0.15;
        const LABEL_STEP = 6;

        switch (action) {
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
            case 'zoom-in':
                photo.zoom = Math.min(3.5, Math.round((photo.zoom + ZOOM_STEP) * 100) / 100);
                break;
            case 'zoom-out':
                photo.zoom = Math.max(0.4, Math.round((photo.zoom - ZOOM_STEP) * 100) / 100);
                break;
            case 'reset':
                photo.zoom = 1.0;
                photo.panX = 0;
                photo.panY = 0;
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
        }

        saveState();
        const valEl = document.getElementById(`adjVal-${placeId}`);
        if (valEl) valEl.textContent = `${Math.round(photo.zoom * 100)}%`;

        const dockZoomVal = document.getElementById('dockZoomVal');
        if (dockZoomVal) dockZoomVal.textContent = `${Math.round(photo.zoom * 100)}%`;

        renderPosterMapSvg();
        renderPosterToCanvas();

        if (action.startsWith('label-')) {
            renderAreaDock(placeId);
        }
    }

    function renderAreaDock(areaId) {
        const dockContainer = document.getElementById('cityAreaDockContainer');
        if (!dockContainer) return;

        const thumbBar = document.getElementById('ctgMobileThumbBar');

        if (!areaId) {
            dockContainer.style.display = 'none';
            dockContainer.innerHTML = '';
            document.body.classList.remove('ctg-dock-open');
            if (thumbBar) thumbBar.style.display = '';
            return;
        }

        const area = window.ctgCityData.places.find(p => p.id === areaId);
        if (!area) {
            dockContainer.style.display = 'none';
            dockContainer.innerHTML = '';
            document.body.classList.remove('ctg-dock-open');
            if (thumbBar) thumbBar.style.display = '';
            return;
        }

        document.body.classList.add('ctg-dock-open');
        if (thumbBar) thumbBar.style.display = 'none';

        const isVisited = state.visited.has(areaId);
        const photo = state.photos[areaId];
        const rawName = state.lang === 'chatgaya' ? area.name_cg : area.name_bn;

        dockContainer.style.display = 'block';

        if (!photo || !photo.dataUrl) {
            const hintMsg = state.lang === 'chatgaya'
                ? '💡 মন চাইলে ছবি দন, ন অইলে এরমই সুন্দর রাহন!'
                : '💡 চাইলে ছবি দিতে পারেন, অথবা এভাবেই সুন্দর রাখতে পারেন!';
            const keepBtnLabel = state.lang === 'chatgaya' ? '✓ এরমই রাহন' : '✓ এভাবেই রাখুন';

            dockContainer.innerHTML = `
                <div class="ctg-area-floating-dock ctg-dock-luxury ctg-dock-with-hint">
                    <div class="ctg-dock-top-bar">
                        <div class="ctg-dock-info">
                            <div class="ctg-dock-pulse-dot"></div>
                            <div class="ctg-dock-text">
                                <div class="ctg-dock-status-pill">
                                    <span class="ctg-dock-status-dot ctg-pulse-amber"></span>
                                    <span class="ctg-dock-tag">${isVisited ? (state.lang === 'chatgaya' ? 'ঘুরি আইস্যি' : 'ঘুরেছি') : (state.lang === 'chatgaya' ? 'চিহ্নিত এলাকা' : 'নির্বাচিত এলাকা')}</span>
                                </div>
                                <strong class="ctg-dock-title">${rawName}</strong>
                            </div>
                        </div>
                        <div class="ctg-dock-action-row">
                            <label class="ctg-dock-btn-upload" title="${state.lang === 'chatgaya' ? 'এলাকার ফটো দিন' : 'ছবি যোগ করুন'}">
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:-1px;margin-right:2px;" aria-hidden="true"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg><span>${state.lang === 'chatgaya' ? 'ছবি লাগান' : 'ছবি যোগ করুন'}</span>
                                <input type="file" accept="image/*" class="ctg-dock-file-input" style="display:none;">
                            </label>
                            <button type="button" class="ctg-dock-btn-keep" id="btnDockKeepAsIs" title="${state.lang === 'chatgaya' ? 'ছবি ছাড়া শুধু এলাকা চিহ্নিত রাখুন' : 'ছবি ছাড়া এলাকা চিহ্নিত রাখুন'}">
                                <span>${keepBtnLabel}</span>
                            </button>
                            <button class="ctg-dock-btn-close" id="btnDockClose" title="${state.lang === 'chatgaya' ? 'বন্ধ গরুন' : 'বন্ধ করুন'}" aria-label="Close">✕</button>
                        </div>
                    </div>
                    <div class="ctg-dock-hint-banner" role="status">
                        ${hintMsg}
                    </div>
                </div>
            `;
        } else {
            const zoomPct = Math.round(((photo.zoom !== undefined) ? photo.zoom : 1.0) * 100);
            const safeDataUrl = (photo.dataUrl || '').replace(/"/g, '&quot;');
            const safeName = (rawName || '').replace(/"/g, '&quot;');
            dockContainer.innerHTML = `
                <div class="ctg-area-floating-dock ctg-dock-luxury">
                    <div class="ctg-dock-top-bar">
                        <div class="ctg-dock-info">
                            <div class="ctg-dock-thumb-wrap">
                                <img src="${safeDataUrl}" alt="${safeName}" class="ctg-dock-thumb">
                                <span class="ctg-dock-thumb-badge" title="মেমোরি সক্রিয়">✨</span>
                            </div>
                            <div class="ctg-dock-text">
                                <div class="ctg-dock-status-pill">
                                    <span class="ctg-dock-status-dot"></span>
                                    <span class="ctg-dock-tag ctg-dock-tag-ok">✓ ${state.lang === 'chatgaya' ? 'ছবি ফিট অইয়ে' : 'ছবি যুক্ত আছে'}</span>
                                </div>
                                <strong class="ctg-dock-title">${rawName}</strong>
                            </div>
                        </div>
                        <div class="ctg-dock-action-row">
                            <label class="ctg-dock-btn-change" title="${state.lang === 'chatgaya' ? 'ছবি বদলান' : 'ছবি পরিবর্তন'}">
                                <span class="ctg-dock-action-icon">🔄</span>
                                <span>${state.lang === 'chatgaya' ? 'বদলান' : 'পরিবর্তন'}</span>
                                <input type="file" accept="image/*" class="ctg-dock-file-input" style="display:none;">
                            </label>
                            <button type="button" class="ctg-dock-btn-delete" id="btnDockDelete" title="${state.lang === 'chatgaya' ? 'ছবি মুচুন' : 'ছবি মুছুন'}" aria-label="Delete">
                                <span class="ctg-dock-action-icon">🗑️</span>
                                <span>${state.lang === 'chatgaya' ? 'মুচুন' : 'মুছুন'}</span>
                            </button>
                            <button class="ctg-dock-btn-close" id="btnDockClose" title="${state.lang === 'chatgaya' ? 'বন্ধ গরুন' : 'বন্ধ করুন'}" aria-label="Close">✕</button>
                        </div>
                    </div>

                    <div class="ctg-dock-hint-banner ctg-dock-gesture-hint" role="status" style="margin-top: 6px; margin-bottom: 2px;">
                        ${state.lang === 'chatgaya' 
                            ? '💡 ম্যাপের ছবিত সরাসরি আঙুল/মাউস টানি সরাইন, চাকা ঘুরাই জুম গরুন আর নাম টানি বসাইন' 
                            : '💡 ম্যাপে ছবির ওপর সরাসরি আঙুল/মাউস টেনে সরান, হুইল দিয়ে জুম করুন ও নাম টেনে বসান'}
                    </div>

                    <div class="ctg-dock-divider"></div>

                    <div class="ctg-dock-controls-strip">
                        <!-- Pan Segment -->
                        <div class="ctg-dock-pill-segment">
                            <span class="ctg-dock-segment-title">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 9l-3 3 3 3M9 5l3-3 3 3M15 19l-3 3-3-3M19 9l3 3-3 3M2 12h20M12 2v20"/></svg>
                                ${state.lang === 'chatgaya' ? 'সরাইন' : 'প্যান'}
                            </span>
                            <div class="ctg-dock-segmented-group">
                                <button class="ctg-dock-seg-btn" data-action="pan-left" title="ছবি বাঁয়ে" aria-label="Pan Left">◀</button>
                                <button class="ctg-dock-seg-btn" data-action="pan-up" title="ছবি উপরে" aria-label="Pan Up">▲</button>
                                <button class="ctg-dock-seg-btn" data-action="pan-down" title="ছবি নিচে" aria-label="Pan Down">▼</button>
                                <button class="ctg-dock-seg-btn" data-action="pan-right" title="ছবি ডানে" aria-label="Pan Right">▶</button>
                            </div>
                        </div>

                        <!-- Zoom Segment -->
                        <div class="ctg-dock-pill-segment">
                            <span class="ctg-dock-segment-title">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.35-4.35"/></svg>
                                ${state.lang === 'chatgaya' ? 'জুম' : 'জুম'}
                            </span>
                            <div class="ctg-dock-segmented-group">
                                <button class="ctg-dock-seg-btn" data-action="zoom-out" title="জুম কমান" aria-label="Zoom Out">−</button>
                                <span class="ctg-dock-zoom-val" id="dockZoomVal">${zoomPct}%</span>
                                <button class="ctg-dock-seg-btn" data-action="zoom-in" title="জুম বাড়ান" aria-label="Zoom In">+</button>
                                <button class="ctg-dock-seg-btn ctg-dock-seg-reset" data-action="reset" title="রিসেট" aria-label="Reset">↺</button>
                            </div>
                        </div>

                        <!-- Label Segment -->
                        <div class="ctg-dock-pill-segment">
                            <span class="ctg-dock-segment-title">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M4 7V4h16v3M9 20h6M12 4v16"/></svg>
                                ${state.lang === 'chatgaya' ? 'নাম' : 'লেবেল'}
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

        const fileInputs = dockContainer.querySelectorAll('.ctg-dock-file-input');
        fileInputs.forEach(input => {
            input.addEventListener('change', (e) => {
                if (e.target.files && e.target.files[0]) {
                    handlePhotoUpload(areaId, e.target.files[0]);
                }
            });
        });

        const adjBtns = dockContainer.querySelectorAll('button[data-action]');
        adjBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const action = btn.getAttribute('data-action');
                if (action) adjustPhoto(areaId, action);
            });
        });

        const btnDelete = dockContainer.querySelector('#btnDockDelete');
        if (btnDelete) {
            btnDelete.addEventListener('click', (e) => {
                e.stopPropagation();
                removePhoto(areaId);
            });
        }

        const btnClose = dockContainer.querySelector('#btnDockClose');
        if (btnClose) {
            btnClose.addEventListener('click', (e) => {
                e.stopPropagation();
                state.activeAreaId = null;
                renderAreaDock(null);
                renderPosterMapSvg();
            });
        }

        const btnKeep = dockContainer.querySelector('#btnDockKeepAsIs');
        if (btnKeep) {
            btnKeep.addEventListener('click', (e) => {
                e.stopPropagation();
                state.activeAreaId = null;
                renderAreaDock(null);
                renderPosterMapSvg();
                showToast(state.lang === 'chatgaya' ? 'জাগা বাসি এরমই সুন্দর রাখা অইয়ে!' : 'এলাকা সফলভাবে চিহ্নিত রাখা হয়েছে!');
            });
        }
    }

    function selectAllPlaces() {
        window.ctgCityData.places.forEach(p => state.visited.add(p.id));
        saveState();
        renderPlacesList();
        updateUI();
        renderAreaDock(state.activeAreaId);
    }

    function clearAllPlaces() {
        state.visited.clear();
        state.photos = {};
        state.activeAreaId = null;
        saveState();
        renderPlacesList();
        updateUI();
        renderAreaDock(null);
    }

    function loadDemoTour() {
        state.visited = new Set([
            'kalurghat',
            'bahaddarhat',
            'chawkbazar',
            'andarkilla',
            'newmarket',
            'notunbridge',
            'gec',
            'agrabad',
            'patenga'
        ]);
        state.activeAreaId = 'andarkilla';
        saveState();
        renderPlacesList();
        updateUI();
        renderAreaDock('andarkilla');
        showToast(state.lang === 'chatgaya' ? 'চাটগাঁর আইকনিক স্পটগুলিনের ডিমো ট্যুর লোড অইয়ে!' : 'চট্টগ্রামের প্রধান স্থানগুলোর ডেমো ট্যুর লোড হয়েছে!');
    }

    // 6. UI Synchronization & Live Poster Render
    function updateUI() {
        const dict = window.ctgCityData.dictionary[state.lang];
        const validPlaces = (window.ctgCityData && window.ctgCityData.places) ? window.ctgCityData.places : [];
        const validIds = new Set(validPlaces.map(p => p.id));
        for (const id of state.visited) {
            if (!validIds.has(id)) state.visited.delete(id);
        }
        const total = validPlaces.length;
        const count = Math.min(state.visited.size, total);
        const remaining = Math.max(0, total - count);
        const percent = total > 0 ? Math.min(100, Math.round((count / total) * 100)) : 0;

        // Language toggle button & Top Navbar Product Brand
        const btnLang = document.getElementById('btnCityLangToggle');
        if (btnLang) {
            btnLang.title = dict.switchBtnTitle;
            const deskSpan = btnLang.querySelector('.ctg-lang-text-desktop');
            const mobSpan = btnLang.querySelector('.ctg-lang-text-mobile');
            if (deskSpan && mobSpan) {
                deskSpan.textContent = dict.switchBtnText;
                mobSpan.textContent = (state.lang === 'chatgaya') ? '🗣️ সহজ বাংলা' : '🌊 চাটগাঁইয়া';
            } else {
                btnLang.textContent = dict.switchBtnText;
            }
        }
        const navSubTitle = document.getElementById('ctgNavSubTitle');
        if (navSubTitle && (window.location.hash || '').toLowerCase() === '#exp3') {
            navSubTitle.textContent = (state.lang === 'standard_bn') ? 'আমার চট্টগ্রাম শহর' : 'আঁর চাটগাঁ শহর';
        }

        // Eyebrows & headings
        safeText('cityHeroTag', dict.heroTag);
        safeText('cityHeroTitle', dict.heroTitle);
        safeText('cityHeroDesc', dict.heroDesc);
        safeText('citySelectHeading', dict.selectHeading);
        safeText('citySpotsSubtitle', `${toBengaliDigits(count)} / ${toBengaliDigits(total)} এলাকা নির্বাচিত`);
        safeText('btnCityDemo', dict.btnDemo || '✨ ডিমো ট্যুর');
        safeText('btnCitySelectAll', dict.btnSelectAll);
        safeText('btnCityClear', dict.btnClear);

        // Rank Calculation
        let currentRank = dict.rankLevels[0];
        for (let i = dict.rankLevels.length - 1; i >= 0; i--) {
            if (count >= dict.rankLevels[i].threshold) {
                currentRank = dict.rankLevels[i];
                break;
            }
        }

        safeText('cityRankTitle', currentRank.title);
        safeText('cityRankDesc', currentRank.desc || '');
        safeText('cityRankPercent', `${toBengaliDigits(percent)}${dict.percentDone}`);
        const rankBar = document.getElementById('cityRankBarFill');
        if (rankBar) rankBar.style.width = `${percent}%`;

        // Update Global Mobile Thumb Action Bar (21 iconic areas)
        if (typeof window.updateMobileThumbBar === 'function') {
            window.updateMobileThumbBar(count, total, currentRank.title, 'exp3');
        }
        const btnMtbJump = document.getElementById('btnMtbJumpToPoster');
        if (btnMtbJump && !btnMtbJump.__hasCityListener) {
            btnMtbJump.__hasCityListener = true;
            btnMtbJump.addEventListener('click', () => {
                const target = document.querySelector('.ctg-control-box-download') || document.getElementById('cityPosterStage');
                if (target) target.scrollIntoView({ behavior: 'smooth', block: 'center' });
            });
        }

        // Right panel controls
        safeText('cityThemeHeading', dict.themeHeading);
        safeText('cityTitleHeading', dict.titleHeading);
        safeText('cityDownloadHeading', dict.downloadHeading);

        // Music ticker
        safeText('cityMusicSongTitle', dict.musicSongName);
        safeText('cityLyricsMarquee', dict.musicLyrics);

        // Title input & counter
        const titleInput = document.getElementById('inputCityPosterTitle');
        if (titleInput && titleInput.value !== state.posterTitle) {
            titleInput.value = state.posterTitle;
        }
        safeText('cityTitleCharCounter', `${toBengaliDigits(state.posterTitle.length)} / ৩২`);

        // Author name inputs (both sidebar and quick top bar) & heading
        safeText('cityAuthorHeading', dict.posterAuthorHeading || (state.lang === 'chatgaya' ? 'অনর নাম' : 'আপনার নাম'));
        const nameInput = document.getElementById('inputCityAuthorName');
        const btnResetAuthor = document.getElementById('btnResetCityAuthor');
        const quickNameInput = document.getElementById('inputCityQuickAuthorName');
        const btnResetQuickAuthor = document.getElementById('btnResetCityQuickAuthor');
        const placeholderText = state.lang === 'chatgaya' ? 'অনর নাম (ঐচ্ছিক)' : 'আপনার নাম (ঐচ্ছিক)';

        if (quickNameInput) {
            quickNameInput.placeholder = placeholderText;
            if (quickNameInput.value !== (state.authorName || '')) {
                quickNameInput.value = state.authorName || '';
            }
            if (btnResetQuickAuthor) {
                btnResetQuickAuthor.style.display = (state.authorName && state.authorName.trim()) ? 'flex' : 'none';
            }
        }

        if (nameInput) {
            nameInput.placeholder = placeholderText;
            if (nameInput.value !== (state.authorName || '')) {
                nameInput.value = state.authorName || '';
            }
            if (btnResetAuthor) {
                btnResetAuthor.style.display = (state.authorName && state.authorName.trim()) ? 'flex' : 'none';
            }
        }

        // Quick Bar & Direct Actions Language Sync
        safeText('cityQuickThemeLabel', state.lang === 'chatgaya' ? 'থিম:' : 'থিম:');
        safeText('cityDirectDownloadText', state.lang === 'chatgaya' ? '↓ অনর পোস্টার নামাই লন (Ultra HD)' : '↓ আপনার পোস্টার ডাউনলোড করুন (Ultra HD)');
        safeText('cityPosterTipContent', state.lang === 'chatgaya' ? 'টিপস: ম্যাপ বা লিস্টের জাগাত টিপ মারি ছবি দন বা এলাকা বাসি লন' : 'টিপস: ম্যাপের যেকোনো এলাকায় ক্লিক করে ছবি যোগ বা বাছাই করতে পারেন');

        // Interactive Micro-Guide / Helpful Tips Elements
        safeText('cityGuideHeading', dict.guideHeading || 'সহজে পোস্টার সাজানোর নির্দেশিকা');
        const gStep1 = document.getElementById('cityGuideStep1');
        if (gStep1 && dict.guideStep1) {
            const parts = dict.guideStep1.split(': ');
            gStep1.innerHTML = `<span class="ctg-guide-pip">১</span> <strong>${parts[0]}:</strong> ${parts[1] || ''}`;
        }
        const gStep2 = document.getElementById('cityGuideStep2');
        if (gStep2 && dict.guideStep2) {
            const parts = dict.guideStep2.split(': ');
            gStep2.innerHTML = `<span class="ctg-guide-pip">২</span> <strong>${parts[0]}:</strong> ${parts[1] || ''}`;
        }
        const gStep3 = document.getElementById('cityGuideStep3');
        if (gStep3 && dict.guideStep3) {
            const parts = dict.guideStep3.split(': ');
            gStep3.innerHTML = `<span class="ctg-guide-pip">৩</span> <strong>${parts[0]}:</strong> ${parts[1] || ''}`;
        }
        const gStep4 = document.getElementById('cityGuideStep4');
        if (gStep4 && dict.guideStep4) {
            const parts = dict.guideStep4.split(': ');
            gStep4.innerHTML = `<span class="ctg-guide-pip">৪</span> <strong>${parts[0]}:</strong> ${parts[1] || ''}`;
        }

        // Live Poster Elements (Clean Gallery-Grade Typography)
        safeText('cityPosterLiveTitle', state.posterTitle || dict.posterDefaultTitle);

        // Seamless Traveler Name Integration into Subtitle (Without awkward 'পরিক্রমক' label)
        let dynamicSub = dict.posterDefaultSub;
        if (state.authorName && state.authorName.trim()) {
            const author = state.authorName.trim();
            dynamicSub = (state.lang === 'chatgaya')
                ? `কালুরঘাটত্তুন পতেঙ্গা—${author}র ব্যক্তিগত স্মৃতি মানচিত্র`
                : `কালুরঘাটত্তুন পতেঙ্গা—${author}-এর ব্যক্তিগত স্মৃতি মানচিত্র`;
        }
        safeText('cityPosterLiveSub', dynamicSub);

        safeText('cityPosterLiveCount', toBengaliDigits(total));
        safeText('cityPosterLivePct', `${toBengaliDigits(percent)}% ভ্রমণ`);
        safeText('cityPosterLiveDialTitle', currentRank.title);
        safeText('cityPosterLiveDialStats', `${toBengaliDigits(count)} ঘোরা · ${toBengaliDigits(remaining)} বাকি`);
        safeText('cityPosterLiveRank', currentRank.title);

        const dialCircle = document.getElementById('cityDialProgressCircle');
        if (dialCircle) {
            const circumference = 263.89;
            const offset = circumference - (percent / 100) * circumference;
            dialCircle.style.strokeDashoffset = offset;
        }

        // Hide legacy author line permanently (integrated seamlessly in dynamicSub)
        const liveAuthorWrap = document.getElementById('cityPosterLiveAuthorWrap');
        if (liveAuthorWrap) {
            liveAuthorWrap.style.display = 'none';
        }

        // Sync themes to layout & live poster
        const layout = document.getElementById('exp4Layout');
        const stage = document.getElementById('cityPosterStage');
        if (layout) layout.setAttribute('data-theme', state.theme);
        if (stage) stage.setAttribute('data-theme', state.theme);

        // Sync theme radio buttons & quick swatch dots
        document.querySelectorAll('#cityThemeSelector .ctg-theme-btn, .ctg-quick-swatch-dot, .ctg-pqt-chip, .ctg-mf-chip').forEach(btn => {
            const isMatch = btn.getAttribute('data-theme') === state.theme;
            btn.classList.toggle('active', isMatch);
            btn.setAttribute('aria-checked', isMatch ? 'true' : 'false');
        });

        // Render Poster Map SVG & Photo Pins
        renderPosterMapSvg();

        // Update hidden 1200x1500 canvas engine
        renderPosterToCanvas();
    }

    // 7. Interactive Vector Map Geometry Engine (Official CCC 21 Areas)
    function getMapGeometry() {
        const W = 800;
        const H = 820;

        // Official Bounding Box of Chattogram City Corporation
        const MIN_LON = 91.7444;
        const MAX_LON = 91.8934;
        const MIN_LAT = 22.2194;
        const MAX_LAT = 22.4665;
        const midLat = 22.343;
        const cosLat = Math.cos(midLat * Math.PI / 180);
        const lonSpan = (MAX_LON - MIN_LON) * cosLat;
        const latSpan = MAX_LAT - MIN_LAT;
        const padX = 70;
        const padY = 46;
        const availW = W - padX * 2;
        const availH = H - padY * 2;
        const scale = Math.min(availW / lonSpan, availH / latSpan);
        const actualW = lonSpan * scale;
        const actualH = latSpan * scale;
        const offsetX = padX + (availW - actualW) / 2;
        const offsetY = padY + (availH - actualH) / 2;

        function project(lon, lat) {
            return {
                x: Math.round((offsetX + (lon - MIN_LON) * cosLat * scale) * 10) / 10,
                y: Math.round((offsetY + (MAX_LAT - lat) * scale) * 10) / 10
            };
        }

        const boundaryCoords = (window.ctgCityData && window.ctgCityData.cccBoundary) || [];

        // Entire CCC City Bedrock Boundary closed SVG path
        let cccBoundaryD = '';
        boundaryCoords.forEach((pt, i) => {
            const p = project(pt[0], pt[1]);
            cccBoundaryD += (i === 0 ? 'M ' : ' L ') + p.x + ' ' + p.y;
        });
        if (cccBoundaryD) cccBoundaryD += ' Z';

        // 1. Natural Karnaphuli River Waterway (East flank)
        const bank = [];
        if (boundaryCoords.length >= 206) {
            for (let i = 205; i < boundaryCoords.length; i++) bank.push(boundaryCoords[i]);
            for (let i = 0; i <= 15; i++) bank.push(boundaryCoords[i]);
        }

        const riverCenterCoords = [];
        for (let i = 0; i < bank.length; i++) {
            const prev = bank[Math.max(0, i - 1)];
            const next = bank[Math.min(bank.length - 1, i + 1)];
            const dx = (next[0] - prev[0]) * cosLat;
            const dy = (next[1] - prev[1]);
            const len = Math.hypot(dx, dy) || 1e-6;
            const offset = 0.0035;
            const rLon = bank[i][0] + (dy / len) * offset / cosLat;
            const rLat = bank[i][1] + (-dx / len) * offset;
            riverCenterCoords.push([rLon, rLat]);
        }

        let riverCenterD = '';
        riverCenterCoords.forEach((pt, i) => {
            const p = project(pt[0], pt[1]);
            riverCenterD += (i === 0 ? 'M ' : ' L ') + p.x + ' ' + p.y;
        });

        // 2. Real Bay of Bengal Natural Coast Waves & Ripples (West Coast)
        const rawCoast = boundaryCoords.length >= 206 ? boundaryCoords.slice(145, 206) : [];
        const smoothCoast = [];
        for (let i = 0; i < rawCoast.length; i++) {
            let sumLon = 0, sumLat = 0, count = 0;
            for (let j = -3; j <= 3; j++) {
                const idx = i + j;
                if (idx >= 0 && idx < rawCoast.length) {
                    sumLon += rawCoast[idx][0];
                    sumLat += rawCoast[idx][1];
                    count++;
                }
            }
            smoothCoast.push([sumLon / count, sumLat / count]);
        }

        function makeWavePath(offsetDist) {
            let d = '';
            smoothCoast.forEach((pt, i) => {
                const prev = smoothCoast[Math.max(0, i - 2)];
                const next = smoothCoast[Math.min(smoothCoast.length - 1, i + 2)];
                const dx = (next[0] - prev[0]) * cosLat;
                const dy = (next[1] - prev[1]);
                const len = Math.hypot(dx, dy) || 1e-6;
                const wLon = pt[0] + (dy / len) * offsetDist / cosLat;
                const wLat = pt[1] + (-dx / len) * offsetDist;
                const op = project(wLon, wLat);
                d += (i === 0 ? 'M ' : ' L ') + op.x + ' ' + op.y;
            });
            return d;
        }

        const coastPathD = makeWavePath(0.002);
        const wave1PathD = makeWavePath(0.007);
        const wave2PathD = makeWavePath(0.016);
        const wave3PathD = makeWavePath(0.028);
        const wave4PathD = makeWavePath(0.044);

        // Scattered open-water cartographic wave ripples angled along Bay of Bengal Coastal Swell
        const rippleCoords = [
            { x: 50, y: 195, s: 1.15, rot: 28 },
            { x: 95, y: 235, s: 0.95, rot: 26 },
            { x: 40, y: 275, s: 1.20, rot: 25 },
            { x: 88, y: 315, s: 1.00, rot: 24 },
            { x: 35, y: 360, s: 1.25, rot: 22 },
            { x: 82, y: 405, s: 1.05, rot: 22 },
            { x: 42, y: 450, s: 1.15, rot: 20 },
            { x: 90, y: 495, s: 0.95, rot: 20 },
            { x: 38, y: 540, s: 1.20, rot: 18 },
            { x: 84, y: 585, s: 1.00, rot: 18 },
            { x: 48, y: 630, s: 1.15, rot: 16 },
            { x: 94, y: 675, s: 0.90, rot: 15 },
            { x: 42, y: 720, s: 1.20, rot: 14 },
            { x: 86, y: 765, s: 1.05, rot: 12 },
            { x: 55, y: 805, s: 0.95, rot: 10 }
        ];

        let oceanRipplesSvg = '';
        rippleCoords.forEach(rp => {
            oceanRipplesSvg += `
                <g class="city-ocean-ripple" transform="translate(${rp.x}, ${rp.y}) rotate(${rp.rot}) scale(${rp.s})">
                    <path d="M 0 0 c 6 -4.5 14 -4.5 20 0 c 6 -4.5 14 -4.5 20 0" class="city-ripple-crest"></path>
                    <path d="M 6 4 c 4 -3 10 -3 14 0 c 4 -3 10 -3 14 0" class="city-ripple-sub"></path>
                </g>`;
        });

        // Labels placement points
        const riverPt = (bank && bank.length > 50) ? bank[50] : [91.86, 22.34];
        const seaLabelPt = { x: 122, y: 560 };
        const riverLabelPt = project(riverPt[0] + 0.013, riverPt[1] - 0.004);

        return {
            W, H,
            cccBoundaryD,
            riverCenterD,
            coastPathD,
            wave1PathD,
            wave2PathD,
            wave3PathD,
            wave4PathD,
            rippleCoords,
            oceanRipplesSvg,
            seaLabelPt,
            riverLabelPt
        };
    }

    // 8. Interactive Vector Map & Live Poster SVG (21 Boundary Polygons, 3D Island & Photo Masking)
    function renderPosterMapSvg() {
        const container = document.getElementById('cityMapContainer');
        if (!container) return;

        const geom = getMapGeometry();
        const W = geom.W;
        const H = geom.H;

        // Render 21 Area Boundary Polygons & Photo ClipPaths
        const areas = window.ctgCityData.areas || window.ctgCityData.places || [];
        let defsSvg = '';
        let areasSvg = '';
        let labelsSvg = '';

        areas.forEach(a => {
            const isVisited = state.visited.has(a.id);
            const photo = state.photos[a.id];
            const rawName = state.lang === 'chatgaya' ? a.name_cg : a.name_bn;
            const mapLabel = state.lang === 'chatgaya' ? (a.map_label_cg || a.name_cg) : (a.map_label_bn || a.name_bn);

            defsSvg += `
                <clipPath id="clip-area-${a.id}">
                    <path d="${a.d}"></path>
                </clipPath>
            `;

            const isActive = (a.id === state.activeAreaId);

            areasSvg += `
                <g class="ctg-area-group ${isVisited ? 'is-visited' : ''} ${photo ? 'has-photo' : ''} ${isActive ? 'is-active-area' : ''}" 
                   data-area-id="${a.id}" 
                   tabindex="0" 
                   role="button" 
                   aria-label="${rawName} (${isVisited ? 'ঘুরেছি' : 'ঘুরিনি'})">
                    <title>${rawName} - ${isVisited ? 'ঘুরেছি' : 'ঘুরিনি'}</title>
                    <!-- Background Polygon Fill -->
                    <path d="${a.d}" class="ctg-area-shape ${isVisited ? 'is-visited' : ''}"></path>
                    
                    <!-- Clipped Photo if uploaded (Full-shape polygon photo masking with pan & zoom) -->
                    ${photo && photo.dataUrl ? (() => {
                        const zoom = (typeof photo.zoom === 'number') ? photo.zoom : 1.0;
                        const panX = (typeof photo.panX === 'number') ? photo.panX : 0;
                        const panY = (typeof photo.panY === 'number') ? photo.panY : 0;
                        const sw = a.bbox.width * zoom;
                        const sh = a.bbox.height * zoom;
                        const cx = a.bbox.minX + a.bbox.width / 2;
                        const cy = a.bbox.minY + a.bbox.height / 2;
                        const posX = cx - sw / 2 + panX;
                        const posY = cy - sh / 2 + panY;
                        return `
                            <image href="${(photo.dataUrl || '').replace(/"/g, '&quot;')}" 
                                   data-area-id="${a.id}"
                                   x="${posX}" y="${posY}" 
                                   width="${sw}" height="${sh}" 
                                   clip-path="url(#clip-area-${a.id})" 
                                   preserveAspectRatio="xMidYMid slice"
                                   pointer-events="none"></image>
                            <path d="${a.d}" class="ctg-area-photo-overlay" pointer-events="none"></path>
                        `;
                    })() : ''}

                    <!-- Crisp Golden Boundary Stroke -->
                    <path d="${a.d}" class="ctg-area-stroke ${isVisited ? 'is-visited' : ''}"></path>
                </g>
            `;

            if (isVisited && photo && photo.dataUrl) {
                if (photo.hideLabel) {
                    // Omit text label so full photo shines through unobstructed
                } else {
                    const offX = photo.labelOffsetX || 0;
                    const offY = photo.labelOffsetY || 0;
                    const baseX = a.center[0];
                    const baseY = a.center[1];
                    const curX = baseX + offX;
                    const curY = baseY + offY;
                    const badgeText = mapLabel;
                    const pillW = Math.max(48, mapLabel.length * 8 + 22);
                    const pillH = 15;
                    labelsSvg += `
                        <g class="ctg-photo-area-badge has-photo is-draggable" data-label-id="${a.id}" transform="translate(${curX.toFixed(2)}, ${curY.toFixed(2)})" role="button" tabindex="0" aria-label="${badgeText}" pointer-events="all" style="pointer-events: all; cursor: grab;">
                            <rect x="${(-pillW / 2).toFixed(1)}" y="${(-pillH / 2).toFixed(1)}" 
                                  width="${pillW}" height="${pillH}" rx="${pillH / 2}" 
                                  class="ctg-photo-badge-bg" pointer-events="all"></rect>
                            <text x="0" y="0" 
                                  class="ctg-area-label ctg-area-label-photo ${isVisited ? 'is-visited' : ''}" 
                                  text-anchor="middle" dominant-baseline="central" pointer-events="none">${badgeText}</text>
                        </g>
                    `;
                }
            } else {
                labelsSvg += `
                    <text x="${a.center[0]}" y="${a.center[1]}" 
                          class="ctg-area-label ${isVisited ? 'is-visited' : ''}" 
                          data-label-id="${a.id}" 
                          pointer-events="none">${mapLabel}</text>
                `;
            }
        });

        container.innerHTML = `
            <svg viewBox="20 40 660 780" class="ctg-city-map-svg" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    ${defsSvg}
                    <!-- River Watercolor Gradient -->
                    <linearGradient id="ctgRiverGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="#023e8a" stop-opacity="0.85" />
                        <stop offset="40%" stop-color="#0077b6" stop-opacity="0.95" />
                        <stop offset="75%" stop-color="#2a9d8f" stop-opacity="0.95" />
                        <stop offset="100%" stop-color="#48cae4" stop-opacity="0.9" />
                    </linearGradient>
                    <!-- 3D Island Bedrock Elevation Shadow Filter (Adaptive) -->
                    <filter id="ctgIslandShadow" x="-15%" y="-10%" width="130%" height="135%">
                        <feDropShadow dx="0" dy="${state.theme === 'pothochitro' ? '4' : '14'}" stdDeviation="${state.theme === 'pothochitro' ? '8' : '18'}" flood-color="${state.theme === 'pothochitro' ? '#8c7851' : '#000000'}" flood-opacity="${state.theme === 'pothochitro' ? '0.18' : '0.75'}" />
                    </filter>
                </defs>

                <!-- 1. Concentric Bay of Bengal Ocean Waves & Ripples (West Coast) -->
                <g class="city-ocean-layer" aria-hidden="true">
                    ${geom.oceanRipplesSvg}
                    <path d="${geom.wave4PathD}" class="city-coast-wave city-coast-wave-4"></path>
                    <path d="${geom.wave3PathD}" class="city-coast-wave city-coast-wave-3"></path>
                    <path d="${geom.wave2PathD}" class="city-coast-wave city-coast-wave-2"></path>
                    <path d="${geom.wave1PathD}" class="city-coast-wave city-coast-wave-1"></path>
                    <path d="${geom.coastPathD}" class="city-coast-wave city-coast-wave-shore"></path>
                </g>

                <!-- 2. Karnaphuli River Waterway (East flank) -->
                <g class="city-river-layer" aria-hidden="true">
                    <path d="${geom.riverCenterD}" class="city-map-river-ambient"></path>
                    <path d="${geom.riverCenterD}" class="city-map-river-body"></path>
                    <path d="${geom.riverCenterD}" class="city-map-river-core"></path>
                </g>

                <!-- 3. Waterway Watermark Labels -->
                <text x="${geom.seaLabelPt.x}" y="${geom.seaLabelPt.y}" class="city-water-label city-sea-label" transform="rotate(-80 ${geom.seaLabelPt.x} ${geom.seaLabelPt.y})">BAY OF BENGAL · বঙ্গোপসাগর ≋</text>
                <text x="${geom.riverLabelPt.x}" y="${geom.riverLabelPt.y}" class="city-water-label city-river-label" transform="rotate(52 ${geom.riverLabelPt.x} ${geom.riverLabelPt.y})">KARNAPHULI RIVER · কর্ণফুলী নদী</text>

                <!-- 4. 3D Sculpted City Bedrock & Island Elevation -->
                <g class="city-island-relief" aria-hidden="true">
                    <path d="${geom.cccBoundaryD}" class="city-island-shadow" filter="url(#ctgIslandShadow)"></path>
                    <path d="${geom.cccBoundaryD}" class="city-island-bedrock"></path>
                    <path d="${geom.cccBoundaryD}" class="city-island-bevel"></path>
                </g>

                <!-- 5. 23 Constituent Area Boundary Polygons Layer -->
                <g class="city-areas-layer">
                    ${areasSvg}
                </g>

                <!-- 6. Historic Kalurghat Rail-cum-Road Bridge (1930) Across Karnaphuli River -->
                <g class="ctg-kalurghat-bridge-group" aria-label="ঐতিহাসিক কালুরঘাট সেতু">
                    <!-- River Piers -->
                    <line x1="592" y1="243.5" x2="592" y2="253" class="ctg-bridge-pier"></line>
                    <line x1="612" y1="237" x2="612" y2="246" class="ctg-bridge-pier"></line>
                    <line x1="632" y1="230.5" x2="632" y2="239" class="ctg-bridge-pier"></line>
                    <!-- Bridge Deck Girder Base -->
                    <line x1="572" y1="250" x2="652" y2="224" class="ctg-bridge-base"></line>
                    <!-- Railway Track Deck -->
                    <line x1="572" y1="250" x2="652" y2="224" class="ctg-bridge-track"></line>
                    <!-- Historic 1930 Steel Truss Lattice Girders -->
                    <path d="M 572 250 L 582 237 L 592 243.5 L 602 230.5 L 612 237 L 622 224 L 632 230.5 L 642 218 L 652 224" class="ctg-bridge-truss"></path>
                    <!-- Top Chord of Truss -->
                    <line x1="582" y1="237" x2="642" y2="218" class="ctg-bridge-top-chord"></line>
                    <!-- Amber Deck Lantern Pips -->
                    <circle cx="582" cy="247" r="2.2" class="ctg-bridge-lantern"></circle>
                    <circle cx="602" cy="240" r="2.2" class="ctg-bridge-lantern"></circle>
                    <circle cx="622" cy="234" r="2.2" class="ctg-bridge-lantern"></circle>
                    <circle cx="642" cy="227" r="2.2" class="ctg-bridge-lantern"></circle>
                    <!-- Historic Landmark Badge -->
                    <g class="ctg-bridge-badge" transform="translate(636, 206)">
                        <rect x="-42" y="-9" width="84" height="18" rx="4" class="ctg-bridge-tag-bg"></rect>
                        <text x="0" y="1" class="ctg-bridge-tag-text">কালুরঘাট রেল সেতু 🚂</text>
                    </g>
                </g>

                <!-- 6a. 3rd Karnaphuli Bridge / Shah Amanat Bridge ("নতুন ব্রিজ") Across Karnaphuli River -->
                <g class="ctg-notun-bridge-group" aria-label="নতুন ব্রিজ (শাহ আমানত সেতু)">
                    <!-- River Piers -->
                    <line x1="545" y1="431" x2="545" y2="442" class="ctg-bridge-pier"></line>
                    <line x1="575" y1="443.5" x2="575" y2="454" class="ctg-bridge-pier"></line>
                    <!-- Bridge Deck Girder Base -->
                    <line x1="524" y1="422" x2="596" y2="452" class="ctg-bridge-base"></line>
                    <!-- Roadway Track Deck -->
                    <line x1="524" y1="422" x2="596" y2="452" class="ctg-bridge-track"></line>
                    <!-- Iconic Extradosed Cable Pylons -->
                    <line x1="545" y1="431" x2="545" y2="414" class="ctg-bridge-pylon"></line>
                    <line x1="575" y1="443.5" x2="575" y2="426.5" class="ctg-bridge-pylon"></line>
                    <!-- Fan Stay Cables -->
                    <path d="M 545 414 L 532 425 M 545 414 L 538 428 M 545 414 L 552 434 M 545 414 L 558 436.5 M 575 426.5 L 562 438 M 575 426.5 L 568 440.5 M 575 426.5 L 582 446 M 575 426.5 L 588 448.5" class="ctg-bridge-cables"></path>
                    <!-- Amber Deck Lantern Pips -->
                    <circle cx="538" cy="428" r="2.2" class="ctg-bridge-lantern"></circle>
                    <circle cx="560" cy="437" r="2.2" class="ctg-bridge-lantern"></circle>
                    <circle cx="582" cy="446" r="2.2" class="ctg-bridge-lantern"></circle>
                    <!-- Iconic River Landmark Badge In Open Waterway -->
                    <g class="ctg-bridge-badge" transform="translate(586, 474)">
                        <rect x="-60" y="-9" width="120" height="18" rx="4" class="ctg-bridge-tag-bg"></rect>
                        <text x="0" y="1" class="ctg-bridge-tag-text">নতুন ব্রিজ (শাহ আমানত সেতু) 🌉</text>
                    </g>
                </g>

                <!-- 6b. Cartographic Landmarks in Open Expanses (Patenga Coastal & Aviation) -->
                <g class="city-landmarks-layer" pointer-events="none" aria-hidden="true">
                    <!-- Shah Amanat Airport in Patenga -->
                    <g class="city-landmark-pip" transform="translate(385, 680)">
                        <circle r="2.8" class="ctg-landmark-dot"></circle>
                        <text x="7" y="3.5" class="ctg-landmark-subtext">শাহ আমানত বিমানবন্দর ✈️</text>
                    </g>
                    <!-- Naval Beach in Patenga -->
                    <g class="city-landmark-pip" transform="translate(295, 755)">
                        <circle r="2.8" class="ctg-landmark-dot"></circle>
                        <text x="7" y="3.5" class="ctg-landmark-subtext">নেভাল সৈকত ⛵</text>
                    </g>
                </g>

                <!-- 7. Luxury Cartographic Accents: Nautical Compass Rose (Upper Right) -->
                <g class="ctg-nautical-compass" transform="translate(615, 105)" aria-hidden="true">
                    <circle r="34" class="ctg-compass-ring-outer"></circle>
                    <circle r="30" class="ctg-compass-ring-inner"></circle>
                    <circle r="16" class="ctg-compass-ring-core"></circle>
                    <line x1="0" y1="-34" x2="0" y2="-28" class="ctg-compass-tick"></line>
                    <line x1="34" y1="0" x2="28" y2="0" class="ctg-compass-tick"></line>
                    <line x1="0" y1="34" x2="0" y2="28" class="ctg-compass-tick"></line>
                    <line x1="-34" y1="0" x2="-28" y2="0" class="ctg-compass-tick"></line>
                    <line x1="24" y1="-24" x2="20" y2="-20" class="ctg-compass-tick-sub"></line>
                    <line x1="24" y1="24" x2="20" y2="20" class="ctg-compass-tick-sub"></line>
                    <line x1="-24" y1="24" x2="-20" y2="20" class="ctg-compass-tick-sub"></line>
                    <line x1="-24" y1="-24" x2="-20" y2="-20" class="ctg-compass-tick-sub"></line>
                    <!-- 4-Point Star -->
                    <polygon points="0,-28 4,-12 0,-14" class="ctg-compass-star-n-light"></polygon>
                    <polygon points="0,-28 -4,-12 0,-14" class="ctg-compass-star-n-dark"></polygon>
                    <polygon points="0,28 4,12 0,14" class="ctg-compass-star-s-light"></polygon>
                    <polygon points="0,28 -4,12 0,14" class="ctg-compass-star-s-dark"></polygon>
                    <polygon points="28,0 12,4 14,0" class="ctg-compass-star-e-light"></polygon>
                    <polygon points="28,0 12,-4 14,0" class="ctg-compass-star-e-dark"></polygon>
                    <polygon points="-28,0 -12,4 -14,0" class="ctg-compass-star-w-light"></polygon>
                    <polygon points="-28,0 -12,-4 -14,0" class="ctg-compass-star-w-dark"></polygon>
                    <circle r="3.2" class="ctg-compass-pivot"></circle>
                    <text x="0" y="-39" class="ctg-compass-label ctg-compass-label-n">N</text>
                    <text x="43" y="3.5" class="ctg-compass-label">E</text>
                    <text x="0" y="47" class="ctg-compass-label">S</text>
                    <text x="-43" y="3.5" class="ctg-compass-label">W</text>
                </g>

                <!-- 8. Technical Scale Bar & Geodetic Coordinates (Lower Left Maritime Margin) -->
                <g class="ctg-carto-coords-badge" transform="translate(68, 715)" aria-hidden="true">
                    <rect x="0" y="-12" width="134" height="20" rx="4" class="ctg-coords-badge-bg"></rect>
                    <text x="67" y="2" class="ctg-coords-badge-text">22°20′ N · 91°50′ E</text>
                </g>
                <g class="ctg-carto-scale-group" transform="translate(68, 765)" aria-hidden="true">
                    <line x1="0" y1="0" x2="100" y2="0" class="ctg-scale-bar-line"></line>
                    <line x1="0" y1="-4" x2="0" y2="4" class="ctg-scale-tick"></line>
                    <line x1="50" y1="-3" x2="50" y2="3" class="ctg-scale-tick"></line>
                    <line x1="100" y1="-4" x2="100" y2="4" class="ctg-scale-tick"></line>
                    <text x="0" y="-8" class="ctg-scale-text">০</text>
                    <text x="50" y="-8" class="ctg-scale-text">২.৫</text>
                    <text x="100" y="-8" class="ctg-scale-text">৫ কিমি</text>
                    <text x="50" y="14" class="ctg-scale-subtext">SCALE 1:50,000</text>
                </g>

                <!-- 9. Crisp Area Name Labels Layer (Topmost z-order so no polygon can ever clip text) -->
                <g class="city-labels-layer" aria-hidden="true">
                    ${labelsSvg}
                </g>
            </svg>
        `;

        const svgEl = container.querySelector('.ctg-city-map-svg');

        function getSvgPoint(clientX, clientY) {
            if (!svgEl) return { x: clientX, y: clientY };
            const pt = svgEl.createSVGPoint();
            pt.x = clientX;
            pt.y = clientY;
            const ctm = svgEl.getScreenCTM();
            if (ctm) {
                return pt.matrixTransform(ctm.inverse());
            }
            return { x: clientX, y: clientY };
        }

        // 1. Direct Drag-and-Drop for Photo Area Badges (Labels with Window Tracking)
        container.querySelectorAll('.ctg-photo-area-badge.is-draggable').forEach(badge => {
            const areaId = badge.getAttribute('data-label-id');
            const area = areas.find(a => a.id === areaId);
            let isDragging = false;
            let startP = { x: 0, y: 0 };
            let initOffset = { x: 0, y: 0 };
            let hasMoved = false;

            badge.addEventListener('pointerdown', (e) => {
                const photo = state.photos[areaId];
                if (!photo || !photo.dataUrl) return;
                if (e.button !== 0 && e.pointerType === 'mouse') return;
                isDragging = true;
                hasMoved = false;
                startP = getSvgPoint(e.clientX, e.clientY);
                initOffset = {
                    x: typeof photo.labelOffsetX === 'number' ? photo.labelOffsetX : 0,
                    y: typeof photo.labelOffsetY === 'number' ? photo.labelOffsetY : 0
                };
                badge.classList.add('is-dragging');
                e.stopPropagation();

                const onMove = (ev) => {
                    if (!isDragging) return;
                    const ph = state.photos[areaId];
                    if (!ph || !area) return;
                    const curP = getSvgPoint(ev.clientX, ev.clientY);
                    const dx = curP.x - startP.x;
                    const dy = curP.y - startP.y;
                    if (Math.hypot(dx, dy) > 3) hasMoved = true;

                    ph.labelOffsetX = Math.round(initOffset.x + dx);
                    ph.labelOffsetY = Math.round(initOffset.y + dy);

                    // Real-time 60fps transform update on the badge <g>
                    const curX = area.center[0] + ph.labelOffsetX;
                    const curY = area.center[1] + ph.labelOffsetY;
                    badge.setAttribute('transform', `translate(${curX.toFixed(1)}, ${curY.toFixed(1)})`);
                };

                const onUp = (ev) => {
                    window.removeEventListener('pointermove', onMove);
                    window.removeEventListener('pointerup', onUp);
                    window.removeEventListener('pointercancel', onUp);
                    if (!isDragging) return;
                    isDragging = false;
                    badge.classList.remove('is-dragging');
                    if (hasMoved) {
                        saveState();
                        renderPosterToCanvas();
                    }
                };

                window.addEventListener('pointermove', onMove, { passive: false });
                window.addEventListener('pointerup', onUp);
                window.addEventListener('pointercancel', onUp);
            });

            badge.addEventListener('click', (e) => {
                if (hasMoved) {
                    e.stopPropagation();
                    e.preventDefault();
                    hasMoved = false;
                    return;
                }
                state.activeAreaId = areaId;
                renderAreaDock(areaId);
                renderPosterMapSvg();
            });
        });

        // 2. Direct Photo Panning and Wheel Zoom on Area Groups
        container.querySelectorAll('.ctg-area-group').forEach(group => {
            const areaId = group.getAttribute('data-area-id');
            const area = areas.find(a => a.id === areaId);
            let isPanning = false;
            let startP = { x: 0, y: 0 };
            let initPan = { x: 0, y: 0 };
            let hasMoved = false;

            group.addEventListener('pointerdown', (e) => {
                const photo = state.photos[areaId];
                // Only pan if this area has an uploaded photo
                if (!photo || !photo.dataUrl) return;
                if (e.button !== 0 && e.pointerType === 'mouse') return;
                
                // Auto-activate area dock if not already active
                if (state.activeAreaId !== areaId) {
                    state.activeAreaId = areaId;
                    renderAreaDock(areaId);
                    container.querySelectorAll('.ctg-area-group').forEach(el => {
                        el.classList.toggle('active-dock', el.getAttribute('data-area-id') === areaId);
                    });
                }

                isPanning = true;
                hasMoved = false;
                startP = getSvgPoint(e.clientX, e.clientY);
                initPan = { x: photo.panX || 0, y: photo.panY || 0 };
                group.classList.add('is-panning');
                e.stopPropagation();

                const onMove = (ev) => {
                    if (!isPanning) return;
                    const ph = state.photos[areaId];
                    if (!ph || !area || !area.bbox) return;
                    const curP = getSvgPoint(ev.clientX, ev.clientY);
                    const dx = curP.x - startP.x;
                    const dy = curP.y - startP.y;
                    if (Math.hypot(dx, dy) > 3) hasMoved = true;

                    ph.panX = Math.round(initPan.x + dx);
                    ph.panY = Math.round(initPan.y + dy);

                    // Real-time 60fps image repositioning in SVG
                    const imgEl = container.querySelector(`image[data-area-id="${areaId}"]`);
                    if (imgEl) {
                        const zoom = ph.zoom || 1.0;
                        const sw = area.bbox.width * zoom;
                        const sh = area.bbox.height * zoom;
                        const cx = area.bbox.minX + area.bbox.width / 2 + ph.panX;
                        const cy = area.bbox.minY + area.bbox.height / 2 + ph.panY;
                        imgEl.setAttribute('x', (cx - sw / 2).toFixed(1));
                        imgEl.setAttribute('y', (cy - sh / 2).toFixed(1));
                    }
                };

                const onUp = (ev) => {
                    window.removeEventListener('pointermove', onMove);
                    window.removeEventListener('pointerup', onUp);
                    window.removeEventListener('pointercancel', onUp);
                    if (!isPanning) return;
                    isPanning = false;
                    group.classList.remove('is-panning');
                    if (hasMoved) {
                        saveState();
                        renderPosterToCanvas();
                    }
                };

                window.addEventListener('pointermove', onMove, { passive: false });
                window.addEventListener('pointerup', onUp);
                window.addEventListener('pointercancel', onUp);
            });

            // Desktop Mouse Wheel Zoom
            const handleWheelZoom = (e) => {
                const photo = state.photos[areaId];
                if (!photo || !photo.dataUrl) return;
                e.preventDefault();
                e.stopPropagation();
                
                // Auto-activate dock
                if (state.activeAreaId !== areaId) {
                    state.activeAreaId = areaId;
                    renderAreaDock(areaId);
                    container.querySelectorAll('.ctg-area-group').forEach(el => {
                        el.classList.toggle('active-dock', el.getAttribute('data-area-id') === areaId);
                    });
                }

                const delta = e.deltaY < 0 ? 0.08 : -0.08;
                photo.zoom = Math.min(3.5, Math.max(0.4, +(photo.zoom + delta).toFixed(2)));

                const imgEl = container.querySelector(`image[data-area-id="${areaId}"]`);
                if (imgEl && area && area.bbox) {
                    const sw = area.bbox.width * photo.zoom;
                    const sh = area.bbox.height * photo.zoom;
                    const cx = area.bbox.minX + area.bbox.width / 2 + (photo.panX || 0);
                    const cy = area.bbox.minY + area.bbox.height / 2 + (photo.panY || 0);
                    imgEl.setAttribute('x', (cx - sw / 2).toFixed(1));
                    imgEl.setAttribute('y', (cy - sh / 2).toFixed(1));
                    imgEl.setAttribute('width', sw.toFixed(1));
                    imgEl.setAttribute('height', sh.toFixed(1));
                }
                const zoomEl = document.getElementById('dockZoomVal');
                if (zoomEl) zoomEl.textContent = `${Math.round(photo.zoom * 100)}%`;
                saveState();
                renderPosterToCanvas();
            };

            group.addEventListener('wheel', handleWheelZoom, { passive: false });
            const matchingBadge = container.querySelector(`.ctg-photo-area-badge[data-label-id="${areaId}"]`);
            if (matchingBadge) {
                matchingBadge.addEventListener('wheel', handleWheelZoom, { passive: false });
            }

            const handleAreaAction = (e) => {
                if (hasMoved) {
                    e.stopPropagation();
                    e.preventDefault();
                    hasMoved = false;
                    return;
                }
                e.stopPropagation();
                if (!areaId) return;

                const isVisited = state.visited.has(areaId);
                const hasPhoto = !!(state.photos && state.photos[areaId] && state.photos[areaId].dataUrl);
                if (!isVisited) {
                    togglePlaceVisited(areaId);
                } else {
                    if (state.activeAreaId === areaId) {
                        if (hasPhoto) {
                            renderAreaDock(areaId);
                        } else {
                            togglePlaceVisited(areaId);
                        }
                    } else {
                        state.activeAreaId = areaId;
                        renderAreaDock(areaId);
                        renderPosterMapSvg();
                    }
                }
            };

            group.addEventListener('click', handleAreaAction);
            group.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleAreaAction(e);
                }
            });
        });

        // 3. Mobile Touch Pinch-to-Zoom on Map Stage
        let pinchDist = null;
        let pinchBaseZoom = 1.0;

        container.addEventListener('touchstart', (e) => {
            if (e.touches.length === 2 && state.activeAreaId) {
                const photo = state.photos[state.activeAreaId];
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
            if (e.touches.length === 2 && pinchDist && state.activeAreaId) {
                const photo = state.photos[state.activeAreaId];
                const area = areas.find(a => a.id === state.activeAreaId);
                if (photo && photo.dataUrl && area && area.bbox) {
                    const currentDist = Math.hypot(
                        e.touches[0].clientX - e.touches[1].clientX,
                        e.touches[0].clientY - e.touches[1].clientY
                    );
                    const ratio = currentDist / pinchDist;
                    photo.zoom = Math.min(3.5, Math.max(0.4, +(pinchBaseZoom * ratio).toFixed(2)));

                    const imgEl = container.querySelector(`image[data-area-id="${state.activeAreaId}"]`);
                    if (imgEl) {
                        const sw = area.bbox.width * photo.zoom;
                        const sh = area.bbox.height * photo.zoom;
                        const cx = area.bbox.minX + area.bbox.width / 2 + (photo.panX || 0);
                        const cy = area.bbox.minY + area.bbox.height / 2 + (photo.panY || 0);
                        imgEl.setAttribute('x', (cx - sw / 2).toFixed(1));
                        imgEl.setAttribute('y', (cy - sh / 2).toFixed(1));
                        imgEl.setAttribute('width', sw.toFixed(1));
                        imgEl.setAttribute('height', sh.toFixed(1));
                    }
                    const zoomEl = document.getElementById('dockZoomVal');
                    if (zoomEl) zoomEl.textContent = `${Math.round(photo.zoom * 100)}%`;
                }
            }
        }, { passive: true });

        container.addEventListener('touchend', (e) => {
            if (pinchDist) {
                pinchDist = null;
                saveState();
                renderPosterToCanvas();
            }
        }, { passive: true });

        // Background click: deselect active area
        if (svgEl) {
            svgEl.addEventListener('click', (e) => {
                if (!e.target.closest('.ctg-area-group') && !e.target.closest('.ctg-photo-area-badge')) {
                    state.activeAreaId = null;
                    renderAreaDock(null);
                    renderPosterMapSvg();
                }
            });
        }
    }

    // 9. 1200x1500 Canvas Render Engine (Lossless PNG, JPG, PDF)
    function renderPosterToCanvas() {
        let canvas = document.getElementById('cityExportCanvas');
        if (!canvas) {
            canvas = document.createElement('canvas');
            canvas.id = 'cityExportCanvas';
            canvas.style.display = 'none';
            document.body.appendChild(canvas);
        }
        const ctx = canvas.getContext('2d');
        const W = 1200;
        const H = 1500;
        canvas.width = W;
        canvas.height = H;

        // Theme Palettes — 4 Distinct Signature Art Identities with Complete Bridge Vectors
        const palettes = {
            pothochitro: {
                bg: '#fcfaf6',
                cardBg: '#ffffff',
                line: 'rgba(30, 41, 59, 0.45)',
                textPrimary: '#0f172a',
                textSecondary: '#475569',
                accent: '#d97706',
                activeFill: '#d97706',
                activeBorder: '#0f172a',
                bedrockFill: '#e8e2d5',
                bedrockBorder: 'rgba(30, 41, 59, 0.55)',
                unvisitedFill: '#f1ece0',
                bridgeBase: '#c2410c',
                bridgeTrack: '#0f172a',
                bridgeTruss: '#0f4c81',
                bridgePylon: '#c2410c',
                bridgeCables: '#0284c7',
                bridgePier: '#334155',
                fontFamily: '"Noto Serif Bengali", Georgia, serif',
                bodyFont: '"Anek Bangla", sans-serif'
            },
            dark: { // Midnight Obsidian (Pitch-Black Titanium & Pure Champagne Gold)
                bg: '#09090b',
                cardBg: '#121217',
                line: 'rgba(251, 191, 36, 0.40)',
                textPrimary: '#ffffff',
                textSecondary: '#a1a1aa',
                accent: '#fbbf24',
                activeFill: '#ca8a04',
                activeBorder: '#fbbf24',
                bedrockFill: '#18181b',
                bedrockBorder: 'rgba(251, 191, 36, 0.65)',
                unvisitedFill: '#1c1c20',
                bridgeBase: '#ca8a04',
                bridgeTrack: '#fef08a',
                bridgeTruss: '#fbbf24',
                bridgePylon: '#eab308',
                bridgeCables: '#fde047',
                bridgePier: '#27272a',
                fontFamily: '"Noto Serif Bengali", Georgia, serif',
                bodyFont: '"Anek Bangla", sans-serif'
            },
            emerald: { // Bay of Bengal Marine (Deep Oceanic Navy & Bioluminescent Electric Cyan)
                bg: '#021526',
                cardBg: '#082338',
                line: 'rgba(56, 189, 248, 0.40)',
                textPrimary: '#ffffff',
                textSecondary: '#94a3b8',
                accent: '#00f5d4',
                activeFill: '#0284c7',
                activeBorder: '#00f5d4',
                bedrockFill: '#0b2b45',
                bedrockBorder: 'rgba(0, 245, 212, 0.65)',
                unvisitedFill: '#0d3759',
                bridgeBase: '#0284c7',
                bridgeTrack: '#67e8f9',
                bridgeTruss: '#00f5d4',
                bridgePylon: '#00f5d4',
                bridgeCables: '#38bdf8',
                bridgePier: '#071f38',
                fontFamily: '"Noto Serif Bengali", Georgia, serif',
                bodyFont: '"Anek Bangla", sans-serif'
            },
            monochrome: { // Alias to Bay of Bengal Marine
                bg: '#021526',
                cardBg: '#082338',
                line: 'rgba(56, 189, 248, 0.40)',
                textPrimary: '#ffffff',
                textSecondary: '#94a3b8',
                accent: '#00f5d4',
                activeFill: '#0284c7',
                activeBorder: '#00f5d4',
                bedrockFill: '#0b2b45',
                bedrockBorder: 'rgba(0, 245, 212, 0.65)',
                unvisitedFill: '#0d3759',
                bridgeBase: '#0284c7',
                bridgeTrack: '#67e8f9',
                bridgeTruss: '#00f5d4',
                bridgePylon: '#00f5d4',
                bridgeCables: '#38bdf8',
                bridgePier: '#071f38',
                fontFamily: '"Noto Serif Bengali", Georgia, serif',
                bodyFont: '"Anek Bangla", sans-serif'
            },
            ochre: { // Chattogram Red Earth (Roasted Espresso & Fiery Terracotta Copper)
                bg: '#180e0a',
                cardBg: '#24150f',
                line: 'rgba(251, 146, 60, 0.40)',
                textPrimary: '#ffffff',
                textSecondary: '#fdba74',
                accent: '#f97316',
                activeFill: '#ea580c',
                activeBorder: '#fed7aa',
                bedrockFill: '#2a1811',
                bedrockBorder: 'rgba(251, 146, 60, 0.65)',
                unvisitedFill: '#361e15',
                bridgeBase: '#ea580c',
                bridgeTrack: '#fed7aa',
                bridgeTruss: '#fb923c',
                bridgePylon: '#ea580c',
                bridgeCables: '#fdba74',
                bridgePier: '#27140e',
                fontFamily: '"Noto Serif Bengali", Georgia, serif',
                bodyFont: '"Anek Bangla", sans-serif'
            }
        };

        const theme = palettes[state.theme] || palettes.dark;
        const dict = window.ctgCityData.dictionary[state.lang];
        const validPlaces = (window.ctgCityData && window.ctgCityData.places) ? window.ctgCityData.places : [];
        const validIds = new Set(validPlaces.map(p => p.id));
        const total = validPlaces.length;
        const count = Math.min([...state.visited].filter(id => validIds.has(id)).length, total);
        const remaining = Math.max(0, total - count);
        const percent = total > 0 ? Math.min(100, Math.round((count / total) * 100)) : 0;

        // 1. Background
        ctx.fillStyle = theme.bg;
        ctx.fillRect(0, 0, W, H);

        // 2. Poster Outer Margin Frame
        ctx.strokeStyle = theme.line;
        ctx.lineWidth = 2.5;
        ctx.strokeRect(40, 40, W - 80, H - 80);

        // Subtle Inner Architectural Inset Hairline Frame
        ctx.save();
        ctx.strokeStyle = (state.theme === 'pothochitro') ? 'rgba(217, 119, 6, 0.28)' : 'rgba(255, 255, 255, 0.08)';
        ctx.lineWidth = 1;
        ctx.strokeRect(48, 48, W - 96, H - 96);
        ctx.restore();

        // 3. Technical Corner Marks
        const cornerLen = 24;
        ctx.strokeStyle = theme.accent;
        ctx.lineWidth = 3.5;
        // Top-left
        ctx.beginPath(); ctx.moveTo(40, 40 + cornerLen); ctx.lineTo(40, 40); ctx.lineTo(40 + cornerLen, 40); ctx.stroke();
        // Top-right
        ctx.beginPath(); ctx.moveTo(W - 40 - cornerLen, 40); ctx.lineTo(W - 40, 40); ctx.lineTo(W - 40, 40 + cornerLen); ctx.stroke();
        // Bottom-left
        ctx.beginPath(); ctx.moveTo(40, H - 40 - cornerLen); ctx.lineTo(40, H - 40); ctx.lineTo(40 + cornerLen, H - 40); ctx.stroke();
        // Bottom-right
        ctx.beginPath(); ctx.moveTo(W - 40 - cornerLen, H - 40); ctx.lineTo(W - 40, H - 40); ctx.lineTo(W - 40, H - 40 - cornerLen); ctx.stroke();

        // 4. Header Titles (Clean Gallery-Grade Title Focus)
        ctx.textAlign = 'left';
        ctx.fillStyle = theme.textPrimary;
        ctx.font = `800 52px ${theme.fontFamily}`;
        ctx.fillText(state.posterTitle || dict.posterDefaultTitle, 70, 138);

        ctx.fillStyle = theme.textSecondary;
        ctx.font = `500 20px ${theme.bodyFont}`;
        let canvasSub = dict.posterDefaultSub;
        if (state.authorName && state.authorName.trim()) {
            const author = state.authorName.trim();
            canvasSub = (state.lang === 'chatgaya')
                ? `কালুরঘাটত্তুন পতেঙ্গা—${author}র ব্যক্তিগত স্মৃতি মানচিত্র`
                : `কালুরঘাটত্তুন পতেঙ্গা—${author}-এর ব্যক্তিগত স্মৃতি মানচিত্র`;
        }
        ctx.fillText(canvasSub, 70, 180);

        // 5. Circular Progress Dial on Top Right (Benchmark Replica media_1791553063691.png)
        const dialCenterX = W - 150;
        const dialCenterY = 135;
        const dialR = 48;

        // Outer tick ring
        ctx.save();
        ctx.strokeStyle = theme.accent;
        ctx.lineWidth = 1.6;
        ctx.setLineDash([3, 6]);
        ctx.beginPath();
        ctx.arc(dialCenterX, dialCenterY, dialR + 8, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();

        // Background track
        ctx.save();
        ctx.fillStyle = (state.theme === 'pothochitro') ? '#ffffff' : 'rgba(10, 38, 28, 0.85)';
        ctx.beginPath();
        ctx.arc(dialCenterX, dialCenterY, dialR, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = (state.theme === 'pothochitro') ? 'rgba(0,0,0,0.08)' : 'rgba(255, 255, 255, 0.12)';
        ctx.lineWidth = 4;
        ctx.stroke();
        ctx.restore();

        // Animated progress arc
        const pct = percent;
        if (pct > 0) {
            ctx.save();
            ctx.strokeStyle = theme.accent;
            ctx.lineWidth = 4.5;
            ctx.lineCap = 'round';
            ctx.beginPath();
            ctx.arc(dialCenterX, dialCenterY, dialR, -Math.PI / 2, -Math.PI / 2 + (pct / 100) * Math.PI * 2);
            ctx.stroke();
            ctx.restore();
        }

        // Bold Total Numeral (Dynamic Total: 21 Areas)
        ctx.save();
        ctx.fillStyle = (state.theme === 'pothochitro') ? '#1a1a1a' : '#ffffff';
        ctx.font = '900 34px "Noto Serif Bengali", serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(toBengaliDigits(total), dialCenterX, dialCenterY - 6);

        // Gold Percentage Label underneath numeral
        ctx.fillStyle = theme.accent;
        ctx.font = '700 12px "Anek Bangla", sans-serif';
        ctx.fillText(`${toBengaliDigits(pct)}% ভ্রমণ`, dialCenterX, dialCenterY + 18);

        // Dial Title & Stats underneath the circle
        let currentRank = dict.rankLevels[0];
        for (let i = dict.rankLevels.length - 1; i >= 0; i--) {
            if (count >= dict.rankLevels[i].threshold) {
                currentRank = dict.rankLevels[i];
                break;
            }
        }

        ctx.fillStyle = (state.theme === 'pothochitro') ? '#1a1a1a' : '#ffffff';
        ctx.font = '700 15px "Noto Serif Bengali", serif';
        ctx.fillText(currentRank.title, dialCenterX, dialCenterY + 74);

        ctx.fillStyle = (state.theme === 'pothochitro') ? '#666666' : 'rgba(255, 255, 255, 0.75)';
        ctx.font = '600 13px "Anek Bangla", sans-serif';
        ctx.fillText(`${toBengaliDigits(count)} ঘোরা · ${toBengaliDigits(remaining)} বাকি`, dialCenterX, dialCenterY + 95);
        ctx.restore();

        // Architectural Divider
        ctx.strokeStyle = theme.line;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(70, 220);
        ctx.lineTo(W - 70, 220);
        ctx.stroke();

        // 7. 21-Area Boundary Polygons & Natural Waterways on Canvas (High-Res 1200x1500)
        const geom = getMapGeometry();
        const cScale = 1.46;
        const cMapOffsetX = (W - 680 * cScale) / 2 + 15;
        const cMapOffsetY = 195;

        ctx.save();
        ctx.translate(cMapOffsetX, cMapOffsetY);
        ctx.scale(cScale, cScale);

        // 1. Concentric Bay of Bengal Ocean Waves & Open-Water Ripples
        if (geom.rippleCoords && geom.rippleCoords.length) {
            geom.rippleCoords.forEach(rp => {
                ctx.save();
                ctx.translate(rp.x, rp.y);
                ctx.scale(rp.s, rp.s);
                ctx.strokeStyle = (state.theme === 'pothochitro') ? 'rgba(14, 90, 130, 0.55)' : (state.theme === 'dark' ? 'rgba(72, 202, 228, 0.70)' : 'rgba(42, 157, 143, 0.65)');
                ctx.lineWidth = 1.6;
                ctx.lineCap = 'round';
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.bezierCurveTo(5, -4, 11, -4, 16, 0);
                ctx.bezierCurveTo(21, -4, 27, -4, 32, 0);
                ctx.stroke();
                ctx.lineWidth = 1.0;
                ctx.globalAlpha = 0.55;
                ctx.beginPath();
                ctx.moveTo(5, 3);
                ctx.bezierCurveTo(8, 0.5, 12, 0.5, 15, 3);
                ctx.bezierCurveTo(18, 0.5, 22, 0.5, 25, 3);
                ctx.stroke();
                ctx.restore();
            });
        }

        const waves = [
            { d: geom.wave4PathD, w: 2.2, a: 0.25, dash: [6, 12] },
            { d: geom.wave3PathD, w: 1.8, a: 0.35, dash: [14, 8] },
            { d: geom.wave2PathD, w: 1.8, a: 0.45, dash: [10, 6] },
            { d: geom.wave1PathD, w: 2.0, a: 0.60, dash: [] },
            { d: geom.coastPathD, w: 2.5, a: 0.75, dash: [] }
        ];
        waves.forEach(wv => {
            if (wv.d) {
                ctx.save();
                ctx.strokeStyle = (state.theme === 'pothochitro') ? '#0e5a82' : (state.theme === 'dark' ? '#48cae4' : '#2a9d8f');
                ctx.globalAlpha = (state.theme === 'pothochitro') ? wv.a * 0.85 : wv.a;
                ctx.lineWidth = wv.w;
                ctx.lineCap = 'round';
                ctx.lineJoin = 'round';
                if (wv.dash.length) ctx.setLineDash(wv.dash);
                ctx.stroke(new Path2D(wv.d));
                ctx.restore();
            }
        });

        // 2. Karnaphuli River
        if (geom.riverCenterD) {
            const rPath = new Path2D(geom.riverCenterD);
            // Ambient wide glow
            ctx.save();
            ctx.strokeStyle = '#2a9d8f';
            ctx.globalAlpha = 0.25;
            ctx.lineWidth = 26;
            ctx.lineCap = 'round';
            ctx.stroke(rPath);
            ctx.restore();

            // River gradient body
            ctx.save();
            const rGrad = ctx.createLinearGradient(550, 200, 700, 750);
            rGrad.addColorStop(0, '#023e8a');
            rGrad.addColorStop(0.4, '#0077b6');
            rGrad.addColorStop(0.75, '#2a9d8f');
            rGrad.addColorStop(1, '#48cae4');
            ctx.strokeStyle = (state.theme === 'pothochitro') ? '#0077b6' : rGrad;
            ctx.globalAlpha = 0.90;
            ctx.lineWidth = 16;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.stroke(rPath);
            ctx.restore();

            // Flow line
            ctx.save();
            ctx.strokeStyle = '#ffffff';
            ctx.globalAlpha = 0.65;
            ctx.lineWidth = 2.8;
            ctx.lineCap = 'round';
            ctx.setLineDash([6, 5]);
            ctx.stroke(rPath);
            ctx.restore();
        }

        // 3. Watermark text labels
        ctx.save();
        ctx.font = '700 11px "Plus Jakarta Sans", sans-serif';
        // Bay of Bengal
        ctx.save();
        ctx.fillStyle = (state.theme === 'pothochitro') ? '#0077b6' : 'rgba(72, 202, 228, 0.75)';
        ctx.translate(geom.seaLabelPt.x, geom.seaLabelPt.y);
        ctx.rotate(-80 * Math.PI / 180);
        ctx.fillText('BAY OF BENGAL · বঙ্গোপসাগর ≋', 0, 0);
        ctx.restore();
        // Karnaphuli River
        ctx.save();
        ctx.fillStyle = (state.theme === 'pothochitro') ? '#2a9d8f' : 'rgba(42, 157, 143, 0.85)';
        ctx.translate(geom.riverLabelPt.x, geom.riverLabelPt.y);
        ctx.rotate(52 * Math.PI / 180);
        ctx.fillText('KARNAPHULI RIVER · কর্ণফুলী নদী', 0, 0);
        ctx.restore();
        ctx.restore();

        // 4. 3D Sculpted City Bedrock & Island Relief
        if (geom.cccBoundaryD) {
            const boundaryPath = new Path2D(geom.cccBoundaryD);
            // Drop shadow
            ctx.save();
            ctx.shadowColor = 'rgba(0, 0, 0, 0.75)';
            ctx.shadowBlur = 24;
            ctx.shadowOffsetY = 14;
            ctx.fillStyle = theme.bedrockFill;
            ctx.fill(boundaryPath);
            ctx.restore();

            // Bedrock stroke
            ctx.save();
            ctx.strokeStyle = theme.bedrockBorder;
            ctx.lineWidth = 2.2;
            ctx.stroke(boundaryPath);
            ctx.restore();
        }

        // 5. 21 Constituent Area Boundary Polygons & Clipped Photos
        const areas = window.ctgCityData.areas || window.ctgCityData.places || [];
        
        // Pass 1: Draw All Polygon Fills & Uploaded Photos First
        areas.forEach(a => {
            const isVisited = state.visited.has(a.id);
            const photo = state.photos[a.id];
            const rawName = state.lang === 'chatgaya' ? a.name_cg : a.name_bn;
            const path = new Path2D(a.d);

            // Background Polygon Fill
            ctx.save();
            if (isVisited) {
                ctx.fillStyle = theme.activeFill;
            } else {
                ctx.fillStyle = theme.unvisitedFill;
            }
            ctx.fill(path);
            ctx.restore();

            // Clipped Photo if uploaded (with pan & zoom)
            if (photo && photo.dataUrl) {
                ctx.save();
                ctx.clip(path);
                const img = new Image();
                img.src = photo.dataUrl;
                if (img.complete && img.naturalWidth > 0) {
                    const zoom = (typeof photo.zoom === 'number') ? photo.zoom : 1.0;
                    const panX = (typeof photo.panX === 'number') ? photo.panX : 0;
                    const panY = (typeof photo.panY === 'number') ? photo.panY : 0;
                    const sw = a.bbox.width * zoom;
                    const sh = a.bbox.height * zoom;
                    const cx = a.bbox.minX + a.bbox.width / 2;
                    const cy = a.bbox.minY + a.bbox.height / 2;
                    const posX = cx - sw / 2 + panX;
                    const posY = cy - sh / 2 + panY;
                    ctx.drawImage(img, posX, posY, sw, sh);
                }
                ctx.fillStyle = 'rgba(0, 0, 0, 0.22)';
                ctx.fill(path);
                ctx.restore();
            }
        });

        // Pass 2: Draw Crisp Cartographic Boundary Strokes On Top (Guarantees Razor-Sharp Borders Even When Adjacent Areas Are Visited)
        areas.forEach(a => {
            const isVisited = state.visited.has(a.id);
            const path = new Path2D(a.d);

            ctx.save();
            ctx.strokeStyle = isVisited ? (theme.activeBorder || theme.accent) : (state.theme === 'pothochitro' ? 'rgba(15, 23, 42, 0.40)' : 'rgba(233, 196, 106, 0.35)');
            ctx.lineWidth = isVisited ? 2.5 : 1.4;
            ctx.lineJoin = 'round';
            if (isVisited && state.theme !== 'pothochitro') {
                ctx.shadowColor = (state.theme === 'emerald') ? 'rgba(0, 245, 212, 0.65)' : (state.theme === 'ochre' ? 'rgba(251, 146, 60, 0.65)' : 'rgba(233, 196, 106, 0.65)');
                ctx.shadowBlur = 8;
            }
            ctx.stroke(path);
            ctx.restore();
        });

        // 6. Historic Kalurghat Rail-cum-Road Bridge (1930) Across Karnaphuli River
        ctx.save();
        // River Piers
        ctx.strokeStyle = theme.bridgePier || '#334155';
        ctx.lineWidth = 3.5;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(592, 242); ctx.lineTo(592, 249);
        ctx.moveTo(606, 238); ctx.lineTo(606, 245);
        ctx.stroke();

        // Bridge Base Deck Girder
        ctx.strokeStyle = theme.bridgeBase || '#ca8a04';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(578, 247.5); ctx.lineTo(620, 235);
        ctx.stroke();

        // Railway Track
        ctx.strokeStyle = theme.bridgeTrack || '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([2, 3]);
        ctx.beginPath();
        ctx.moveTo(578, 247.5); ctx.lineTo(620, 235);
        ctx.stroke();
        ctx.setLineDash([]);

        // Steel Truss Lattice Girders
        ctx.strokeStyle = theme.bridgeTruss || '#fbbf24';
        ctx.lineWidth = 1.8;
        ctx.lineJoin = 'round';
        ctx.beginPath();
        ctx.moveTo(578, 247.5);
        ctx.lineTo(585, 237);
        ctx.lineTo(592, 243.5);
        ctx.lineTo(599, 233);
        ctx.lineTo(606, 239.5);
        ctx.lineTo(613, 229);
        ctx.lineTo(620, 235);
        ctx.stroke();

        // Top Chord
        ctx.beginPath();
        ctx.moveTo(585, 237); ctx.lineTo(613, 229);
        ctx.stroke();

        // Amber Deck Lantern Pips
        ctx.fillStyle = '#ffeaa7';
        [ [585, 242], [599, 238], [613, 234] ].forEach(pt => {
            ctx.beginPath();
            ctx.arc(pt[0], pt[1], 2.2, 0, Math.PI * 2);
            ctx.fill();
        });

        // 6b. Notun Bridge (Shah Amanat Bridge / 3rd Karnaphuli Bridge)
        // River Piers
        ctx.strokeStyle = theme.bridgePier || '#334155';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(539, 427); ctx.lineTo(539, 435);
        ctx.moveTo(559, 434); ctx.lineTo(559, 442);
        ctx.stroke();

        // Bridge Deck Girder Base
        ctx.strokeStyle = theme.bridgeBase || '#ca8a04';
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(526, 422); ctx.lineTo(572, 438);
        ctx.stroke();

        // Roadway Track
        ctx.strokeStyle = theme.bridgeTrack || '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([2, 3]);
        ctx.beginPath();
        ctx.moveTo(526, 422); ctx.lineTo(572, 438);
        ctx.stroke();
        ctx.setLineDash([]);

        // Iconic Extradosed Cable Pylons
        ctx.strokeStyle = theme.bridgePylon || '#eab308';
        ctx.lineWidth = 2.4;
        ctx.beginPath();
        ctx.moveTo(539, 427); ctx.lineTo(539, 413);
        ctx.moveTo(559, 434); ctx.lineTo(559, 420);
        ctx.stroke();

        // Stay Cables
        ctx.strokeStyle = theme.bridgeCables || theme.accent;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        // Pylon 1
        ctx.moveTo(539, 413); ctx.lineTo(530, 423.5);
        ctx.moveTo(539, 413); ctx.lineTo(534, 425);
        ctx.moveTo(539, 413); ctx.lineTo(544, 428);
        ctx.moveTo(539, 413); ctx.lineTo(548, 430);
        // Pylon 2
        ctx.moveTo(559, 420); ctx.lineTo(550, 430.5);
        ctx.moveTo(559, 420); ctx.lineTo(554, 432);
        ctx.moveTo(559, 420); ctx.lineTo(564, 435);
        ctx.moveTo(559, 420); ctx.lineTo(568, 436.5);
        ctx.stroke();

        // Amber Deck Lantern Pips
        ctx.fillStyle = '#ffeaa7';
        [ [534, 425], [549, 430], [564, 435] ].forEach(pt => {
            ctx.beginPath();
            ctx.arc(pt[0], pt[1], 2.2, 0, Math.PI * 2);
            ctx.fill();
        });

        // 7. Nautical Compass Rose (Upper Right)
        ctx.save();
        ctx.translate(615, 105);
        ctx.strokeStyle = (state.theme === 'pothochitro') ? 'rgba(0,0,0,0.3)' : 'rgba(233, 196, 106, 0.4)';
        ctx.lineWidth = 1;
        ctx.setLineDash([2, 4]);
        ctx.beginPath(); ctx.arc(0, 0, 34, 0, Math.PI * 2); ctx.stroke();
        ctx.setLineDash([]);
        ctx.beginPath(); ctx.arc(0, 0, 30, 0, Math.PI * 2); ctx.stroke();
        ctx.beginPath(); ctx.arc(0, 0, 16, 0, Math.PI * 2); ctx.stroke();
        // Cardinal ticks
        ctx.beginPath();
        ctx.moveTo(0, -34); ctx.lineTo(0, -28);
        ctx.moveTo(34, 0); ctx.lineTo(28, 0);
        ctx.moveTo(0, 34); ctx.lineTo(0, 28);
        ctx.moveTo(-34, 0); ctx.lineTo(-28, 0);
        ctx.stroke();
        // North needle (Gold)
        ctx.fillStyle = theme.accent;
        ctx.beginPath(); ctx.moveTo(0, -28); ctx.lineTo(4, -12); ctx.lineTo(0, -14); ctx.closePath(); ctx.fill();
        ctx.fillStyle = '#c79a2e';
        ctx.beginPath(); ctx.moveTo(0, -28); ctx.lineTo(-4, -12); ctx.lineTo(0, -14); ctx.closePath(); ctx.fill();
        // Other 3 arrows
        ctx.fillStyle = (state.theme === 'pothochitro') ? '#333333' : 'rgba(255, 255, 255, 0.7)';
        ctx.beginPath(); ctx.moveTo(0, 28); ctx.lineTo(4, 12); ctx.lineTo(0, 14); ctx.closePath(); ctx.fill();
        ctx.beginPath(); ctx.moveTo(28, 0); ctx.lineTo(12, 4); ctx.lineTo(14, 0); ctx.closePath(); ctx.fill();
        ctx.beginPath(); ctx.moveTo(-28, 0); ctx.lineTo(-12, 4); ctx.lineTo(-14, 0); ctx.closePath(); ctx.fill();
        // Pivot
        ctx.fillStyle = theme.accent;
        ctx.beginPath(); ctx.arc(0, 0, 3.2, 0, Math.PI * 2); ctx.fill();
        // Labels
        ctx.font = '800 11px "Plus Jakarta Sans", sans-serif';
        ctx.fillStyle = theme.accent;
        ctx.textAlign = 'center';
        ctx.fillText('N', 0, -39);
        ctx.font = '600 10px "Plus Jakarta Sans", sans-serif';
        ctx.fillStyle = (state.theme === 'pothochitro') ? '#555555' : 'rgba(255, 255, 255, 0.65)';
        ctx.fillText('E', 43, 3.5);
        ctx.fillText('S', 0, 47);
        ctx.fillText('W', -43, 3.5);
        ctx.restore();

        // 8. Scale & Coordinates (Lower Left)
        ctx.save();
        ctx.translate(68, 715);
        ctx.fillStyle = (state.theme === 'pothochitro') ? '#ffffff' : 'rgba(12, 35, 26, 0.75)';
        ctx.strokeStyle = (state.theme === 'pothochitro') ? 'rgba(0,0,0,0.15)' : 'rgba(233, 196, 106, 0.3)';
        ctx.lineWidth = 1;
        roundRect(ctx, 0, -12, 134, 20, 4);
        ctx.fill(); ctx.stroke();
        ctx.font = '600 10.5px "Plus Jakarta Sans", monospace';
        ctx.fillStyle = theme.accent;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('22°20′ N · 91°50′ E', 67, 0);
        ctx.restore();

        ctx.save();
        ctx.translate(68, 765);
        ctx.strokeStyle = (state.theme === 'pothochitro') ? '#555555' : 'rgba(255, 255, 255, 0.5)';
        ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(100, 0); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, -4); ctx.lineTo(0, 4); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(50, -3); ctx.lineTo(50, 3); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(100, -4); ctx.lineTo(100, 4); ctx.stroke();
        ctx.font = '600 10px "Anek Bangla", sans-serif';
        ctx.fillStyle = (state.theme === 'pothochitro') ? '#333333' : 'rgba(255, 255, 255, 0.7)';
        ctx.textAlign = 'center';
        ctx.fillText('০', 0, -8);
        ctx.fillText('২.৫', 50, -8);
        ctx.fillText('৫ কিমি', 100, -8);
        ctx.font = '700 8px "Plus Jakarta Sans", sans-serif';
        ctx.fillStyle = theme.accent;
        ctx.fillText('SCALE 1:50,000', 50, 14);
        ctx.restore();

        // 9. Centered Area Name Labels (Topmost Layer: rendered after all polygons & landmarks so text is never clipped)
        areas.forEach(a => {
            const isVisited = state.visited.has(a.id);
            const photo = state.photos[a.id];
            const mapLabel = state.lang === 'chatgaya' ? (a.map_label_cg || a.name_cg) : (a.map_label_bn || a.name_bn);

            if (isVisited && photo && photo.dataUrl) {
                if (photo.hideLabel) return;
                const offX = photo.labelOffsetX || 0;
                const offY = photo.labelOffsetY || 0;
                const baseX = a.center[0];
                const baseY = a.center[1];
                const curX = baseX + offX;
                const curY = baseY + offY;
                const pillW = Math.max(48, mapLabel.length * 8 + 22);
                const pillH = 15;

                ctx.save();
                ctx.fillStyle = (state.theme === 'pothochitro') ? 'rgba(255, 255, 255, 0.94)' : 'rgba(6, 19, 14, 0.9)';
                ctx.strokeStyle = theme.accent;
                ctx.lineWidth = 1.2;
                roundRect(ctx, curX - pillW / 2, curY - pillH / 2, pillW, pillH, pillH / 2);
                ctx.fill();
                ctx.stroke();

                ctx.font = '700 10px "Noto Serif Bengali", serif';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillStyle = (state.theme === 'pothochitro') ? '#1a1a1a' : '#ffffff';
                ctx.fillText(mapLabel, curX, curY);
                ctx.restore();
            } else {
                ctx.save();
                ctx.font = '700 12.5px "Noto Serif Bengali", serif';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                if (isVisited) {
                    ctx.strokeStyle = 'rgba(15, 23, 42, 0.95)';
                    ctx.lineWidth = 2.4;
                    ctx.lineJoin = 'round';
                    ctx.strokeText(mapLabel, a.center[0], a.center[1]);
                    ctx.fillStyle = '#ffffff';
                    ctx.fillText(mapLabel, a.center[0], a.center[1]);
                } else {
                    ctx.strokeStyle = (state.theme === 'pothochitro') ? 'rgba(255, 255, 255, 0.95)' : '#071711';
                    ctx.lineWidth = 3.2;
                    ctx.lineJoin = 'round';
                    ctx.strokeText(mapLabel, a.center[0], a.center[1]);
                    ctx.fillStyle = (state.theme === 'pothochitro') ? '#1e293b' : '#ffffff';
                    ctx.fillText(mapLabel, a.center[0], a.center[1]);
                }
                ctx.restore();
            }
        });

        ctx.restore(); // end map scale/translate

        ctx.restore(); // end context

        // 9. Footer Branding
        ctx.textAlign = 'left';
        ctx.fillStyle = theme.textSecondary;
        ctx.font = '500 16px "Plus Jakarta Sans", sans-serif';
        ctx.fillText('#MYCHATTOGRAM · #CHATTOGRAMCITY', 70, H - 70);

        // QR Code & Attribution
        if (ctgStaticQrImg && ctgStaticQrImg.complete && ctgStaticQrImg.naturalWidth) {
            ctx.drawImage(ctgStaticQrImg, W - 70 - 44, H - 90, 44, 44);
            ctx.textAlign = 'right';
            ctx.fillStyle = theme.accent;
            ctx.font = '700 16px "Plus Jakarta Sans", sans-serif';
            if ('letterSpacing' in ctx) ctx.letterSpacing = '2px';
            ctx.fillText("● SAKIB'S CREATION", W - 70 - 54, H - 74);
            if ('letterSpacing' in ctx) ctx.letterSpacing = '0px';

            ctx.fillStyle = theme.textSecondary || "#94a3b8";
            ctx.font = '600 12px "Plus Jakarta Sans", sans-serif';
            ctx.fillText("ghuraghuri.vercel.app/chattogram", W - 70 - 54, H - 54);
        } else {
            ctx.textAlign = 'right';
            ctx.fillStyle = theme.accent;
            ctx.font = '700 16px "Plus Jakarta Sans", sans-serif';
            if ('letterSpacing' in ctx) ctx.letterSpacing = '2.5px';
            ctx.fillText("● SAKIB'S CREATION", W - 70, H - 75);
            if ('letterSpacing' in ctx) ctx.letterSpacing = '0px';

            ctx.fillStyle = theme.textSecondary || "#94a3b8";
            ctx.font = '600 12px "Plus Jakarta Sans", sans-serif';
            ctx.fillText("ghuraghuri.vercel.app/chattogram", W - 70, H - 55);
        }
    }

    function roundRect(ctx, x, y, w, h, r) {
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

    // 9. 3-Format Lossless Download Engine
    function downloadPoster(format) {
        const canvas = document.getElementById('cityExportCanvas');
        if (!canvas) return;

        const btnId = format === 'png' ? 'btnDownloadCityPng' : (format === 'jpg' ? 'btnDownloadCityJpg' : 'btnDownloadCityPdf');
        const btn = document.getElementById(btnId);
        if (btn) {
            btn.style.opacity = '0.6';
            btn.style.pointerEvents = 'none';
            btn.style.transform = 'scale(0.97)';
        }

        // Ensure canvas is freshly rendered
        renderPosterToCanvas();

        const timestamp = new Date().toISOString().split('T')[0];
        const sanitizedTitle = (state.posterTitle || 'My-Chattogram-City').replace(/[^a-zA-Z0-9\u0980-\u09FF_-]/g, '-');
        const filename = `${sanitizedTitle}-${state.theme}-${timestamp}`;

        setTimeout(() => {
            try {
                if (format === 'png') {
                    const dataUrl = canvas.toDataURL('image/png');
                    triggerDownload(dataUrl, `${filename}.png`);
                    showToast(state.lang === 'chatgaya' ? 'Ultra HD PNG নামি গিয়্যি!' : 'Ultra HD PNG ডাউনলোড সম্পন্ন!');
                } else if (format === 'jpg') {
                    const dataUrl = canvas.toDataURL('image/jpeg', 1.0);
                    triggerDownload(dataUrl, `${filename}.jpg`);
                    showToast(state.lang === 'chatgaya' ? '100% Quality JPG নামি গিয়্যি!' : '100% কোয়ালিটি JPG ডাউনলোড সম্পন্ন!');
                } else if (format === 'pdf') {
                    const runPdfExport = () => {
                        if (window.jspdf && window.jspdf.jsPDF) {
                            try {
                                const { jsPDF } = window.jspdf;
                                const pdf = new jsPDF({
                                    orientation: 'portrait',
                                    unit: 'mm',
                                    format: 'a4'
                                });
                                const imgData = canvas.toDataURL('image/jpeg', 0.98);
                                const pdfW = pdf.internal.pageSize.getWidth();
                                const pdfH = pdf.internal.pageSize.getHeight();
                                pdf.addImage(imgData, 'JPEG', 0, 0, pdfW, pdfH);
                                pdf.save(`${filename}.pdf`);
                                showToast(state.lang === 'chatgaya' ? 'প্রিন্ট রেডি PDF নামি গিয়্যি!' : 'প্রিন্ট রেডি PDF ডাউনলোড সম্পন্ন!');
                            } catch (err) {
                                console.error('[CityEngine] PDF generation error:', err);
                                triggerDownload(canvas.toDataURL('image/png'), `${filename}.png`);
                            }
                        } else {
                            console.warn('[CityEngine] jsPDF not loaded, falling back to PNG');
                            triggerDownload(canvas.toDataURL('image/png'), `${filename}.png`);
                        }
                    };

                    if (window.loadJsPdfOnDemand && (!window.jspdf || !window.jspdf.jsPDF)) {
                        window.loadJsPdfOnDemand(runPdfExport);
                    } else {
                        runPdfExport();
                    }
                }
            } finally {
                if (btn) {
                    btn.style.opacity = '1';
                    btn.style.pointerEvents = 'auto';
                    btn.style.transform = 'none';
                }
            }
        }, 120);
    }

    function triggerDownload(url, filename) {
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    // 10. Event Listeners
    let eventListenersInitialized = false;
    function setupEventListeners() {
        if (eventListenersInitialized) return;
        eventListenersInitialized = true;

        // Language Toggle Button
        const btnLang = document.getElementById('btnCityLangToggle');
        if (btnLang) {
            btnLang.addEventListener('click', () => {
                state.lang = (state.lang === 'chatgaya') ? 'standard_bn' : 'chatgaya';
                const dict = window.ctgCityData.dictionary[state.lang];
                // Update default title if user hasn't typed custom one
                if (!state.posterTitle || state.posterTitle === 'My Chattogram City' || state.posterTitle === 'আঁর চাটগাঁ শহর' || state.posterTitle === 'আমার চট্টগ্রাম শহর') {
                    state.posterTitle = dict.posterDefaultTitle;
                }
                saveState();
                populateFilters();
                renderPlacesList();
                updateUI();
                renderAreaDock(state.activeAreaId);
                updateAudioButtonUI();
                showToast(state.lang === 'chatgaya' ? 'খাঁটি চাটগাঁইয়া বুলি অন অইয়ে!' : 'প্রমিত বাংলায় রূপান্তরিত হয়েছে!');
            });
        }

        // Audio Toggle (Sidebar & Floating Pill)
        const btnAudio = document.getElementById('btnToggleCityAudio');
        if (btnAudio) {
            btnAudio.addEventListener('click', (e) => {
                e.preventDefault();
                toggleAudio();
            });
        }

        const btnFloatingPlay = document.getElementById('btnFloatingPlayPause');
        if (btnFloatingPlay) {
            btnFloatingPlay.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleAudio();
            });
        }

        const floatingPill = document.getElementById('ctgFloatingAudioPill');
        const btnMinimizeAudio = document.getElementById('btnMinimizeAudioPill');
        if (floatingPill) {
            if (btnMinimizeAudio) {
                btnMinimizeAudio.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const isMin = floatingPill.classList.toggle('is-minimized');
                    btnMinimizeAudio.textContent = isMin ? '+' : '−';
                    btnMinimizeAudio.setAttribute('title', isMin ? 'প্লেয়ার বিস্তার করুন' : 'প্লেয়ার সংক্ষেপ করুন');
                });
            }
            floatingPill.addEventListener('click', (e) => {
                if (e.target.closest('#btnFloatingPlayPause') || e.target.closest('#btnMinimizeAudioPill')) return;
                if (floatingPill.classList.contains('is-minimized')) {
                    floatingPill.classList.remove('is-minimized');
                    if (btnMinimizeAudio) {
                        btnMinimizeAudio.textContent = '−';
                        btnMinimizeAudio.setAttribute('title', 'প্লেয়ার সংক্ষেপ করুন');
                    }
                    return;
                }
                e.preventDefault();
                toggleAudio();
            });
        }

        // Selection Actions
        const btnSelectAll = document.getElementById('btnCitySelectAll');
        if (btnSelectAll) btnSelectAll.addEventListener('click', selectAllPlaces);

        const btnClear = document.getElementById('btnCityClear');
        if (btnClear) btnClear.addEventListener('click', clearAllPlaces);

        // Title Input
        const titleInput = document.getElementById('inputCityPosterTitle');
        if (titleInput) {
            titleInput.addEventListener('input', (e) => {
                state.posterTitle = e.target.value;
                safeText('cityTitleCharCounter', `${toBengaliDigits(state.posterTitle.length)} / ৩২`);
                safeText('cityPosterLiveTitle', state.posterTitle);
                saveState();
                renderPosterToCanvas();
            });
        }

        // Reset Title Button
        const btnResetTitle = document.getElementById('btnResetCityTitle');
        if (btnResetTitle) {
            btnResetTitle.addEventListener('click', () => {
                const dict = window.ctgCityData.dictionary[state.lang];
                state.posterTitle = dict.posterDefaultTitle;
                if (titleInput) titleInput.value = state.posterTitle;
                saveState();
                updateUI();
            });
        }

        // Author Name Inputs (Two-Way Sync: Quick Bar & Sidebar) & Reset Buttons
        const nameInput = document.getElementById('inputCityAuthorName');
        const btnResetAuthor = document.getElementById('btnResetCityAuthor');
        const quickNameInput = document.getElementById('inputCityQuickAuthorName');
        const btnResetQuickAuthor = document.getElementById('btnResetCityQuickAuthor');

        function handleAuthorInput(val) {
            state.authorName = val;
            if (nameInput && nameInput.value !== val) nameInput.value = val;
            if (quickNameInput && quickNameInput.value !== val) quickNameInput.value = val;
            const hasText = Boolean(val && val.trim());
            if (btnResetAuthor) btnResetAuthor.style.display = hasText ? 'flex' : 'none';
            if (btnResetQuickAuthor) btnResetQuickAuthor.style.display = hasText ? 'flex' : 'none';
            saveState();
            updateUI();
        }

        function clearAuthorName() {
            state.authorName = '';
            if (nameInput) nameInput.value = '';
            if (quickNameInput) quickNameInput.value = '';
            if (btnResetAuthor) btnResetAuthor.style.display = 'none';
            if (btnResetQuickAuthor) btnResetQuickAuthor.style.display = 'none';
            saveState();
            updateUI();
        }

        if (nameInput) {
            nameInput.addEventListener('input', (e) => handleAuthorInput(e.target.value));
        }
        if (btnResetAuthor) {
            btnResetAuthor.addEventListener('click', clearAuthorName);
        }
        if (quickNameInput) {
            quickNameInput.addEventListener('input', (e) => handleAuthorInput(e.target.value));
        }
        if (btnResetQuickAuthor) {
            btnResetQuickAuthor.addEventListener('click', clearAuthorName);
        }

        // Live Poster Click to Edit Title and Subtitle/Name
        const livePosterTitle = document.getElementById('cityPosterLiveTitle');
        if (livePosterTitle) {
            livePosterTitle.classList.add('is-clickable');
            livePosterTitle.setAttribute('title', 'ক্লিক করে শিরোনাম পরিবর্তন করুন');
            livePosterTitle.addEventListener('click', () => {
                if (titleInput) {
                    titleInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    titleInput.focus();
                    titleInput.select();
                    titleInput.classList.add('ctg-input-highlight');
                    setTimeout(() => titleInput.classList.remove('ctg-input-highlight'), 1200);
                }
            });
        }

        const livePosterSub = document.getElementById('cityPosterLiveSub');
        if (livePosterSub) {
            livePosterSub.classList.add('is-clickable');
            livePosterSub.setAttribute('title', 'ক্লিক করে আপনার নাম যোগ বা সম্পাদনা করুন');
            livePosterSub.addEventListener('click', () => {
                const targetInput = quickNameInput || nameInput;
                if (targetInput) {
                    targetInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    targetInput.focus();
                    targetInput.select();
                    targetInput.classList.add('ctg-input-highlight');
                    setTimeout(() => targetInput.classList.remove('ctg-input-highlight'), 1200);
                }
            });
        }

        // Theme Switcher Buttons (Sidebar, Quick Top Bar Dots & In-Map Quick Chips)
        document.querySelectorAll('#cityThemeSelector .ctg-theme-btn, .ctg-quick-swatch-dot, .ctg-pqt-chip, .ctg-mf-chip').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const t = btn.getAttribute('data-theme');
                if (t) {
                    setTheme(t);
                }
            });
        });

        // Download Format Buttons
        const bPng = document.getElementById('btnDownloadCityPng');
        if (bPng) bPng.addEventListener('click', () => downloadPoster('png'));

        const bJpg = document.getElementById('btnDownloadCityJpg');
        if (bJpg) bJpg.addEventListener('click', () => downloadPoster('jpg'));

        const bPdf = document.getElementById('btnDownloadCityPdf');
        if (bPdf) bPdf.addEventListener('click', () => downloadPoster('pdf'));

        // Copy Caption
        const bCaption = document.getElementById('btnCopyCityCaption');
        if (bCaption) {
            bCaption.addEventListener('click', () => {
                const dict = window.ctgCityData.dictionary[state.lang];
                const count = state.visited.size;
                const total = window.ctgCityData.places.length;
                const caption = state.lang === 'chatgaya' 
                    ? `কালুরঘাটত্তুন পতেঙ্গা—চাটগাঁ শহরের ${toBengaliDigits(total)}খান জাগার মইধ্যে আঁই ${toBengaliDigits(count)}খান জাগা ঘুরিয়্যি! তোঁয়ার শহর কদ্দুর চিনা? নিজের চাটগাঁর পোস্টার বানাই লন: https://ghuraghuri.vercel.app/chattogram#city #MyChattogram #আঁরচাটগাঁশহর`
                    : `কালুরঘাট থেকে পতেঙ্গা—চট্টগ্রাম সিটি কর্পোরেশনের ${toBengaliDigits(total)}টি প্রধান দর্শনীয় স্থানের মধ্যে আমি ${toBengaliDigits(count)}টি স্থান ঘুরে দেখেছি! নিজের চট্টগ্রাম শহর ভ্রমণ মানচিত্র তৈরি করুন: https://ghuraghuri.vercel.app/chattogram#city #MyChattogram #Ghuraghuri`;

                navigator.clipboard.writeText(caption).then(() => {
                    showToast(dict.captionCopied);
                }).catch(() => {
                    showToast(caption);
                });
            });
        }

        // Web Share API Handler
        const bShare = document.getElementById('btnWebShareCity');
        if (bShare && navigator.share) {
            bShare.style.display = 'inline-flex';
            bShare.addEventListener('click', () => {
                const canvas = document.getElementById('cityExportCanvas');
                const count = state.visited.size;
                const total = window.ctgCityData.places.length;
                const caption = state.lang === 'chatgaya' 
                    ? `কালুরঘাটত্তুন পতেঙ্গা—চাটগাঁ শহরের ${toBengaliDigits(total)}খান জাগার মইধ্যে আঁই ${toBengaliDigits(count)}খান জাগা ঘুরিয়্যি! তোঁয়ার শহর কদ্দুর চিনা? নিজের চাটগাঁর পোস্টার বানাই লন: https://ghuraghuri.vercel.app/chattogram#city #MyChattogram #আঁরচাটগাঁশহর`
                    : `কালুরঘাট থেকে পতেঙ্গা—চট্টগ্রাম সিটি কর্পোরেশনের ${toBengaliDigits(total)}টি প্রধান দর্শনীয় স্থানের মধ্যে আমি ${toBengaliDigits(count)}টি স্থান ঘুরে দেখেছি! নিজের চট্টগ্রাম শহর ভ্রমণ মানচিত্র তৈরি করুন: https://ghuraghuri.vercel.app/chattogram#city #MyChattogram #Ghuraghuri`;

                if (canvas && canvas.toBlob && navigator.canShare) {
                    canvas.toBlob((blob) => {
                        const file = new File([blob], 'my-chattogram-city.png', { type: 'image/png' });
                        if (navigator.canShare({ files: [file] })) {
                            navigator.share({
                                title: 'My Chattogram City — আঁর চাটগাঁ শহর',
                                text: caption,
                                files: [file]
                            }).catch(() => {});
                            return;
                        }
                        navigator.share({
                            title: 'My Chattogram City — আঁর চাটগাঁ শহর',
                            text: caption,
                            url: window.location.href
                        }).catch(() => {});
                    }, 'image/png');
                } else {
                    navigator.share({
                        title: 'My Chattogram City — আঁর চাটগাঁ শহর',
                        text: caption,
                        url: window.location.href
                    }).catch(() => {});
                }
            });
        }
    }

    // 11. Utilities
    function toBengaliDigits(num) {
        const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
        return String(num).replace(/[0-9]/g, d => bnDigits[d]);
    }

    function safeText(id, text) {
        const el = document.getElementById(id);
        if (el) el.textContent = text;
    }

    function showToast(msg) {
        let toast = document.getElementById('ctgToast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'ctgToast';
            toast.className = 'ctg-toast';
            document.body.appendChild(toast);
        }
        toast.textContent = msg;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 2600);
    }

    function setTheme(t) {
        if (!t) return;
        state.theme = t;
        saveState();
        updateUI();
    }

    // Auto-init on DOMContentLoaded or immediate if loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    window.ctgCityEngine = {
        state: state,
        init: init,
        saveState: saveState,
        renderPosterMapSvg: renderPosterMapSvg,
        renderPosterToCanvas: renderPosterToCanvas,
        updateUI: updateUI,
        setTheme: setTheme,
        renderAreaDock: renderAreaDock,
        renderPlacesList: renderPlacesList,
        togglePlaceVisited: togglePlaceVisited,
        downloadPoster: downloadPoster,
        startAudioPlayback: startAudioPlayback,
        stopAudioPlayback: stopAudioPlayback,
        forceSilence: forceSilence,
        toggleAudio: toggleAudio,
        onEnterExp3: onEnterExp3,
        attemptAutoplay: attemptAutoplay
    };
})();
