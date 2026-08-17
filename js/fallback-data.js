/* ============================================================================
   GHURAGHURI - LOCAL FALLBACK DATASET (CURATED, NOT LIVE)
   Used ONLY when the travel-services API (api/) is unreachable or returns an
   error, so the Hotels / Restaurants / Transport pages stay usable.

   All fallback results are clearly labelled "Local information" and are NEVER
   presented as live data: no real-time schedules, no live prices, no
   availability. Photos reuse the same Unsplash photo ids already used by the
   project (reliable sources, no hotlinked random images).
   ============================================================================ */

(function (window) {
    "use strict";

    /* Unsplash photo ids already used elsewhere in the project. */
    var HOTEL_PHOTOS = [
        "1566073771259-6a8506099945", "1582719508461-905c673771fd",
        "1520250497591-112f2f40a3f4", "1521783988139-89397d761dce",
        "1571003123894-1f0594d2b5d9", "1542314831-068cd1dbfeeb",
        "1611892440504-42a792e24d32", "1595576508898-0ad5c879a061",
        "1551882547-ff40c63fe5fa", "1564501049412-61c2a3083791"
    ];
    var REST_PHOTOS = [
        "1517248135467-4c7edcad34c4", "1414235077428-338989a2e8c0",
        "1555396273-367ea4eb4db5", "1466978913421-dad2ebd01d17",
        "1555939594-58d7cb561ad1", "1504674900247-0877df9cc836",
        "1546069901-ba9599a7e63c", "1567620905732-2d1ec7ab7445",
        "1528735602780-2552fd46c7af", "1476224203421-9ac39bcb3327"
    ];

    function img(id, w) {
        return "https://images.unsplash.com/photo-" + id +
            "?auto=format&fit=crop&w=" + (w || 900) + "&q=70";
    }

    /* Place -> coordinates + labels for the major hubs (Dhaka, Chattogram,
       Rajshahi, Khulna and Barishal have no destination entry in the data, so
       they are defined here; the rest match DESTINATIONS slugs). */
    var PLACES = {
        "dhaka":     { name: "Dhaka",     name_bn: "ঢাকা",     district: "Dhaka",     division: "Dhaka",     lat: 23.8103, lng: 90.4125 },
        "chattogram":{ name: "Chattogram",name_bn: "চট্টগ্রাম", district: "Chattogram",division: "Chattogram", lat: 22.3569, lng: 91.7832 },
        "coxs-bazar":{ name: "Cox's Bazar", name_bn: "কক্সবাজার", district: "Cox's Bazar", division: "Chattogram", lat: 21.4272, lng: 92.0058 },
        "sylhet":    { name: "Sylhet",    name_bn: "সিলেট",     district: "Sylhet",    division: "Sylhet",    lat: 24.8949, lng: 91.8687 },
        "sajek-valley": { name: "Sajek Valley", name_bn: "সাজেক ভ্যালি", district: "Rangamati", division: "Chattogram", lat: 23.3819, lng: 92.2938 },
        "bandarban": { name: "Bandarban", name_bn: "বান্দরবান", district: "Bandarban", division: "Chattogram", lat: 22.1953, lng: 92.2189 },
        "rangamati": { name: "Rangamati", name_bn: "রাঙ্গামাটি", district: "Rangamati", division: "Chattogram", lat: 22.6470, lng: 92.1520 },
        "rajshahi":  { name: "Rajshahi",  name_bn: "রাজশাহী",  district: "Rajshahi",  division: "Rajshahi",  lat: 24.3745, lng: 88.6042 },
        "khulna":    { name: "Khulna",    name_bn: "খুলনা",     district: "Khulna",    division: "Khulna",    lat: 22.8456, lng: 89.5403 },
        "barishal":  { name: "Barishal",  name_bn: "বরিশাল",   district: "Barishal",  division: "Barishal",  lat: 22.7010, lng: 90.3535 }
    };

    /* Curated local listings. Rows: [name, address, rating, reviews, priceBDT, type] */
    var HOTEL_LINES = {
        "dhaka": [
            ["The Westin Dhaka", "Main Gulshan Avenue, Gulshan-2, Dhaka", 4.6, 980, 14000, "hotel"],
            ["Radisson Blu Dhaka Water Garden", "Airport Road, Dhaka Cantonment, Dhaka", 4.5, 740, 10500, "hotel"],
            ["Pan Pacific Sonargaon Dhaka", "107 Kazi Nazrul Islam Avenue, Dhaka", 4.4, 830, 9500, "hotel"],
            ["Hotel Sarina Dhaka", "27 Banani C/A, Banani, Dhaka", 4.2, 610, 6500, "hotel"]
        ],
        "chattogram": [
            ["Radisson Blu Chittagong Bay View", "SS Khaled Road, Chittagong", 4.4, 520, 9000, "hotel"],
            ["Agrabad Hotel", "1039 CDA Avenue, Agrabad, Chattogram", 4.0, 380, 4800, "hotel"],
            ["Well Park Residence", "C.D.A. Avenue, Muradpur, Chattogram", 3.9, 210, 3200, "guesthouse"],
            ["Hotel Meer Inn", "Meer Sarak, Chattogram", 3.7, 160, 2500, "guesthouse"]
        ],
        "coxs-bazar": [
            ["Hotel Sea Crown", "Hotel Motel Road, Cox's Bazar", 4.3, 690, 5200, "hotel"],
            ["Hotel The Cox Today", "Jilanja Point, Cox's Bazar", 4.1, 470, 4200, "hotel"],
            ["Seagull Hotel Cox's Bazar", "14 Beach Road, Cox's Bazar", 4.5, 820, 7800, "hotel"],
            ["Prime Park Hotel", "Kolatali Road, Cox's Bazar", 3.8, 250, 3000, "resort"]
        ],
        "sylhet": [
            ["Grand Sultan Tea Resort & Golf", "Amberkhana, Sylhet", 4.5, 430, 11500, "resort"],
            ["Rose View Hotel", "Zindabazar Point, Sylhet", 4.2, 610, 6200, "hotel"],
            ["Hotel Noorjahan Grand", "Shahjalal Uposhahar, Sylhet", 4.0, 350, 4500, "hotel"],
            ["Falcon Garden Resort", "Companyganj, Sylhet", 3.9, 180, 3600, "resort"]
        ],
        "sajek-valley": [
            ["Sajek Megh Punji", "Sajek Valley, Rangamati", 4.1, 320, 4500, "resort"],
            ["Sajek Ruilui Eco Resort", "Konglak Hill, Sajek, Rangamati", 4.0, 240, 4200, "resort"],
            ["Sajek Hill View Cottage", "Sajek Valley, Baghaichari, Rangamati", 3.9, 170, 2800, "guesthouse"],
            ["Konglak Hill Resort", "Konglak Para, Sajek, Rangamati", 3.8, 140, 2400, "guesthouse"]
        ],
        "bandarban": [
            ["Hill View Hotel Bandarban", "Bandarban Sadar, Bandarban", 4.0, 210, 3500, "hotel"],
            ["Hotel Plaza Bandarban", "Bandarban Road, Bandarban", 3.8, 150, 2600, "hotel"],
            ["Nilgiri Resort", "Nilgiri Hill, Bandarban", 4.2, 290, 4800, "resort"],
            ["Chimbuk Hill Resort", "Chimbuk, Thanchi Road, Bandarban", 3.7, 120, 2200, "resort"]
        ],
        "rangamati": [
            ["Parjatan Hotel Rangamati", "Parjatan Complex, Rangamati", 4.0, 260, 3600, "hotel"],
            ["Hotel Green Castle", "BGB Camp Road, Rangamati", 3.8, 140, 2400, "hotel"],
            ["Sukanta Resort", "Tabalchhari, Rangamati", 3.7, 110, 2100, "resort"],
            ["Kaptai Lake View Hotel", "Kaptai, Rangamati", 3.6, 90, 1800, "guesthouse"]
        ],
        "rajshahi": [
            ["Hotel Nice International", "Bornali, Rajshahi", 4.1, 340, 4600, "hotel"],
            ["Hotel Northern International", "Station Road, Rajshahi", 4.0, 280, 4200, "hotel"],
            ["Hotel Orchard Plaza", "Laxmipur, Rajshahi", 3.8, 160, 2800, "hotel"],
            ["Padma Garden Resort", "Nandigram, Rajshahi", 3.7, 90, 2200, "resort"]
        ],
        "khulna": [
            ["Hotel Castle Salam", "K.D.A. Avenue, Khulna", 4.2, 310, 4800, "hotel"],
            ["Tiger Garden Hotel", "Khan Jahan Ali Road, Khulna", 4.0, 220, 3600, "hotel"],
            ["Hotel City Inn Khulna", "Sonadanga, Khulna", 3.8, 130, 2400, "hotel"],
            ["Sundarban Hotel", "Khan Jahan Ali Road, Khulna", 3.7, 100, 2000, "guesthouse"]
        ],
        "barishal": [
            ["Hotel Grand Park Barishal", "Sadar Road, Barishal", 4.0, 200, 3400, "hotel"],
            ["Hotel Safe Inn", "Hosain Market, Barishal", 3.8, 120, 2400, "hotel"],
            ["Green City Hotel", "Sadar Road, Barishal", 3.6, 80, 1900, "guesthouse"],
            ["Riverside Guest House", "Port Road, Barishal", 3.5, 60, 1500, "guesthouse"]
        ]
    };

    /* Rows: [name, address, rating, reviews, priceLevel(1-3), cuisines[], openHours] */
    var REST_LINES = {
        "dhaka": [
            ["Sultan's Dine", "Gulshan-1, Dhaka", 4.3, 1200, 2, ["Bangladeshi"], "Open daily 11:00–22:30"],
            ["Haji Biriyani", "Nazira Bazar, Dhaka", 4.1, 900, 1, ["Bangladeshi"], "Open daily 10:00–22:00"],
            ["Star Kabab & Restaurant", "Dhanmondi, Dhaka", 4.2, 700, 1, ["Bangladeshi", "Fast Food"], "Open daily 11:00–23:00"],
            ["Café Mango", "Banani, Dhaka", 4.0, 450, 2, ["Cafe", "Bakery"], "Open daily 08:00–23:00"]
        ],
        "chattogram": [
            ["Ananda Restaurant", "GEC Circle, Chattogram", 4.0, 520, 1, ["Bangladeshi"], "Open daily 11:00–22:30"],
            ["Shat Rong Restaurant", "Kotwali, Chattogram", 3.9, 380, 1, ["Chinese"], "Open daily 10:00–22:00"],
            ["Lakeshore Restaurant", "CDA Avenue, Chattogram", 4.1, 290, 2, ["Bangladeshi", "Seafood"], "Open daily 11:00–23:00"],
            ["Zaman Hotel", "Agrabad, Chattogram", 3.8, 210, 1, ["Bangladeshi"], "Open daily 07:00–22:00"]
        ],
        "coxs-bazar": [
            ["Poushe Restaurant", "Hotel Motel Road, Cox's Bazar", 4.2, 640, 2, ["Seafood"], "Open daily 10:00–23:00"],
            ["Jhawban Sea Food", "Sea Beach Road, Cox's Bazar", 4.0, 410, 2, ["Seafood", "Bangladeshi"], "Open daily 11:00–22:30"],
            ["Beach Café Cox", "Kolatali Beach, Cox's Bazar", 3.9, 260, 1, ["Cafe", "Fast Food"], "Open daily 08:00–22:00"],
            ["Mermaid Beach Restaurant", "Laboni Point, Cox's Bazar", 3.8, 190, 2, ["Bangladeshi"], "Open daily 10:00–22:00"]
        ],
        "sylhet": [
            ["Panshi Restaurant", "Zindabazar, Sylhet", 4.1, 480, 1, ["Bangladeshi"], "Open daily 11:00–22:30"],
            ["Sylheti Bazar Restaurant", "Zindabazar, Sylhet", 4.0, 330, 1, ["Bangladeshi"], "Open daily 10:00–22:00"],
            ["Mithai Ghor", "Amberkhana, Sylhet", 4.2, 270, 1, ["Dessert", "Bakery"], "Open daily 09:00–21:00"],
            ["Tea Garden Café", "Sreemangal Road, Sylhet", 3.9, 150, 2, ["Cafe"], "Open daily 08:00–21:00"]
        ],
        "sajek-valley": [
            ["Pahar Para Restaurant", "Sajek Valley, Rangamati", 3.9, 180, 1, ["Bangladeshi"], "Open daily 07:00–21:00"],
            ["Konglak Hill Restaurant", "Konglak Para, Sajek", 3.8, 130, 1, ["Bangladeshi"], "Open daily 07:00–21:00"],
            ["Megh Moti Café", "Sajek Valley, Rangamati", 3.7, 90, 1, ["Cafe"], "Open daily 08:00–20:00"],
            ["Sajek View Restaurant", "Baghaichari, Rangamati", 3.6, 70, 1, ["Bangladeshi"], "Open daily 07:00–21:00"]
        ],
        "bandarban": [
            ["Meghla Restaurant", "Meghla Para, Bandarban", 3.9, 200, 1, ["Bangladeshi"], "Open daily 07:00–21:00"],
            ["Bandarban Hill View", "Bandarban Sadar", 3.8, 140, 1, ["Bangladeshi"], "Open daily 08:00–21:00"],
            ["Chimbuk View Café", "Chimbuk, Bandarban", 3.6, 80, 1, ["Cafe"], "Open daily 08:00–20:00"],
            ["Ruma Kitchen", "Ruma Road, Bandarban", 3.5, 60, 1, ["Bangladeshi"], "Open daily 07:00–21:00"]
        ],
        "rangamati": [
            ["Hanging Bridge Restaurant", "Hanging Bridge, Rangamati", 4.0, 260, 1, ["Bangladeshi"], "Open daily 09:00–21:00"],
            ["Lake City Diner", "Reserve Bazar, Rangamati", 3.9, 170, 1, ["Bangladeshi"], "Open daily 08:00–22:00"],
            ["Rangamati Parjatan Restaurant", "Parjatan Complex, Rangamati", 3.8, 120, 1, ["Bangladeshi"], "Open daily 09:00–21:00"],
            ["Chakma House Kitchen", "Tabalchhari, Rangamati", 3.7, 90, 1, ["Bangladeshi"], "Open daily 08:00–20:00"]
        ],
        "rajshahi": [
            ["Shahi Restaurant", "Shaheb Bazar, Rajshahi", 4.0, 300, 1, ["Bangladeshi"], "Open daily 11:00–22:00"],
            ["Mango City Diner", "Bhatapara, Rajshahi", 3.8, 180, 1, ["Bangladeshi"], "Open daily 10:00–22:00"],
            ["Belly's Restaurant", "Station Road, Rajshahi", 3.7, 120, 1, ["Bangladeshi", "Chinese"], "Open daily 10:00–22:30"],
            ["Rajshahi Kacchi", "Bornali, Rajshahi", 3.6, 90, 1, ["Bangladeshi"], "Open daily 11:00–21:30"]
        ],
        "khulna": [
            ["Sundarban Restaurant", "Khan Jahan Ali Road, Khulna", 4.0, 280, 1, ["Bangladeshi"], "Open daily 10:00–22:00"],
            ["Fatikchhaya Restaurant", "Sonadanga, Khulna", 3.9, 190, 1, ["Bangladeshi"], "Open daily 10:00–22:00"],
            ["Shrimp City Diner", "KDA Avenue, Khulna", 3.8, 140, 2, ["Seafood"], "Open daily 11:00–22:30"],
            ["Khulna Kabab House", "Rupsha Road, Khulna", 3.7, 100, 1, ["Bangladeshi", "Fast Food"], "Open daily 11:00–22:00"]
        ],
        "barishal": [
            ["Dhonaghar Restaurant", "Sadar Road, Barishal", 3.9, 160, 1, ["Bangladeshi"], "Open daily 10:00–22:00"],
            ["River View Diner", "Port Road, Barishal", 3.8, 110, 1, ["Bangladeshi", "Seafood"], "Open daily 10:00–22:00"],
            ["Barishal Kacchi Ghor", "Hosain Market, Barishal", 3.7, 80, 1, ["Bangladeshi"], "Open daily 11:00–21:30"],
            ["Shundori Restaurant", "Sadar Road, Barishal", 3.6, 60, 1, ["Bangladeshi"], "Open daily 10:00–21:30"]
        ]
    };

    var HOTELS = {};
    Object.keys(HOTEL_LINES).forEach(function (key) {
        HOTELS[key] = HOTEL_LINES[key].map(function (h, i) {
            return {
                name: h[0], address: h[1], rating: h[2], review_count: h[3],
                price: h[4], currency: "BDT", hotel_type: h[5],
                amenities: ["Free Wi-Fi", "AC Rooms", "Breakfast Included", "Room Service"],
                photo: HOTEL_PHOTOS[i % HOTEL_PHOTOS.length]
            };
        });
    });

    var RESTAURANTS = {};
    Object.keys(REST_LINES).forEach(function (key) {
        RESTAURANTS[key] = REST_LINES[key].map(function (r, i) {
            return {
                name: r[0], address: r[1], rating: r[2], review_count: r[3],
                price_level: String(r[4]), cuisine: r[5], opening_hours: r[6],
                photo: REST_PHOTOS[i % REST_PHOTOS.length]
            };
        });
    });

    window.FALLBACK_DATA = {
        places: PLACES,
        hotels: HOTELS,
        restaurants: RESTAURANTS,
        img: img,
        label: "Local information",
        note: "Information may not be live — the live travel service is currently unreachable."
    };
})(window);
