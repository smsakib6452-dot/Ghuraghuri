import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import destinationsData from "@/data/destinations.json";
import translationsData from "@/data/translations.json";
import { Destination } from "@/types/destination";
import { DestinationCard } from "@/components/destinations/DestinationCard";
import { buildRouteMetadata } from "@/lib/seo";
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
      "Chattogram is Bangladesh's southeastern wonderland, blessed with the world's longest natural sea beach at Cox's Bazar and the cloud-kissed peaks of Sajek Valley and Bandarban. From cascading waterfalls in deep hill tracts to the scenic Marine Drive along the Bay of Bengal, it offers boundless adventure. Explore all 110 curated destinations across this vibrant division.",
    heroImage: "/assets/destinations/coxs-bazar.webp",
  },
  sylhet: {
    name: "Sylhet",
    nameBn: "সিলেট",
    slug: "sylhet",
    title: "Sylhet Travel Guide: Best Places to Visit",
    description:
      "Discover Sylhet's 30 destinations: rolling Sreemangal tea hills, crystal Ratargul swamp forests, roaring waterfalls, and Tanguar Haor houseboats.",
    intro:
      "Sylhet is the emerald jewel of northeastern Bangladesh, renowned for rolling tea gardens in Sreemangal and mystical freshwater swamp forests at Ratargul. High rainfall feeds magnificent cascades like Madhabkunda alongside vast wetlands at Tanguar Haor where houseboats glide beneath mountain borders. Discover all 30 authentic destinations across Sylhet.",
    heroImage: "/assets/destinations/srimangal.webp",
  },
  khulna: {
    name: "Khulna",
    nameBn: "খুলনা",
    slug: "khulna",
    title: "Khulna Travel Guide: Best Places to Visit",
    description:
      "Explore Khulna's 22 destinations: Sundarbans mangrove world heritage, royal Bengal tiger trails, and historic Sixty Dome Mosque in Bagerhat.",
    intro:
      "Khulna division is home to the world's largest contiguous mangrove ecosystem, the Sundarbans UNESCO World Heritage Site. Travel through tidal waterways where the Royal Bengal tiger roams, and visit Bagerhat's historic mosques built during the Bengal Sultanate. Explore all 22 handpicked destinations across Khulna.",
    heroImage: "/assets/destinations/sundarbans.webp",
  },
  barishal: {
    name: "Barishal",
    nameBn: "বরিশাল",
    slug: "barishal",
    title: "Barishal Travel Guide: Best Places to Visit",
    description:
      "Discover Barishal's 19 destinations: Kuakata panoramic sunrise and sunset beach, floating guava markets, and serene southern riverways.",
    intro:
      "Barishal is the Venice of Bengal, celebrated for its labyrinth of meandering rivers, floating guava markets, and lush tidal floodplains. At Kuakata's southern shoreline, witness the rare spectacle of both sunrise and sunset over the ocean from the same beach. Discover all 19 unique destinations across Barishal.",
    heroImage: "/assets/destinations/kuakata.webp",
  },
  dhaka: {
    name: "Dhaka",
    nameBn: "ঢাকা",
    slug: "dhaka",
    title: "Dhaka Travel Guide: Best Places to Visit",
    description:
      "Explore Dhaka's 56 destinations: Lalbagh Fort, Ahsan Manzil palace, historic Panam City, and cultural riverfronts across central Bangladesh.",
    intro:
      "Dhaka division pulses at the historical and cultural center of Bangladesh, spanning over four centuries of Mughal, colonial, and contemporary heritage. From the terracotta grandeur of Panam City to the iconic Lalbagh Fort and Ahsan Manzil on the Buriganga riverfront, history lives here. Explore all 56 curated destinations across Dhaka.",
    heroImage: "/assets/destinations/ahsan-manzil.webp",
  },
  rajshahi: {
    name: "Rajshahi",
    nameBn: "রাজশাহী",
    slug: "rajshahi",
    title: "Rajshahi Travel Guide: Best Places to Visit",
    description:
      "Discover Rajshahi's 27 destinations: ancient terracotta temples of Puthia, Somapura Mahavihara Buddhist ruins, and the majestic Padma riverfront.",
    intro:
      "Rajshahi division is a treasure trove of ancient civilisations, famous for the UNESCO World Heritage Buddhist vihara at Paharpur and the terracotta masterpieces of Puthia. Bordered by the mighty Padma River and fertile mango orchards, it represents the classical artistic soul of northern Bengal. Explore all 27 destinations across Rajshahi.",
    heroImage: "/assets/destinations/puthia-temple-complex.webp",
  },
  rangpur: {
    name: "Rangpur",
    nameBn: "রংপুর",
    slug: "rangpur",
    title: "Rangpur Travel Guide: Best Places to Visit",
    description:
      "Explore Rangpur's 19 destinations: majestic Tajhat Palace, Kantajew terracotta temple, Teesta Barrage, and northern Himalayan borderlands.",
    intro:
      "Rangpur division stretches across the northern expanse of Bangladesh, boasting the ornate Roman-influenced Tajhat Palace and the legendary 18th-century Kantajew terracotta temple. With tea gardens stretching to Panchagarh and views toward the Himalayas, this tranquil region beckons. Discover all 19 destinations across Rangpur.",
    heroImage: "/assets/destinations/tajhat-palace.webp",
  },
  mymensingh: {
    name: "Mymensingh",
    nameBn: "ময়মনসিংহ",
    slug: "mymensingh",
    title: "Mymensingh Travel Guide: Best Places to Visit",
    description:
      "Discover Mymensingh's 12 destinations: pristine white clay hills of Birishiri, scenic Garo hill tracks, and historic Brahmaputra riverfronts.",
    intro:
      "Mymensingh division lies along the emerald foothills of the Garo Hills and Meghalaya border, famed for the turquoise waters of Birishiri's white clay lake. Folk traditions, botanical sanctuaries, and the historic banks of the Old Brahmaputra river offer serene escapes. Explore all 12 curated destinations across Mymensingh.",
    heroImage: "/assets/destinations/birishiri.webp",
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

  return (
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

        {/* Hero Header Block with Unique H1 & 2-3 Sentence Intro */}
        <div className="p-6 sm:p-10 rounded-3xl bg-[var(--surface)] border border-[var(--glass-border)] shadow-sm space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0f4a38]/10 text-[#0f4a38] dark:bg-[#1f9d76]/20 dark:text-[#2ecc71] text-xs font-bold">
            <Compass className="w-4 h-4 text-[#f4a340]" />
            <span>Official Division Travel Guide</span>
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
            <span>Local Photography & Complete Itineraries</span>
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
  );
}
