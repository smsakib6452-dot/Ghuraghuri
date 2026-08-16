/* ============================================================================
   BANGLADESH TRAVEL EXPLORER - INTERNATIONALIZATION (EN <-> BN)
   Provides a language toggle, UI string dictionary, taxonomy translation
   (divisions / districts / categories / difficulty / transport) and
   destination-content localization loaded from data/translations.js.

   Language selection is stored in localStorage ("ghuraghuri_lang"); a
   ?lang=en|bn URL parameter overrides it (useful for deep links/tests).
   Load AFTER data/destinations.js, js/store.js and data/translations.js.
   ============================================================================ */

(function (window, document) {
    "use strict";

    var STORAGE = "ghuraghuri_lang";
    var DEST = (typeof I18N_DEST !== "undefined") ? I18N_DEST : {};

    /* ---------------- UI dictionary (English -> Bangla) ---------------- */
    var bn = {
        "nav.destinations": "গন্তব্যস্থান",
        "nav.map": "মানচিত্র",
        "nav.weather": "আবহাওয়া",
        "nav.admin": "অ্যাডমিন",

        "hero.eyebrow": "%nটি নির্বাচিত গন্তব্য আবিষ্কার করুন",
        "hero.title": "আপনার পরবর্তী গন্তব্য, বাংলাদেশেই",
        "hero.sub": "সমুদ্র, পাহাড়, বন আর সংস্কৃতির সেরা জায়গাগুলো খুঁজে নিন এবং আপনার পরবর্তী ভ্রমণের পরিকল্পনা করুন।",
        "hero.search": "গন্তব্য খুঁজুন — কক্সবাজার, সাজেক, সিলেট...",
        "stat.destinations": "গন্তব্য",
        "stat.divisions": "বিভাগ",
        "stat.rating": "গড় রেটিং",

        "popular.eyebrow": "সবচেয়ে জনপ্রিয়",
        "popular.title": "এখন জনপ্রিয়",
        "popular.link": "সব %nটি গন্তব্যস্থান দেখুন →",

        "section.destinations.eyebrow": "ভ্রমণ গাইড",
        "section.destinations.title": "আপনার পরবর্তী অ্যাডভেঞ্চার বেছে নিন",
        "filter.all": "সব",
        "sort.label": "সাজান",
        "sort.featured": "ফিচার্ড",
        "sort.rating": "সর্বোচ্চ রেটিং",
        "sort.reviews": "সর্বাধিক রিভিউ",
        "sort.name": "নাম A–Z",

        "resultCount": "%tটি গন্তব্যের মধ্যে %aটি",
        "resultCount.query": " \"%q\" এর জন্য",

        "card.viewGuide": "গাইড দেখুন →",
        "card.reviews": "%rটি রিভিউ",

        "empty.title": "কোনো গন্তব্য পাওয়া যায়নি",
        "empty.text": "ভিন্ন কিছু খুঁজুন বা অন্য বিভাগ চেষ্টা করুন।",
        "empty.reset": "ফিল্টার রিসেট করুন",

        "map.eyebrow": "মানচিত্র দিয়ে ঘুরে দেখুন",
        "map.title": "বাংলাদেশের কোথায়?",
        "map.viewGuide": "গাইড দেখুন →",

        "weather.eyebrow": "আবহাওয়া অনুযায়ী পরিকল্পনা",
        "weather.title": "বর্তমান আবহাওয়া",
        "weather.select": "একটি গন্তব্য নির্বাচন করে তার বর্তমান আবহাওয়া দেখুন।",
        "weather.loading": "আবহাওয়া লোড হচ্ছে…",
        "weather.unavailable": "আপাতত আবহাওয়া পাওয়া যাচ্ছে না।",

        "weather.page.eyebrow": "লাইভ পূর্বাভাস",
        "weather.page.title": "সারা বাংলাদেশের আবহাওয়া",
        "weather.count": "%tটি গন্তব্যের মধ্যে %aটি",
        "weather.search": "গন্তব্য, বিভাগ বা জেলার ভিত্তিতে ফিল্টার করুন…",
        "weather.refresh": "↻ এখনই রিফ্রেশ করুন",
        "weather.status.all": "%nটি গন্তব্যের লাইভ আবহাওয়া · %t সময়ে আপডেট",
        "weather.status.loading": "আবহাওয়া লোড হচ্ছে… %tটির মধ্যে %aটি",
        "weather.status.failed": "%fটি অনুপলব্ধ",

        "crumb.home": "হোম",
        "detail.gmaps": "গুগল ম্যাপে খুলুন",
        "detail.weatherLink": "আবহাওয়া দেখুন",
        "detail.about": "বিবরণ",
        "detail.gallery": "গ্যালারি",
        "detail.activities": "সেরা যা করবেন",
        "detail.attractions": "প্রধান আকর্ষণ",
        "detail.tips": "ভ্রমণ টিপস",
        "detail.gettingThere": "কীভাবে যাবেন",
        "detail.facts": "দ্রুত তথ্য",
        "detail.liveWeather": "লাইভ আবহাওয়া",
        "detail.location": "অবস্থান",
        "detail.reviews": "%rটি রিভিউ",
        "detail.notFound.title": "গন্তব্য পাওয়া যায়নি",
        "detail.notFound.text": "আপনি যে গন্তব্যটি খুঁজছেন তা বিদ্যমান নেই।",
        "detail.back": "সব গন্তব্যে ফিরে যান",

        "fact.division": "বিভাগ",
        "fact.district": "জেলা",
        "fact.bestTime": "সেরা সময়",
        "fact.days": "প্রস্তাবিত",
        "fact.difficulty": "অসুবিধা",
        "fact.budget": "বাজেট",
        "fact.type": "ভ্রমণের ধরন",

        "ti.from": "থেকে",
        "ti.distance": "দূরত্ব",
        "ti.duration": "সময়",
        "ti.route": "পথ",
        "ti.transport": "যানবাহন",
        "ti.flight": "ফ্লাইট",

        "footer.title": "বাংলাদেশ ট্রাভেল এক্সপ্লোরার — ওপেন ডেটা, লিফলেট ও ওপেন-মেটিও দিয়ে তৈরি একটি ডেমো ভ্রমণ গাইড।",
        "footer.meta": "আবহাওয়ার ডেটা: ওপেন-মেটিও · মানচিত্র: © ওপেনস্ট্রিটম্যাপ · ছবি: আনস্প্ল্যাশ",
        "footer.admin": "বাংলাদেশ ট্রাভেল এক্সপ্লোরার — অ্যাডমিন প্যানেল। পরিবর্তনগুলো শুধু আপনার ব্রাউজারে সংরক্ষিত হয়।",

        "page.title.index": "বাংলাদেশ ট্রাভেল এক্সপ্লোরার — বাংলাদেশের সৌন্দর্য আবিষ্কার করুন",
        "page.title.weather": "লাইভ আবহাওয়া — বাংলাদেশ ট্রাভেল এক্সপ্লোরার",
        "page.title.detail": "গন্তব্য — বাংলাদেশ ট্রাভেল এক্সপ্লোরার",
        "page.title.admin": "অ্যাডমিন প্যানেল — বাংলাদেশ ট্রাভেল এক্সপ্লোরার",

        "admin.title": "গন্তব্যস্থান",
        "admin.subtitle": "গন্তব্যস্থান যোগ, সম্পাদনা ও লুকান",
        "admin.count": "%nটি গন্তব্য · পরিবর্তন এই ব্রাউজারে সংরক্ষিত",
        "admin.login.title": "অ্যাডমিন লগইন",
        "admin.login.note": "গন্তব্য পরিচালনা করতে অ্যাডমিন পাসওয়ার্ড দিন।",
        "admin.login.placeholder": "পাসওয়ার্ড",
        "admin.login.btn": "সাইন ইন",
        "admin.login.error": "পাসওয়ার্ড ভুল।",
        "admin.add": "+ গন্তব্য যোগ করুন",
        "admin.reset": "সব পরিবর্তন রিসেট করুন",
        "admin.logout": "লগ আউট",
        "admin.stat.live": "লাইভ মোট",
        "admin.stat.builtin": "বিল্ট-ইন",
        "admin.stat.custom": "কাস্টম",
        "admin.stat.hidden": "লুকানো",
        "admin.search": "নাম, বিভাগ, জেলা খুঁজুন…",
        "admin.filter.all": "সব স্ট্যাটাস",
        "admin.filter.builtin": "বিল্ট-ইন",
        "admin.filter.custom": "কাস্টম",
        "admin.filter.hidden": "লুকানো",
        "admin.th.name": "নাম",
        "admin.th.division": "বিভাগ · জেলা",
        "admin.th.category": "বিভাগ",
        "admin.th.rating": "রেটিং",
        "admin.th.reviews": "রিভিউ",
        "admin.th.status": "স্ট্যাটাস",
        "admin.th.actions": "অ্যাকশন",
        "admin.badge.builtin": "বিল্ট-ইন",
        "admin.badge.custom": "কাস্টম",
        "admin.badge.hidden": "লুকানো",
        "admin.view": "দেখুন",
        "admin.edit": "সম্পাদনা",
        "admin.hide": "লুকান",
        "admin.show": "দেখান",
        "admin.delete": "মুছুন",
        "admin.note": "পরিবর্তনগুলো এই ব্রাউজারে (localStorage) সংরক্ষিত হয় এবং সাথে সাথে লাইভ সাইটে প্রযোজ্য হয়। মূল ১০৪টি গন্তব্য ফেরাতে <em>সব পরিবর্তন রিসেট করুন</em> চাপুন।",
        "admin.empty": "কোনো গন্তব্য মিলছে না।",
        "admin.editor.add": "নতুন গন্তব্য",
        "admin.editor.edit": "গন্তব্য সম্পাদনা",
        "admin.editor.back": "← তালিকায় ফিরুন",
        "admin.editor.save": "গন্তব্য সংরক্ষণ করুন",
        "admin.editor.cancel": "বাতিল",
        "admin.editor.basics": "মৌলিক তথ্য",
        "admin.editor.ratings": "রেটিং",
        "admin.editor.location": "অবস্থান",
        "admin.editor.images": "ছবি",
        "admin.editor.copy": "বিবরণ",
        "admin.editor.planning": "পরিকল্পনা",
        "admin.editor.travel": "যাতায়াত",
        "admin.editor.name": "নাম",
        "admin.editor.slug": "স্লাগ (খালি রাখলে অটো)",
        "admin.editor.division": "বিভাগ",
        "admin.editor.district": "জেলা",
        "admin.editor.category": "প্রধান ক্যাটাগরি",
        "admin.editor.categories": "সব ক্যাটাগরি (কমা দিয়ে)",
        "admin.editor.rating": "রেটিং (০–৫)",
        "admin.editor.reviews": "রিভিউ",
        "admin.editor.lat": "অক্ষাংশ",
        "admin.editor.lng": "দ্রাঘিমাংশ",
        "admin.editor.photo": "আনস্প্ল্যাশ ছবির আইডি",
        "admin.editor.gallery": "গ্যালারির ছবির আইডি (কমা দিয়ে, ঐচ্ছিক)",
        "admin.editor.short": "সংক্ষিপ্ত বিবরণ",
        "admin.editor.desc": "বিবরণ",
        "admin.editor.bestTime": "সেরা সময়",
        "admin.editor.days": "প্রস্তাবিত দিন",
        "admin.editor.difficulty": "অসুবিধা",
        "admin.editor.budget": "বাজেট",
        "admin.editor.type": "ভ্রমণের ধরন",
        "admin.editor.activities": "করণীয় (প্রতি লাইনে একটি)",
        "admin.editor.attractions": "প্রধান আকর্ষণ (প্রতি লাইনে একটি)",
        "admin.editor.tips": "টিপস (প্রতি লাইনে একটি)",
        "admin.editor.from": "থেকে",
        "admin.editor.distance": "দূরত্ব (কিমি)",
        "admin.editor.duration": "সময়",
        "admin.editor.route": "পথ",
        "admin.editor.transport": "যানবাহন (কমা দিয়ে)",
        "admin.editor.flight": "ফ্লাইট (ঐচ্ছিক)",
        "admin.easy": "সহজ",
        "admin.moderate": "মাঝারি",
        "admin.challenging": "কঠিন",
        "admin.disabled.title": "অ্যাডমিন বন্ধ আছে",
        "admin.disabled.note": "প্যানেল ব্যবহার করতে কনফিগে ADMIN_ENABLED সত্য করুন।"
    };

    var en = {
        "nav.destinations": "Destinations",
        "nav.map": "Map",
        "nav.weather": "Weather",
        "nav.admin": "Admin",
        "hero.eyebrow": "EXPLORE %n HAND-PICKED DESTINATIONS",
        "hero.title": "Your Next Adventure Starts Here",
        "hero.sub": "Discover the best beaches, mountains, forests, and cultural experiences Bangladesh has to offer.",
        "hero.search": "Search destinations — Cox's Bazar, Sajek, Sylhet...",
        "stat.destinations": "Destinations",
        "stat.divisions": "Divisions",
        "stat.rating": "Avg. Rating",
        "popular.eyebrow": "Most Visited",
        "popular.title": "Popular Right Now",
        "popular.link": "View all %n destinations →",
        "section.destinations.eyebrow": "Travel Guide",
        "section.destinations.title": "Pick Your Next Adventure",
        "filter.all": "All",
        "sort.label": "Sort by",
        "sort.featured": "Featured",
        "sort.rating": "Highest rated",
        "sort.reviews": "Most reviewed",
        "sort.name": "Name A–Z",
        "resultCount": "%a of %t destinations",
        "resultCount.query": " for \"%q\"",
        "card.viewGuide": "View guide →",
        "card.reviews": "%r reviews",
        "empty.title": "No destinations found",
        "empty.text": "Try a different search term or category.",
        "empty.reset": "Reset filters",
        "map.eyebrow": "Explore by Map",
        "map.title": "Where in Bangladesh?",
        "map.viewGuide": "View guide →",
        "weather.eyebrow": "Plan Around the Weather",
        "weather.title": "Current Weather",
        "weather.select": "Select a destination to see its current weather.",
        "weather.loading": "Loading weather…",
        "weather.unavailable": "Weather unavailable right now.",
        "weather.page.eyebrow": "Live Forecasts",
        "weather.page.title": "Weather Across Bangladesh",
        "weather.count": "%a of %t destinations",
        "weather.search": "Filter by destination, division or district…",
        "weather.refresh": "↻ Refresh now",
        "weather.status.all": "Live conditions for %n destinations · updated %t",
        "weather.status.loading": "Loading weather… %a of %t",
        "weather.status.failed": "%f unavailable",
        "crumb.home": "Home",
        "detail.gmaps": "Open in Google Maps",
        "detail.weatherLink": "Check Weather",
        "detail.about": "About",
        "detail.gallery": "Gallery",
        "detail.activities": "Best Things to Do",
        "detail.attractions": "Top Attractions",
        "detail.tips": "Travel Tips",
        "detail.gettingThere": "Getting There",
        "detail.facts": "Quick Facts",
        "detail.liveWeather": "Live Weather",
        "detail.location": "Location",
        "detail.reviews": "%r reviews",
        "detail.notFound.title": "Destination not found",
        "detail.notFound.text": "The destination you are looking for does not exist.",
        "detail.back": "Back to all destinations",
        "fact.division": "Division",
        "fact.district": "District",
        "fact.bestTime": "Best time",
        "fact.days": "Recommended",
        "fact.difficulty": "Difficulty",
        "fact.budget": "Budget",
        "fact.type": "Travel type",
        "ti.from": "From",
        "ti.distance": "Distance",
        "ti.duration": "Duration",
        "ti.route": "Route",
        "ti.transport": "Transport",
        "ti.flight": "Flight",
        "footer.title": "Bangladesh Travel Explorer — a demo travel guide built with Open Data, Leaflet and Open-Meteo.",
        "footer.meta": "Weather data: Open-Meteo · Maps: © OpenStreetMap contributors · Photos: Unsplash",
        "footer.admin": "Bangladesh Travel Explorer — admin panel. Changes are stored in your browser only.",
        "page.title.index": "Bangladesh Travel Explorer — Discover the Beauty of Bangladesh",
        "page.title.weather": "Live Weather — Bangladesh Travel Explorer",
        "page.title.detail": "Destination — Bangladesh Travel Explorer",
        "page.title.admin": "Admin Panel — Bangladesh Travel Explorer",
        "admin.title": "Destinations",
        "admin.subtitle": "Add, edit and hide destinations",
        "admin.count": "%n destinations · changes saved in this browser",
        "admin.login.title": "Admin Login",
        "admin.login.note": "Enter the admin password to manage destinations.",
        "admin.login.placeholder": "Password",
        "admin.login.btn": "Sign in",
        "admin.login.error": "Incorrect password.",
        "admin.add": "+ Add destination",
        "admin.reset": "Reset all changes",
        "admin.logout": "Log out",
        "admin.stat.live": "Total live",
        "admin.stat.builtin": "Built-in",
        "admin.stat.custom": "Custom",
        "admin.stat.hidden": "Hidden",
        "admin.search": "Search name, division, district…",
        "admin.filter.all": "All statuses",
        "admin.filter.builtin": "Built-in",
        "admin.filter.custom": "Custom",
        "admin.filter.hidden": "Hidden",
        "admin.th.name": "Name",
        "admin.th.division": "Division · District",
        "admin.th.category": "Category",
        "admin.th.rating": "Rating",
        "admin.th.reviews": "Reviews",
        "admin.th.status": "Status",
        "admin.th.actions": "Actions",
        "admin.badge.builtin": "Built-in",
        "admin.badge.custom": "Custom",
        "admin.badge.hidden": "Hidden",
        "admin.view": "View",
        "admin.edit": "Edit",
        "admin.hide": "Hide",
        "admin.show": "Show",
        "admin.delete": "Delete",
        "admin.note": "Changes are saved in this browser (localStorage) and applied to the live site immediately. Use <em>Reset all changes</em> to restore the original 104 destinations.",
        "admin.empty": "No destinations match.",
        "admin.editor.add": "Add Destination",
        "admin.editor.edit": "Edit Destination",
        "admin.editor.back": "← Back to list",
        "admin.editor.save": "Save destination",
        "admin.editor.cancel": "Cancel",
        "admin.editor.basics": "Basics",
        "admin.editor.ratings": "Ratings",
        "admin.editor.location": "Location",
        "admin.editor.images": "Images",
        "admin.editor.copy": "Copy",
        "admin.editor.planning": "Planning",
        "admin.editor.travel": "Getting there",
        "admin.editor.name": "Name",
        "admin.editor.slug": "Slug (auto if blank)",
        "admin.editor.division": "Division",
        "admin.editor.district": "District",
        "admin.editor.category": "Primary category",
        "admin.editor.categories": "All categories (comma separated)",
        "admin.editor.rating": "Rating (0–5)",
        "admin.editor.reviews": "Reviews",
        "admin.editor.lat": "Latitude",
        "admin.editor.lng": "Longitude",
        "admin.editor.photo": "Unsplash photo id",
        "admin.editor.gallery": "Gallery photo ids (comma separated, optional)",
        "admin.editor.short": "Short description",
        "admin.editor.desc": "Description",
        "admin.editor.bestTime": "Best time",
        "admin.editor.days": "Recommended days",
        "admin.editor.difficulty": "Difficulty",
        "admin.editor.budget": "Budget",
        "admin.editor.type": "Travel type",
        "admin.editor.activities": "Activities (one per line)",
        "admin.editor.attractions": "Top attractions (one per line)",
        "admin.editor.tips": "Tips (one per line)",
        "admin.editor.from": "From",
        "admin.editor.distance": "Distance (km)",
        "admin.editor.duration": "Duration",
        "admin.editor.route": "Route",
        "admin.editor.transport": "Transport (comma separated)",
        "admin.editor.flight": "Flight (optional)",
        "admin.easy": "Easy",
        "admin.moderate": "Moderate",
        "admin.challenging": "Challenging",
        "admin.disabled.title": "Admin disabled",
        "admin.disabled.note": "Set ADMIN_ENABLED to true in config to use the panel."
    };

    /* ---------------- Taxonomy (English -> Bangla) ---------------- */
    var taxonomy = {
        category: {
            "Beach": "সৈকত",
            "Mountain": "পাহাড়",
            "Adventure": "অ্যাডভেঞ্চার",
            "Waterfall": "ঝরনা",
            "Nature": "প্রকৃতি",
            "Cultural": "সাংস্কৃতিক",
            "Forest": "বন",
            "Island": "দ্বীপ",
            "Historical": "ঐতিহাসিক",
            "Family": "পরিবার"
        },
        division: {
            "Chattogram": "চট্টগ্রাম",
            "Sylhet": "সিলেট",
            "Khulna": "খুলনা",
            "Barishal": "বরিশাল",
            "Dhaka": "ঢাকা",
            "Rajshahi": "রাজশাহী",
            "Mymensingh": "ময়মনসিংহ",
            "Rangpur": "রংপুর"
        },
        district: {
            "Bagerhat": "বাগেরহাট",
            "Bagha (Rajshahi)": "বাঘা (রাজশাহী)",
            "Bandarban": "বান্দরবান",
            "Barishal": "বরিশাল",
            "Bhola": "ভোলা",
            "Bogura": "বগুড়া",
            "Chapainawabganj": "চাঁপাইনবাবগঞ্জ",
            "Chattogram": "চট্টগ্রাম",
            "Comilla": "কুমিল্লা",
            "Cox's Bazar": "কক্সবাজার",
            "Dhaka": "ঢাকা",
            "Dinajpur": "দিনাজপুর",
            "Gazipur": "গাজীপুর",
            "Gopalganj": "গোপালগঞ্জ",
            "Habiganj": "হবিগঞ্জ",
            "Jamalpur": "জামালপুর",
            "Khagrachhari": "খাগড়াছড়ি",
            "Khulna / Satkhira": "খুলনা / সাতক্ষীরা",
            "Kishoreganj": "কিশোরগঞ্জ",
            "Kushtia": "কুষ্টিয়া",
            "Lalmonirhat": "লালমনিরহাট",
            "Manikganj": "মানিকগঞ্জ",
            "Meherpur": "মেহেরপুর",
            "Moulvibazar": "মৌলভীবাজার",
            "Muktagacha": "মুক্তাগাছা",
            "Munshiganj": "মুন্সিগঞ্জ",
            "Munshiganj / Shariatpur": "মুন্সিগঞ্জ / শরীয়তপুর",
            "Mymensingh": "ময়মনসিংহ",
            "Naogaon": "নওগাঁ",
            "Narayanganj": "নারায়ণগঞ্জ",
            "Natore": "নাটোর",
            "Netrokona": "নেত্রকোনা",
            "Nilphamari": "নীলফামারী",
            "Noakhali": "নোয়াখালী",
            "Panchagarh": "পঞ্চগড়",
            "Patuakhali": "পটুয়াখালী",
            "Puthia (Rajshahi)": "পুঠিয়া (রাজশাহী)",
            "Rajshahi": "রাজশাহী",
            "Rangamati": "রাঙ্গামাটি",
            "Rangpur": "রংপুর",
            "Savar": "সাভার",
            "Sherpur": "শেরপুর",
            "Sirajganj / Tangail": "সিরাজগঞ্জ / টাঙ্গাইল",
            "Sunamganj": "সুনামগঞ্জ",
            "Sylhet": "সিলেট",
            "Tangail": "টাঙ্গাইল"
        },
        difficulty: {
            "Easy": "সহজ",
            "Moderate": "মাঝারি",
            "Challenging": "কঠিন"
        },
        transport: {
            "Bus": "বাস",
            "Train": "ট্রেন",
            "Flight": "ফ্লাইট",
            "Private Car": "ব্যক্তিগত গাড়ি",
            "Chander Gari (local jeep)": "চান্দের গাড়ি (লোকাল জিপ)",
            "Chander Gari": "চান্দের গাড়ি",
            "Train (to Chattogram)": "ট্রেন (চট্টগ্রাম)",
            "Boat/Launch": "নৌকা/লঞ্চ",
            "Launch/Sea truck (from Teknaf)": "লঞ্চ/সি ট্রাক (টেকনাফ থেকে)",
            "Launch (via Barishal)": "লঞ্চ (বরিশাল হয়ে)",
            "Microbus": "মাইক্রোবাস",
            "Boat": "নৌকা",
            "Launch": "লঞ্চ",
            "CNG": "সিএনজি",
            "Launch (via Mongla)": "লঞ্চ (মোংলা হয়ে)",
            "Rickshaw": "রিকশা",
            "Metro Rail": "মেট্রোরেল",
            "CNG (from Barlekha)": "সিএনজি (বড়লেখা থেকে)",
            "Walk": "হেঁটে",
            "Train (on the bridge)": "ট্রেন (সেতুর উপর)"
        }
    };

    /* ---------------- Weather condition labels ---------------- */
    var weatherLabels = {
        "Clear sky": "পরিষ্কার আকাশ",
        "Mainly clear": "প্রায় পরিষ্কার",
        "Partly cloudy": "আংশিক মেঘলা",
        "Overcast": "মেঘাচ্ছন্ন",
        "Foggy": "কুয়াশাচ্ছন্ন",
        "Rime fog": "হিম কুয়াশা",
        "Light drizzle": "হালকা গুঁড়ি গুঁড়ি",
        "Drizzle": "গুঁড়ি গুঁড়ি",
        "Heavy drizzle": "ভারী গুঁড়ি গুঁড়ি",
        "Freezing drizzle": "হিমায়িত গুঁড়ি গুঁড়ি",
        "Light rain": "হালকা বৃষ্টি",
        "Rain": "বৃষ্টি",
        "Heavy rain": "ভারী বৃষ্টি",
        "Freezing rain": "হিমায়িত বৃষ্টি",
        "Light snow": "হালকা তুষার",
        "Snow": "তুষারপাত",
        "Heavy snow": "ভারী তুষারপাত",
        "Snow grains": "তুষার কণা",
        "Light showers": "হালকা বৃষ্টিপাত",
        "Showers": "বৃষ্টিপাত",
        "Heavy showers": "ভারী বৃষ্টিপাত",
        "Snow showers": "তুষার বৃষ্টিপাত",
        "Thunderstorm": "বজ্রপাতসহ ঝড়",
        "Unknown": "অজানা",
        "Live conditions": "লাইভ আবহাওয়া"
    };

    /* ---------------- Helpers ---------------- */

    function lang() {
        try {
            var p = new URLSearchParams(window.location.search).get("lang");
            if (p === "bn" || p === "en") return p;
            var s = window.localStorage.getItem(STORAGE);
            if (s === "bn" || s === "en") return s;
        } catch (e) {}
        return "en";
    }

    function isBn() { return lang() === "bn"; }

    function t(key) {
        var d = isBn() ? bn : en;
        return (d[key] != null) ? d[key] : "";
    }

    function weatherLabel(label) {
        if (!isBn()) return label;
        return weatherLabels[label] || label;
    }

    /* Translate a key and substitute %k placeholders from a values map. */
    function fmt(key, values) {
        var s = t(key);
        if (!s) return s;
        values = values || {};
        Object.keys(values).forEach(function (k) {
            s = s.split("%" + k).join(String(values[k]));
        });
        return s;
    }

    function mapTax(value, dict) {
        if (!isBn()) return value;
        return (dict[value] != null) ? dict[value] : value;
    }

    /* Produce a Bangla copy of a destination for display. */
    function localizeDest(d) {
        if (!isBn()) return d;
        var tr = DEST[d.slug];
        var out = {};
        Object.keys(d).forEach(function (k) { out[k] = d[k]; });

        if (tr) {
            if (tr.name) out.name = tr.name;
            if (tr.shortDesc) out.shortDesc = tr.shortDesc;
            if (tr.description) out.description = tr.description;
            if (tr.activities) out.activities = tr.activities;
            if (tr.attractions) out.attractions = tr.attractions;
            if (tr.tips) out.tips = tr.tips;
            if (tr.bestTime) out.bestTime = tr.bestTime;
            if (tr.recommendedDays) out.recommendedDays = tr.recommendedDays;
            if (tr.budget) out.budget = tr.budget;
            if (tr.travelType) out.travelType = tr.travelType;
        }

        out.division = mapTax(d.division, taxonomy.division);
        out.district = mapTax(d.district, taxonomy.district);
        out.category = mapTax(d.category, taxonomy.category);
        out.categories = (d.categories || []).map(function (c) { return mapTax(c, taxonomy.category); });
        out.difficulty = mapTax(d.difficulty, taxonomy.difficulty);

        out.travelInfo = {};
        Object.keys(d.travelInfo || {}).forEach(function (k) {
            out.travelInfo[k] = d.travelInfo[k];
        });
        if (tr && tr.travelInfo) {
            if (tr.travelInfo.from) out.travelInfo.from = tr.travelInfo.from;
            if (tr.travelInfo.duration) out.travelInfo.duration = tr.travelInfo.duration;
            if (tr.travelInfo.route) out.travelInfo.route = tr.travelInfo.route;
            if (tr.travelInfo.flight != null) out.travelInfo.flight = tr.travelInfo.flight;
            if (tr.travelInfo.transport) {
                out.travelInfo.transport = tr.travelInfo.transport;
            } else {
                out.travelInfo.transport = (d.travelInfo.transport || []).map(function (x) {
                    return mapTax(x, taxonomy.transport);
                });
            }
        } else {
            out.travelInfo.transport = (d.travelInfo.transport || []).map(function (x) {
                return mapTax(x, taxonomy.transport);
            });
        }
        return out;
    }

    /* Translate the global destination list in place. */
    function translateDestinations() {
        if (typeof DESTINATIONS === "undefined") return;
        DESTINATIONS = DESTINATIONS.map(localizeDest);
    }

    /* Bangla numerals helper */
    var BN_DIGITS = "০১২৩৪৫৬৭৮৯";
    function toBnDigits(str) {
        return String(str).replace(/[0-9]/g, function (d) { return BN_DIGITS[d]; });
    }

    /* Apply translations to static [data-i18n] elements. */
    function applyUI() {
        document.documentElement.setAttribute("lang", isBn() ? "bn" : "en");

        var toggle = document.getElementById("langToggle");
        if (toggle) toggle.textContent = isBn() ? "English" : "বাংলা";

        var titleEl = document.querySelector("title[data-i18n]");
        if (titleEl) titleEl.textContent = t(titleEl.getAttribute("data-i18n"));

        if (!isBn()) return;

        var count = (typeof DESTINATIONS !== "undefined") ? DESTINATIONS.length : 104;

        document.querySelectorAll("[data-i18n]").forEach(function (el) {
            var key = el.getAttribute("data-i18n");
            var text = t(key);
            if (!text) return;
            text = text.replace(/%n/g, toBnDigits(count));
            el.innerHTML = text;
        });
        document.querySelectorAll("[data-i18n-placeholder]").forEach(function (el) {
            var text = t(el.getAttribute("data-i18n-placeholder"));
            if (text) el.setAttribute("placeholder", text);
        });
    }

    function toggle() {
        var next = isBn() ? "en" : "bn";
        try { window.localStorage.setItem(STORAGE, next); } catch (e) {}
        window.location.reload();
    }

    window.I18N = {
        lang: lang,
        isBn: isBn,
        t: t,
        fmt: fmt,
        weatherLabel: weatherLabel,
        mapTax: mapTax,
        localizeDest: localizeDest,
        toggle: toggle,
        applyUI: applyUI
    };

    /* Translate the global list immediately so every later script
       (detail.js, app.js, weather-page.js) sees Bangla data at eval time. */
    translateDestinations();

    /* Wire the toggle button + static UI strings. */
    document.addEventListener("DOMContentLoaded", function () {
        var btn = document.getElementById("langToggle");
        if (btn) btn.addEventListener("click", toggle);
        applyUI();
        /* Smooth language transition: fade content in after i18n applies. */
        var f = setTimeout(function () { document.body.classList.add("loaded"); }, 50);
        if (f) clearTimeout(f);
    });
})(window, document);