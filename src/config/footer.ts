// Footer Configuration & External Links
// Easily edit social links, legal pages, creator credit, and attribution here.

export interface FooterLegalLink {
  label: string;
  label_bn: string;
  href: string;
}

export interface FooterSocialLink {
  name: string;
  href: string;
  platform: "facebook" | "instagram" | "youtube";
}

export const FOOTER_CONFIG = {
  // Creator Credit
  creator: {
    name: "Sakib",
    credit: "Created by Sakib",
    credit_bn: "সাকিব কর্তৃক নির্মিত",
  },

  // Legal & Contact Links
  legalLinks: [
    {
      label: "Contact",
      label_bn: "যোগাযোগ",
      href: "/contact",
    },
    {
      label: "Privacy Policy",
      label_bn: "গোপনীয়তা নীতি",
      href: "/privacy",
    },
    {
      label: "Terms of Service",
      label_bn: "শর্তাবলী",
      href: "/terms",
    },
  ] as FooterLegalLink[],

  // Social Media Links
  socialLinks: [
    {
      name: "Facebook",
      href: "https://facebook.com/ghuraghuri.bd",
      platform: "facebook",
    },
    {
      name: "Instagram",
      href: "https://instagram.com/ghuraghuri.bd",
      platform: "instagram",
    },
    {
      name: "YouTube",
      href: "https://youtube.com/@ghuraghuri",
      platform: "youtube",
    },
  ] as FooterSocialLink[],

  // Attribution Data
  attribution: {
    osmText: "© OpenStreetMap contributors",
    osmText_bn: "© ওপেনস্ট্রিটম্যাপ অবদানকারী",
    osmUrl: "https://www.openstreetmap.org/copyright",
  },
};
