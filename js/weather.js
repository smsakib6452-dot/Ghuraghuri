/* ============================================================================
   BANGLADESH TRAVEL EXPLORER - WEATHER WIDGET
   Uses CONFIG.WEATHER_PROVIDER ("openmeteo" or "tomorrowio") with an
   automatic Open-Meteo fallback when the primary provider fails.
   ============================================================================ */

(function (window) {
    "use strict";

    var cache = {};
    var lastSelected = null;

    /* Map Open-Meteo weather codes to short label + emoji. */
    var WMO = {
        0: ["Clear sky", "☀️"],
        1: ["Mainly clear", "🌤️"],
        2: ["Partly cloudy", "⛅"],
        3: ["Overcast", "☁️"],
        45: ["Foggy", "🌫️"],
        48: ["Rime fog", "🌫️"],
        51: ["Light drizzle", "🌦️"],
        53: ["Drizzle", "🌦️"],
        55: ["Heavy drizzle", "🌧️"],
        56: ["Freezing drizzle", "🌧️"],
        57: ["Freezing drizzle", "🌧️"],
        61: ["Light rain", "🌧️"],
        63: ["Rain", "🌧️"],
        65: ["Heavy rain", "🌧️"],
        66: ["Freezing rain", "🌧️"],
        67: ["Freezing rain", "🌧️"],
        71: ["Light snow", "🌨️"],
        73: ["Snow", "🌨️"],
        75: ["Heavy snow", "❄️"],
        77: ["Snow grains", "🌨️"],
        80: ["Light showers", "🌦️"],
        81: ["Showers", "🌧️"],
        82: ["Heavy showers", "⛈️"],
        85: ["Snow showers", "🌨️"],
        86: ["Snow showers", "🌨️"],
        95: ["Thunderstorm", "⛈️"],
        96: ["Thunderstorm", "⛈️"],
        99: ["Thunderstorm", "⛈️"]
    };

    function codeLabel(code) {
        var entry = WMO[code];
        return entry ? entry : ["Unknown", "🌡️"];
    }

    function emojiFor(code) {
        return codeLabel(code)[1];
    }

    function celsius(c) {
        return Math.round(c) + "°C";
    }

    function cacheKey(lat, lng) {
        return lat.toFixed(2) + "," + lng.toFixed(2);
    }

    function fromCache(lat, lng) {
        var key = cacheKey(lat, lng);
        if (cache[key]) {
            var age = Date.now() - cache[key].ts;
            if (age < CONFIG.WEATHER_CACHE_MINUTES * 60 * 1000) {
                return cache[key].data;
            }
        }
        return null;
    }

    /* ---------- Provider: Open-Meteo (free, keyless) ---------- */
    function fetchOpenMeteo(lat, lng) {
        var units = CONFIG.WEATHER_UNITS === "imperial" ? "fahrenheit" : "celsius";
        var url = "https://api.open-meteo.com/v1/forecast" +
            "?latitude=" + lat +
            "&longitude=" + lng +
            "&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m" +
            "&daily=temperature_2m_max,temperature_2m_min" +
            "&timezone=auto" +
            "&temperature_unit=" + units +
            "&wind_speed_unit=" + (CONFIG.WEATHER_UNITS === "imperial" ? "mph" : "kmh");

        return fetch(url).then(function (r) {
            if (!r.ok) throw new Error("Open-Meteo HTTP " + r.status);
            return r.json();
        }).then(function (data) {
            var cur = data.current;
            var label = codeLabel(cur.weather_code);
            return {
                provider: "openmeteo",
                temp: Math.round(cur.temperature_2m),
                unit: CONFIG.WEATHER_UNITS === "imperial" ? "°F" : "°C",
                label: label[0],
                icon: label[1],
                humidity: cur.relative_humidity_2m,
                wind: Math.round(cur.wind_speed_10m),
                windUnit: CONFIG.WEATHER_UNITS === "imperial" ? "mph" : "km/h",
                dailyMax: Math.round(data.daily.temperature_2m_max[0]),
                dailyMin: Math.round(data.daily.temperature_2m_min[0])
            };
        });
    }

    /* ---------- Provider: Tomorrow.io v4 (requires API key) ---------- */
    function fetchTomorrowIo(lat, lng) {
        var url = "https://api.tomorrow.io/v4/timelines" +
            "?location=" + lat + "," + lng +
            "&fields=temperature,humidity,windSpeed,weatherCode" +
            "&timesteps=1h" +
            "&units=" + (CONFIG.WEATHER_UNITS === "imperial" ? "imperial" : "metric") +
            "&apikey=" + encodeURIComponent(CONFIG.WEATHER_API_KEY);

        return fetch(url).then(function (r) {
            if (!r.ok) throw new Error("Tomorrow.io HTTP " + r.status);
            return r.json();
        }).then(function (data) {
            var minutely = data.data.timelines[0].intervals[0].values;
            return {
                provider: "tomorrowio",
                temp: Math.round(minutely.temperature),
                unit: CONFIG.WEATHER_UNITS === "imperial" ? "°F" : "°C",
                label: "Live conditions",
                icon: emojiFor(minutely.weatherCode),
                humidity: Math.round(minutely.humidity),
                wind: Math.round(minutely.windSpeed),
                windUnit: CONFIG.WEATHER_UNITS === "imperial" ? "mph" : "km/h",
                dailyMax: null,
                dailyMin: null
            };
        });
    }

    /* Fetch weather for a destination, honoring the configured provider,
       cache, and automatic fallback. */
    function getWeather(dest) {
        var cached = fromCache(dest.latitude, dest.longitude);
        if (cached) return Promise.resolve(cached);

        var primary = CONFIG.WEATHER_PROVIDER === "tomorrowio"
            ? fetchTomorrowIo(dest.latitude, dest.longitude)
            : fetchOpenMeteo(dest.latitude, dest.longitude);

        return primary.catch(function () {
            if (!CONFIG.WEATHER_FALLBACK) throw new Error("Weather provider failed and fallback disabled");
            return fetchOpenMeteo(dest.latitude, dest.longitude);
        }).then(function (data) {
            var key = cacheKey(dest.latitude, dest.longitude);
            cache[key] = { ts: Date.now(), data: data };
            return data;
        });
    }

    /* Build the inner HTML for one weather card. */
    function cardHTML(dest, w) {
        var range = (w.dailyMax !== null && w.dailyMin !== null)
            ? '<span class="w-range">' + w.dailyMin + " / " + w.dailyMax + " " + w.unit + "</span>"
            : "";
        return '<div class="w-head">' +
            '<div><div class="w-name">' + dest.name + "</div>" +
            '<div class="w-cond">' + I18N.weatherLabel(w.label) + "</div></div>" +
            '<div class="w-icon">' + w.icon + "</div>" +
            "</div>" +
            '<div class="w-temp">' + w.temp + " " + w.unit + "</div>" +
            (range ? range : "") +
            '<div class="w-meta">' +
            (w.humidity !== undefined ? "<span>💧 " + w.humidity + "%</span>" : "") +
            "<span>🌬️ " + w.wind + " " + w.windUnit + "</span>" +
            "</div>";
    }

    /* Render a grid of weather cards for the given destinations.
       `onSelect(dest, w)` is called when a card is clicked. */
    function renderWeather(el, destinations, onSelect) {
        var wrap = document.getElementById(el);
        wrap.innerHTML = '<div class="weather-note">' + I18N.t("weather.loading") + "</div>";

        Promise.all(destinations.map(function (d) {
            return getWeather(d).then(function (w) {
                return { dest: d, weather: w };
            });
        })).then(function (results) {
            wrap.innerHTML = "";
            results.forEach(function (item) {
                var card = document.createElement("div");
                card.className = "weather-card";
                if (lastSelected && lastSelected.dest.id === item.dest.id) {
                    card.classList.add("is-selected");
                }
                card.innerHTML = cardHTML(item.dest, item.weather);
                card.addEventListener("click", function () {
                    lastSelected = item;
                    var all = wrap.querySelectorAll(".weather-card");
                    for (var i = 0; i < all.length; i++) all[i].classList.remove("is-selected");
                    card.classList.add("is-selected");
                    if (onSelect) onSelect(item.dest, item.weather);
                });
                wrap.appendChild(card);
            });
        }).catch(function (err) {
            wrap.innerHTML = '<div class="weather-note">' + I18N.t("weather.unavailable") + " " +
                (err && err.message ? "(" + err.message + ")" : "") + "</div>";
        });
    }

    /* Render a single weather card for the detail page sidebar. */
    function renderSingleWeather(el, dest) {
        var node = document.getElementById(el);
        node.innerHTML = '<p class="weather-note">' + I18N.t("weather.loading") + "</p>";

        getWeather(dest).then(function (w) {
            node.innerHTML = cardHTML(dest, w);
        }).catch(function (err) {
            node.innerHTML = '<p class="weather-note">' + I18N.t("weather.unavailable") + " " +
                (err && err.message ? "(" + err.message + ")" : "") + "</p>";
        });
    }

    /* Render a large weather grid for many destinations, fetching in small
       batches so the page fills progressively instead of waiting for dozens
       of API calls at once. `onSelect(dest)` fires when a card is clicked. */
    function renderWeatherAll(el, destinations, opts) {
        opts = opts || {};
        var wrap = document.getElementById(el);
        var onSelect = opts.onSelect || null;
        var batchSize = opts.batchSize || 14;

        wrap.innerHTML = "";

        var status = document.createElement("div");
        status.className = "weather-note weather-status";
        wrap.appendChild(status);

        var done = 0;
        var failed = 0;

        function updateStatus() {
            if (done >= destinations.length) {
                var timeStr = new Date().toLocaleTimeString();
                var allText = I18N.fmt("weather.status.all", {
                    n: destinations.length,
                    t: timeStr
                });
                if (failed) {
                    allText += " · " + I18N.fmt("weather.status.failed", { f: failed });
                }
                status.textContent = allText;
            } else {
                status.textContent = I18N.fmt("weather.status.loading", {
                    a: done,
                    t: destinations.length
                });
            }
        }

        function next() {
            var chunk = destinations.slice(done, done + batchSize);
            if (!chunk.length) { updateStatus(); return; }

            Promise.all(chunk.map(function (d) {
                return getWeather(d).catch(function () { return null; });
            })).then(function (ws) {
                var cards = [];
                ws.forEach(function (w, i) {
                    done++;
                    if (!w) { failed++; return; }
                    var card = document.createElement("div");
                    card.className = "weather-card";
                    card.innerHTML = cardHTML(chunk[i], w);
                    card.addEventListener("click", function () {
                        if (onSelect) onSelect(chunk[i]);
                    });
                    cards.push(card);
                });
                cards.forEach(function (c) { wrap.appendChild(c); });
                updateStatus();
                next();
            });
        }

        updateStatus();
        next();
    }

    /* Drop the in-memory weather cache so the next fetch is live. */
    function clearCache() {
        cache = {};
    }

    window.WEATHER = {
        getWeather: getWeather,
        renderWeather: renderWeather,
        renderSingleWeather: renderSingleWeather,
        renderWeatherAll: renderWeatherAll,
        clearCache: clearCache,
        emojiFor: emojiFor
    };
})(window);