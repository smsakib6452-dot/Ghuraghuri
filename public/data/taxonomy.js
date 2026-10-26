/* ============================================================================
   GHURAGHURI - BANGLADESH TAXONOMY (Divisions / Districts / Categories)
   Central hierarchy used across the site:
     Bangladesh -> Division -> District -> Upazila/Area -> Destination
   Consumed by js/db.js, js/discover.js, js/admin.js and the homepage.
   ============================================================================ */

(function (window) {
    "use strict";

    var DIVISIONS = [
        { id: 1, name: "Dhaka", name_bn: "ঢাকা" },
        { id: 2, name: "Chattogram", name_bn: "চট্টগ্রাম" },
        { id: 3, name: "Rajshahi", name_bn: "রাজশাহী" },
        { id: 4, name: "Khulna", name_bn: "খুলনা" },
        { id: 5, name: "Barishal", name_bn: "বরিশাল" },
        { id: 6, name: "Sylhet", name_bn: "সিলেট" },
        { id: 7, name: "Rangpur", name_bn: "রংপুর" },
        { id: 8, name: "Mymensingh", name_bn: "ময়মনসিংহ" }
    ];

    var DISTRICTS = [
        /* Dhaka Division (1) */
        { id: 1,  division_id: 1, name: "Dhaka", name_bn: "ঢাকা" },
        { id: 2,  division_id: 1, name: "Faridpur", name_bn: "ফরিদপুর" },
        { id: 3,  division_id: 1, name: "Gazipur", name_bn: "গাজীপুর" },
        { id: 4,  division_id: 1, name: "Gopalganj", name_bn: "গোপালগঞ্জ" },
        { id: 5,  division_id: 1, name: "Kishoreganj", name_bn: "কিশোরগঞ্জ" },
        { id: 6,  division_id: 1, name: "Madaripur", name_bn: "মাদারীপুর" },
        { id: 7,  division_id: 1, name: "Manikganj", name_bn: "মানিকগঞ্জ" },
        { id: 8,  division_id: 1, name: "Munshiganj", name_bn: "মুন্সীগঞ্জ" },
        { id: 9,  division_id: 1, name: "Narayanganj", name_bn: "নারায়ণগঞ্জ" },
        { id: 10, division_id: 1, name: "Narsingdi", name_bn: "নরসিংদী" },
        { id: 11, division_id: 1, name: "Rajbari", name_bn: "রাজবাড়ী" },
        { id: 12, division_id: 1, name: "Shariatpur", name_bn: "শরীয়তপুর" },
        { id: 13, division_id: 1, name: "Tangail", name_bn: "টাঙ্গাইল" },

        /* Chattogram Division (2) */
        { id: 14, division_id: 2, name: "Chattogram", name_bn: "চট্টগ্রাম" },
        { id: 15, division_id: 2, name: "Bandarban", name_bn: "বান্দরবান" },
        { id: 16, division_id: 2, name: "Brahmanbaria", name_bn: "ব্রাহ্মণবাড়িয়া" },
        { id: 17, division_id: 2, name: "Chandpur", name_bn: "চাঁদপুর" },
        { id: 18, division_id: 2, name: "Cumilla", name_bn: "কুমিল্লা" },
        { id: 19, division_id: 2, name: "Cox's Bazar", name_bn: "কক্সবাজার" },
        { id: 20, division_id: 2, name: "Feni", name_bn: "ফেনী" },
        { id: 21, division_id: 2, name: "Khagrachhari", name_bn: "খাগড়াছড়ি" },
        { id: 22, division_id: 2, name: "Lakshmipur", name_bn: "লক্ষ্মীপুর" },
        { id: 23, division_id: 2, name: "Noakhali", name_bn: "নোয়াখালী" },
        { id: 24, division_id: 2, name: "Rangamati", name_bn: "রাঙ্গামাটি" },

        /* Rajshahi Division (3) */
        { id: 25, division_id: 3, name: "Bogura", name_bn: "বগুড়া" },
        { id: 26, division_id: 3, name: "Joypurhat", name_bn: "জয়পুরহাট" },
        { id: 27, division_id: 3, name: "Naogaon", name_bn: "নওগাঁ" },
        { id: 28, division_id: 3, name: "Natore", name_bn: "নাটোর" },
        { id: 29, division_id: 3, name: "Chapainawabganj", name_bn: "চাঁপাইনবাবগঞ্জ" },
        { id: 30, division_id: 3, name: "Pabna", name_bn: "পাবনা" },
        { id: 31, division_id: 3, name: "Rajshahi", name_bn: "রাজশাহী" },
        { id: 32, division_id: 3, name: "Sirajganj", name_bn: "সিরাজগঞ্জ" },

        /* Khulna Division (4) */
        { id: 33, division_id: 4, name: "Bagerhat", name_bn: "বাগেরহাট" },
        { id: 34, division_id: 4, name: "Chuadanga", name_bn: "চুয়াডাঙ্গা" },
        { id: 35, division_id: 4, name: "Jashore", name_bn: "যশোর" },
        { id: 36, division_id: 4, name: "Jhenaidah", name_bn: "ঝিনাইদহ" },
        { id: 37, division_id: 4, name: "Khulna", name_bn: "খুলনা" },
        { id: 38, division_id: 4, name: "Kushtia", name_bn: "কুষ্টিয়া" },
        { id: 39, division_id: 4, name: "Magura", name_bn: "মাগুরা" },
        { id: 40, division_id: 4, name: "Meherpur", name_bn: "মেহেরপুর" },
        { id: 41, division_id: 4, name: "Narail", name_bn: "নড়াইল" },
        { id: 42, division_id: 4, name: "Satkhira", name_bn: "সাতক্ষীরা" },

        /* Barishal Division (5) */
        { id: 43, division_id: 5, name: "Jhalokathi", name_bn: "ঝালকাঠি" },
        { id: 44, division_id: 5, name: "Barguna", name_bn: "বরগুনা" },
        { id: 45, division_id: 5, name: "Barishal", name_bn: "বরিশাল" },
        { id: 46, division_id: 5, name: "Bhola", name_bn: "ভোলা" },
        { id: 47, division_id: 5, name: "Patuakhali", name_bn: "পটুয়াখালী" },
        { id: 48, division_id: 5, name: "Pirojpur", name_bn: "পিরোজপুর" },

        /* Sylhet Division (6) */
        { id: 49, division_id: 6, name: "Habiganj", name_bn: "হবিগঞ্জ" },
        { id: 50, division_id: 6, name: "Moulvibazar", name_bn: "মৌলভীবাজার" },
        { id: 51, division_id: 6, name: "Sunamganj", name_bn: "সুনামগঞ্জ" },
        { id: 52, division_id: 6, name: "Sylhet", name_bn: "সিলেট" },

        /* Rangpur Division (7) */
        { id: 53, division_id: 7, name: "Dinajpur", name_bn: "দিনাজপুর" },
        { id: 54, division_id: 7, name: "Gaibandha", name_bn: "গাইবান্ধা" },
        { id: 55, division_id: 7, name: "Kurigram", name_bn: "কুড়িগ্রাম" },
        { id: 56, division_id: 7, name: "Lalmonirhat", name_bn: "লালমনিরহাট" },
        { id: 57, division_id: 7, name: "Nilphamari", name_bn: "নীলফামারী" },
        { id: 58, division_id: 7, name: "Panchagarh", name_bn: "পঞ্চগড়" },
        { id: 59, division_id: 7, name: "Rangpur", name_bn: "রংপুর" },
        { id: 60, division_id: 7, name: "Thakurgaon", name_bn: "ঠাকুরগাঁও" },

        /* Mymensingh Division (8) */
        { id: 61, division_id: 8, name: "Jamalpur", name_bn: "জামালপুর" },
        { id: 62, division_id: 8, name: "Mymensingh", name_bn: "ময়মনসিংহ" },
        { id: 63, division_id: 8, name: "Netrokona", name_bn: "নেত্রকোনা" },
        { id: 64, division_id: 8, name: "Sherpur", name_bn: "শেরপুর" }
    ];

    /* Standardized destination categories. Each category has an English name,
       a Bangla name, and an icon name used by the UI when available. */
    var CATEGORIES = [
        { id: 1,  name: "Beach", name_bn: "সৈকত" },
        { id: 2,  name: "Island", name_bn: "দ্বীপ" },
        { id: 3,  name: "Hill", name_bn: "পাহাড়" },
        { id: 4,  name: "Mountain", name_bn: "পর্বত" },
        { id: 5,  name: "Waterfall", name_bn: "ঝরনা" },
        { id: 6,  name: "Forest", name_bn: "বন" },
        { id: 7,  name: "National Park", name_bn: "জাতীয় উদ্যান" },
        { id: 8,  name: "Wildlife", name_bn: "বন্যপ্রাণী" },
        { id: 9,  name: "River", name_bn: "নদী" },
        { id: 10, name: "Haor", name_bn: "হাওর" },
        { id: 11, name: "Lake", name_bn: "হ্রদ" },
        { id: 12, name: "Archaeological", name_bn: "প্রত্নতাত্ত্বিক" },
        { id: 13, name: "Historical", name_bn: "ঐতিহাসিক" },
        { id: 14, name: "Heritage", name_bn: "ঐতিহ্য" },
        { id: 15, name: "Religious", name_bn: "ধর্মীয়" },
        { id: 16, name: "Tea Garden", name_bn: "চা বাগান" },
        { id: 17, name: "Eco Tourism", name_bn: "ইকো-ট্যুরিজম" },
        { id: 18, name: "Adventure", name_bn: "অ্যাডভেঞ্চার" },
        { id: 19, name: "Picnic Spot", name_bn: "পিকনিক স্পট" },
        { id: 20, name: "Resort Area", name_bn: "রিসোর্ট এলাকা" },
        { id: 21, name: "City", name_bn: "শহর" },
        { id: 22, name: "Village", name_bn: "গ্রাম" },
        { id: 23, name: "Cultural", name_bn: "সাংস্কৃতিক" },
        { id: 24, name: "Museum", name_bn: "জাদুঘর" },
        { id: 25, name: "Fort", name_bn: "দুর্গ" },
        { id: 26, name: "Palace", name_bn: "প্রাসাদ" },
        { id: 27, name: "Temple", name_bn: "মন্দির" },
        { id: 28, name: "Mosque", name_bn: "মসজিদ" },
        { id: 29, name: "Shrine", name_bn: "দরগাহ" },
        { id: 30, name: "Nature", name_bn: "প্রকৃতি" },
        { id: 31, name: "Family", name_bn: "পরিবার" },
        { id: 32, name: "Coastal", name_bn: "উপকূলীয়" }
    ];

    /* Map legacy district strings (used by earlier data) to the canonical
       64-district names so filters, grouping and search stay consistent. */
    var DISTRICT_ALIASES = {
        "Comilla": "Cumilla",
        "Savar": "Dhaka",
        "Muktagacha": "Mymensingh",
        "Puthia (Rajshahi)": "Rajshahi",
        "Bagha (Rajshahi)": "Rajshahi",
        "Khulna / Satkhira": "Khulna",
        "Munshiganj / Shariatpur": "Munshiganj",
        "Sirajganj / Tangail": "Sirajganj"
    };

    function canonDistrict(name) {
        return DISTRICT_ALIASES[name] || name;
    }

    function districtByName(name) {
        var canonical = canonDistrict(name);
        for (var i = 0; i < DISTRICTS.length; i++) {
            if (DISTRICTS[i].name === canonical) return DISTRICTS[i];
        }
        return null;
    }

    function divisionById(id) {
        for (var i = 0; i < DIVISIONS.length; i++) {
            if (DIVISIONS[i].id === id) return DIVISIONS[i];
        }
        return null;
    }

    function divisionOfDistrict(districtName) {
        var d = districtByName(districtName);
        return d ? divisionById(d.division_id) : null;
    }

    function categoryByName(name) {
        for (var i = 0; i < CATEGORIES.length; i++) {
            if (CATEGORIES[i].name === name) return CATEGORIES[i];
        }
        return null;
    }

    /* All district names that appear in the destination database (includes
       legacy strings) mapped to their canonical district object. */
    function usedDistricts() {
        var out = [];
        for (var i = 0; i < DISTRICTS.length; i++) out.push(DISTRICTS[i]);
        return out;
    }

    window.TAXONOMY = {
        DIVISIONS: DIVISIONS,
        DISTRICTS: DISTRICTS,
        CATEGORIES: CATEGORIES,
        DISTRICT_ALIASES: DISTRICT_ALIASES,
        canonDistrict: canonDistrict,
        districtByName: districtByName,
        divisionById: divisionById,
        divisionOfDistrict: divisionOfDistrict,
        categoryByName: categoryByName,
        usedDistricts: usedDistricts
    };
})(window);
