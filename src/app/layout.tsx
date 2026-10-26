import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Hind_Siliguri } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BackToTop } from "@/components/common/BackToTop";
import { JsonLd, getWebsiteSchema, getOrganizationSchema } from "@/components/seo/JsonLd";
import { TOTAL_DESTINATIONS } from "@/lib/constants";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-sans",
});

const hindSiliguri = Hind_Siliguri({
  subsets: ["bengali"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-bengali",
});

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#0f4a38" },
    { media: "(prefers-color-scheme: dark)", color: "#061510" },
  ],
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: "Ghuraghuri — Bangladesh Travel Explorer | ঘুরাঘুরি",
    template: "%s | Ghuraghuri",
  },
  description:
    `Explore ${TOTAL_DESTINATIONS}+ authentic destinations across 8 divisions of Bangladesh. Discover authentic local photography, cultural heritage, hill tracks, mangroves, and complete travel guides.`,
  keywords: [
    "Bangladesh travel",
    "Ghuraghuri",
    "ঘুরাঘুরি",
    "Bangladesh tourist places",
    "Cox's Bazar",
    "Sajek Valley",
    "Sundarbans",
    "Sylhet travel",
    "Chattogram travel",
    "travel guide Bangladesh",
  ],
  authors: [{ name: "Ghuraghuri Travel Technologies" }],
  creator: "Ghuraghuri",
  metadataBase: new URL("https://ghuraghuri.com"),
  openGraph: {
    type: "website",
    locale: "bn_BD",
    alternateLocale: "en_US",
    url: "https://ghuraghuri.com",
    siteName: "Ghuraghuri",
    title: "Ghuraghuri — Bangladesh Travel Explorer",
    description: `Discover ${TOTAL_DESTINATIONS}+ authentic tourist spots, pristine beaches, hills, and heritage sites of Bangladesh.`,
    images: [
      {
        url: "/assets/destinations/sajek-valley.webp",
        width: 1200,
        height: 630,
        alt: "Sajek Valley — Ghuraghuri",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ghuraghuri — Bangladesh Travel Explorer",
    description: `Discover ${TOTAL_DESTINATIONS}+ authentic tourist spots across Bangladesh.`,
    images: ["/assets/destinations/sajek-valley.webp"],
  },
  icons: {
    icon: "/favicon.svg",
    apple: "/assets/logo.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){
  try {
    var l = localStorage.getItem('ghuraghuri_lang') || 'en';
    document.documentElement.lang = l;
    var t = localStorage.getItem('ghuraghuri_theme');
    if (!t && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      t = 'dark';
    }
    if (t) {
      document.documentElement.setAttribute('data-theme', t);
    }
  } catch(e) {}
})();`,
          }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Hind+Siliguri:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        suppressHydrationWarning
        className={`${plusJakartaSans.variable} ${hindSiliguri.variable} font-sans min-h-screen flex flex-col bg-[#fbfdfc] dark:bg-[#061510] text-[#0d211a] dark:text-[#f0f7f4] antialiased selection:bg-[#0f4a38] selection:text-white`}
      >
        <JsonLd data={[getWebsiteSchema(), getOrganizationSchema()]} id="jsonld-root-schema" />
        <AppProvider>
          <Header />
          <main id="main-content" className="flex-1 w-full" tabIndex={-1}>
            {children}
          </main>
          <Footer />
          <BackToTop />
        </AppProvider>
      </body>
    </html>
  );
}