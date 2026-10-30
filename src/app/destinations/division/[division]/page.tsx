import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import destinationsData from "@/data/destinations.json";
import translationsData from "@/data/translations.json";
import { Destination } from "@/types/destination";
import { DestinationCard } from "@/components/destinations/DestinationCard";
import { buildRouteMetadata } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";
import { getDestinationImage } from "@/lib/destination-image";
import { MapPin, Compass, ArrowLeft } from "lucide-react";

interface Props {
  params: Promise<{ division: string }>;
}

interface DivisionMeta {
  name: string;
  nameBn: string;
  slug: string;
  title: string;
  description: string;
  intro: string;
  heroImage: string;
}

const DIVISION_CONFIG: Record<string, DivisionMeta> = {
  chattogram: {
    name: "Chattogram",
    nameBn: "চট্টগ্রাম",
    slug: "chattogram",
    title: "Chattogram Travel Guide: Best Places to Visit",
    description:
      "Explore Chattogram's 110 destinations: Cox's Bazar beaches, Sajek Valley clouds, Bandarban peaks, and scenic coastal marine drives in Bangladesh.",
    intro:
      "Chattogram division encompasses 110 destinations across 11 districts, including Cox's Bazar, Rangamati, Bandarban, Khagrachhari, Chattogram, Cumilla, and Noakhali. The region combines diverse categories such as coastal beaches, hill tracts, freshwater lakes, offshore islands, and archaeological sites. Major destinations include Cox's Bazar with its 120-kilometer natural sea beach, Saint Martin's Island, Nijhum Dwip, Sajek Valley, and the mountain peaks of Bandarban such as Nilgiri and Keokradong. Additional highlights feature Mainamati's historical Buddhist ruins in Cumilla, Foy's Lake in Chattogram city, Kaptai Lake in Rangamati, and waterfalls like Jadipai and Nafakhum. Travel across Chattogram spans various difficulty levels, from easy family beach holidays to moderate and challenging hill treks. The prime travel window spans October to March, offering clear skies, calm coastal waters, and pleasant hiking temperatures. Typical daily travel expenses range from BDT 1,500 to 5,500 per day across budget stays and premium resorts. Most travelers allocate between 2 to 4 days per major hub, accessing destinations via highway buses, intercity trains, domestic flights into Chattogram or Cox's Bazar, and licensed sea vessels.",
    heroImage: "/og/divisions/chattogram.jpg",
  },
  sylhet: {
    name: "Sylhet",
    nameBn: "সিলেট",
    slug: "sylhet",
    title: "Sylhet Travel Guide: Best Places to Visit",
    description:
      "Discover Sylhet's 30 destinations: rolling Sreemangal tea hills, crystal Ratargul swamp forests, roaring waterfalls, and Tanguar Haor houseboats.",
    intro:
      "Sylhet division features 30 destinations distributed across the four northeastern districts of Sylhet, Moulvibazar, Sunamganj, and Habiganj. Renowned for lush natural landscapes, the division encompasses rolling tea estates, freshwater swamp forests, high-volume waterfalls, and expansive wetland ecosystems. Primary attractions include Srimangal's tea gardens and Lawachara National Park, the crystal-clear waters of Jaflong and Lalakhal, Ratargul Swamp Forest, and the seasonal waters of Tanguar Haor. Visitors also explore prominent cultural and religious landmarks, including the historic Hazrat Shah Jalal and Hazrat Shah Paran shrines in Sylhet city. Travel categories range from nature trails and forest walks to boat navigation through haors and river gorges like Bisnakhandi. The recommended visiting season runs primarily from October to March for pleasant temperatures and migratory birdwatching, with monsoon months from May to September favored for roaring waterfalls and full water bodies. Daily budgets average between BDT 1,000 and 4,500 per day depending on houseboat rentals and resort accommodations. Hubs are reachable via train, long-distance buses, and flights connecting Dhaka directly with Osmani International Airport.",
    heroImage: "/og/divisions/sylhet.jpg",
  },
  khulna: {
    name: "Khulna",
    nameBn: "খুলনা",
    slug: "khulna",
    title: "Khulna Travel Guide: Best Places to Visit",
    description:
      "Explore Khulna's 22 destinations: Sundarbans mangrove world heritage, royal Bengal tiger trails, and historic Sixty Dome Mosque in Bagerhat.",
    intro:
      "Khulna division presents 22 curated travel destinations across 10 southwestern districts, including Khulna, Bagerhat, Kushtia, Satkhira, Meherpur, and Jashore. The division is globally celebrated for the Sundarbans mangrove forest, a UNESCO World Heritage site and home to the Royal Bengal tiger, spotted deer, and diverse river waterways navigated via multi-day motor launches. Beyond the coastal forest, the region holds immense architectural and cultural heritage. Key historical landmarks include Bagerhat's 15th-century Sixty Dome Mosque and Khan Jahan Ali's Tomb, Rabindranath Tagore's estate at Shilaidaha Kuthibari in Kushtia, the Lalon Shah Shrine, the historic Mujibnagar Memorial Complex in Meherpur, and Michael Madhusudan Dutt's birthplace in Jashore. Tourism categories emphasize wildlife safaris, eco-tourism, Bengal Sultanate architecture, and cultural pilgrimages. The ideal travel window spans November to February or March, when weather is dry and waterways are calm. Mainland destinations operate comfortably on daily budgets of BDT 500 to 2,500 per day, whereas chartered Sundarbans cruises range from BDT 4,000 to 8,000 per day. Transportation options include intercity trains, highway coaches, and river launches.",
    heroImage: "/og/divisions/khulna.jpg",
  },
  barishal: {
    name: "Barishal",
    nameBn: "বরিশাল",
    slug: "barishal",
    title: "Barishal Travel Guide: Best Places to Visit",
    description:
      "Discover Barishal's 19 destinations: Kuakata panoramic sunrise and sunset beach, floating guava markets, and serene southern riverways.",
    intro:
      "Barishal division spans 19 destinations across six southern coastal and delta districts: Patuakhali, Barishal, Bhola, Jhalokathi, Barguna, and Pirojpur. Renowned for riverine geography, this division features coastal beaches, mangrove estuaries, historic mosques, and bustling waterborne trade. Kuakata Beach in Patuakhali is the marquee coastal attraction, offering rare panoramic views of both sunrise and sunset across the Bay of Bengal. Inland, the famous floating guava and seasonal fruit markets at Bhimruli in Jhalokathi provide vibrant canal-based boat journeys. Other prominent spots include the 14-dome Guthia Mosque, the vast Durga Sagar reservoir, the serene wildlife habitats of Char Kukri Mukri island in Bhola, Rangabali, and the historic Oxford Mission Church in Barishal city. Travel categories center on beach recreation, river navigation, historical architecture, and cultural rural experiences. October to March is the optimal season for beach activities and island visits, while July to November is ideal for exploring active canal markets. Daily travel budgets generally span BDT 800 to 3,500 per day, with transit powered by overnight passenger launches and buses.",
    heroImage: "/og/divisions/barishal.jpg",
  },
  dhaka: {
    name: "Dhaka",
    nameBn: "ঢাকা",
    slug: "dhaka",
    title: "Dhaka Travel Guide: Best Places to Visit",
    description:
      "Explore Dhaka's 56 destinations: Lalbagh Fort, Ahsan Manzil palace, historic Panam City, and cultural riverfronts across central Bangladesh.",
    intro:
      "Dhaka division comprises 56 destinations across central Bangladesh, covering urban centers and historic districts including Dhaka, Narayanganj, Gazipur, Munshiganj, Manikganj, Kishoreganj, Tangail, and Gopalganj. The division holds significant archaeological, architectural, and political heritage representing Mughal, British colonial, and contemporary eras. Key historical monuments include Lalbagh Fort, Ahsan Manzil, the medieval capital of Panam City in Sonargaon, Baliati Palace, and the National Martyrs' Memorial at Savar. Natural and recreational escapes include Bhawal National Park, Madhupur Sal Forest, and the expansive monsoon waters of Nikli Haor in Kishoreganj. The destination roster includes ancient mosques, historic riverfronts, zamindar palaces, eco-parks, and cultural memorial sites. The most favorable travel window runs from October to March when cooler, dry weather facilitates heritage walks and outdoor sightseeing. Travel costs range from BDT 500 to 2,500 per day, making it highly accessible for day trips, weekend getaways, and extended family holidays. Transportation is exceptionally well-connected through nationwide highway expressways, intercity railway hubs, river ferries, and Hazrat Shahjalal International Airport in the capital.",
    heroImage: "/og/divisions/dhaka.jpg",
  },
  rajshahi: {
    name: "Rajshahi",
    nameBn: "রাজশাহী",
    slug: "rajshahi",
    title: "Rajshahi Travel Guide: Best Places to Visit",
    description:
      "Discover Rajshahi's 27 destinations: ancient terracotta temples of Puthia, Somapura Mahavihara Buddhist ruins, and the majestic Padma riverfront.",
    intro:
      "Rajshahi division contains 27 travel destinations spread across eight northern districts: Rajshahi, Bogura, Naogaon, Natore, Chapainawabganj, Pabna, Sirajganj, and Joypurhat. As a cradle of ancient Bengal civilization, the division is defined by world-renowned archaeological complexes and opulent feudal estates. Foremost among these is the UNESCO World Heritage Buddhist monastery of Somapura Mahavihara at Paharpur, dating to the 8th century, alongside the 3rd-century BC fortified citadel of Mahasthangarh in Bogura. Visitors also explore the exquisite 18th-century terracotta shrines of the Puthia Temple Complex, the grand palaces of Natore Rajbari and Uttara Gano Bhaban, the Sultanate-era Chhoto Sona Masjid, Bagha Mosque, and the historic Varendra Research Museum. Key categories include archaeology, religious architecture, palace heritage, and scenic banks of the Padma and Jamuna rivers. The best time to visit is during the pleasant winter months from October to March, alongside May to July for seasonal mango orchard tours. Typical daily travel budgets range from BDT 500 to 2,500 per day, with easy connectivity via express trains and intercity coaches.",
    heroImage: "/og/divisions/rajshahi.jpg",
  },
  rangpur: {
    name: "Rangpur",
    nameBn: "রংপুর",
    slug: "rangpur",
    title: "Rangpur Travel Guide: Best Places to Visit",
    description:
      "Explore Rangpur's 19 destinations: majestic Tajhat Palace, Kantajew terracotta temple, Teesta Barrage, and northern Himalayan borderlands.",
    intro:
      "Rangpur division encompasses 19 destinations across eight northern frontier districts: Rangpur, Dinajpur, Panchagarh, Lalmonirhat, Nilphamari, Thakurgaon, Kurigram, and Gaibandha. The region blends royal zamindar architecture, ancient terracotta craft, historic water reservoirs, and northern borderlands offering views toward the Himalayan foothills. Leading heritage sites include the magnificent 19th-century Tajhat Palace with its Roman-inspired columns, Dinajpur's 18th-century Kantajew Temple renowned for intricate terracotta reliefs, Ramsagar National Park featuring the country's largest man-made pond, and Nayabad Mosque. In northernmost Panchagarh, travelers visit Tetulia's plain-land tea gardens and Kanchenjunga viewpoints, while Lalmonirhat features the monumental Teesta Barrage. Categories span architectural monuments, nature parks, tea estates, and river engineering works. The primary travel season extends from October to March, when cool northern breezes provide optimal conditions for outdoor touring and clear winter skies enable distant mountain sightings. Expected daily travel budgets range from BDT 500 to 3,000 per day, with regular transit provided by intercity express trains and highway coach services.",
    heroImage: "/og/divisions/rangpur.jpg",
  },
  mymensingh: {
    name: "Mymensingh",
    nameBn: "ময়মনসিংহ",
    slug: "mymensingh",
    title: "Mymensingh Travel Guide: Best Places to Visit",
    description:
      "Discover Mymensingh's 12 destinations: pristine white clay hills of Birishiri, scenic Garo hill tracks, and historic Brahmaputra riverfronts.",
    intro:
      "Mymensingh division encompasses 12 distinctive destinations situated across the four northern districts of Mymensingh, Netrokona, Sherpur, and Jamalpur. Bordered by the scenic Garo Hills near the Indian frontier, the division is characterized by tranquil hilly landscapes, clear rivers, tribal cultural heritage, and colonial-era estates. The crown attraction is Birishiri in Netrokona, famous for the turquoise waters of its White Clay Hills and the crystal-clear Someshwari River. In Mymensingh city, travelers visit the ornate Victorian-style Shashi Lodge, the Muktagacha Zamindar Bari celebrated for traditional sweetmeats, the Zainul Abedin Museum, and landscaped promenades along the Old Brahmaputra River. In Sherpur and Jamalpur, highlights include Madhabtila Eco Park and Gajni Forest along the foothills. Destination categories emphasize nature exploration, rural eco-tourism, riverbanks, and regional history. November to February offers the best travel conditions with clear river flows, comfortable outdoor temperatures, and dry trekking paths. Daily expenses generally range from BDT 500 to 3,000 per day. Access is straightforward via direct train lines and highway buses departing Dhaka.",
    heroImage: "/og/divisions/mymensingh.jpg",
  },
};

export async function generateStaticParams() {
  return Object.keys(DIVISION_CONFIG).map((division) => ({
    division,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { division } = await params;
  const config = DIVISION_CONFIG[division.toLowerCase()];

  if (!config) {
    return {
      title: "Division Not Found",
    };
  }

  return buildRouteMetadata({
    title: config.title,
    description: config.description,
    path: `/destinations/division/${config.slug}`,
    image: config.heroImage,
    imageAlt: `${config.name} Division Travel Guide Bangladesh`,
  });
}

export default async function DivisionPage({ params }: Props) {
  const { division } = await params;
  const config = DIVISION_CONFIG[division.toLowerCase()];

  if (!config) {
    notFound();
  }

  const allDestinations = destinationsData as unknown as Destination[];
  const divisionDestinations = allDestinations
    .filter((d) => d.division.toLowerCase() === config.name.toLowerCase())
    .sort((a, b) => {
      const pA = typeof a.popularity === "number" ? a.popularity : 0;
      const pB = typeof b.popularity === "number" ? b.popularity : 0;
      if (pB !== pA) return pB - pA;
      if (b.rating !== a.rating) return b.rating - a.rating;
      return a.name.localeCompare(b.name);
    });

  const trData = translationsData as Record<string, any>;

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: `${SITE_URL}/`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Destinations",
        item: `${SITE_URL}/destinations`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: `${config.name} Division`,
        item: `${SITE_URL}/destinations/division/${config.slug}`,
      },
    ],
  };

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${config.name} Division Tourist Attractions`,
    description: config.description,
    numberOfItems: divisionDestinations.length,
    itemListElement: divisionDestinations.map((d, index) => {
      const img = getDestinationImage(d);
      const item: Record<string, any> = {
        "@type": "ListItem",
        position: index + 1,
        name: d.name,
        url: `${SITE_URL}/destinations/${d.slug}`,
        description: d.shortDesc,
      };
      if (img) {
        item.image = `${SITE_URL}${img}`;
      }
      return item;
    }),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />

      <div className="py-8 sm:py-12 bg-[var(--background)] min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          {/* Back Link & Breadcrumbs */}
          <div className="flex items-center gap-2 text-xs font-bold text-[#0f4a38] dark:text-[#2ecc71]">
            <Link
              href="/destinations"
              className="inline-flex items-center gap-1.5 hover:underline"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>All Destinations</span>
            </Link>
            <span className="text-[var(--text-muted)]">/</span>
            <span className="text-[var(--text-muted)]">Divisions</span>
            <span className="text-[var(--text-muted)]">/</span>
            <span className="text-foreground">{config.name}</span>
          </div>

          {/* Hero Header Block with Unique H1 & Fact-Based Intro */}
          <div className="p-6 sm:p-10 rounded-3xl bg-[var(--surface)] border border-[var(--glass-border)] shadow-sm space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0f4a38]/10 text-[#0f4a38] dark:bg-[#1f9d76]/20 dark:text-[#2ecc71] text-xs font-bold">
              <Compass className="w-4 h-4 text-[#f4a340]" />
              <span>Division Travel Guide</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-foreground tracking-tight">
              {config.title}
            </h1>

            <p className="text-sm sm:text-base text-[var(--text-muted)] max-w-4xl leading-relaxed">
              {config.intro}
            </p>

            <div className="pt-2 flex items-center gap-4 text-xs font-bold text-[var(--text-muted)]">
              <span className="inline-flex items-center gap-1.5 text-foreground">
                <MapPin className="w-4 h-4 text-[#f4a340]" />
                {divisionDestinations.length} Curated Tourist Spots
              </span>
              <span>•</span>
              <span>Curated spots &amp; travel tips</span>
            </div>
          </div>

          {/* Destination Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {divisionDestinations.map((destination, idx) => {
              const tr = trData[destination.slug];
              const destWithTr = {
                ...destination,
                shortDesc_bn: tr?.shortDesc,
                recommendedDays_bn: tr?.recommendedDays,
              };
              return (
                <DestinationCard
                  key={destination.id}
                  destination={destWithTr}
                  priority={idx < 4}
                />
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
