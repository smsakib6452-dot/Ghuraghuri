// Internationalization (i18n) taxonomy mappings and formatting helpers

export const DIVISIONS_BN: Record<string, string> = {
  Chattogram: "চট্টগ্রাম",
  Sylhet: "সিলেট",
  Khulna: "খুলনা",
  Barishal: "বরিশাল",
  Dhaka: "ঢাকা",
  Rajshahi: "রাজশাহী",
  Mymensingh: "ময়মনসিংহ",
  Rangpur: "রংপুর",
};

export const DISTRICTS_BN: Record<string, string> = {
  // Dhaka Division
  Dhaka: "ঢাকা",
  Faridpur: "ফরিদপুর",
  Gazipur: "গাজীপুর",
  Gopalganj: "গোপালগঞ্জ",
  Kishoreganj: "কিশোরগঞ্জ",
  Madaripur: "মাদারীপুর",
  Manikganj: "মানিকগঞ্জ",
  Munshiganj: "মুন্সীগঞ্জ",
  Narayanganj: "নারায়ণগঞ্জ",
  Narsingdi: "নরসিংদী",
  Rajbari: "রাজবাড়ী",
  Shariatpur: "শরীয়তপুর",
  Tangail: "টাঙ্গাইল",
  // Chattogram Division
  Chattogram: "চট্টগ্রাম",
  Bandarban: "বান্দরবান",
  Brahmanbaria: "ব্রাহ্মণবাড়িয়া",
  Chandpur: "চাঁদপুর",
  Cumilla: "কুমিল্লা",
  Comilla: "কুমিল্লা",
  "Cox's Bazar": "কক্সবাজার",
  Feni: "ফেনী",
  Khagrachhari: "খাগড়াছড়ি",
  Lakshmipur: "লক্ষ্মীপুর",
  Noakhali: "নোয়াখালী",
  Rangamati: "রাঙ্গামাটি",
  // Rajshahi Division
  Bogura: "বগুড়া",
  Joypurhat: "জয়পুরহাট",
  Naogaon: "নওগাঁ",
  Natore: "নাটোর",
  Chapainawabganj: "চাঁপাইনবাবগঞ্জ",
  Pabna: "পাবনা",
  Rajshahi: "রাজশাহী",
  Sirajganj: "সিরাজগঞ্জ",
  // Khulna Division
  Bagerhat: "বাগেরহাট",
  Chuadanga: "চুয়াডাঙ্গা",
  Jashore: "যশোর",
  Jhenaidah: "ঝিনাইদহ",
  Khulna: "খুলনা",
  Kushtia: "কুষ্টিয়া",
  Magura: "মাগুরা",
  Meherpur: "মেহেরপুর",
  Narail: "নড়াইল",
  Satkhira: "সাতক্ষীরা",
  // Barishal Division
  Jhalokathi: "ঝালকাঠি",
  Barguna: "বরগুনা",
  Barishal: "বরিশাল",
  Bhola: "ভোলা",
  Patuakhali: "পটুয়াখালী",
  Pirojpur: "পিরোজপুর",
  // Sylhet Division
  Habiganj: "হবিগঞ্জ",
  Moulvibazar: "মৌলভীবাজার",
  Sunamganj: "সুনামগঞ্জ",
  Sylhet: "সিলেট",
  // Rangpur Division
  Dinajpur: "দিনাজপুর",
  Gaibandha: "গাইবান্ধা",
  Kurigram: "কুড়িগ্রাম",
  Lalmonirhat: "লালমনিরহাট",
  Nilphamari: "নীলফামারী",
  Panchagarh: "পঞ্চগড়",
  Rangpur: "রংপুর",
  Thakurgaon: "ঠাকুরগাঁও",
  // Mymensingh Division
  Jamalpur: "জামালপুর",
  Mymensingh: "ময়মনসিংহ",
  Netrokona: "নেত্রকোনা",
  Sherpur: "শেরপুর",
  // Regional Variants & Combined Names
  Savar: "সাভার",
  Muktagacha: "মুক্তাগাছা",
  "Puthia (Rajshahi)": "পুঠিয়া (রাজশাহী)",
  "Bagha (Rajshahi)": "বাঘা (রাজশাহী)",
  "Khulna / Satkhira": "খুলনা / সাতক্ষীরা",
  "Munshiganj / Shariatpur": "মুন্সীগঞ্জ / শরীয়তপুর",
  "Sirajganj / Tangail": "সিরাজগঞ্জ / টাঙ্গাইল",
};

export const CATEGORIES_BN: Record<string, string> = {
  Beach: "সৈকত",
  Island: "দ্বীপ",
  Hill: "পাহাড়",
  Mountain: "পর্বত",
  Waterfall: "ঝরনা",
  Forest: "বন",
  "National Park": "জাতীয় উদ্যান",
  Wildlife: "বন্যপ্রাণী",
  River: "নদী",
  Haor: "হাওর",
  Lake: "হ্রদ",
  Archaeological: "প্রত্নতাত্ত্বিক",
  Historical: "ঐতিহাসিক",
  Heritage: "ঐতিহ্য",
  Religious: "ধর্মীয়",
  "Tea Garden": "চা বাগান",
  "Eco Tourism": "ইকো-ট্যুরিজম",
  Adventure: "অ্যাডভেঞ্চার",
};

export function getDivisionBn(division: string): string {
  if (!division) return "";
  return DIVISIONS_BN[division] || division;
}

export function getDistrictBn(district: string): string {
  if (!district) return "";
  return DISTRICTS_BN[district] || district;
}

const BN_DIGITS = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];

export interface FormatDigitsOptions {
  useGrouping?: boolean;
  isCurrency?: boolean;
}

/**
 * Formats a number or string into Bengali numerals if isBn is true.
 * Plain path (useGrouping: false) is applied for years, percentages, IDs,
 * and counts under 10,000 that are not currency.
 * Grouping (thousands commas, e.g. ৳১,০০০) is maintained for currency.
 */
export function formatDigits(
  val: number | string,
  isBn: boolean,
  options?: FormatDigitsOptions
): string {
  if (!isBn) return String(val);

  // If explicit useGrouping option was provided
  if (options?.useGrouping !== undefined) {
    if (typeof val === "number") {
      return val.toLocaleString("bn-BD", { useGrouping: options.useGrouping });
    }
    return String(val).replace(/\d/g, (d) => BN_DIGITS[parseInt(d, 10)] || d);
  }

  // If currency is specified, always group with thousands separator
  if (options?.isCurrency) {
    if (typeof val === "number") {
      return val.toLocaleString("bn-BD", { useGrouping: true });
    }
    return String(val).replace(/\d/g, (d) => BN_DIGITS[parseInt(d, 10)] || d);
  }

  // Plain path (useGrouping: false) for years, percentages, IDs, and counts under 10,000
  if (typeof val === "number") {
    if (val < 10000) {
      return val.toLocaleString("bn-BD", { useGrouping: false });
    }
    return val.toLocaleString("bn-BD", { useGrouping: true });
  }

  return String(val).replace(/\d/g, (d) => BN_DIGITS[parseInt(d, 10)] || d);
}

/**
 * Translates duration strings (e.g. "2 – 4 days", "1 day", "Half day", "2 – 3 hours")
 * into authentic Bengali phrasing.
 */
export function localizeDuration(duration: string, isBn: boolean): string {
  if (!isBn || !duration) return duration || "1 – 2 days";

  let result = duration;
  // Convert digits to Bengali
  result = result.replace(/\d/g, (d) => BN_DIGITS[parseInt(d, 10)] || d);

  // Common time phrases
  result = result
    .replace(/\bHalf day trek\b/gi, "অর্ধ দিন ট্রেকিং")
    .replace(/\bHalf day\b/gi, "অর্ধ দিন")
    .replace(/\bdays?\b/gi, "দিন")
    .replace(/\bhours?\b/gi, "ঘণ্টা")
    .replace(/\bday\b/gi, "দিন")
    .replace(/\bhour\b/gi, "ঘণ্টা")
    .replace(/\bmins?\b/gi, "মিনিট")
    .replace(/\bkm\b/gi, "কিমি");

  return result;
}

/**
 * Verified transport and transit route translation dictionary
 */
export const TRANSPORT_TRANSLATIONS_BN: Record<string, string> = {
  // Durations & Route Details
  "8 – 10 hrs": "৮ – ১০ ঘণ্টা",
  "8 hrs (Cox's Bazar Express & Parjotok Express)": "৮ ঘণ্টা (কক্সবাজার এক্সপ্রেস ও পর্যটক এক্সপ্রেস)",
  "55 mins (Biman, US-Bangla, Air Astra)": "৫৫ মিনিট (বিমান, ইউএস-বাংলা, এয়ার অ্যাস্ট্রা)",
  "7 – 8 hrs to Khagrachhari + 2 hrs 4x4 Chander Gari": "খাগড়াছড়ি ৭ – ৮ ঘণ্টা + ২ ঘণ্টা ৪x৪ চাঁন্দের গাড়ি",
  "Dhaka to Feni train, then bus to Khagrachhari": "ঢাকা থেকে ফেনী ট্রেন, এরপর খাগড়াছড়ির বাস",
  "Fly to Chattogram (45 mins) then scenic highway transfer": "চট্টগ্রাম ফ্লাইট (৪৫ মিনিট) এরপর মনোরম মহাসড়ক যাত্রা",
  "4 – 5 hrs (Sreemangal), 6 hrs (Sylhet)": "৪ – ৫ ঘণ্টা (শ্রীমঙ্গল), ৬ ঘণ্টা (সিলেট)",
  "4 – 5 hrs (Parabat, Upaban, Jayantika Express)": "৪ – ৫ ঘণ্টা (পারাবত, উপবন, জয়ন্তিকা এক্সপ্রেস)",
  "45 mins to Osmani International Airport Sylhet": "৪৫ মিনিট (ওসমানী আন্তর্জাতিক বিমানবন্দর, সিলেট)",
  "8 – 9 hrs (Direct Non-AC / AC Sleeper)": "৮ – ৯ ঘণ্টা (সরাসরি নন-এসি / এসি স্লিপার)",
  "Dhaka to Chattogram train (Subarna/Sonar Bangla), then local bus (2.5 hrs)": "ঢাকা-চট্টগ্রাম ট্রেন (সুবর্ণ/সোনার বাংলা), এরপর লোকাল বাস (২.৫ ঘণ্টা)",
  "Fly to Chattogram (45 mins) + road transfer": "চট্টগ্রাম ফ্লাইট (৪৫ মিনিট) + সড়কপথে যাত্রা",
  "4 – 5 hrs (via Padma Bridge expressway)": "৪ – ৫ ঘণ্টা (পদ্মা সেতু এক্সপ্রেসওয়ে হয়ে)",
  "3.5 hrs via Padma Bridge rail link (Sundarban Express)": "৩.৫ ঘণ্টা পদ্মা সেতু রেল সংযোগ (সুন্দরবন এক্সপ্রেস)",
  "Fly to Jashore (40 mins) + 1.5 hr drive to Khulna": "যশোর ফ্লাইট (৪০ মিনিট) + খুলনা ১.৫ ঘণ্টা ড্রাইভ",
  "5 – 6 hrs via Padma Bridge & Payra Bridge": "৫ – ৬ ঘণ্টা (পদ্মা সেতু ও পায়রা সেতু হয়ে)",
  "Dhaka to Bhanga/Barishal corridor, then express bus": "ঢাকা থেকে ভাঙ্গা/বরিশাল করিডোর, এরপর এক্সপ্রেস বাস",
  "Fly to Barishal (35 mins) + 2.5 hr drive": "বরিশাল ফ্লাইট (৩৫ মিনিট) + ২.৫ ঘণ্টা ড্রাইভ",

  // Bus Operator Fleet Types / Descriptions
  "Scania Multi-Axle & Double Decker Luxury": "স্ক্যানিয়া মাল্টি-অ্যাক্সেল ও ডাবল ডেকার লাক্সারি",
  "Volvo 9600 & Non-AC Countrywide Network": "ভলভো ৯৬০০ ও নন-এসি দেশব্যাপী নেটওয়ার্ক",
  "Mercedes-Benz & Hyundai AC Suites": "মার্সিডিজ-বেঞ্জ ও হুন্দাই এসি স্যুট",
  "Sylhet-Chittagong High Frequency Service": "সিলেট-চট্টগ্রাম হাই ফ্রিকোয়েন্সি সার্ভিস",
  "Direct Hill Express & Sleeper Coach": "সরাসরি হিল এক্সপ্রেস ও স্লিপার কোচ",
  "Hyundai Luxury AC Coach": "হুন্দাই লাক্সারি এসি কোচ",
  "Scania Multi-Axle (North Bengal)": "স্ক্যানিয়া মাল্টি-অ্যাক্সেল (উত্তরবঙ্গ)",
  "Padma Bridge South Express": "পদ্মা সেতু দক্ষিণ এক্সপ্রেস",

  // Badges & Common Labels
  "Verified": "বাছাইকৃত",
  "VERIFIED": "বাছাইকৃত",
  "Curated": "বাছাইকৃত",
  "CURATED": "বাছাইকৃত",

  // Distances
  "395 km": "৩৯৫ কিমি",
  "340 km": "৩৪০ কিমি",
  "240 km": "২৪০ কিমি",
  "320 km": "৩২০ কিমি",
  "260 km": "২৬০ কিমি",
  "285 km": "২৮৫ কিমি",
};

/**
 * Returns translated transport text in Bengali if available, otherwise falls back to English key.
 */
export function getTransportTranslation(key: string, isBn: boolean): string {
  if (!isBn || !key) return key;
  return TRANSPORT_TRANSLATIONS_BN[key] || localizeDuration(key, isBn);
}

export const DESTINATION_DETAIL_I18N = {
  en: {
    home: "Home",
    destinations: "Destinations",
    backToDirectory: "Back to Directory",
    divisionSuffix: "Division",
    difficultySuffix: "Difficulty",
    explorerScore: "· Explorer Score",
    aboutPrefix: "About",
    aboutSuffix: "",
    topActivities: "Top Activities & Experiences",
    sightseeingSpots: "Nearby Sightseeing Spots",
    travelTips: "Travel Tips",
    itinerary: "Suggested Itinerary",
    howToReach: "How to Reach from Dhaka",
    roadRoute: "Highway / Road Route:",
    airConnectivity: "Air Connectivity:",
    tripSnapshot: "Trip Snapshot",
    bestTime: "Best Time:",
    duration: "Duration:",
    estBudget: "Est. Budget:",
    findStays: "Find Nearby Stays",
    planTripPrefix: "Plan Trip to",
    planTripSuffix: "",
    liveWeather: "Live Local Weather",
    openMeteo: "Open-Meteo Live",
    humidity: "Humidity:",
    wind: "Wind:",
    kmh: "km/h",
    exactLocation: "Exact Location",
    openInMaps: "Open in Maps",
    gpsPrefix: "GPS:",
    north: "N",
    east: "E",
    moreInPrefix: "More in",
    moreInSuffix: "",
    easy: "Easy",
    moderate: "Moderate",
    challenging: "Challenging",
  },
  bn: {
    home: "হোম",
    destinations: "গন্তব্যসমূহ",
    backToDirectory: "তালিকায় ফিরে যান",
    divisionSuffix: "বিভাগ",
    difficultySuffix: "মাত্রা",
    explorerScore: "· এক্সপ্লোরার স্কোর",
    aboutPrefix: "",
    aboutSuffix: "সম্পর্কে",
    topActivities: "শীর্ষ কার্যক্রম ও অভিজ্ঞতা",
    sightseeingSpots: "কাছের দর্শনীয় স্থানসমূহ",
    travelTips: "ভ্রমণ টিপস ও সতর্কতা",
    itinerary: "প্রস্তাবিত ভ্রমণ পরিকল্পনা",
    howToReach: "ঢাকা থেকে যেভাবে যাবেন",
    roadRoute: "মহাসড়ক / সড়কপথ:",
    airConnectivity: "বিমান সংযোগ:",
    tripSnapshot: "ভ্রমণ সংক্ষেপ",
    bestTime: "সেরা সময়:",
    duration: "স্থায়িত্ব:",
    estBudget: "আনুমানিক বাজেট:",
    findStays: "কাছের হোটেল খুঁজুন",
    planTripPrefix: "",
    planTripSuffix: "-এর ভ্রমণ পরিকল্পনা",
    liveWeather: "লাইভ স্থানীয় আবহাওয়া",
    openMeteo: "ওপেন-মেটিও লাইভ",
    humidity: "আর্দ্রতা:",
    wind: "বাতাস:",
    kmh: "কিমি/ঘণ্টা",
    exactLocation: "সঠিক অবস্থান",
    openInMaps: "ম্যাপে দেখুন",
    gpsPrefix: "জিপিএস:",
    north: "উত্তর",
    east: "পূর্ব",
    moreInPrefix: "",
    moreInSuffix: "বিভাগের আরও স্থান",
    easy: "সহজ",
    moderate: "মাঝারি",
    challenging: "চ্যালেঞ্জিং",
  },
};

