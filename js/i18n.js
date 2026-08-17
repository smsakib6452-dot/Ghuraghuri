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
        "nav.explore": "এক্সপ্লোর",
        "nav.destinations": "গন্তব্যস্থান",
        "nav.hotels": "হোটেল",
        "nav.restaurants": "রেস্টুরেন্ট",
        "nav.transport": "পরিবহন",
        "nav.travel": "ভ্রমণ পরিকল্পনা",
        "nav.map": "মানচিত্র",
        "nav.weather": "আবহাওয়া",
        "nav.admin": "অ্যাডমিন",

        "hero.eyebrow": "বাংলাদেশ আবিষ্কার করুন",
        "hero.title.line1": "এক দেশ,",
        "hero.title.line2": "অসংখ্য গল্প।",
        "hero.sub": "সমুদ্র, পাহাড়, বন, নদী আর ঐতিহ্যের পথে<br/>আবিষ্কার করুন বাংলাদেশের প্রতিটি অনন্য গল্প।",
        "hero.search": "গন্তব্য খুঁজুন — কক্সবাজার, সাজেক, সিলেট...",
        "hero.searchGo": "খুঁজুন",
        "hero.popular": "জনপ্রিয়:",
        "hero.searchLabel": "গন্তব্য খুঁজুন",
        "stat.destinations": "অন্বেষণের স্থান",
        "stat.divisions": "বিভাগ",
        "stat.districts": "জেলা",

        "explore.eyebrow": "আবিষ্কার করুন",
        "explore.title": "বাংলাদেশ এক্সপ্লোর করুন",
        "explore.subtitle": "আপনার পরবর্তী গন্তব্য খুঁজুন",
        "explore.link": "সব গন্তব্যস্থান দেখুন",

        "division.eyebrow": "ব্রাউজ করুন",
        "division.title": "বিভাগ অনুযায়ী এক্সপ্লোর করুন",
        "division.destinations": "টি গন্তব্য",
        "division.count": "%dটি বিভাগ · %tটি গন্তব্য",
        "division.filterResult": "%d বিভাগে %nটি গন্তব্য",

        "planner.eyebrow": "ভ্রমণ পরিকল্পনা",
        "planner.title": "আপনার যাত্রা পরিকল্পনা করুন",
        "planner.sub": "গন্তব্য খুঁজুন, রুট দেখুন, আশেপাশের স্থান ঘুরে দেখুন এবং বাংলাদেশের নিখুঁত ভ্রমণের পরিকল্পনা করুন।",
        "planner.map": "মানচিত্র দেখুন",
        "planner.destinations": "গন্তব্যস্থান দেখুন",

        "info.eyebrow": "সব যা দরকার",
        "info.title": "প্রতিটি গন্তব্য, সম্পূর্ণভাবে",
        "info.exactLocation": "সঠিক অবস্থান",
        "info.exactLocationText": "স্থানাঙ্ক, লাইভ মানচিত্র ও দিকনির্দেশনা সহ প্রতিটি গন্তব্যের অবস্থান চিহ্নিত করুন।",
        "info.weather": "আবহাওয়া",
        "info.weatherText": "লাইভ আবহাওয়া ও পূর্বাভাস, যাতে সঠিক মৌসুমে প্যাকিং করতে পারেন।",
        "info.road": "সড়ক তথ্য",
        "info.roadText": "রুট, দূরত্ব ও সময় — অনুমান ছাড়াই পৌঁছান।",
        "info.hotels": "কাছের হোটেল",
        "info.hotelsText": "সব ধরনের ভ্রমণকারীর জন্য বাজেট ও থাকার ব্যবস্থার তথ্য।",
        "info.food": "স্থানীয় খাবার",
        "info.foodText": "চা থেকে টাটকা সামুদ্রিক খাবার — প্রতিটি অঞ্চলে কী খাবেন তা জানুন।",
        "info.map": "মানচিত্রে এক্সপ্লোর করুন",
        "info.mapText": "ইন্টারঅ্যাক্টিভ মানচিত্রে প্রতিটি গন্তব্য ও আশেপাশের আকর্ষণ দেখুন।",

        "weather.title2": "যাওয়ার আগে আবহাওয়া দেখে নিন",
        "weather.viewAll": "আবহাওয়া দেখুন",

        "footer.tagline": "বাংলাদেশ এক্সপ্লোর করুন, একটি ভ্রমণ এক সময়ে। বাংলাদেশের সৈকত, পাহাড়, বন ও ঐতিহ্যের দরজা।",
        "footer.navTitle": "এক্সপ্লোর",
        "footer.popularTitle": "জনপ্রিয় গন্তব্য",
        "footer.otherTitle": "অন্যান্য",
        "footer.about": "আমাদের সম্পর্কে",
        "footer.contact": "যোগাযোগ",
        "footer.privacy": "গোপনীয়তা",
        "footer.terms": "শর্তাবলী",

        "search.empty": "কোনো গন্তব্য পাওয়া যায়নি",
        "search.view": "দেখুন",

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

        "discover.eyebrow": "বাংলাদেশ আবিষ্কার করুন",
        "discover.title": "বাংলাদেশের প্রতিটি কোণ আবিষ্কার করুন",
        "discover.subtitle": "সৈকত, পাহাড়, বন, নদী ও ঐতিহাসিক স্থান থেকে শুরু করে ৬৪টি জেলার সব গন্তব্য ঘুরে দেখুন।",
        "discover.search": "গন্তব্য খুঁজুন — কক্সবাজার, কুমিল্লা, পাহাড়, সমুদ্র সৈকত…",
        "discover.clear": "সব ফিল্টার মুছুন",
        "discover.resultCount": "%aটি গন্তব্য",
        "filter.label": "ফিল্টার",
        "filter.division": "বিভাগ",
        "filter.district": "জেলা",
        "filter.category": "ক্যাটাগরি",
        "filter.popularity": "জনপ্রিয়তা",
        "filter.featured": "ফিচার্ড",
        "filter.all": "সব",
        "filter.featuredOnly": "শুধু ফিচার্ড",
        "pop.very_high": "খুব জনপ্রিয়",
        "pop.high": "জনপ্রিয়",
        "pop.medium": "মাঝারি",
        "pop.low": "কম পরিচিত",
        "sort.label": "সাজান",
        "sort.popularity": "জনপ্রিয়তা",
        "sort.rating": "সর্বোচ্চ রেটিং",
        "sort.reviews": "সর্বাধিক রিভিউ",
        "sort.name": "নাম A–Z",
        "home.section.beaches": "সেরা সৈকত",
        "home.section.hills": "পাহাড়ের গন্তব্য",
        "home.section.nature": "প্রকৃতি ও বন",
        "home.section.historical": "ঐতিহাসিক স্থান",
        "home.section.hidden": "লুকানো রত্ন",
        "home.section.mountains": "পর্বত",
        "home.section.islands": "দ্বীপপুঞ্জ",
        "home.section.cultural": "সাংস্কৃতিক স্থান",
        "home.section.viewAll": "সব দেখুন",
        "home.section.explore.title": "জেলা অনুযায়ী এক্সপ্লোর করুন",
        "home.section.explore.sub": "৬৪টি জেলার সবকটি কভার করা হয়েছে — আপনার জেলার গন্তব্য খুঁজুন।",
        "home.section.explore.districts": "%nটি জেলায় গন্তব্য",
        "home.section.seeMore": "আরও দেখুন",
        "home.themes.eyebrow": "নির্বাচিত",
        "home.themes.title": "থিম অনুযায়ী এক্সপ্লোর করুন",
        "home.section.explore.eyebrow": "সম্পূর্ণ কভারেজ",

        "featured.eyebrow": "ভ্রমণ পছন্দ",
        "featured.title": "পরবর্তী গন্তব্য কোথায়?",
        "featured.sub": "আপনার যাত্রা শুরুর জন্য হাতে-বাছাই করা গন্তব্য।",
        "featured.link": "সব গন্তব্যস্থান ঘুরে দেখুন",

        "experience.eyebrow": "আপনার মতো করে ঘুরুন",
        "experience.title": "আপনার পছন্দের ভ্রমণ বেছে নিন।",
        "experience.sub": "আপনার পছন্দের ভ্রমণের ধরন সরাসরি খুঁজে দেখুন।",
        "experience.beaches": "সৈকত",
        "experience.mountains": "পাহাড়-পর্বত",
        "experience.nature": "প্রকৃতি ও বন",
        "experience.heritage": "ঐতিহ্য ও ইতিহাস",
        "experience.islands": "দ্বীপ",
        "experience.spiritual": "আধ্যাত্মিক স্থান",
        "experience.count": "%nটি গন্তব্য",
        "experience.view": "ঘুরে দেখুন",

        "stay.eyebrow": "থাকুন",
        "stay.title": "থাকার জায়গা খুঁজুন",
        "stay.sub": "কোথায় থাকবেন তা বেছে নিতে ফিচার্ড থাকার ব্যবস্থা।",
        "stay.link": "হোটেল দেখুন",
        "stay.prompt": "বাংলাদেশের জনপ্রিয় গন্তব্যের কাছে থাকার ব্যবস্থা তুলনা করুন।",

        "eat.eyebrow": "খাওয়া",
        "eat.title": "খাওয়ার জায়গা খুঁজুন",
        "eat.sub": "যাতায়াতের পথে ভালো খেতে ফিচার্ড রেস্টুরেন্ট।",
        "eat.link": "রেস্টুরেন্ট দেখুন",
        "eat.prompt": "বাংলাদেশের যেকোনো গন্তব্যের কাছে দারুণ খাবার খুঁজুন।",

        "move.eyebrow": "ভ্রমণ",
        "move.title": "বাংলাদেশে যাতায়াত",
        "move.sub": "শহরগুলোর মধ্যে কীভাবে যাবেন — আরামে পৌঁছানোর পরিকল্পনা করুন।",
        "move.link": "পরিবহন দেখুন",
        "move.bus": "বাস",
        "move.bus.sub": "আন্তঃনগর ও এক্সপ্রেস বাস",
        "move.train": "ট্রেন",
        "move.train.sub": "ব্রডগেজ রেল নেটওয়ার্ক",
        "move.launch": "লঞ্চ",
        "move.launch.sub": "নদীর ফেরি ও স্টিমার রুট",
        "move.flight": "ফ্লাইট",
        "move.flight.sub": "শহরগুলোর মধ্যে অভ্যন্তরীণ রুট",
        "move.local": "স্থানীয় পরিবহন",
        "move.local.sub": "সিএনজি, রিকশা, নৌকা ও আরও অনেক কিছু",

        "inspiration.eyebrow": "ভ্রমণ অনুপ্রেরণা",
        "inspiration.title": "এই মৌসুমে কোথায় যাবেন?",
        "inspiration.sub": "আপনার পরবর্তী যাত্রার অনুপ্রেরণার জন্য কিছু পরামর্শ।",
        "inspiration.bestTime": "সেরা সময়",
        "inspiration.card1.title": "সোনালি সূর্যাস্ত দেখুন",
        "inspiration.card1.sub": "বিশ্বের দীর্ঘতম সমুদ্র সৈকত",
        "inspiration.card2.title": "মেঘের উপরে উঠুন",
        "inspiration.card2.sub": "সাহসী ভ্রমণকারীদের জন্য পাহাড়ি ট্র্যাক",
        "inspiration.card3.title": "ম্যানগ্রোভ নদীতে ভাসুন",
        "inspiration.card3.sub": "ইউনেস্কো স্বীকৃত বনের বিস্ময়",

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
        "detail.upazila": "উপজেলা",
        "detail.nearby": "কাছাকাছি গন্তব্য",
        "detail.related": "আরও দেখার মতো",
        "detail.notAvailable": "—",
        "detail.reviewsPlaceholder": "এই গন্তব্যের রিভিউ শীঘ্রই আসছে — ভ্রমণকারীদের অভিজ্ঞতা জানাতে শীঘ্রই আসছে।",
        "detail.nearbyHint": "একই এলাকায় আরও যা দেখতে পারেন",
        "detail.services.title": "ভ্রমণ পরিষেবা",
        "detail.services.stay": "কাছের হোটেল",
        "detail.services.eat": "কাছের রেস্টুরেন্ট",
        "detail.services.transport": "যাতায়াত",
        "detail.services.seeAll": "সব দেখুন →",
        "detail.services.origin": "ঢাকা থেকে",

        "fact.division": "বিভাগ",
        "fact.district": "জেলা",
        "fact.upazila": "উপজেলা",
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

        "footer.title": "ওপেন ডেটা, লিফলেট ও ওপেন-মেটিও দিয়ে তৈরি একটি ভ্রমণ গাইড।",
        "footer.meta": "আবহাওয়ার ডেটা: ওপেন-মেটিও · মানচিত্র: © ওপেনস্ট্রিটম্যাপ · ছবি: আনস্প্ল্যাশ",
        "footer.admin": "বাংলাদেশ ট্রাভেল এক্সপ্লোরার — অ্যাডমিন প্যানেল। পরিবর্তনগুলো শুধু আপনার ব্রাউজারে সংরক্ষিত হয়।",

        "page.title.index": "ঘুরাঘুরি — এক দেশ, অসংখ্য গল্প",
        "page.title.weather": "লাইভ আবহাওয়া — ঘুরাঘুরি",
        "page.title.detail": "গন্তব্য — ঘুরাঘুরি",
        "page.title.admin": "অ্যাডমিন প্যানেল — ঘুরাঘুরি",
        "page.title.hotels": "হোটেল — ঘুরাঘুরি",
        "page.title.restaurants": "রেস্টুরেন্ট — ঘুরাঘুরি",
        "page.title.transport": "পরিবহন — ঘুরাঘুরি",
        "page.title.travel": "ভ্রমণ পরিকল্পনা — ঘুরাঘুরি",

        "travel.loading": "লোড হচ্ছে…",
        "travel.empty": "কিছু পাওয়া যায়নি",
        "travel.empty.text": "অন্য অবস্থান বা ফিল্টার চেষ্টা করুন।",
        "travel.error.title": "কিছু একটা ভুল হয়েছে",
        "travel.error.text": "এই মুহূর্তে লাইভ ডেটা লোড করা যাচ্ছে না। একটু পরে আবার চেষ্টা করুন।",
        "travel.retry": "আবার চেষ্টা করুন",
        "travel.demo": "ডেমো ডেটা",
        "travel.demo.text": "লাইভ ফলাফলের জন্য api/.env-এ একটি প্রোভাইডার সংযোগ করুন",
        "travel.fallback.label": "স্থানীয় তথ্য",
        "travel.fallback.note": "লাইভ ট্রাভেল সার্ভিসটি বর্তমানে অপ্রাপ্য, তাই এই তথ্যটি লাইভ নাও হতে পারে",
        "hotels.loading": "হোটেল খোঁজা হচ্ছে…",
        "hotels.empty": "কোনো হোটেল পাওয়া যায়নি",
        "restaurants.loading": "রেস্টুরেন্ট খোঁজা হচ্ছে…",
        "restaurants.empty": "কোনো রেস্টুরেন্ট পাওয়া যায়নি",
        "transport.loading": "পরিবহন খোঁজা হচ্ছে…",
        "transport.empty": "কোনো পরিবহন বিকল্প পাওয়া যায়নি",
        "travel.price.unknown": "দাম জানতে চাই",
        "travel.price.est": "আনুমানিক",
        "travel.price_level": "মূল্য স্তর",
        "travel.open": "এখন খোলা",
        "travel.gmaps": "গুগল ম্যাপ",
        "travel.viewMap": "মানচিত্রে দেখুন",
        "travel.directions": "দিকনির্দেশনা",
        "travel.refine": "সার্চ পরিমার্জন",
        "travel.prompt": "কোথায় যেতে চান?",
        "travel.promptEat": "কোথায় খেতে চান?",
        "travel.destination": "গন্তব্য (যেমন কক্সবাজার, সিলেট)…",
        "travel.search": "খুঁজুন",
        "travel.adults": "যাত্রী",
        "travel.ac.empty": "কোনো মিল নেই",
        "travel.checkIn": "চেক-ইন",
        "travel.checkOut": "চেক-আউট",
        "travel.rooms": "রুম",
        "travel.seeAll": "সব দেখুন",
        "travel.none": "এই গন্তব্যের জন্য কোনো %s পাওয়া যায়নি।",
        "travel.tab.all": "সব",
        "travel.tab.hotels": "হোটেল",
        "travel.tab.restaurants": "রেস্টুরেন্ট",
        "travel.tab.transport": "পরিবহন",
        "travel.section.hotels": "হোটেল",
        "travel.section.restaurants": "রেস্টুরেন্ট",
        "travel.section.transport": "পরিবহন",
        "travel.hero.title": "কোথায় যাচ্ছেন?",
        "travel.hero.sub": "বাংলাদেশের যেকোনো গন্তব্যের জন্য হোটেল, রেস্টুরেন্ট ও পরিবহন খুঁজুন।",

        "hotels.resultCount": "টি হোটেল পাওয়া গেছে",
        "hotels.page.eyebrow": "থাকুন",
        "hotels.page.title": "যেকোনো গন্তব্যের কাছে হোটেল খুঁজুন",
        "hotels.page.sub": "বাংলাদেশের সব গন্তব্যে হোটেল, রিসোর্ট ও থাকার ব্যবস্থা খুঁজুন।",
        "hotels.filter.rating": "সর্বনিম্ন রেটিং",
        "hotels.filter.price": "সর্বোচ্চ দাম",
        "hotels.filter.type": "আবাসনের ধরন",
        "hotels.checkin": "চেক-ইন",
        "hotels.checkout": "চেক-আউট",
        "hotels.adults": "প্রাপ্তবয়স্ক",
        "hotels.rooms": "রুম",

        "restaurants.resultCount": "টি স্থান পাওয়া গেছে",
        "restaurants.page.eyebrow": "খাওয়া",
        "restaurants.page.title": "যেকোনো গন্তব্যের কাছে দারুণ খাবার খুঁজুন",
        "restaurants.page.sub": "বাংলাদেশের সব জায়গায় অবস্থান, রান্না, দাম ও রেটিং দিয়ে রেস্টুরেন্ট খুঁজুন।",
        "restaurants.filter.cuisine": "রান্না",
        "restaurants.filter.price": "মূল্য স্তর",
        "restaurants.filter.rating": "সর্বনিম্ন রেটিং",
        "restaurants.filter.open": "এখন খোলা",

        "transport.page.eyebrow": "ভ্রমণ",
        "transport.page.title": "সারা বাংলাদেশে পরিবহন ও রুট",
        "transport.page.sub": "শহরগুলোর মধ্যে বাস, ট্রেন, ফ্লাইট, লঞ্চ ইত্যাদি তুলনা করুন, সাথে রুটের দূরত্ব ও সময়ের অনুমান।",
        "transport.from": "থেকে (যেমন ঢাকা)…",
        "transport.to": "যাওয়ার গন্তব্য (যেমন কক্সবাজার)…",
        "transport.date": "তারিখ",
        "transport.type": "ধরন",
        "transport.prompt": "উভয় স্থান লিখুন (থেকে ও যাওয়ার গন্তব্য)।",
        "transport.bus": "বাস",
        "transport.train": "ট্রেন",
        "transport.flight": "ফ্লাইট",
        "transport.ferry": "লঞ্চ/ফেরি",
        "transport.car": "গাড়ি",
        "transport.taxi": "ট্যাক্সি",
        "transport.driving": "গাড়ি চালিয়ে",
        "transport.route.title": "রুটের অনুমান",
        "transport.route.distance": "দূরত্ব",
        "transport.route.time": "আনুমানিক সময়",
        "transport.route.mode": "মাধ্যম",

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
        "admin.editor.nameBn": "বাংলা নাম",
        "admin.editor.upazila": "উপজেলা",
        "admin.editor.tags": "ট্যাগ (কমা দিয়ে)",
        "admin.editor.popularity": "জনপ্রিয়তা",
        "admin.editor.status": "অবস্থা",
        "admin.editor.featured": "হোম পেজে ফিচার্ড করুন",
        "admin.editor.details": "বিস্তারিত",
        "admin.editor.thingsToDo": "করণীয় (প্রতি লাইনে একটি)",
        "admin.editor.whatToSee": "দেখার জিনিস (প্রতি লাইনে একটি)",
        "admin.editor.travelTips": "ভ্রমণ টিপস (প্রতি লাইনে একটি)",
        "admin.editor.transportOptions": "পরিবহন বিকল্প (কমা দিয়ে)",
        "admin.editor.nearbyDest": "কাছাকাছি গন্তব্য (স্লাগ, কমা দিয়ে)",
        "admin.editor.nearbyHotels": "কাছাকাছি হোটেল (কমা দিয়ে)",
        "admin.import": "JSON ইমপোর্ট",
        "admin.easy": "সহজ",
        "admin.moderate": "মাঝারি",
        "admin.challenging": "কঠিন",
        "admin.disabled.title": "অ্যাডমিন বন্ধ আছে",
        "admin.disabled.note": "প্যানেল ব্যবহার করতে কনফিগে ADMIN_ENABLED সত্য করুন।",
        "admin.providers.title": "ভ্রমণ পরিষেবা প্রোভাইডার",
        "admin.providers.sub": "হোটেল, রেস্টুরেন্ট, পরিবহন ও রুট প্রোভাইডারের অবস্থা।",
        "admin.providers.notConfigured": "ভ্রমণ পরিষেবা API কনফিগার করা নেই (config.js-এ API_BASE_URL দিন)।",
        "admin.providers.loading": "প্রোভাইডার স্ট্যাটাস লোড হচ্ছে…",
        "admin.providers.error": "প্রোভাইডার স্ট্যাটাস লোড করা যায়নি।",
        "admin.providers.on": "চালু",
        "admin.providers.off": "কনফিগার করা হয়নি",
    };

    var en = {
        "nav.explore": "Explore",
        "nav.destinations": "Destinations",
        "nav.hotels": "Hotels",
        "nav.restaurants": "Restaurants",
        "nav.transport": "Transport",
        "nav.travel": "Plan Trip",
        "nav.map": "Map",
        "nav.weather": "Weather",
        "nav.admin": "Admin",
        "hero.eyebrow": "EXPLORE BANGLADESH",
        "hero.title.line1": "One Country,",
        "hero.title.line2": "Endless Stories.",
        "hero.sub": "From beaches to hills, rivers to forests—<br/>discover the stories that make Bangladesh unforgettable.",
        "hero.search": "Search destinations — Cox's Bazar, Sajek, Sylhet...",
        "hero.searchGo": "Search",
        "hero.popular": "Popular:",
        "hero.searchLabel": "Search destinations",
        "stat.destinations": "Places to Explore",
        "stat.divisions": "Divisions",
        "stat.districts": "Districts",
        "explore.eyebrow": "Discover",
        "explore.title": "Explore Bangladesh",
        "explore.subtitle": "Find your next destination",
        "explore.link": "View all destinations",
        "division.eyebrow": "Browse",
        "division.title": "Explore by Division",
        "division.destinations": "destinations",
        "division.count": "%d divisions · %t destinations",
        "division.filterResult": "%n destinations in %d",
        "planner.eyebrow": "Travel Planner",
        "planner.title": "Plan Your Journey",
        "planner.sub": "Find destinations, check routes, explore nearby places and plan your perfect Bangladesh trip.",
        "planner.map": "Explore Map",
        "planner.destinations": "View Destinations",
        "info.eyebrow": "Everything You Need",
        "info.title": "Every Destination, Fully Explored",
        "info.exactLocation": "Exact Location",
        "info.exactLocationText": "Pinpoint every destination with coordinates, a live map and directions.",
        "info.weather": "Weather",
        "info.weatherText": "Live conditions and forecasts so you pack for the right season.",
        "info.road": "Road Information",
        "info.roadText": "Routes, distances and durations to get you there without the guesswork.",
        "info.hotels": "Nearby Hotels",
        "info.hotelsText": "Budget guidance and stay options for every kind of traveler.",
        "info.food": "Local Food",
        "info.foodText": "Discover what to taste in each region, from tea to fresh seafood.",
        "info.map": "Explore on Map",
        "info.mapText": "Visualize every destination and nearby attractions on an interactive map.",
        "weather.title2": "Check the Weather Before You Go",
        "weather.viewAll": "View Weather",
        "footer.tagline": "Explore Bangladesh, one journey at a time. Your gateway to the beaches, mountains, forests and heritage of Bangladesh.",
        "footer.navTitle": "Explore",
        "footer.popularTitle": "Popular Destinations",
        "footer.otherTitle": "Other",
        "footer.about": "About",
        "footer.contact": "Contact",
        "footer.privacy": "Privacy",
        "footer.terms": "Terms",
        "search.empty": "No destinations found",
        "search.view": "View",
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
        "discover.eyebrow": "Discover Bangladesh",
        "discover.title": "Discover Every Corner of Bangladesh",
        "discover.subtitle": "Explore destinations across all 64 districts — from beaches and hills to forests, rivers and historic landmarks.",
        "discover.search": "Search destinations — Cox's Bazar, Cumilla, hills, beaches…",
        "discover.clear": "Clear all filters",
        "discover.resultCount": "%a destinations",
        "filter.label": "Filters",
        "filter.division": "Division",
        "filter.district": "District",
        "filter.category": "Category",
        "filter.popularity": "Popularity",
        "filter.featured": "Featured",
        "filter.all": "All",
        "filter.featuredOnly": "Featured only",
        "pop.very_high": "Very popular",
        "pop.high": "Popular",
        "pop.medium": "Moderately popular",
        "pop.low": "Lesser known",
        "sort.label": "Sort by",
        "sort.popularity": "Popularity",
        "sort.rating": "Highest rated",
        "sort.reviews": "Most reviewed",
        "sort.name": "Name A–Z",
        "home.section.beaches": "Top Beaches",
        "home.section.hills": "Hill Destinations",
        "home.section.nature": "Nature & Forests",
        "home.section.historical": "Historical Sites",
        "home.section.hidden": "Hidden Gems",
        "home.section.mountains": "Mountains",
        "home.section.islands": "Islands",
        "home.section.cultural": "Cultural Places",
        "home.section.viewAll": "View all",
        "home.section.explore.title": "Explore by District",
        "home.section.explore.sub": "All 64 districts are now covered — find destinations in yours.",
        "home.section.explore.districts": "Destinations in %n districts",
        "home.section.seeMore": "See more",
        "home.themes.eyebrow": "Curated",
        "home.themes.title": "Explore by Theme",
        "home.section.explore.eyebrow": "Full Coverage",
        "featured.eyebrow": "Travel Picks",
        "featured.title": "Where will you go next?",
        "featured.sub": "Hand-picked favourites to start your journey.",
        "featured.link": "Explore All Destinations",
        "experience.eyebrow": "Explore Your Way",
        "experience.title": "Choose your kind of journey.",
        "experience.sub": "Jump straight to the kind of travel you love.",
        "experience.beaches": "Beaches",
        "experience.mountains": "Mountains",
        "experience.nature": "Nature & Forests",
        "experience.heritage": "Heritage & History",
        "experience.islands": "Islands",
        "experience.spiritual": "Spiritual Places",
        "experience.count": "%n destinations",
        "experience.view": "Explore",
        "stay.eyebrow": "Stay",
        "stay.title": "Find a place to stay",
        "stay.sub": "Featured stays to help you choose where to sleep.",
        "stay.link": "Explore Hotels",
        "stay.prompt": "Compare stays near Bangladesh's most-loved destinations.",
        "eat.eyebrow": "Eat",
        "eat.title": "Find a place to eat",
        "eat.sub": "Featured restaurants so you always eat well on the road.",
        "eat.link": "Explore Restaurants",
        "eat.prompt": "Find great food near any destination in Bangladesh.",
        "move.eyebrow": "Move",
        "move.title": "Getting around Bangladesh",
        "move.sub": "Plan how to travel between cities — and get there smoothly.",
        "move.link": "Explore Transport",
        "move.bus": "Bus",
        "move.bus.sub": "Intercity & express coaches",
        "move.train": "Train",
        "move.train.sub": "Broad-gauge rail network",
        "move.launch": "Launch",
        "move.launch.sub": "River ferries & steamer routes",
        "move.flight": "Flights",
        "move.flight.sub": "Domestic routes between cities",
        "move.local": "Local transport",
        "move.local.sub": "CNG, rickshaw, boat & more",
        "inspiration.eyebrow": "Travel Inspiration",
        "inspiration.title": "Where should you go this season?",
        "inspiration.sub": "Editorial ideas to spark your next journey.",
        "inspiration.bestTime": "Best time",
        "inspiration.card1.title": "Chase golden sunsets",
        "inspiration.card1.sub": "The world's longest unbroken sea beach",
        "inspiration.card2.title": "Rise above the clouds",
        "inspiration.card2.sub": "Hill tracks for bold travelers",
        "inspiration.card3.title": "Drift through mangrove rivers",
        "inspiration.card3.sub": "A UNESCO-listed forest wonder",
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
        "detail.upazila": "Upazila",
        "detail.nearby": "Nearby Destinations",
        "detail.related": "You Might Also Like",
        "detail.notAvailable": "—",
        "detail.reviewsPlaceholder": "Reviews for this destination are coming soon — traveler experiences will appear here.",
        "detail.nearbyHint": "More to see around this area",
        "detail.services.title": "Travel Services",
        "detail.services.stay": "Nearby Hotels",
        "detail.services.eat": "Nearby Restaurants",
        "detail.services.transport": "Getting There",
        "detail.services.seeAll": "See all →",
        "detail.services.origin": "From Dhaka",
        "fact.division": "Division",
        "fact.district": "District",
        "fact.upazila": "Upazila",
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
        "page.title.index": "Ghuraghuri — One Country, Endless Stories",
        "page.title.weather": "Live Weather — Ghuraghuri",
        "page.title.detail": "Destination — Ghuraghuri",
        "page.title.admin": "Admin Panel — Ghuraghuri",
        "page.title.hotels": "Hotels — Ghuraghuri",
        "page.title.restaurants": "Restaurants — Ghuraghuri",
        "page.title.transport": "Transport — Ghuraghuri",
        "page.title.travel": "Plan Your Trip — Ghuraghuri",

        "travel.loading": "Loading…",
        "travel.empty": "Nothing found",
        "travel.empty.text": "Try a different location or filter.",
        "travel.error.title": "Something went wrong",
        "travel.error.text": "We couldn't load live data right now. Please try again in a moment.",
        "travel.retry": "Try again",
        "travel.demo": "Demo data",
        "travel.demo.text": "connect a provider in api/.env for live results",
        "travel.fallback.label": "Local information",
        "travel.fallback.note": "the live travel service is currently unreachable, so this data may not be live",
        "hotels.loading": "Searching hotels…",
        "hotels.empty": "No hotels found",
        "restaurants.loading": "Searching restaurants…",
        "restaurants.empty": "No restaurants found",
        "transport.loading": "Searching transport options…",
        "transport.empty": "No transport options found",
        "travel.price.unknown": "Price on request",
        "travel.price.est": "Est.",
        "travel.price_level": "Price level",
        "travel.open": "Open now",
        "travel.gmaps": "Google Maps",
        "travel.viewMap": "View on Map",
        "travel.directions": "Get Directions",
        "travel.refine": "Refine search",
        "travel.prompt": "Where do you want to go?",
        "travel.promptEat": "Where do you want to eat?",
        "travel.destination": "Destination (e.g. Cox's Bazar, Sylhet)…",
        "travel.search": "Search",
        "travel.adults": "Passengers",
        "travel.ac.empty": "No matches",
        "travel.checkIn": "Check-in",
        "travel.checkOut": "Check-out",
        "travel.rooms": "Rooms",
        "travel.seeAll": "See all",
        "travel.none": "No %s found for this destination.",
        "travel.tab.all": "All",
        "travel.tab.hotels": "Hotels",
        "travel.tab.restaurants": "Restaurants",
        "travel.tab.transport": "Transport",
        "travel.section.hotels": "Hotels",
        "travel.section.restaurants": "Restaurants",
        "travel.section.transport": "Transport",
        "travel.hero.title": "Where are you going?",
        "travel.hero.sub": "Search hotels, restaurants and transport for any destination in Bangladesh.",

        "hotels.resultCount": "hotels found",
        "hotels.page.eyebrow": "Stay",
        "hotels.page.title": "Find Great Stays Near Any Destination",
        "hotels.page.sub": "Search hotels, resorts and stays across every destination in Bangladesh.",
        "hotels.filter.rating": "Min rating",
        "hotels.filter.price": "Max price",
        "hotels.filter.type": "Stay type",
        "hotels.checkin": "Check-in",
        "hotels.checkout": "Check-out",
        "hotels.adults": "Adults",
        "hotels.rooms": "Rooms",

        "restaurants.resultCount": "places found",
        "restaurants.page.eyebrow": "Eat",
        "restaurants.page.title": "Find Great Food Near Any Destination",
        "restaurants.page.sub": "Search restaurants across Bangladesh by location, cuisine, price and rating.",
        "restaurants.filter.cuisine": "Cuisine",
        "restaurants.filter.price": "Price level",
        "restaurants.filter.rating": "Min rating",
        "restaurants.filter.open": "Open now",

        "transport.page.eyebrow": "Move",
        "transport.page.title": "Transport Options & Routes Across Bangladesh",
        "transport.page.sub": "Compare bus, train, flight, ferry and more between cities, plus route distance and duration estimates.",
        "transport.from": "From (e.g. Dhaka)…",
        "transport.to": "To (e.g. Cox's Bazar)…",
        "transport.date": "Date",
        "transport.type": "Type",
        "transport.prompt": "Enter both departure and destination.",
        "transport.bus": "Bus",
        "transport.train": "Train",
        "transport.flight": "Flight",
        "transport.ferry": "Ferry",
        "transport.car": "Car",
        "transport.taxi": "Taxi",
        "transport.driving": "Driving",
        "transport.route.title": "Route estimate",
        "transport.route.distance": "Distance",
        "transport.route.time": "Est. time",
        "transport.route.mode": "Mode",
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
        "admin.note": "Changes are saved in this browser (localStorage) and applied to the live site immediately. Use <em>Reset all changes</em> to restore the original destinations.",
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
        "admin.editor.nameBn": "Bangla name",
        "admin.editor.upazila": "Upazila",
        "admin.editor.tags": "Tags (comma separated)",
        "admin.editor.popularity": "Popularity",
        "admin.editor.status": "Status",
        "admin.editor.featured": "Featured on home page",
        "admin.editor.details": "Details",
        "admin.editor.thingsToDo": "Things to do (one per line)",
        "admin.editor.whatToSee": "What to see (one per line)",
        "admin.editor.travelTips": "Travel tips (one per line)",
        "admin.editor.transportOptions": "Transport options (comma separated)",
        "admin.editor.nearbyDest": "Nearby destinations (slugs, comma separated)",
        "admin.editor.nearbyHotels": "Nearby hotels (comma separated)",
        "admin.import": "Import JSON",
        "admin.easy": "Easy",
        "admin.moderate": "Moderate",
        "admin.challenging": "Challenging",
        "admin.disabled.title": "Admin disabled",
        "admin.disabled.note": "Set ADMIN_ENABLED to true in config to use the panel.",
        "admin.providers.title": "Travel Service Providers",
        "admin.providers.sub": "Status of the hotel, restaurant, transport and route providers used by the API.",
        "admin.providers.notConfigured": "Travel services API not configured (set API_BASE_URL in config.js).",
        "admin.providers.loading": "Loading provider status…",
        "admin.providers.error": "Could not load provider status.",
        "admin.providers.on": "Enabled",
        "admin.providers.off": "Not configured",
    };

    /* ---------------- Taxonomy (English -> Bangla) ---------------- */
    var taxonomy = {
        category: {
            "Beach": "সৈকত",
            "Island": "দ্বীপ",
            "Hill": "পাহাড়",
            "Mountain": "পর্বত",
            "Waterfall": "ঝরনা",
            "Forest": "বন",
            "National Park": "জাতীয় উদ্যান",
            "Wildlife": "বন্যপ্রাণী",
            "River": "নদী",
            "Haor": "হাওর",
            "Lake": "হ্রদ",
            "Archaeological": "প্রত্নতাত্ত্বিক",
            "Historical": "ঐতিহাসিক",
            "Heritage": "ঐতিহ্য",
            "Religious": "ধর্মীয়",
            "Tea Garden": "চা বাগান",
            "Eco Tourism": "ইকো-ট্যুরিজম",
            "Adventure": "অ্যাডভেঞ্চার",
            "Picnic Spot": "পিকনিক স্পট",
            "Resort Area": "রিসোর্ট এলাকা",
            "City": "শহর",
            "Village": "গ্রাম",
            "Cultural": "সাংস্কৃতিক",
            "Museum": "জাদুঘর",
            "Fort": "দুর্গ",
            "Palace": "প্রাসাদ",
            "Temple": "মন্দির",
            "Mosque": "মসজিদ",
            "Shrine": "দরগাহ",
            "Nature": "প্রকৃতি",
            "Family": "পরিবার",
            "Coastal": "উপকূলীয়"
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
            "Dhaka": "ঢাকা", "Faridpur": "ফরিদপুর", "Gazipur": "গাজীপুর", "Gopalganj": "গোপালগঞ্জ",
            "Kishoreganj": "কিশোরগঞ্জ", "Madaripur": "মাদারীপুর", "Manikganj": "মানিকগঞ্জ",
            "Munshiganj": "মুন্সীগঞ্জ", "Narayanganj": "নারায়ণগঞ্জ", "Narsingdi": "নরসিংদী",
            "Rajbari": "রাজবাড়ী", "Shariatpur": "শরীয়তপুর", "Tangail": "টাঙ্গাইল",
            "Chattogram": "চট্টগ্রাম", "Bandarban": "বান্দরবান", "Brahmanbaria": "ব্রাহ্মণবাড়িয়া",
            "Chandpur": "চাঁদপুর", "Cumilla": "কুমিল্লা", "Cox's Bazar": "কক্সবাজার", "Feni": "ফেনী",
            "Khagrachhari": "খাগড়াছড়ি", "Lakshmipur": "লক্ষ্মীপুর", "Noakhali": "নোয়াখালী",
            "Rangamati": "রাঙ্গামাটি",
            "Bogura": "বগুড়া", "Joypurhat": "জয়পুরহাট", "Naogaon": "নওগাঁ", "Natore": "নাটোর",
            "Chapainawabganj": "চাঁপাইনবাবগঞ্জ", "Pabna": "পাবনা", "Rajshahi": "রাজশাহী", "Sirajganj": "সিরাজগঞ্জ",
            "Bagerhat": "বাগেরহাট", "Chuadanga": "চুয়াডাঙ্গা", "Jashore": "যশোর", "Jhenaidah": "ঝিনাইদহ",
            "Khulna": "খুলনা", "Kushtia": "কুষ্টিয়া", "Magura": "মাগুরা", "Meherpur": "মেহেরপুর",
            "Narail": "নড়াইল", "Satkhira": "সাতক্ষীরা",
            "Jhalokathi": "ঝালকাঠি", "Barguna": "বরগুনা", "Barishal": "বরিশাল", "Bhola": "ভোলা",
            "Patuakhali": "পটুয়াখালী", "Pirojpur": "পিরোজপুর",
            "Habiganj": "হবিগঞ্জ", "Moulvibazar": "মৌলভীবাজার", "Sunamganj": "সুনামগঞ্জ", "Sylhet": "সিলেট",
            "Dinajpur": "দিনাজপুর", "Gaibandha": "গাইবান্ধা", "Kurigram": "কুড়িগ্রাম", "Lalmonirhat": "লালমনিরহাট",
            "Nilphamari": "নীলফামারী", "Panchagarh": "পঞ্চগড়", "Rangpur": "রংপুর", "Thakurgaon": "ঠাকুরগাঁও",
            "Jamalpur": "জামালপুর", "Mymensingh": "ময়মনসিংহ", "Netrokona": "নেত্রকোনা", "Sherpur": "শেরপুর",
            "Comilla": "কুমিল্লা", "Savar": "সাভার", "Muktagacha": "মুক্তাগাছা",
            "Puthia (Rajshahi)": "পুঠিয়া (রাজশাহী)", "Bagha (Rajshahi)": "বাঘা (রাজশাহী)",
            "Khulna / Satkhira": "খুলনা / সাতক্ষীরা", "Munshiganj / Shariatpur": "মুন্সিগঞ্জ / শরীয়তপুর",
            "Sirajganj / Tangail": "সিরাজগঞ্জ / টাঙ্গাইল"
        },
        difficulty: {
            "Easy": "সহজ",
            "Moderate": "মাঝারি",
            "Challenging": "কঠিন",
            "Easy to Moderate": "সহজ থেকে মাঝারি"
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
            "Train (on the bridge)": "ট্রেন (সেতুর উপর)",
            "Bicycle": "সাইকেল",
            "Bike": "বাইক",
            "Taxi": "ট্যাক্সি"
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

    /* Build a searchable haystack for a destination that works in BOTH
       languages and in either UI mode: includes the English + Bangla name,
       upazila, English + Bangla division/district/category, tags and the
       short description. Lets users type "কক্সবাজার" or "কুমিল্লা" even
       while the site is in English. */
    function searchText(d) {
        var parts = [];
        function add(x) { if (x) parts.push(String(x).toLowerCase()); }
        function bothLanguages(value, dict) {
            if (!value) return;
            if (!dict) { add(value); return; }
            var en = value;
            var keys = Object.keys(dict);
            for (var i = 0; i < keys.length; i++) {
                if (dict[keys[i]] === value) { en = keys[i]; break; }
            }
            var bn = dict[en] || en;
            add(en);
            add(bn);
        }
        add(d.name);
        add(d.name_bn);
        add(d.upazila);
        bothLanguages(d.division, taxonomy.division);
        bothLanguages(d.district, taxonomy.district);
        bothLanguages(d.category, taxonomy.category);
        (d.categories || []).forEach(function (c) { bothLanguages(c, taxonomy.category); });
        (d.tags || []).forEach(add);
        add(d.shortDesc);
        return parts.join(" ");
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
        } else if (d.name_bn) {
            /* New entries without a full translation still get their Bangla
               name (and shortDesc when present) in Bangla mode. */
            out.name = d.name_bn;
            if (!out.shortDesc && d.shortDesc_bn) out.shortDesc = d.shortDesc_bn;
        }
        out.shortDesc = out.shortDesc || "";

        out.division = mapTax(d.division, taxonomy.division);
        out.district = mapTax(d.district, taxonomy.district);
        out.category = mapTax(d.category, taxonomy.category);
        out.categories = (d.categories || []).map(function (c) { return mapTax(c, taxonomy.category); });
        out.difficulty = mapTax(d.difficulty, taxonomy.difficulty);
        out.things_to_do = (d.things_to_do || []).map(function (a) { return a; });
        out.what_to_see = (d.what_to_see || []).map(function (a) { return a; });
        out.travel_tips = (d.travel_tips || []).map(function (a) { return a; });
        if (tr && tr.activities) out.things_to_do = tr.activities;
        if (tr && tr.attractions) out.what_to_see = tr.attractions;
        if (tr && tr.tips) out.travel_tips = tr.tips;
        out.transport_options = (d.transport_options || []).map(function (x) {
            return mapTax(x, taxonomy.transport);
        });

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
        var toggleMobile = document.getElementById("langToggleMobile");
        if (toggleMobile) toggleMobile.textContent = isBn() ? "English" : "বাংলা";

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
        document.body.classList.add("lang-fading");
        setTimeout(function () { window.location.reload(); }, 350);
    }

    window.I18N = {
        lang: lang,
        isBn: isBn,
        t: t,
        fmt: fmt,
        weatherLabel: weatherLabel,
        mapTax: mapTax,
        searchText: searchText,
        localizeDest: localizeDest,
        toggle: toggle,
        applyUI: applyUI,
        taxonomy: taxonomy
    };

    /* Translate the global list immediately so every later script
       (detail.js, app.js, weather-page.js) sees Bangla data at eval time. */
    translateDestinations();

    /* Wire the toggle button + static UI strings. */
    document.addEventListener("DOMContentLoaded", function () {
        var btn = document.getElementById("langToggle");
        if (btn) btn.addEventListener("click", toggle);
        applyUI();
    });
})(window, document);