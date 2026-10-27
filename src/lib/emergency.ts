// Centralized Emergency Contacts & Safety Configuration
// Single source of truth for all emergency numbers across Ghuraghuri.

export interface EmergencyContactItem {
  id: string;
  name: string;
  name_bn: string;
  display: string;
  displayBn: string;
  telLink: string;
  note: string;
  note_bn: string;
  officialUrl?: string;
}

export const EMERGENCY_CONFIG = {
  // National 24/7 Emergency Services
  nationalEmergency: {
    id: "national-emergency",
    name: "National Emergency Service",
    name_bn: "জাতীয় জরুরি সেবা",
    display: "999",
    displayBn: "৯৯৯",
    telLink: "tel:999",
    note: "Police, Fire, Ambulance (Toll-Free 24/7)",
    note_bn: "পুলিশ, ফায়ার সার্ভিস ও অ্যাম্বুলেন্স (টোল-ফ্রি ২৪/৭)",
    officialUrl: "https://nhd.gov.bd",
  },

  // Official Bangladesh Tourist Police 24/7 Helpline
  touristPolice: {
    id: "tourist-police-helpline",
    name: "Bangladesh Tourist Police 24/7 Helpline",
    name_bn: "বাংলাদেশ ট্যুরিস্ট পুলিশ ২৪/৭ হেল্পলাইন",
    display: "01320-222222",
    displayBn: "০১৩২০-২২২২২২",
    telLink: "tel:+8801320222222",
    note: "Dedicated Tourist Safety & Rapid Response",
    note_bn: "সার্বক্ষণিক পর্যটক নিরাপত্তা ও তাৎক্ষণিক সহায়তা",
    officialUrl: "https://touristpolice.gov.bd",
  },

  // Official Tourist Police Portal
  touristPoliceOfficialUrl: "https://touristpolice.gov.bd",
  officialPortalTitle: "Official Tourist Police portal",
  officialPortalTitleBn: "অফিসিয়াল ট্যুরিস্ট পুলিশ পোর্টাল",
};
