export type ItineraryActivity = {
  time_en: string;
  time_bn: string;
  title_en: string;
  title_bn: string;
  desc_en: string;
  desc_bn: string;
  spot: string;
  dining_recommendation?: string;
  dining_recommendation_bn?: string;
  transit_tip?: string;
  transit_tip_bn?: string;
};

export type ItineraryDay = {
  dayNumber: number;
  title_en: string;
  title_bn: string;
  theme_en: string;
  theme_bn: string;
  activities: ItineraryActivity[];
};

export type DestinationItinerary = {
  destinationId: string;
  name_en: string;
  name_bn: string;
  division: string;
  bestSeason_en: string;
  bestSeason_bn: string;
  plans: {
    2: ItineraryDay[];
    3: ItineraryDay[];
    4: ItineraryDay[];
  };
};

export const CURATED_ITINERARIES: Record<string, DestinationItinerary> = {
  "coxs-bazar": {
    destinationId: "coxs-bazar",
    name_en: "Cox's Bazar",
    name_bn: "কক্সবাজার",
    division: "Chattogram",
    bestSeason_en: "November to March (Pleasant breeze & calm waves)",
    bestSeason_bn: "নভেম্বর থেকে মার্চ (আরামদায়ক বাতাস ও শান্ত সমুদ্র)",
    plans: {
      2: [
        {
          dayNumber: 1,
          title_en: "Arrival, Laboni Beach Sunset & Authentic Seafood Feast",
          title_bn: "কক্সবাজার আগমন, লাবণী পয়েন্টে সূর্যাস্ত ও খাঁটি সীফুড ভোজ",
          theme_en: "Beach Relaxation & Local Flavors",
          theme_bn: "সৈকত রিলাক্সেশন ও ঐতিহ্যবাহী স্বাদ",
          activities: [
            {
              time_en: "06:30 AM – 09:30 AM",
              time_bn: "সকাল ০৬:৩০ – ০৯:৩০",
              title_en: "Arrival & Hotel Check-in",
              title_bn: "কলাতলী পৌঁছানো ও হোটেল চেক-ইন",
              desc_en: "Arrive via Cox's Bazar Express train or AC bus. Check into hotel at Kolatoli/Sugandha zone. Enjoy fresh paratha, omelet, and spiced tea at local bakery.",
              desc_bn: "কক্সবাজার এক্সপ্রেস ট্রেন বা এসি বাসে কলাতলী আগমন। হোটেলে চেক-ইন করে কলাতলী মোড়ে গরম পরোটা, ডিম ভাজি ও মালাই চা দিয়ে সকালের নাশতা সেরে নিন।",
              spot: "Kolatoli Beach Point",
              transit_tip: "Auto / TomTom from rail station to Kolatoli: ৳40-৳60 per person",
              transit_tip_bn: "রেল স্টেশন থেকে কলাতলী টমটম ভাড়া: জনপ্রতি ৪০-৬০ টাকা"
            },
            {
              time_en: "01:00 PM – 03:00 PM",
              time_bn: "দুপুর ০১:০০ – ০৩:০০",
              title_en: "Legendary Lunch at Poushe Restaurant",
              title_bn: "পৌষী রেস্তোরাঁয় ঐতিহ্যবাহী রূপচাঁদা ও ভর্তা লাঞ্চ",
              desc_en: "Experience authentic coastal dining with crispy fried Rupchanda, Loitta bhuna, and 20+ varieties of traditional Bengali bhortas with piping hot rice.",
              desc_bn: "পৌষী রেস্তোরাঁয় বসে মচমচে রূপচাঁদা ফ্রাই, লইট্যা মাছের ঝোল এবং শুঁটকি, বেগুন, ডাল সহ ২০+ পদের ঐতিহ্যবাহী ভর্তা দিয়ে তৃপ্তিদায়ক দুপুরের খাবার।",
              spot: "Hotel Motel Road",
              dining_recommendation: "Poushe Restaurant (Signature: Rupchanda Fry & Chepa Shutki Bhorta)",
              dining_recommendation_bn: "পৌষী রেস্তোরাঁ (সিগনেচার: মচমচে রূপচাঁদা ফ্রাই ও চেপা শুঁটকি ভর্তা)"
            },
            {
              time_en: "04:30 PM – 06:30 PM",
              time_bn: "বিকাল ০৪:৩০ – ০৬:৩০",
              title_en: "World's Longest Natural Beach Sunset at Laboni",
              title_bn: "লাবণী পয়েন্টে অবিস্মরণীয় সূর্যাস্ত ও ডাবের পানি",
              desc_en: "Walk along the roaring waves of Laboni Beach. Witness the sun sinking into the Bay of Bengal while sipping fresh green coconut water.",
              desc_bn: "লাবণী বিচে সমুদ্রের গর্জন উপভোগ করতে করতে হেঁটে চলুন। সাগরের নীল জলরাশিতে সূর্যাস্তের মনোরম দৃশ্য দেখুন এবং তাজা ডাবের পানি পান করুন।",
              spot: "Laboni Beach Point",
              transit_tip: "Easy 10-min TomTom ride: ৳20",
              transit_tip_bn: "কলাতলী থেকে লাবণী পয়েন্ট টমটম ভাড়া: ২০ টাকা"
            },
            {
              time_en: "07:30 PM – 10:00 PM",
              time_bn: "রাত ০৭:৩০ – ১০:০০",
              title_en: "Burmese Market Shopping & Fresh Crab Dinner",
              title_bn: "বার্মিজ মার্কেটে কেনাকাটা ও ঝাউবনে ফ্রেশ কাঁকড়া ডিনার",
              desc_en: "Explore colorful handmade shawls, pickles, and sea-pearl jewelry at Burmese Market. Conclude with live crab fry and grilled fish at Jhawban Sea Food.",
              desc_bn: "বার্মিজ মার্কেটে ঐতিহ্যবাহী আচার, রাখাইন তাঁতের চাদর ও মুক্তার গহনা কেনাকাটা। রাতের খাবারে ঝাউবনে তাজা ক্র্যাব ফ্রাই ও কোরাল মাছ ভুনা।",
              spot: "Burmese Market & Sea Beach Road",
              dining_recommendation: "Jhawban Sea Food (Signature: Fresh Bay Crab Fry & Garlic Squid)",
              dining_recommendation_bn: "ঝাউবন সীফুড (সিগনেচার: স্পেশাল ক্র্যাব ফ্রাই ও স্কুইড ভুনা)"
            }
          ]
        },
        {
          dayNumber: 2,
          title_en: "Marine Drive Coastal Safari, Himchari & Coral Inani Beach",
          title_bn: "মেরিন ড্রাইভ সাফারি, হিমছড়ি পাহাড় ও ইনানী পাথুরে সৈকত",
          theme_en: "Coastal Hills, Waterfalls & Coral Stones",
          theme_bn: "পাহাড়, জলপ্রপাত ও প্রবালের মেলবন্ধন",
          activities: [
            {
              time_en: "08:30 AM – 11:30 AM",
              time_bn: "সকাল ০৮:৩০ – ১১:৩০",
              title_en: "Marine Drive Cruise to Himchari National Park",
              title_bn: "মেরিন ড্রাইভ দিয়ে হিমছড়ি জাতীয় উদ্যান যাত্রা",
              desc_en: "Board an open-air Chander Gari along the breathtaking 80km Marine Drive (emerald hills on one side, turquoise sea on the other). Climb Himchari hill stairs for a 360° panoramic sea view.",
              desc_bn: "একপাশে সবুজ পাহাড় আর অন্যপাশে গর্জনরত সমুদ্র—বিশ্বখ্যাত মেরিন ড্রাইভ দিয়ে চান্দের গাড়িতে হিমছড়ি যাত্রা। পাহাড়ে উঠে ওপর থেকে পুরো বঙ্গোপসাগরের মনোরম রূপ অবলোকন।",
              spot: "Himchari National Park",
              transit_tip: "Chander Gari return hire: ৳2,000-৳2,500 (or shared Auto ৳60/seat)",
              transit_tip_bn: "চান্দের গাড়ি রিজার্ভ ভাড়া: ২,০০০-২,৫০০ টাকা (বা শেয়ার্ড অটোরিকশা ৬০ টাকা)"
            },
            {
              time_en: "12:00 PM – 03:30 PM",
              time_bn: "দুপুর ১২:০০ – ০৩:৩০",
              title_en: "Inani Coral Beach & Wave-side Seafood Lunch",
              title_bn: "ইনানী পাথুরে সৈকত ভ্রমণ ও সীফুড লাঞ্চ",
              desc_en: "Walk among ancient coral formations at low tide. Savor freshly fried pomfret and shrimp prepared right by beachside shacks with cool coconut water.",
              desc_bn: "ইনানী বিচে প্রবাল পাথরের ওপর হেঁটে বেড়ান ও ছবি তুলুন। সৈকতের পাশের স্থানীয় রেস্তোরাঁয় তাজা ভাজা রূপচাঁদা মাছ ও চিংড়ি দিয়ে লাঞ্চ।",
              spot: "Inani Beach",
              dining_recommendation: "Inani Beachside Seafood Stall (Signature: Fried Sea Pomfret)",
              dining_recommendation_bn: "ইনানী বিচসাইড ক্যাফে (সিগনেচার: তাজা ফ্রাইড রূপচাঁদা)"
            },
            {
              time_en: "05:00 PM – 07:00 PM",
              time_bn: "বিকাল ০৫:০০ – সন্ধ্যা ০৭:০০",
              title_en: "Darianagar Cave Sunset & Return to Town",
              title_bn: "দরিয়ানগর গুহা পয়েন্টে সূর্যাস্ত ও শহরে ফেরা",
              desc_en: "Stop by the dramatic hills of Darianagar. Capture the evening glow over the ocean before heading back to Kolatoli.",
              desc_bn: "দরিয়ানগর সি-ভিউ পয়েন্টে সূর্যাস্তের আলোয় স্মৃতিময় ছবি তুলুন। এরপর কলাতলীতে ফিরে আসুন।",
              spot: "Darianagar Sea Beach"
            },
            {
              time_en: "08:30 PM – 10:30 PM",
              time_bn: "রাত ০৮:৩০ – ১০:৩০",
              title_en: "Souvenir Dry Fish Shopping & Night Train/Coach Boarding",
              title_bn: "শুঁটকি ও স্মারক কেনাকাটা এবং রাতের কোচে ঢাকা যাত্রা",
              desc_en: "Pick up authentic sundried fish (loitta, rupchanda, chhuri) from certified cooperative stalls. Board your night sleeper coach or Cox's Bazar Express back home.",
              desc_bn: "কলাতলী শুঁটকি মার্কেট থেকে আসল লইট্যা, ছুরি ও রূপচাঁদা শুঁটকি কিনুন। এরপর রাতের এসি স্লিপার বা কক্সবাজার এক্সপ্রেস ট্রেনে ঢাকার উদ্দেশ্যে রওনা।",
              spot: "Kolatoli Bus Counters / Railway Station"
            }
          ]
        }
      ],
      3: [
        {
          dayNumber: 1,
          title_en: "Arrival, Laboni Beach Sunset & Authentic Seafood Feast",
          title_bn: "কক্সবাজার আগমন, লাবণী পয়েন্টে সূর্যাস্ত ও খাঁটি সীফুড ভোজ",
          theme_en: "Beach Relaxation & Local Flavors",
          theme_bn: "সৈকত রিলাক্সেশন ও ঐতিহ্যবাহী স্বাদ",
          activities: [
            {
              time_en: "07:00 AM – 10:00 AM",
              time_bn: "সকাল ০৭:০০ – ১০:০০",
              title_en: "Arrival, Check-in & Breakfast",
              title_bn: "কক্সবাজার আগমন ও হোটেলে চেক-ইন",
              desc_en: "Arrive at Cox's Bazar rail station or bus terminal. Check into your hotel. Freshen up and enjoy breakfast.",
              desc_bn: "রেল স্টেশন বা বাস টার্মিনাল থেকে হোটেলে চেক-ইন। ফ্রেশ হয়ে সকালের নাশতা গ্রহণ।",
              spot: "Kolatoli Hotel Zone"
            },
            {
              time_en: "01:00 PM – 02:30 PM",
              time_bn: "দুপুর ০১:০০ – ০২:৩০",
              title_en: "Authentic Coastal Feast at Poushe",
              title_bn: "পৌষী রেস্তোরাঁয় দুপুরের খাবার",
              desc_en: "Enjoy 20+ traditional Bengali bhortas and fresh seafood with warm rice.",
              desc_bn: "গরম ভাতের সাথে ২০+ পদের ভর্তা ও তাজা সামুদ্রিক মাছের ঝোল।",
              spot: "Hotel Motel Road",
              dining_recommendation: "Poushe Restaurant",
              dining_recommendation_bn: "পৌষী রেস্তোরাঁ"
            },
            {
              time_en: "04:30 PM – 06:30 PM",
              time_bn: "বিকাল ০৪:৩০ – ০৬:৩০",
              title_en: "Sunset Stroll at Laboni Beach",
              title_bn: "লাবণী সৈকতে সূর্যাস্ত অবলোকন",
              desc_en: "Watch the golden sun dip below the waves of the world's longest natural sea beach.",
              desc_bn: "বিশ্বের দীর্ঘতম সমুদ্র সৈকতে দিগন্তজোড়া সূর্যাস্ত উপভোগ।",
              spot: "Laboni Beach"
            },
            {
              time_en: "08:00 PM – 10:00 PM",
              time_bn: "রাত ০৮:০০ – ১০:০০",
              title_en: "Burmese Market Shopping & Seafood Dinner",
              title_bn: "বার্মিজ মার্কেট ও ঝাউবনে রাতের খাবার",
              desc_en: "Shop for local crafts and savor fresh sea crab fry and calamari.",
              desc_bn: "রাখাইন তাঁতের কাপড় কেনাকাটা ও ঝাউবনে ফ্রেশ কাঁকড়া ফ্রাই।",
              spot: "Burmese Market & Sea Beach Road"
            }
          ]
        },
        {
          dayNumber: 2,
          title_en: "Marine Drive Coastal Safari, Himchari & Inani Coral Rocks",
          title_bn: "মেরিন ড্রাইভ সাফারি, হিমছড়ি ও ইনানী পাথুরে সৈকত",
          theme_en: "Hills, Waves & Corals",
          theme_bn: "পাহাড়, সমুদ্র ও প্রবাল সৈকত",
          activities: [
            {
              time_en: "08:30 AM – 12:00 PM",
              time_bn: "সকাল ০৮:৩০ – ১২:০০",
              title_en: "Marine Drive Scenic Drive to Himchari",
              title_bn: "মেরিন ড্রাইভ হয়ে হিমছড়ি পাহাড়ি ভিউপয়েন্ট",
              desc_en: "Ride open-air Chander Gari along the 80km Marine Drive with hills on left and ocean on right. Climb Himchari peak for bird's eye view.",
              desc_bn: "একপাশে সবুজ পাহাড় আর অন্যপাশে নীল সাগর—মেরিন ড্রাইভ দিয়ে হিমছড়ি পাহাড়ে উঠে পুরো সাগরের ভিউ উপভোগ।",
              spot: "Himchari National Park"
            },
            {
              time_en: "12:30 PM – 03:30 PM",
              time_bn: "দুপুর ১২:৩০ – ০৩:৩০",
              title_en: "Inani Beach Coral Exploration & Lunch",
              title_bn: "ইনানী সৈকতে প্রবাল দর্শন ও সীফুড লাঞ্চ",
              desc_en: "Walk across coral reefs and enjoy fresh fried pomfret right at Inani beach.",
              desc_bn: "ইনানীর প্রবাল পাথরে হাঁটা এবং তাজা রূপচাঁদা ফ্রাই দিয়ে লাঞ্চ।",
              spot: "Inani Coral Beach"
            },
            {
              time_en: "05:00 PM – 07:00 PM",
              time_bn: "বিকাল ০৫:০০ – ০৭:০০",
              title_en: "Darianagar Cave Sunset",
              title_bn: "দরিয়ানগর গুহায় সূর্যাস্ত",
              desc_en: "Capture sunset over dramatic hill ridges and caves before returning to town.",
              desc_bn: "পাহাড় ও সমুদ্রের মিলনস্থলে সূর্যাস্তের মনোরম দৃশ্য দর্শন।",
              spot: "Darianagar"
            },
            {
              time_en: "08:30 PM – 10:30 PM",
              time_bn: "রাত ০৮:৩০ – ১০:৩০",
              title_en: "Beachside Live Barbecue",
              title_bn: "সৈকতে লাইভ বারবিকিউ ডিনার",
              desc_en: "Enjoy grilled red snapper and chicken tikka right beside the waves under the night sky.",
              desc_bn: "সমুদ্রের ঢেউয়ের পাশে বসে লাল কোরাল মাছ ও চিকেন বারবিকিউ।",
              spot: "Sugandha Beach Point"
            }
          ]
        },
        {
          dayNumber: 3,
          title_en: "Moheshkhali Island Speedboat Trip & Historic Adinath Temple",
          title_bn: "মহেশখালী দ্বীপে স্পিডবোট ভ্রমণ ও ঐতিহাসিক আদিনাথ মন্দির",
          theme_en: "Island Heritage, Pagodas & Departure",
          theme_bn: "দ্বীপের ইতিহাস, প্যাগোডা ও ঢাকা প্রত্যাবর্তন",
          activities: [
            {
              time_en: "08:30 AM – 12:30 PM",
              time_bn: "সকাল ০৮:৩০ – ১২:৩০",
              title_en: "Speedboat to Moheshkhali & Adinath Temple",
              title_bn: "মহেশখালী দ্বীপে স্পিডবোট ও আদিনাথ মন্দির দর্শন",
              desc_en: "Take a thrilling 25-minute speedboat from 6 No. Ghat across the estuary to Moheshkhali. Climb Mainak Hill to visit the ancient Adinath Shiva temple and Golden Buddhist pagoda.",
              desc_bn: "৬ নম্বর ঘাট থেকে স্পিডবোটে মহেশখালী দ্বীপ যাত্রা। মৈনাক পাহাড়ে উঠে ঐতিহাসিক আদিনাথ শিব মন্দির ও রাখাইন স্বর্ণ প্যাগোডা দর্শন।",
              spot: "Moheshkhali Island",
              transit_tip: "Speedboat fare: ৳100 per person each way",
              transit_tip_bn: "স্পিডবোট ভাড়া: জনপ্রতি ১০০ টাকা"
            },
            {
              time_en: "01:30 PM – 03:00 PM",
              time_bn: "দুপুর ০১:৩০ – ০৩:০০",
              title_en: "Return to Town & Farewell Coastal Lunch",
              title_bn: "কক্সবাজার ফিরে সমাপনী লাঞ্চ",
              desc_en: "Return to main town, check out of hotel (store luggage securely at front desk), and enjoy final coastal lunch.",
              desc_bn: "শহরে ফিরে হোটেল চেক-আউট করে শেষবারের মতো ঐতিহ্যবাহী খাবারে লাঞ্চ সম্পন্ন।",
              spot: "Kolatoli"
            },
            {
              time_en: "04:00 PM – 07:30 PM",
              time_bn: "বিকাল ০৪:০০ – সন্ধ্যা ০৭:৩০",
              title_en: "Authentic Dry Fish Market & Souvenir Shopping",
              title_bn: "শুঁটকি মার্কেট ও উপহার সামগ্রী কেনাকাটা",
              desc_en: "Purchase vacuum-packed quality dried fish, organic coconut oil, and handmade pickles from registered markets.",
              desc_bn: "কলাতলী বিশ্বস্ত কাউন্টার থেকে কোয়ালিটি শুঁটকি ও বার্মিজ আচার কেনাকাটা।",
              spot: "Kolatoli Dry Fish Market"
            },
            {
              time_en: "08:30 PM – 10:30 PM",
              time_bn: "রাত ০৮:৩০ – ১০:৩০",
              title_en: "Boarding AC Bus / Cox's Bazar Express",
              title_bn: "রাতের এসি স্লিপার বাস বা ট্রেনে ঢাকা যাত্রা",
              desc_en: "Board your return transport comfortably after an unforgettable coastal holiday.",
              desc_bn: "আরামদায়ক এসি বাস বা ট্রেনে ঢাকার উদ্দেশ্যে যাত্রা শুরু।",
              spot: "Iconic Railway Station / Kolatoli Counters"
            }
          ]
        }
      ],
      4: [
        {
          dayNumber: 1,
          title_en: "Arrival, Laboni Beach Sunset & Authentic Seafood Feast",
          title_bn: "কক্সবাজার আগমন, লাবণী পয়েন্টে সূর্যাস্ত ও খাঁটি সীফুড ভোজ",
          theme_en: "Beach Relaxation & Local Flavors",
          theme_bn: "সৈকত রিলাক্সেশন ও ঐতিহ্যবাহী স্বাদ",
          activities: [
            {
              time_en: "07:00 AM – 10:00 AM",
              time_bn: "সকাল ০৭:০০ – ১০:০০",
              title_en: "Arrival & Check-in",
              title_bn: "কক্সবাজার আগমন ও চেক-ইন",
              desc_en: "Arrive via train/bus and check into hotel.",
              desc_bn: "হোটেলে চেক-ইন ও সকালের নাশতা।",
              spot: "Kolatoli"
            },
            {
              time_en: "04:30 PM – 06:30 PM",
              time_bn: "বিকাল ০৪:৩০ – ০৬:৩০",
              title_en: "Laboni Sunset",
              title_bn: "লাবণী সৈকতে সূর্যাস্ত",
              desc_en: "Relaxing beach walk and green coconut water.",
              desc_bn: "সৈকতে সান্ধ্যকালীন পদচারণা।",
              spot: "Laboni Beach"
            }
          ]
        },
        {
          dayNumber: 2,
          title_en: "Himchari & Inani Coral Rocks Safari",
          title_bn: "হিমছড়ি ও ইনানী প্রবাল সৈকত সাফারি",
          theme_en: "Marine Drive Journey",
          theme_bn: "মেরিন ড্রাইভের প্রাকৃতিক রূপ",
          activities: [
            {
              time_en: "09:00 AM – 03:00 PM",
              time_bn: "সকাল ০৯:০০ – দুপুর ০৩:০০",
              title_en: "Himchari Waterfall & Inani Coral Beach",
              title_bn: "হিমছড়ি জলপ্রপাত ও ইনানী পাথুরে সৈকত",
              desc_en: "Full day exploration along Marine Drive.",
              desc_bn: "মেরিন ড্রাইভ দিয়ে পুরো দিন চমৎকার সমুদ্র ও পাহাড় দর্শন।",
              spot: "Marine Drive"
            }
          ]
        },
        {
          dayNumber: 3,
          title_en: "Moheshkhali Island & Mangrove Backwaters",
          title_bn: "মহেশখালী দ্বীপ ও ম্যানগ্রোভ খাল ভ্রমণ",
          theme_en: "Island Cruise & History",
          theme_bn: "দ্বীপ ভ্রমণ ও ইতিহাস",
          activities: [
            {
              time_en: "09:00 AM – 02:00 PM",
              time_bn: "সকাল ০৯:০০ – দুপুর ০২:০০",
              title_en: "Adinath Temple & Rakhine Village",
              title_bn: "আদিনাথ মন্দির ও রাখাইন পল্লী দর্শন",
              desc_en: "Explore island temples and salt beds.",
              desc_bn: "মৈনাক পাহাড়ে শিব মন্দির ও রাখাইন বৌদ্ধ বিহার দর্শন।",
              spot: "Moheshkhali"
            }
          ]
        },
        {
          dayNumber: 4,
          title_en: "Ramu Buddhist Monasteries & Departure",
          title_bn: "রামু বৌদ্ধ বিহার দর্শন ও ঢাকা যাত্রা",
          theme_en: "Spiritual Heritage & Return",
          theme_bn: "ঐতিহাসিক বিহার ও বিদায়",
          activities: [
            {
              time_en: "09:30 AM – 01:30 PM",
              time_bn: "সকাল ০৯:৩০ – দুপুর ০১:৩০",
              title_en: "Ramu 100-foot Reclining Buddha Statue",
              title_bn: "রামুর ১০০ ফুট সিংহশয্যা গৌতম বুদ্ধ মূর্তি",
              desc_en: "Visit the serene Ramu Buddhist temples with 100ft reclining Buddha, rubber gardens, and bamboo groves.",
              desc_bn: "রামুর ঐতিহাসিক ১০০ ফুট বুদ্ধ মূর্তি ও রাবার বাগান পরিদর্শন।",
              spot: "Ramu Upazila"
            },
            {
              time_en: "08:30 PM",
              time_bn: "রাত ০৮:৩০",
              title_en: "Board Return Transport",
              title_bn: "রাতের বাসে প্রত্যাবর্তন",
              desc_en: "Board return train or bus with unforgettable memories.",
              desc_bn: "কক্সবাজার এক্সপ্রেস বা এসি বাসে ঢাকায় ফেরা।",
              spot: "Cox's Bazar Station"
            }
          ]
        }
      ]
    }
  },
  "sajek-valley": {
    destinationId: "sajek-valley",
    name_en: "Sajek Valley",
    name_bn: "সাজেক ভ্যালি",
    division: "Chattogram",
    bestSeason_en: "September to February (Clouds beneath your feet)",
    bestSeason_bn: "সেপ্টেম্বর থেকে ফেব্রুয়ারি (পায়ের নিচে সাদা মেঘের সমুদ্র)",
    plans: {
      2: [
        {
          dayNumber: 1,
          title_en: "Dighinala Army Escort, Ruilui Para & Helipad Stargazing",
          title_bn: "দীঘিনালা আর্মি এসকর্ট, রুইলুই পাড়া ও হ্যালিপ্যাডে তারা দর্শন",
          theme_en: "Climbing into the Clouds",
          theme_bn: "মেঘের দেশে মেঘের চাদরে প্রবেশ",
          activities: [
            {
              time_en: "07:30 AM – 10:00 AM",
              time_bn: "সকাল ০৭:৩০ – ১০:০০",
              title_en: "Khagrachhari Arrival & 4x4 Chander Gari Hiring",
              title_bn: "খাগড়াছড়ি আগমন ও চান্দের গাড়ি নির্ধারণ",
              desc_en: "Arrive at Khagrachhari via night coach. Savor hill breakfast and hire certified 4x4 Chander Gari for the thrilling mountain safari.",
              desc_bn: "খাগড়াছড়ি বাসস্ট্যান্ডে নেমে নাশতা করে সমিতির অনুমোদিত ৪x৪ চান্দের গাড়ি ঠিক করুন।",
              spot: "Khagrachhari Sadar",
              transit_tip: "Chander Gari official 2-day reserve fare: ৳9,500-৳11,000 for up to 12 people",
              transit_tip_bn: "চান্দের গাড়ি সরকারি নির্ধারিত ২ দিনের ভাড়া: ৯,৫০০-১১,০০০ টাকা (১২ জনের জন্য)"
            },
            {
              time_en: "10:30 AM – 01:30 PM",
              time_bn: "সকাল ১০:৩০ – দুপুর ০১:৩০",
              title_en: "Mandatory Army Escort from Dighinala to Sajek",
              title_bn: "দীঘিনালা থেকে সেনাবহিনীর এসকর্টে সাজেক যাত্রা",
              desc_en: "Join the convoy escorted by the Bangladesh Army. Experience sweeping mountain ridges, lush green valleys, and bamboo suspension bridges.",
              desc_bn: "দীঘিনালা থেকে সেনাবাহিনীর কড়া নিরাপত্তায় গাড়িবহরের সাথে চোখ জুড়ানো পাহাড়ি আঁকাবাঁকা পথ পাড়ি দিয়ে সাজেক ভ্যালিতে পৌঁছানো।",
              spot: "Dighinala to Ruilui Para"
            },
            {
              time_en: "02:00 PM – 03:30 PM",
              time_bn: "দুপুর ০২:০০ – ০৩:৩০",
              title_en: "Authentic Bamboo Chicken Lunch",
              title_bn: "বাঁশের চোঙায় পাহাড়ি বাঁশ মুরগি দিয়ে লাঞ্চ",
              desc_en: "Taste fresh chicken marinated in local mountain herbs and roasted slowly inside green bamboo shoots with indigenous sticky rice.",
              desc_bn: "পাহাড়ে তাজা বাঁশের চোঙায় রান্না করা পাহাড়ি মশলার সুস্বাদু বাঁশ মুরগি ও জুমের চালের গরম ভাত দিয়ে দুপুরের খাবার।",
              spot: "Ruilui Para",
              dining_recommendation: "Pahar Para Restaurant (Signature: Bamboo Chicken & Pahari Dal)",
              dining_recommendation_bn: "পাহাড় পাড়া রেস্তোরাঁ (সিগনেচার: বাঁশ মুরগি ও পাহাড়ি জুমের ডাল)"
            },
            {
              time_en: "05:00 PM – 09:30 PM",
              time_bn: "বিকাল ০৫:০০ – রাত ০৯:৩০",
              title_en: "Sunset at Helipad & Milky Way Stargazing",
              title_bn: "হ্যালিপ্যাডে রক্তিম সূর্যাস্ত ও মেঘের ওপর তারা দর্শন",
              desc_en: "Witness the sun setting over the endless mountain horizons of Mizoram and Bangladesh. Stargaze around the hilltop campfire.",
              desc_bn: "১ নম্বর হ্যালিপ্যাডে বসে দিগন্ত বিস্তৃত পাহাড়ের ওপারে সূর্যাস্ত উপভোগ। রাতে মেঘমুক্ত আকাশে কোটি তারার মেলা ও ক্যাম্পফায়ার।",
              spot: "Sajek Helipad 1 & 2"
            }
          ]
        },
        {
          dayNumber: 2,
          title_en: "Konglak Peak Sea of Clouds, Alutila Cave & Return",
          title_bn: "কংলাক পাহাড়ে মেঘের সমুদ্র, রহস্যময় আলুটিলা গুহা ও ফেরা",
          theme_en: "Above the Clouds & Subterranean Adventure",
          theme_bn: "মেঘের চূড়া ও মাটির নিচের গুহার রহস্য",
          activities: [
            {
              time_en: "05:30 AM – 08:30 AM",
              time_bn: "ভোর ০৫:৩০ – সকাল ০৮:৩০",
              title_en: "Sunrise from Konglak Para (Highest Peak)",
              title_bn: "কংলাক পাড়ার চূড়ায় সূর্যোদয় ও মেঘের ভেলা",
              desc_en: "Hike up to the highest point of Sajek Valley. Stand literally above a vast rolling sea of white fluffy clouds as the morning sun turns everything golden.",
              desc_bn: "ভোরে সাজেকের সর্বোচ্চ চূড়া কংলাক পাহাড়ে পদযাত্রা। চোখের সামনে মেঘের সাদা সমুদ্রের ভেতর থেকে সূর্যের উদয় অবলোকন।",
              spot: "Konglak Para"
            },
            {
              time_en: "10:00 AM – 01:30 PM",
              time_bn: "সকাল ১০:০০ – দুপুর ০১:৩০",
              title_en: "Morning Escort Return to Khagrachhari",
              title_bn: "সকাল ১০টার এসকর্টে খাগড়াছড়ি প্রত্যাবর্তন",
              desc_en: "Check out of cottage and join the 10:00 AM army escort heading back down through scenic forests.",
              desc_bn: "কটেজ চেক-আউট করে সকালের এসকর্টে খাগড়াছড়ির উদ্দেশ্যে পাহাড় থেকে নিচে নামা।",
              spot: "Baghaichari Road"
            },
            {
              time_en: "02:30 PM – 05:30 PM",
              time_bn: "দুপুর ০২:৩০ – বিকাল ০৫:৩০",
              title_en: "Alutila Mysterious Cave Exploration",
              title_bn: "মশাল জ্বালিয়ে রহস্যময় আলুটিলা গুহা পাড়ি দেওয়া",
              desc_en: "Walk through the subterranean water stream of ancient Alutila Cave holding traditional bamboo torches. Visit nearby Tareng park viewpoint.",
              desc_bn: "বাঁশের মশাল হাতে শীতল জলধারা মাড়িয়ে গা ছমছমে আলুটিলা গুহা পার হওয়া এবং তারেং পর্যটন কেন্দ্রে পাহাড়ের রূপ দর্শন।",
              spot: "Alutila Mysterious Cave"
            },
            {
              time_en: "08:30 PM – 10:00 PM",
              time_bn: "রাত ০৮:৩০ – ১০:০০",
              title_en: "Traditional Marma Dinner & Night Bus to Dhaka",
              title_bn: "সিস্টেম রেস্তোরাঁয় মারমা খাবার ও ঢাকার বাসে ওঠা",
              desc_en: "Enjoy indigenous duck curry and wild vegetables at famous System Restaurant before boarding your night coach back to Dhaka.",
              desc_bn: "খাগড়াছড়ির বিখ্যাত সিস্টেম রেস্তোরাঁয় হাঁসের মাংস ও পাহাড়ি শাকসবজি দিয়ে ডিনার সেরে রাতের বাসে ঢাকার উদ্দেশ্যে রওনা।",
              spot: "Khagrachhari Bus Terminal"
            }
          ]
        }
      ],
      3: [
        {
          dayNumber: 1,
          title_en: "Khagrachhari Arrival, Army Escort & Sajek Sunset",
          title_bn: "খাগড়াছড়ি আগমন, আর্মি এসকর্ট ও সাজেক সূর্যাস্ত",
          theme_en: "Journey to Cloud Valley",
          theme_bn: "মেঘের রাজ্যের উদ্দেশ্যে যাত্রা",
          activities: [
            {
              time_en: "07:30 AM – 01:30 PM",
              time_bn: "সকাল ০৭:৩০ – দুপুর ০১:৩০",
              title_en: "Khagrachhari to Ruilui Para via Army Escort",
              title_bn: "দীঘিনালা এসকর্টে সাজেক রুইলুই পাড়ায় পৌঁছানো",
              desc_en: "Scenic mountain safari via Chander Gari with Army convoy.",
              desc_bn: "পাহাড়ি চড়াই-উতরাই পেরিয়ে সাজেক ভ্যালিতে আগমন ও চেক-ইন।",
              spot: "Ruilui Para"
            },
            {
              time_en: "05:00 PM – 07:00 PM",
              time_bn: "বিকাল ০৫:০০ – ০৭:০০",
              title_en: "Helipad Sunset",
              title_bn: "হ্যালিপ্যাডে সূর্যাস্ত দর্শন",
              desc_en: "Watch sunset over mountain ridges.",
              desc_bn: "হ্যালিপ্যাডে বসে শান্ত রক্তিম সূর্যাস্ত দর্শন।",
              spot: "Sajek Helipad"
            }
          ]
        },
        {
          dayNumber: 2,
          title_en: "Konglak Peak Clouds & Sajek Stone Garden",
          title_bn: "কংলাক চূড়ার মেঘের সাগর ও সাজেক স্টোন গার্ডেন",
          theme_en: "Sea of Clouds & Tribal Villages",
          theme_bn: "মেঘের ভেলা ও পাহাড়ি পাড়া",
          activities: [
            {
              time_en: "05:30 AM – 09:00 AM",
              time_bn: "ভোর ০৫:৩০ – সকাল ০৯:০০",
              title_en: "Sunrise at Konglak Para",
              title_bn: "কংলাক পাড়ায় ভোরে মেঘের স্পর্শ",
              desc_en: "Stand amidst rolling clouds on the highest mountain peak.",
              desc_bn: "সাজেকের সর্বোচ্চ বিন্দু থেকে চারপাশের মেঘের অপার সৌন্দর্য উপভোগ।",
              spot: "Konglak Peak"
            },
            {
              time_en: "02:30 PM – 05:00 PM",
              time_bn: "দুপুর ০২:৩০ – বিকাল ০৫:০০",
              title_en: "Sajek Stone Garden & Lusai Heritage Walk",
              title_bn: "স্টোন গার্ডেন ও লুসাই গ্রাম পরিদর্শন",
              desc_en: "Explore limestone natural rock formations and traditional wooden houses.",
              desc_bn: "প্রাকৃতিক পাথরের বাগান ও লুসাই আদিবাসীদের ঐতিহ্যবাহী কৃষ্টি দর্শন।",
              spot: "Stone Garden"
            }
          ]
        },
        {
          dayNumber: 3,
          title_en: "Alutila Cave, Risang Waterfall & Return",
          title_bn: "আলুটিলা গুহা, রিসাং ঝর্ণা ও ঢাকা প্রত্যাবর্তন",
          theme_en: "Waterfalls & Caves",
          theme_bn: "ঝর্ণার গর্জন ও গুহার রোমাঞ্চ",
          activities: [
            {
              time_en: "10:00 AM – 01:30 PM",
              time_bn: "সকাল ১০:০০ – দুপুর ০১:৩০",
              title_en: "Downhill Escort to Khagrachhari",
              title_bn: "পাহাড় থেকে খাগড়াছড়িতে নেমে আসা",
              desc_en: "Descent from Sajek through the valley.",
              desc_bn: "সকালের এসকর্টে খাগড়াছড়িতে ফিরে আসা।",
              spot: "Khagrachhari"
            },
            {
              time_en: "02:30 PM – 05:30 PM",
              time_bn: "দুপুর ০২:৩০ – বিকাল ০৫:৩০",
              title_en: "Risang Waterfall & Alutila Cave",
              title_bn: "রিসাং ঝর্ণায় জলকেলি ও আলুটিলা গুহা",
              desc_en: "Slide along the natural stone slide at Risang and trek through Alutila cave with torches.",
              desc_bn: "রিসাং ঝর্ণার শীতল পানিতে শরীর জুড়ানো ও মশালের আলোয় আলুটিলা গুহা পার হওয়া।",
              spot: "Risang Waterfall"
            },
            {
              time_en: "08:30 PM",
              time_bn: "রাত ০৮:৩০",
              title_en: "Night Coach to Dhaka",
              title_bn: "রাতের বাসে ঢাকা রওনা",
              desc_en: "Board Shant Paribahan / Ena back to Dhaka.",
              desc_bn: "শান্তি বা শ্যামলী বাসে ঢাকায় ফেরা।",
              spot: "Khagrachhari Terminal"
            }
          ]
        }
      ],
      4: [
        {
          dayNumber: 1,
          title_en: "Khagrachhari to Sajek Arrival",
          title_bn: "খাগড়াছড়ি থেকে সাজেকে আগমন",
          theme_en: "Escort Entry",
          theme_bn: "পাহাড়ে প্রবেশ",
          activities: [
            {
              time_en: "08:00 AM – 02:00 PM",
              time_bn: "সকাল ০৮:০০ – দুপুর ০২:০০",
              title_en: "Chander Gari Journey to Sajek",
              title_bn: "সাজেক রুইলুই পাড়ায় পৌঁছানো",
              desc_en: "Mountain drive with Army escort.",
              desc_bn: "চান্দের গাড়িতে পাহাড়ি সৌন্দর্য উপভোগ করে সাজেক পৌঁছানো।",
              spot: "Sajek"
            }
          ]
        },
        {
          dayNumber: 2,
          title_en: "Konglak Clouds & Mountain Trekking",
          title_bn: "কংলাক পাড়া ও মেঘের ভেলা",
          theme_en: "Cloud Peak",
          theme_bn: "মেঘের চূড়া",
          activities: [
            {
              time_en: "05:30 AM – 11:00 AM",
              time_bn: "ভোর ০৫:৩০ – সকাল ১১:০০",
              title_en: "Sunrise Cloud Walk",
              title_bn: "মেঘের ওপর প্রভাতী হাঁটা",
              desc_en: "Watch the sun rise over Mizoram mountain borders.",
              desc_bn: "কংলাক পাহাড়ে দাঁড়িয়ে ভোরের মেঘের সাগরে অবগাহন।",
              spot: "Konglak"
            }
          ]
        },
        {
          dayNumber: 3,
          title_en: "Relaxing Cloud Valley & Barbecue",
          title_bn: "সাজেকে ধীরস্থির সময় ও বারবিকিউ",
          theme_en: "Relaxation & Bonfire",
          theme_bn: "বিশ্রাম ও সান্ধ্যকালীন ক্যাম্পফায়ার",
          activities: [
            {
              time_en: "03:00 PM – 09:00 PM",
              time_bn: "বিকাল ০৩:০০ – রাত ০৯:০০",
              title_en: "Village Walks & Night BBQ",
              title_bn: "পাহাড়ি পাড়ায় হাঁটা ও বারবিকিউ ডিনার",
              desc_en: "Meet friendly indigenous villagers and enjoy night live BBQ.",
              desc_bn: "পাহাড়ি গ্রামের শান্ত পরিবেশ ও রাতের তাজা বারবিকিউ।",
              spot: "Ruilui"
            }
          ]
        },
        {
          dayNumber: 4,
          title_en: "Alutila, Tareng & Departure",
          title_bn: "আলুটিলা, তারেং পার্ক ও ঢাকা প্রত্যাবর্তন",
          theme_en: "Subterranean & Return",
          theme_bn: "গুহা দর্শন ও ফেরা",
          activities: [
            {
              time_en: "10:00 AM – 06:00 PM",
              time_bn: "সকাল ১০:০০ – সন্ধ্যা ০৬:০০",
              title_en: "Alutila Cave & Khagrachhari Sightseeing",
              title_bn: "আলুটিলা গুহা ও পাহাড়ি খাবার",
              desc_en: "Explore cave and catch evening bus back.",
              desc_bn: "গুহা পার হওয়া এবং রাতের বাসে ঢাকায় ফেরা।",
              spot: "Khagrachhari"
            }
          ]
        }
      ]
    }
  },
  sylhet: {
    destinationId: "sylhet",
    name_en: "Sylhet & Sreemangal",
    name_bn: "সিলেট ও শ্রীমঙ্গল",
    division: "Sylhet",
    bestSeason_en: "June to September for Waterfalls; October to March for Tea Gardens",
    bestSeason_bn: "বর্ষায় জলপ্রপাত ও হাওর; শীতে চা বাগান ও মিষ্টি আবহাওয়া",
    plans: {
      2: [
        {
          dayNumber: 1,
          title_en: "Ratargul Freshwater Swamp Forest & Malnicherra Tea Estate",
          title_bn: "রাতারগুল সোয়াম্প ফরেস্ট ও উপমহাদেশের প্রাচীনতম মালনীছড়া চা বাগান",
          theme_en: "Amazon of Bengal & Green Tea Hills",
          theme_bn: "সোয়াম্প ফরেস্ট ও সবুজ চা বাগান",
          activities: [
            {
              time_en: "07:00 AM – 10:00 AM",
              time_bn: "সকাল ০৭:০০ – ১০:০০",
              title_en: "Sylhet Arrival & Shrine Visit",
              title_bn: "সিলেট আগমন ও হযরত শাহজালাল (র.) মাজার",
              desc_en: "Arrive via Parabat Express or Upaban train. Check in and visit historic Hazrat Shah Jalal Shrine. Savor hot Bakarkhani and milk tea.",
              desc_bn: "ট্রেন বা বাসে সিলেট আগমন। হোটেলে ফ্রেশ হয়ে হযরত শাহজালাল (র.) মাজার জিয়ারত ও বাকরখানি দিয়ে নাশতা।",
              spot: "Dargah Gate, Sylhet"
            },
            {
              time_en: "10:30 AM – 02:00 PM",
              time_bn: "সকাল ১০:৩০ – দুপুর ০২:০০",
              title_en: "Wooden Boat Safari in Ratargul Swamp Forest",
              title_bn: "রাতারগুল মিঠাপানির জলাবনে ডিঙি নৌকায় ভ্রমণ",
              desc_en: "Glide along the submerged Koroch and Murta trees of Bangladesh's only freshwater swamp forest. Climb watchtower for forest view.",
              desc_bn: "মাঝি নৌকায় নিস্তব্ধ জলাবনের ভেতর দিয়ে কদম ও করচ গাছের ছায়ায় ভ্রমণ। ওয়াচ টাওয়ারে উঠে বনভূমির রূপ দর্শন।",
              spot: "Ratargul Swamp Forest",
              transit_tip: "CNG auto from Sylhet to Ratargul ghat: ৳600-৳800 return",
              transit_tip_bn: "সিলেট শহর থেকে রাতারগুল ঘাট সিএনজি রিজার্ভ: ৬০০-৮০০ টাকা"
            },
            {
              time_en: "02:30 PM – 04:00 PM",
              time_bn: "দুপুর ০২:৩০ – বিকাল ০৪:০০",
              title_en: "Authentic Akhni Polao Lunch at Panshi",
              title_bn: "পানশী রেস্তোরাঁয় ঐতিহ্যবাহী গরুর আখনি ও ৩০ পদের ভর্তা",
              desc_en: "Feast on fragrant Beef Akhni, spicy duck curry, and traditional Sylheti shutki bhortas.",
              desc_bn: "সিলেটের বিখ্যাত পানশী রেস্তোরাঁয় বসে জিভে জল আনা গরুর আখনি পোলাও, হাঁসের মাংস ও হরেক পদের ভর্তা।",
              spot: "Zindabazar",
              dining_recommendation: "Panshi Restaurant (Signature: Beef Akhni & Duck Curry)",
              dining_recommendation_bn: "পানশী রেস্তোরাঁ (সিগনেচার: গরুর আখনি পোলাও ও হাঁস ভুনা)"
            },
            {
              time_en: "04:30 PM – 06:30 PM",
              time_bn: "বিকাল ০৪:৩০ – সন্ধ্যা ০৬:৩০",
              title_en: "Sunset Walk at Malnicherra Tea Estate",
              title_bn: "মালনীছড়া চা বাগানের সবুজ টিলায় সূর্যাস্ত",
              desc_en: "Walk through the subcontinent's oldest tea garden established in 1849. Breath in fresh tea leaf aromas at sunset.",
              desc_bn: "১৮৪৯ সালে প্রতিষ্ঠিত উপমহাদেশের প্রাচীনতম মালনীছড়া চা বাগানের সবুজ গালিচায় হেঁটে সূর্যাস্ত অবলোকন।",
              spot: "Malnicherra Tea Estate"
            }
          ]
        },
        {
          dayNumber: 2,
          title_en: "Jaflong Zero Point & Emerald Waters of Lalakhal River",
          title_bn: "জাফলং জিরো পয়েন্ট ও লালাখালের স্ফটিক নীল জলরাশি",
          theme_en: "Pebble Rivers & Clear Emerald Waters",
          theme_bn: "পাথুরে নদী ও স্বচ্ছ নীল জলের মোহনা",
          activities: [
            {
              time_en: "08:30 AM – 12:30 PM",
              time_bn: "সকাল ০৮:৩০ – দুপুর ১২:৩০",
              title_en: "Jaflong Stone River & Mayabi Waterfall",
              title_bn: "জাফলং পিয়াইন নদী ও মায়াবী ঝর্ণা দর্শন",
              desc_en: "Take a boat across the Piyain river to the stone beds of Jaflong right under the Meghalaya hill borders. Walk to the Mayabi waterfall.",
              desc_bn: "ভারতের মেঘালয় পাহাড়ের পাদদেশে জাফলংয়ের পাথুরে নদী পাড়ি দিয়ে মায়াবী ঝর্ণার শীতল জলধারায় পৌঁছানো।",
              spot: "Jaflong Zero Point"
            },
            {
              time_en: "01:30 PM – 05:00 PM",
              time_bn: "দুপুর ০১:৩০ – বিকাল ০৫:০০",
              title_en: "Emerald Green Lalakhal River Cruise",
              title_bn: "পান্না সবুজ লালাখাল নদীতে স্পিডবোট বা নৌকা ভ্রমণ",
              desc_en: "Cruise through the emerald blue-green waters of the Shari River originating from Cherrapunji.",
              desc_bn: "মেঘালয়ের পাহাড় থেকে নেমে আসা স্বচ্ছ নীল-সবুজ পানির নদী লালাখালে নয়নাভিরাম নৌকাভ্রমণ।",
              spot: "Lalakhal River"
            },
            {
              time_en: "08:00 PM – 10:00 PM",
              time_bn: "রাত ০৮:০০ – ১০:০০",
              title_en: "Seven-layer Tea Tasting & Return Coach",
              title_bn: "সাত রঙের চা ও ট্রেনের ফিরতি যাত্রা",
              desc_en: "Taste Nilkantha's 7-layer tea before catching the return AC coach or Upaban Express train.",
              desc_bn: "ঐতিহাসিক সাত রঙের চা পান এবং রাতের ট্রেনে ঢাকার উদ্দেশ্যে যাত্রা।",
              spot: "Sylhet Railway Station"
            }
          ]
        }
      ],
      3: [
        {
          dayNumber: 1,
          title_en: "Sylhet City, Ratargul Swamp & Malnicherra Tea",
          title_bn: "সিলেট শহর, রাতারগুল জলাবন ও মালনীছড়া চা বাগান",
          theme_en: "Swamp & Tea Estate",
          theme_bn: "জলাবন ও সবুজ চা বাগান",
          activities: [
            {
              time_en: "08:00 AM – 01:00 PM",
              time_bn: "সকাল ০৮:০০ – দুপুর ০১:০০",
              title_en: "Ratargul Boat Safari",
              title_bn: "রাতারগুলে ডিঙি নৌকায় ভ্রমণ",
              desc_en: "Explore the peaceful freshwater swamp forest.",
              desc_bn: "জলাবনের ভেতর শান্ত শীতল নৌভ্রমণ।",
              spot: "Ratargul"
            },
            {
              time_en: "03:00 PM – 06:30 PM",
              time_bn: "দুপুর ০৩:০০ – সন্ধ্যা ০৬:৩০",
              title_en: "Malnicherra Tea Estate Sunset",
              title_bn: "মালনীছড়া চা বাগানে সূর্যাস্ত",
              desc_en: "Walk through undulating tea hillocks.",
              desc_bn: "সবুজ চা পাতার ঘ্রাণে স্নিগ্ধ বিকেল কাটানো।",
              spot: "Malnicherra"
            }
          ]
        },
        {
          dayNumber: 2,
          title_en: "Jaflong, Khasia Punji & Emerald Lalakhal",
          title_bn: "জাফলং, খাসিয়া পুঞ্জি ও লালাখাল",
          theme_en: "Border Hills & Crystal Waters",
          theme_bn: "সীমান্ত পাহাড় ও নীল নদী",
          activities: [
            {
              time_en: "08:30 AM – 01:00 PM",
              time_bn: "সকাল ০৮:৩০ – দুপুর ০১:০০",
              title_en: "Jaflong Zero Point & Khasia Village",
              title_bn: "জাফলং জিরো পয়েন্ট ও খাসিয়া গ্রাম",
              desc_en: "Walk stone river bed and observe betel leaf plantations.",
              desc_bn: "পাথুরে নদী ও পানের বরজে খাসিয়াদের জীবনযাত্রা দর্শন।",
              spot: "Jaflong"
            },
            {
              time_en: "02:30 PM – 06:00 PM",
              time_bn: "দুপুর ০২:৩০ – সন্ধ্যা ০৬:০০",
              title_en: "Lalakhal River Boat Ride",
              title_bn: "লালাখাল নদীতে স্ফটিক নীল জলরাশি",
              desc_en: "Cruise through pristine turquoise waters.",
              desc_bn: "লালাখালে শান্ত স্বচ্ছ জলে নৌকা ভ্রমণ।",
              spot: "Lalakhal"
            }
          ]
        },
        {
          dayNumber: 3,
          title_en: "Sreemangal Lawachara Rainforest & Madhabpur Lotus Lake",
          title_bn: "শ্রীমঙ্গল লাউয়াছড়া রেইনফরেস্ট ও মাধবপুর পদ্ম লেক",
          theme_en: "Rainforest Canopy & Seven Layer Tea",
          theme_bn: "গহীন অরণ্য ও সাতরঙা চা",
          activities: [
            {
              time_en: "08:00 AM – 12:00 PM",
              time_bn: "সকাল ০৮:০০ – দুপুর ১২:০০",
              title_en: "Lawachara National Park Jungle Trek",
              title_bn: "লাউয়াছড়া জাতীয় উদ্যানে ট্র্যাকিং ও উল্লোক দর্শন",
              desc_en: "Trek through the dense canopy of Lawachara. Listen to the calls of endangered Hoolock Gibbons along the train tracks inside the jungle.",
              desc_bn: "লাউয়াছড়া বনের গভীর ট্রেইলে পদযাত্রা। বনের ভেতর দিয়ে যাওয়া রেললাইন ও বিরল উল্লুকের ডাক শোনা।",
              spot: "Lawachara National Park"
            },
            {
              time_en: "01:30 PM – 04:30 PM",
              time_bn: "দুপুর ০১:৩০ – বিকাল ০৪:৩০",
              title_en: "Madhabpur Lake Lotus Sanctuary",
              title_bn: "মাধবপুর লেকে নীল পদ্মের মেলা",
              desc_en: "Admire purple water lilies and lotus flowers surrounded by terraced tea hills right on the Tripura border.",
              desc_bn: "চা বাগানে ঘেরা শান্ত নীল জলের মাধবপুর লেক ও ফুটে থাকা শত শত পদ্ম ফুল দর্শন।",
              spot: "Madhabpur Lake"
            },
            {
              time_en: "05:00 PM – 07:30 PM",
              time_bn: "বিকাল ০৫:০০ – সন্ধ্যা ০৭:৩০",
              title_en: "Famous Nilkantha Seven Layer Tea & Return",
              title_bn: "নীলকণ্ঠের বিখ্যাত সাত রঙের চা ও ফেরা",
              desc_en: "Sip Ramesh Ram Gour's famous multi-layered tea and purchase fresh garden tea leaves before boarding Kalni Express to Dhaka.",
              desc_bn: "রামেশ বাবুর নীলকণ্ঠ কেবিনে বসে সাত রঙের চা উপভোগ ও সরাসরি বাগান থেকে তাজা চা পাতা কিনে ট্রেনে ঢাকায় ফেরা।",
              spot: "Sreemangal Railway Station"
            }
          ]
        }
      ],
      4: [
        {
          dayNumber: 1,
          title_en: "Sylhet Arrival & Ratargul Forest",
          title_bn: "সিলেটে আগমন ও রাতারগুল বন",
          theme_en: "Swamp Exploration",
          theme_bn: "জলাবন সাফারি",
          activities: [
            {
              time_en: "08:00 AM – 02:00 PM",
              time_bn: "সকাল ০৮:০০ – দুপুর ০২:০০",
              title_en: "Ratargul Boat Ride",
              title_bn: "রাতারগুলে নৌকাভ্রমণ",
              desc_en: "Freshwater forest exploration.",
              desc_bn: "মিঠাপানির সোয়াম্প ফরেস্ট দর্শন।",
              spot: "Ratargul"
            }
          ]
        },
        {
          dayNumber: 2,
          title_en: "Jaflong & Lalakhal Emerald River",
          title_bn: "জাফলং ও লালাখাল নদী",
          theme_en: "River Safari",
          theme_bn: "নদী সাফারি",
          activities: [
            {
              time_en: "08:30 AM – 04:00 PM",
              time_bn: "সকাল ০৮:৩০ – বিকাল ০৪:০০",
              title_en: "Jaflong & Lalakhal",
              title_bn: "জাফলং ও লালাখাল ভ্রমণ",
              desc_en: "Full day river excursions.",
              desc_bn: "পাথুরে নদী ও নীল জলের মিলনমেলা।",
              spot: "Jaflong"
            }
          ]
        },
        {
          dayNumber: 3,
          title_en: "Bichnakandi Stone Streams & Panthumai",
          title_bn: "বিছনাকান্দি পাথুরে ঝর্ণা ও পান্তুমাই জলপ্রপাত",
          theme_en: "Rocky Mountain Streams",
          theme_bn: "পাহাড়ি পাথুরে নদী ও জলপ্রপাত",
          activities: [
            {
              time_en: "08:30 AM – 04:30 PM",
              time_bn: "সকাল ০৮:৩০ – বিকাল ০৪:৩০",
              title_en: "Bichnakandi & Panthumai Border Waterfall",
              title_bn: "বিছনাকান্দিতে স্বচ্ছ পানিতে স্নান ও পান্তুমাই ঝর্ণা",
              desc_en: "Boat to Bichnakandi where steps of Meghalaya hills meet crystal cold mountain water. View Panthumai waterfall from boat.",
              desc_bn: "পাহাড়ের বুক চিরে নেমে আসা স্বচ্ছ পাথুরে পানিতে শীতল স্নান ও দূর থেকে পান্তুমাই ঝর্ণার সৌন্দর্য অবলোকন।",
              spot: "Bichnakandi"
            }
          ]
        },
        {
          dayNumber: 4,
          title_en: "Sreemangal Tea Estates & Return",
          title_bn: "শ্রীমঙ্গল চা বাগান ও ফেরা",
          theme_en: "Tea Capital of Bangladesh",
          theme_bn: "চা কন্যা শ্রীমঙ্গল",
          activities: [
            {
              time_en: "09:00 AM – 04:00 PM",
              time_bn: "সকাল ০৯:০০ – বিকাল ০৪:০০",
              title_en: "Lawachara Forest & Seven Layer Tea",
              title_bn: "লাউয়াছড়া অরণ্য ও সাতরঙা চা",
              desc_en: "Rainforest trek and return evening train.",
              desc_bn: "সবুজ বনে হাঁটা ও ট্রেনে ঢাকায় ফেরা।",
              spot: "Sreemangal"
            }
          ]
        }
      ]
    }
  },
  bandarban: {
    destinationId: "bandarban",
    name_en: "Bandarban",
    name_bn: "বান্দরবান",
    division: "Chattogram",
    bestSeason_en: "October to March (Crisp mountain air & cloud peaks)",
    bestSeason_bn: "অক্টোবর থেকে মার্চ (মেঘের মেলা ও পাহাড়ের মনোরম আবহাওয়া)",
    plans: {
      2: [
        {
          dayNumber: 1,
          title_en: "Golden Temple, Nilachal Cloud Viewpoint & Sunset",
          title_bn: "স্বর্ণ মন্দির, নীলাচলে মেঘের দৃশ্য ও সূর্যাস্ত",
          theme_en: "Heaven of Clouds",
          theme_bn: "স্বর্গীয় মেঘ ও বৌদ্ধ ঐতিহ্য",
          activities: [
            {
              time_en: "07:30 AM – 11:30 AM",
              time_bn: "সকাল ০৭:৩০ – ১১:৩০",
              title_en: "Bandarban Arrival & Golden Temple Visit",
              title_bn: "বান্দরবান আগমন ও স্বর্ণ মন্দির (বুদ্ধ ধাতু জাদি)",
              desc_en: "Arrive via AC bus from Dhaka/Chittagong. Check into hotel and visit the magnificent Golden Temple atop Pulpara hill.",
              desc_bn: "বান্দরবান শহরে পৌঁছে হোটেলে ফ্রেশ হওয়া এবং পুলপাড়া পাহাড়ে অবস্থিত কারুকার্যখচিত স্বর্ণ মন্দির দর্শন।",
              spot: "Buddha Dhatu Jadi"
            },
            {
              time_en: "03:30 PM – 06:30 PM",
              time_bn: "বিকাল ০৩:৩০ – সন্ধ্যা ০৬:৩০",
              title_en: "Nilachal (Heaven of Clouds) Sunset",
              title_bn: "নীলাচলে (স্বর্গপুরী) অপরূপ সূর্যাস্ত দর্শন",
              desc_en: "Climb up to Nilachal viewpoint 2,000 feet above sea level. Enjoy cool mountain breezes and watch sunset over endless rolling green hills.",
              desc_bn: "সমুদ্রপৃষ্ঠ থেকে প্রায় ২,০০০ ফুট উঁচুতে নীলাচলে দাঁড়িয়ে দিগন্তজোড়া সবুজ পাহাড়ের বুকে রক্তিম সূর্যাস্ত উপভোগ।",
              spot: "Nilachal"
            }
          ]
        },
        {
          dayNumber: 2,
          title_en: "Chimbuk Hill, Nilgiri Cloud Resort & Shailopropat",
          title_bn: "চিম্বুক পাহাড়, নীলগিরি ক্লাউড রিসোর্ট ও শৈলপ্রপাত",
          theme_en: "Highest Accessible Cloud Peak",
          theme_bn: "দেশের সর্বোচ্চ মেঘের চূড়ায় অভিযান",
          activities: [
            {
              time_en: "07:30 AM – 01:30 PM",
              time_bn: "সকাল ০৭:৩০ – দুপুর ০১:৩০",
              title_en: "4x4 Expedition to Nilgiri Cloud Resort",
              title_bn: "চান্দের গাড়িতে নীলগিরি চূড়ায় মেঘের স্পর্শ",
              desc_en: "Ride an open Chander Gari winding up mountain peaks to Nilgiri (2,400 ft), operated by Bangladesh Army. Touch clouds floating right through your fingers.",
              desc_bn: "চান্দের গাড়িতে চিম্বুক পাহাড়ি রাস্তা বেয়ে ২,৪০০ ফুট উঁচুতে নীলগিরি গমন। চোখের সামনে ভেসে যাওয়া জীবন্ত মেঘ স্পর্শ করার অনুভূতি।",
              spot: "Nilgiri Resort"
            },
            {
              time_en: "02:30 PM – 05:00 PM",
              time_bn: "দুপুর ০২:৩০ – বিকাল ০৫:০০",
              title_en: "Shailopropat Natural Waterfall & Marma Handicrafts",
              title_bn: "শৈলপ্রপাত ঝর্ণা ও মারমা বাজার কেনাকাটা",
              desc_en: "Cool off at the cold mountain stream of Shailopropat. Shop for pure tribal woven fabrics and raw forest honey.",
              desc_bn: "পাহাড়ে বয়ে যাওয়া পাথুরে শৈলপ্রপাত ঝর্ণা দর্শন ও স্থানীয় আদিবাসীদের তৈরি পোশাক এবং পাহাড়ি খাঁটি মধু কেনাকাটা।",
              spot: "Shailopropat"
            },
            {
              time_en: "08:30 PM",
              time_bn: "রাত ০৮:৩০",
              title_en: "Night Bus Boarding back to Dhaka",
              title_bn: "রাতের বাসে ঢাকা যাত্রা",
              desc_en: "Board AC bus (Saintmartin/Desh Travels) back to Dhaka.",
              desc_bn: "সেন্টমার্টিন বা দেশ ট্রাভেলসের এসি কোচে ঢাকায় ফেরা।",
              spot: "Bandarban Bus Stand"
            }
          ]
        }
      ],
      3: [
        {
          dayNumber: 1,
          title_en: "Golden Temple & Nilachal Sunset",
          title_bn: "স্বর্ণ মন্দির ও নীলাচল সূর্যাস্ত",
          theme_en: "Hilltop Heritage",
          theme_bn: "পাহাড়ি ঐতিহ্য",
          activities: [
            {
              time_en: "08:00 AM – 06:00 PM",
              time_bn: "সকাল ০৮:০০ – সন্ধ্যা ০৬:০০",
              title_en: "Buddha Dhatu Jadi & Nilachal Cloud Deck",
              title_bn: "স্বর্ণ মন্দির ও নীলাচলের মেঘের ভিউ",
              desc_en: "Explore cultural sites and catch mountain sunset.",
              desc_bn: "পাহাড়ের স্বর্ণ মন্দির ও নীলাচলে সূর্যাস্ত দর্শন।",
              spot: "Nilachal"
            }
          ]
        },
        {
          dayNumber: 2,
          title_en: "Nilgiri Peak, Chimbuk & Shailopropat",
          title_bn: "নীলগিরি চূড়া, চিম্বুক ও শৈলপ্রপাত ঝর্ণা",
          theme_en: "Sky High Expedition",
          theme_bn: "আকাশছোঁয়া পাহাড়",
          activities: [
            {
              time_en: "07:30 AM – 03:30 PM",
              time_bn: "সকাল ০৭:৩০ – দুপুর ০৩:৩০",
              title_en: "Full Day Nilgiri Safari",
              title_bn: "নীলগিরি পাহাড়ি সাফারি",
              desc_en: "Touch clouds on Bangladesh's highest reachable summit.",
              desc_bn: "চান্দের গাড়িতে নীলগিরি চূড়ায় মেঘের স্পর্শ।",
              spot: "Nilgiri"
            }
          ]
        },
        {
          dayNumber: 3,
          title_en: "Boga Lake or Meghla Eco Park & Departure",
          title_bn: "বগা লেক বা মেঘলা পর্যটন কমপ্লেক্স ও ফেরা",
          theme_en: "Volcanic Mountain Lake & Return",
          theme_bn: "রহস্যময় লেক ও ঢাকা যাত্রা",
          activities: [
            {
              time_en: "08:30 AM – 03:00 PM",
              time_bn: "সকাল ০৮:৩০ – দুপুর ০৩:০০",
              title_en: "Meghla Cable Car & Suspension Bridge",
              title_bn: "মেঘলার ঝুলন্ত সেতু ও ক্যাবল কার ভ্রমণ",
              desc_en: "Walk across twin suspension bridges and boat through the serene lake.",
              desc_bn: "মেঘলার ঝুলন্ত সেতুতে হাঁটা, বোটিং ও মিনি চিড়িয়াখানা পরিদর্শন।",
              spot: "Meghla"
            },
            {
              time_en: "08:30 PM",
              time_bn: "রাত ০৮:৩০",
              title_en: "Board Return Coach",
              title_bn: "রাতের বাসে প্রত্যাবর্তন",
              desc_en: "Night coach back to Dhaka.",
              desc_bn: "এসি বাসে ঢাকায় ফেরা।",
              spot: "Bandarban"
            }
          ]
        }
      ],
      4: [
        {
          dayNumber: 1,
          title_en: "Bandarban Town & Nilachal",
          title_bn: "বান্দরবান শহর ও নীলাচল",
          theme_en: "Town & Sunset",
          theme_bn: "শহর ও সূর্যাস্ত",
          activities: [
            {
              time_en: "08:00 AM – 06:00 PM",
              time_bn: "সকাল ০৮:০০ – সন্ধ্যা ০৬:০০",
              title_en: "Town Check-in & Nilachal",
              title_bn: "চেক-ইন ও নীলাচলে সূর্যাস্ত",
              desc_en: "Arrival and sunset walk.",
              desc_bn: "হোটেলে ওঠা ও নীলাচল ভিউ।",
              spot: "Nilachal"
            }
          ]
        },
        {
          dayNumber: 2,
          title_en: "Nilgiri & Chimbuk Hill",
          title_bn: "নীলগিরি ও চিম্বুক পাহাড়",
          theme_en: "Cloud Safari",
          theme_bn: "মেঘের চূড়া",
          activities: [
            {
              time_en: "08:00 AM – 04:00 PM",
              time_bn: "সকাল ০৮:০০ – বিকাল ০৪:০০",
              title_en: "Nilgiri & Shailopropat",
              title_bn: "নীলগিরি ও শৈলপ্রপাত ঝর্ণা",
              desc_en: "Mountain top excursion.",
              desc_bn: "নীলগিরি পাহাড়ি ট্রিপ।",
              spot: "Nilgiri"
            }
          ]
        },
        {
          dayNumber: 3,
          title_en: "Thanchi & Sangu River Boat Safari",
          title_bn: "থানচি ও সাঙ্গু নদীতে রোমাঞ্চকর নৌভ্রমণ",
          theme_en: "Deep Hills & Sangu Rapids",
          theme_bn: "গহীন পাহাড় ও সাঙ্গু নদী",
          activities: [
            {
              time_en: "08:00 AM – 04:30 PM",
              time_bn: "সকাল ০৮:০০ – বিকাল ০৪:৩০",
              title_en: "Sangu River Boat Cruise",
              title_bn: "সাঙ্গু নদীর শান্ত বুকে নৌকাভ্রমণ",
              desc_en: "Cruise through sheer vertical rocky gorges of the Sangu River.",
              desc_bn: "উঁচু পাথুরে পাহাড়ের বুক চিরে বয়ে যাওয়া সাঙ্গু নদীতে নৌকাভ্রমণ।",
              spot: "Thanchi"
            }
          ]
        },
        {
          dayNumber: 4,
          title_en: "Meghla Eco Park & Departure",
          title_bn: "মেঘলা পার্ক ও ঢাকা যাত্রা",
          theme_en: "Farewell to Hills",
          theme_bn: "বিদায় বান্দরবান",
          activities: [
            {
              time_en: "09:00 AM – 03:00 PM",
              time_bn: "সকাল ০৯:০০ – দুপুর ০৩:০০",
              title_en: "Meghla Park & Shopping",
              title_bn: "মেঘলা ঝুলন্ত ব্রিজ ও কেনাকাটা",
              desc_en: "Souvenir shopping and return night bus.",
              desc_bn: "স্মারক কেনাকাটা ও রাতে ফেরা।",
              spot: "Bandarban"
            }
          ]
        }
      ]
    }
  }
};
