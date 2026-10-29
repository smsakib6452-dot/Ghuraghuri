"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Train,
  Bus,
  Ticket,
  Clock,
  CheckCircle2,
  Printer,
  Trash2,
  X,
  ExternalLink,
  ChevronRight,
  ShieldAlert,
  Compass,
  PhoneCall,
  MessageCircle,
} from "lucide-react";

export const ENABLE_BOOKING_DEMO = false;

export const OPERATOR_CONTACTS: Record<string, { phone: string; whatsapp?: string; portalUrl: string }> = {
  "Green Line Paribahan": { phone: "01730-060000", whatsapp: "8801730060000", portalUrl: "https://greenlinebd.com" },
  "Hanif Enterprise": { phone: "01713-402673", whatsapp: "8801713402673", portalUrl: "https://shohoz.com" },
  "Shohag Elite": { phone: "01711-612433", whatsapp: "8801711612433", portalUrl: "https://shohoz.com" },
  "Shohag Paribahan": { phone: "01711-612433", whatsapp: "8801711612433", portalUrl: "https://shohoz.com" },
  "Desh Travels": { phone: "01762-684400", whatsapp: "8801762684400", portalUrl: "https://deshtravelsbd.com" },
  "Shyamoli Paribahan": { phone: "01711-440498", whatsapp: "8801711440498", portalUrl: "https://shohoz.com" },
  "Ena Transport": { phone: "01869-802728", whatsapp: "8801869802728", portalUrl: "https://shohoz.com" },
  "Saintmartin Paribahan": { phone: "01711-300444", whatsapp: "8801711300444", portalUrl: "https://shohoz.com" },
  "Shanti Paribahan": { phone: "01819-866405", whatsapp: "8801819866405", portalUrl: "https://shohoz.com" },
  "Sakura Paribahan": { phone: "01711-010450", whatsapp: "8801711010450", portalUrl: "https://shohoz.com" },
  "National Travels": { phone: "01711-418854", whatsapp: "8801711418854", portalUrl: "https://shohoz.com" },
  "Bangladesh Railway": { phone: "131", portalUrl: "https://eticket.railway.gov.bd" },
  "MV Manami Launch": { phone: "01711-058885", whatsapp: "8801711058885", portalUrl: "https://shohoz.com/launch" },
  "MV Sundarban 16": { phone: "01711-058886", whatsapp: "8801711058886", portalUrl: "https://shohoz.com/launch" },
  "Biman Bangladesh Airlines": { phone: "13636", portalUrl: "https://www.biman-airlines.com" },
  "US-Bangla Airlines": { phone: "13605", portalUrl: "https://usbair.com" },
};

export type ScheduleItem = {
  id: string;
  type: "bus" | "train" | "ferry" | "flight";
  operator: string;
  coach: string;
  depart: string;
  arrive: string;
  fare: number;
  seatsLeft: number;
  rating?: number;
  lastChecked?: string;
  boarding: string[];
  dropping: string[];
};

export type BookingVoucher = {
  ref: string;
  category: "transport" | "hotel" | "restaurant";
  title: string;
  route?: string;
  address?: string;
  pnr?: string;
  date: string;
  time?: string;
  coachBogie?: string;
  coachClass?: string;
  seats?: string[];
  room?: string;
  nights?: number;
  rooms?: number;
  guests?: number;
  diningSlot?: string;
  boarding?: string;
  dropping?: string;
  passenger?: string;
  guest?: string;
  phone: string;
  email?: string;
  total: number;
  bookedAt: string;
};

const SCHEDULES: Record<string, ScheduleItem[]> = {
  "dhaka-coxs-bazar": [
    { id: "b1", type: "bus", operator: "Green Line Paribahan", coach: "Scania Multi-Axle (AC Sleeper)", depart: "08:00 AM", arrive: "05:00 PM", fare: 2200, seatsLeft: 8, rating: 4.8, boarding: ["Sayedabad", "Arambagh", "Rajarbagh"], dropping: ["Kolatali Point", "Sugandha Beach"] },
    { id: "b2", type: "bus", operator: "Hanif Enterprise", coach: "Volvo B11R 1J (AC Executive)", depart: "09:30 AM", arrive: "06:30 PM", fare: 1600, seatsLeft: 14, rating: 4.5, boarding: ["Sayedabad", "Gabtoli", "Panthapath"], dropping: ["Jhawtola", "Kolatali"] },
    { id: "b3", type: "bus", operator: "Shohag Elite", coach: "Scania Comfort Sleeper", depart: "08:30 PM", arrive: "05:30 AM", fare: 2400, seatsLeft: 6, rating: 4.9, boarding: ["Malibagh", "Arambagh"], dropping: ["Hotel Motel Zone", "Kolatali"] },
    { id: "b4", type: "bus", operator: "Desh Travels", coach: "Hyundai Universe Suite (AC)", depart: "10:15 PM", arrive: "07:00 AM", fare: 1800, seatsLeft: 11, rating: 4.7, boarding: ["Arambagh", "Sayedabad"], dropping: ["Kolatali Beach", "Laboni Point"] },
    { id: "b5", type: "bus", operator: "Shyamoli Paribahan", coach: "Hino AK1J (Economy Non-AC)", depart: "11:00 PM", arrive: "08:30 AM", fare: 900, seatsLeft: 22, rating: 4.2, boarding: ["Sayedabad", "Arambagh", "Gabtoli"], dropping: ["Cox's Bazar Central", "Jhawtola"] },
    { id: "t1", type: "train", operator: "Bangladesh Railway", coach: "Cox's Bazar Express (814) - Snigdha AC", depart: "06:15 AM", arrive: "03:00 PM", fare: 1325, seatsLeft: 18, rating: 4.9, boarding: ["Kamalapur Railway Station", "Dhaka Airport"], dropping: ["Cox's Bazar Iconic Station"] },
    { id: "t2", type: "train", operator: "Bangladesh Railway", coach: "Tourist Express (816) - Shovon Chair", depart: "06:15 PM", arrive: "03:20 AM", fare: 695, seatsLeft: 26, rating: 4.7, boarding: ["Kamalapur Railway Station", "Dhaka Airport"], dropping: ["Cox's Bazar Iconic Station"] },
    { id: "t3", type: "train", operator: "Bangladesh Railway", coach: "Cox's Bazar Express (813) - AC Berth / Cabin", depart: "10:30 PM", arrive: "07:15 AM", fare: 2350, seatsLeft: 8, rating: 4.9, boarding: ["Kamalapur Railway Station", "Dhaka Airport"], dropping: ["Cox's Bazar Iconic Station"] },
    { id: "f1", type: "flight", operator: "Biman Bangladesh Airlines", coach: "Boeing 737-800 (BG-433)", depart: "11:30 AM", arrive: "12:35 PM", fare: 4800, seatsLeft: 7, rating: 4.7, boarding: ["Hazrat Shahjalal International Airport (DAC)"], dropping: ["Cox's Bazar Airport (CXB)"] },
    { id: "f2", type: "flight", operator: "US-Bangla Airlines", coach: "ATR 72-600 (BS-141)", depart: "02:15 PM", arrive: "03:20 PM", fare: 5200, seatsLeft: 5, rating: 4.6, boarding: ["Hazrat Shahjalal International Airport (DAC)"], dropping: ["Cox's Bazar Airport (CXB)"] }
  ],
  "dhaka-chattogram": [
    { id: "b11", type: "bus", operator: "Green Line Paribahan", coach: "Scania Multi-Axle AC", depart: "07:30 AM", arrive: "01:00 PM", fare: 1400, seatsLeft: 12, rating: 4.8, boarding: ["Rajarbagh", "Sayedabad"], dropping: ["Dampara", "GEC Circle"] },
    { id: "b12", type: "bus", operator: "Shohag Paribahan", coach: "Mercedes-Benz AC Coach", depart: "09:00 AM", arrive: "02:30 PM", fare: 1350, seatsLeft: 10, rating: 4.7, boarding: ["Malibagh", "Arambagh"], dropping: ["Dampara", "Agrabad"] },
    { id: "b13", type: "bus", operator: "Hanif Enterprise", coach: "Hino 1J AC Coach", depart: "11:00 AM", arrive: "04:30 PM", fare: 1100, seatsLeft: 16, rating: 4.5, boarding: ["Panthapath", "Sayedabad"], dropping: ["Alankar", "Dampara"] },
    { id: "t11", type: "train", operator: "Bangladesh Railway", coach: "Suborno Express (702) - Snigdha AC", depart: "04:30 PM", arrive: "09:50 PM", fare: 805, seatsLeft: 15, rating: 4.9, boarding: ["Kamalapur", "Dhaka Airport"], dropping: ["Chattogram Railway Station"] },
    { id: "t12", type: "train", operator: "Bangladesh Railway", coach: "Sonar Bangla Express (788) - AC Chair", depart: "07:00 AM", arrive: "12:15 PM", fare: 805, seatsLeft: 21, rating: 4.8, boarding: ["Kamalapur", "Dhaka Airport"], dropping: ["Chattogram Railway Station"] },
    { id: "t13", type: "train", operator: "Bangladesh Railway", coach: "Turna Express (742) - AC Berth / Cabin", depart: "11:30 PM", arrive: "05:15 AM", fare: 1550, seatsLeft: 12, rating: 4.7, boarding: ["Kamalapur", "Dhaka Airport"], dropping: ["Chattogram Railway Station"] },
    { id: "t14", type: "train", operator: "Bangladesh Railway", coach: "Mahanagar Provati (704) - Shovon Chair", depart: "07:45 AM", arrive: "02:00 PM", fare: 405, seatsLeft: 35, rating: 4.4, boarding: ["Kamalapur", "Airport"], dropping: ["Chattogram Railway Station"] }
  ],
  "dhaka-sylhet": [
    { id: "b21", type: "bus", operator: "Green Line Paribahan", coach: "Scania Multi-Axle AC", depart: "07:45 AM", arrive: "01:45 PM", fare: 1400, seatsLeft: 10, rating: 4.8, boarding: ["Rajarbagh", "Sayedabad"], dropping: ["Kadamtoli", "Subidbazar"] },
    { id: "b22", type: "bus", operator: "Ena Transport", coach: "Hyundai Universe Suite AC", depart: "09:30 AM", arrive: "03:30 PM", fare: 1100, seatsLeft: 18, rating: 4.5, boarding: ["Mohakhali", "Uttara"], dropping: ["Kadamtoli", "Humayun Rashid Chattar"] },
    { id: "t21", type: "train", operator: "Bangladesh Railway", coach: "Parabat Express (709) - Snigdha AC", depart: "06:20 AM", arrive: "01:00 PM", fare: 736, seatsLeft: 12, rating: 4.7, boarding: ["Kamalapur", "Airport"], dropping: ["Sylhet Railway Station"] },
    { id: "t22", type: "train", operator: "Bangladesh Railway", coach: "Upaban Express (739) - Shovon Chair", depart: "08:30 PM", arrive: "03:45 AM", fare: 375, seatsLeft: 30, rating: 4.4, boarding: ["Kamalapur", "Airport"], dropping: ["Sylhet Railway Station"] },
    { id: "t23", type: "train", operator: "Bangladesh Railway", coach: "Kalni Express (773) - AC Chair", depart: "03:00 PM", arrive: "09:30 PM", fare: 736, seatsLeft: 16, rating: 4.6, boarding: ["Kamalapur", "Airport"], dropping: ["Sylhet Railway Station"] },
    { id: "t24", type: "train", operator: "Bangladesh Railway", coach: "Jayantika Express (717) - AC Cabin / Berth", depart: "11:15 AM", arrive: "06:50 PM", fare: 1450, seatsLeft: 9, rating: 4.8, boarding: ["Kamalapur", "Airport"], dropping: ["Sylhet Railway Station"] }
  ],
  "dhaka-sajek": [
    { id: "b31", type: "bus", operator: "Saintmartin Paribahan", coach: "Hino 1J AC (Direct Khagrachhari)", depart: "10:30 PM", arrive: "06:30 AM", fare: 1200, seatsLeft: 14, rating: 4.7, boarding: ["Arambagh", "Sayedabad"], dropping: ["Khagrachhari (Direct Chander Gari connection)"] },
    { id: "b32", type: "bus", operator: "Shanti Paribahan", coach: "Non-AC Hino (Direct Hill Express)", depart: "11:00 PM", arrive: "07:30 AM", fare: 750, seatsLeft: 20, rating: 4.3, boarding: ["Gabtoli", "Sayedabad"], dropping: ["Khagrachhari Bus Terminal"] },
    { id: "b33", type: "bus", operator: "Ena Transport", coach: "Hyundai AC Coach", depart: "11:15 PM", arrive: "07:00 AM", fare: 1150, seatsLeft: 8, rating: 4.6, boarding: ["Sayedabad"], dropping: ["Khagrachhari Sadar"] }
  ],
  "dhaka-barishal": [
    { id: "l1", type: "ferry", operator: "MV Manami Launch", coach: "VIP & Deluxe AC Cabin", depart: "08:30 PM", arrive: "05:00 AM", fare: 1800, seatsLeft: 15, rating: 4.9, boarding: ["Sadarghat Launch Terminal"], dropping: ["Barishal River Port"] },
    { id: "l2", type: "ferry", operator: "MV Sundarban 16", coach: "Single & Double AC Cabin", depart: "09:00 PM", arrive: "05:30 AM", fare: 1500, seatsLeft: 22, rating: 4.8, boarding: ["Sadarghat Launch Terminal"], dropping: ["Barishal River Port"] },
    { id: "b41", type: "bus", operator: "Sakura Paribahan", coach: "Hino 1J AC via Padma Bridge", depart: "08:00 AM", arrive: "11:45 AM", fare: 750, seatsLeft: 16, rating: 4.5, boarding: ["Gabtoli", "Sayedabad"], dropping: ["Nathullabad Bus Terminal"] }
  ],
  "dhaka-rajshahi": [
    { id: "t31", type: "train", operator: "Bangladesh Railway", coach: "Padma Express (759) - Snigdha AC", depart: "11:00 PM", arrive: "04:30 AM", fare: 805, seatsLeft: 18, rating: 4.8, boarding: ["Kamalapur", "Dhaka Airport"], dropping: ["Rajshahi Railway Station"] },
    { id: "t32", type: "train", operator: "Bangladesh Railway", coach: "Silk City Express (753) - Shovon Chair", depart: "02:40 PM", arrive: "08:35 PM", fare: 415, seatsLeft: 25, rating: 4.6, boarding: ["Kamalapur", "Dhaka Airport"], dropping: ["Rajshahi Railway Station"] },
    { id: "t33", type: "train", operator: "Bangladesh Railway", coach: "Dhumketu Express (769) - AC Berth / Cabin", depart: "06:00 AM", arrive: "11:40 AM", fare: 1450, seatsLeft: 10, rating: 4.7, boarding: ["Kamalapur", "Dhaka Airport"], dropping: ["Rajshahi Railway Station"] },
    { id: "b51", type: "bus", operator: "National Travels", coach: "Scania Multi-Axle AC", depart: "08:30 AM", arrive: "02:30 PM", fare: 1200, seatsLeft: 14, rating: 4.7, boarding: ["Gabtoli", "Kalyanpur"], dropping: ["Shiroil Bus Terminal"] }
  ],
  "dhaka-khulna": [
    { id: "t41", type: "train", operator: "Bangladesh Railway", coach: "Sundarban Express (725) - Snigdha AC via Padma Bridge", depart: "08:15 AM", arrive: "03:50 PM", fare: 920, seatsLeft: 20, rating: 4.8, boarding: ["Kamalapur"], dropping: ["Khulna Railway Station"] },
    { id: "t42", type: "train", operator: "Bangladesh Railway", coach: "Benapole Express (795) - AC Cabin", depart: "11:45 PM", arrive: "06:10 AM", fare: 1650, seatsLeft: 8, rating: 4.9, boarding: ["Kamalapur"], dropping: ["Benapole / Khulna"] },
    { id: "t43", type: "train", operator: "Bangladesh Railway", coach: "Chitra Express (763) - Shovon Chair", depart: "07:00 PM", arrive: "02:30 AM", fare: 465, seatsLeft: 28, rating: 4.5, boarding: ["Kamalapur"], dropping: ["Khulna Railway Station"] }
  ],
  "dhaka-rangpur": [
    { id: "t51", type: "train", operator: "Bangladesh Railway", coach: "Rangpur Express (771) - Snigdha AC", depart: "09:10 AM", arrive: "07:05 PM", fare: 995, seatsLeft: 14, rating: 4.7, boarding: ["Kamalapur", "Dhaka Airport"], dropping: ["Rangpur Railway Station"] },
    { id: "t52", type: "train", operator: "Bangladesh Railway", coach: "Kurigram Express (797) - Shovon Chair", depart: "08:45 PM", arrive: "06:15 AM", fare: 510, seatsLeft: 22, rating: 4.6, boarding: ["Kamalapur", "Dhaka Airport"], dropping: ["Rangpur / Kurigram Station"] }
  ]
};

const BOGIES = ["ক (Ka)", "খ (Kha)", "গ (Ga)", "ঘ (Gha)", "ঙ (Uma)", "চ (Cha)", "ছ (Chha)", "জ (Ja)"];
const STORAGE_KEY = "ghuraghuri_user_bookings";

interface BookingEngineProps {
  initialCorridor?: string;
  currentDestination: string;
  isBn: boolean;
  externalTrigger?: {
    type: "hotel" | "restaurant";
    item: { name: string; address: string; price?: number };
  } | null;
  onClearTrigger?: () => void;
}

function getCorridorFromDestination(dest?: string): string {
  const q = (dest || "").toLowerCase();
  if (q.includes("cox")) return "dhaka-coxs-bazar";
  if (q.includes("chat") || q.includes("ctg") || q.includes("পতেঙ্গা") || q.includes("চট্টগ্রাম")) return "dhaka-chattogram";
  if (q.includes("sylhet") || q.includes("সিলেট") || q.includes("sreemangal") || q.includes("শ্রীমঙ্গল") || q.includes("jaflong") || q.includes("tanguar")) return "dhaka-sylhet";
  if (q.includes("sajek") || q.includes("সাজেক") || q.includes("khagrachhari") || q.includes("খাগড়াছড়ি")) return "dhaka-sajek";
  if (q.includes("barishal") || q.includes("বরিশাল") || q.includes("kuakata") || q.includes("কুয়াকাটা")) return "dhaka-barishal";
  if (q.includes("rajshahi") || q.includes("রাজশাহী") || q.includes("bogura") || q.includes("বগুড়া")) return "dhaka-rajshahi";
  if (q.includes("khulna") || q.includes("খুলনা") || q.includes("sundarban") || q.includes("সুন্দরবন")) return "dhaka-khulna";
  if (q.includes("rangpur") || q.includes("রংপুর") || q.includes("dinajpur") || q.includes("দিনাজপুর")) return "dhaka-rangpur";
  return "dhaka-coxs-bazar";
}

export default function BookingEngine({
  initialCorridor = "dhaka-coxs-bazar",
  currentDestination,
  isBn,
  externalTrigger,
  onClearTrigger,
}: BookingEngineProps) {
  // Corridor resolution (React 19 pure state adjustment from props)
  const [prevDestination, setPrevDestination] = useState(currentDestination);
  const [activeCorridor, setActiveCorridor] = useState<string>(() => 
    currentDestination ? getCorridorFromDestination(currentDestination) : initialCorridor
  );

  if (currentDestination !== prevDestination) {
    setPrevDestination(currentDestination);
    setActiveCorridor(getCorridorFromDestination(currentDestination));
  }

  // Modal States
  const [activeModal, setActiveModal] = useState<"transport" | "hotel" | "restaurant" | "confirmation" | "myBookings" | null>(null);
  const [selectedSchedule, setSelectedSchedule] = useState<ScheduleItem | null>(null);

  // Seat Picker States
  const [selectedBogie, setSelectedBogie] = useState<string>("ক (Ka)");
  const [selectedClass, setSelectedClass] = useState<"snigdha" | "shovon" | "berth">("snigdha");
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [passengerName, setPassengerName] = useState<string>("");
  const [passengerPhone, setPassengerPhone] = useState<string>("");
  const [boardingPoint, setBoardingPoint] = useState<string>("");

  // Hotel Booking Modal State
  const [hotelItem, setHotelItem] = useState<{ name: string; address: string; price: number } | null>(null);
  const [htRoomMultiplier, setHtRoomMultiplier] = useState<number>(1.0);
  const [htRoomTitle, setHtRoomTitle] = useState<string>("Standard Deluxe Room");
  const [htCheckIn, setHtCheckIn] = useState<string>(() => new Date().toISOString().split("T")[0]);
  const [htCheckOut, setHtCheckOut] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split("T")[0];
  });
  const [htRooms, setHtRooms] = useState<number>(1);
  const [htGuests, setHtGuests] = useState<number>(2);
  const [htName, setHtName] = useState<string>("");
  const [htPhone, setHtPhone] = useState<string>("");

  // Restaurant Reservation Modal State
  const [restItem, setRestItem] = useState<{ name: string; address: string } | null>(null);
  const [rtDate, setRtDate] = useState<string>(() => new Date().toISOString().split("T")[0]);
  const [rtTimeSlot, setRtTimeSlot] = useState<string>("08:00 PM");
  const [rtGuests, setRtGuests] = useState<number>(2);
  const [rtName, setRtName] = useState<string>("");
  const [rtPhone, setRtPhone] = useState<string>("");
  const [rtRequests, setRtRequests] = useState<string>("");

  // Confirmed Voucher & Storage
  const [currentVoucher, setCurrentVoucher] = useState<BookingVoucher | null>(null);
  const [savedBookings, setSavedBookings] = useState<BookingVoucher[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  // Listen for external trigger (e.g. user clicked "Book" on a hotel card in page.tsx)
  const [prevTrigger, setPrevTrigger] = useState(externalTrigger);
  if (externalTrigger && externalTrigger !== prevTrigger) {
    setPrevTrigger(externalTrigger);
    if (externalTrigger.type === "hotel") {
      setHotelItem({
        name: externalTrigger.item.name,
        address: externalTrigger.item.address,
        price: externalTrigger.item.price || 3200,
      });
      setActiveModal("hotel");
    } else if (externalTrigger.type === "restaurant") {
      setRestItem({
        name: externalTrigger.item.name,
        address: externalTrigger.item.address,
      });
      setActiveModal("restaurant");
    }
  }

  useEffect(() => {
    if (externalTrigger && onClearTrigger) {
      onClearTrigger();
    }
  }, [externalTrigger, onClearTrigger]);

  const saveVoucher = (voucher: BookingVoucher) => {
    try {
      const updated = [voucher, ...savedBookings];
      setSavedBookings(updated);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const removeBooking = (ref: string) => {
    const updated = savedBookings.filter((b) => b.ref !== ref);
    setSavedBookings(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  // Helper fare calculation
  const currentTransportFare = useMemo(() => {
    if (!selectedSchedule) return 0;
    const isTrain = selectedSchedule.type === "train";
    if (!isTrain) return selectedSchedule.fare;
    if (selectedClass === "shovon") return Math.round(selectedSchedule.fare * 0.52);
    if (selectedClass === "berth") return Math.round(selectedSchedule.fare * 1.75);
    return selectedSchedule.fare;
  }, [selectedSchedule, selectedClass]);

  const totalTransportPayable = selectedSeats.length * currentTransportFare;

  // Hotel nights calculation
  const htNights = useMemo(() => {
    const inD = new Date(htCheckIn).getTime();
    const outD = new Date(htCheckOut).getTime();
    const diff = Math.round((outD - inD) / 86400000);
    return diff > 0 ? diff : 1;
  }, [htCheckIn, htCheckOut]);

  const totalHotelPayable = useMemo(() => {
    if (!hotelItem) return 0;
    const base = hotelItem.price || 3000;
    return Math.round(base * htRoomMultiplier) * htNights * htRooms;
  }, [hotelItem, htRoomMultiplier, htNights, htRooms]);

  // Handle seat click
  const toggleSeat = (sId: string) => {
    if (selectedSeats.includes(sId)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== sId));
    } else {
      if (selectedSeats.length >= 4) {
        alert(isBn ? "একবারে সর্বোচ্চ ৪টি আসন নির্বাচন করা যায়।" : "Maximum 4 seats can be selected per booking.");
        return;
      }
      setSelectedSeats([...selectedSeats, sId]);
    }
  };

  const openTransportBooking = (item: ScheduleItem) => {
    setSelectedSchedule(item);
    setSelectedSeats([]);
    setSelectedBogie("ক (Ka)");
    setSelectedClass(item.coach.toLowerCase().includes("shovon") ? "shovon" : item.coach.toLowerCase().includes("berth") ? "berth" : "snigdha");
    setBoardingPoint(item.boarding[0] || "Dhaka Central");
    setActiveModal("transport");
  };

  const handleConfirmTransport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSchedule || selectedSeats.length === 0) return;

    const isTrain = selectedSchedule.type === "train";
    const refCode = `${isTrain ? "BR" : "BUS"}-${Math.floor(100000 + Math.random() * 900000)}`;
    const pnrCode = isTrain ? `PNR-${Math.floor(10000000 + Math.random() * 90000000)}` : undefined;

    const voucher: BookingVoucher = {
      ref: refCode,
      pnr: pnrCode,
      category: "transport",
      title: `${selectedSchedule.operator} — ${selectedSchedule.coach}`,
      route: `${activeCorridor.split("-")[0].toUpperCase()} ⇄ ${activeCorridor.split("-")[1].toUpperCase()}`,
      date: new Date().toISOString().split("T")[0],
      time: selectedSchedule.depart,
      coachBogie: isTrain ? selectedBogie : undefined,
      coachClass: isTrain ? (selectedClass === "shovon" ? "Shovon Chair" : selectedClass === "berth" ? "AC Berth/Cabin" : "Snigdha AC") : undefined,
      seats: selectedSeats.map((s) => (isTrain ? `${selectedBogie.split(" ")[0]}-${s}` : s)),
      boarding: boardingPoint,
      dropping: selectedSchedule.dropping[0] || "Destination Hub",
      passenger: passengerName || "Guest Traveler",
      phone: passengerPhone || "01700000000",
      total: totalTransportPayable,
      bookedAt: new Date().toLocaleString(),
    };

    saveVoucher(voucher);
    setCurrentVoucher(voucher);
    setActiveModal("confirmation");
  };

  const handleConfirmHotel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hotelItem) return;

    const refCode = `HTL-${Math.floor(100000 + Math.random() * 900000)}`;
    const voucher: BookingVoucher = {
      ref: refCode,
      category: "hotel",
      title: hotelItem.name,
      address: hotelItem.address,
      room: htRoomTitle,
      date: htCheckIn,
      nights: htNights,
      rooms: htRooms,
      guests: htGuests,
      guest: htName || "Guest Traveler",
      phone: htPhone || "01700000000",
      total: totalHotelPayable,
      bookedAt: new Date().toLocaleString(),
    };

    saveVoucher(voucher);
    setCurrentVoucher(voucher);
    setActiveModal("confirmation");
  };

  const handleConfirmRestaurant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!restItem) return;

    const refCode = `DINE-${Math.floor(100000 + Math.random() * 900000)}`;
    const voucher: BookingVoucher = {
      ref: refCode,
      category: "restaurant",
      title: restItem.name,
      address: restItem.address,
      date: rtDate,
      diningSlot: rtTimeSlot,
      guests: rtGuests,
      guest: rtName || "Diner Guest",
      phone: rtPhone || "01700000000",
      total: 0, // table reserve is free
      bookedAt: new Date().toLocaleString(),
    };

    saveVoucher(voucher);
    setCurrentVoucher(voucher);
    setActiveModal("confirmation");
  };

  const corridorSchedules = SCHEDULES[activeCorridor] || SCHEDULES["dhaka-coxs-bazar"];

  return (
    <section className="space-y-12">
      {/* Corridor Header & Picker */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[var(--surface)] border border-[var(--glass-border)] shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0f4a38]/10 text-[#0f4a38] dark:bg-[#1f9d76]/20 dark:text-[#2ecc71] text-xs font-bold mb-2">
              <Compass className="w-3.5 h-3.5" />
              <span>{isBn ? "প্রচলিত আন্তঃনগর শিডিউল" : "Typical Intercity Schedules (confirm with the operator)"}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-foreground">
              {isBn ? "আন্তঃনগর বাস, ট্রেন ও লঞ্চ শিডিউল" : "Intercity Transit Timetables"}
            </h2>
            <p className="text-sm text-[var(--text-muted)] mt-1">
              {isBn
                ? "কাউন্টারে সরাসরি ফোন বা মেসেজ পাঠিয়ে সময় ও আসন নিশ্চিত করুন অথবা অফিশিয়াল পোর্টালে যান।"
                : "Confirm departure times and seat availability directly with the operator or via official portals."}
            </p>
          </div>

          {/* Corridor Select Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[var(--text-muted)]">{isBn ? "করিডোর:" : "Corridor:"}</span>
            <select
              value={activeCorridor}
              onChange={(e) => setActiveCorridor(e.target.value)}
              className="px-4 py-2.5 rounded-xl bg-[var(--surface-raised)] border border-[var(--glass-border)] text-xs sm:text-sm font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-[#0f4a38]"
            >
              <option value="dhaka-coxs-bazar">ঢাকা ⇄ কক্সবাজার (Cox&apos;s Bazar)</option>
              <option value="dhaka-chattogram">ঢাকা ⇄ চট্টগ্রাম (Chattogram)</option>
              <option value="dhaka-sylhet">ঢাকা ⇄ সিলেট (Sylhet)</option>
              <option value="dhaka-sajek">ঢাকা ⇄ সাজেক (Khagrachhari/Sajek)</option>
              <option value="dhaka-barishal">ঢাকা ⇄ বরিশাল (Barishal Launch/Bus)</option>
              <option value="dhaka-rajshahi">ঢাকা ⇄ রাজশাহী (Rajshahi)</option>
              <option value="dhaka-khulna">ঢাকা ⇄ খুলনা (Khulna)</option>
              <option value="dhaka-rangpur">ঢাকা ⇄ রংপুর (Rangpur)</option>
            </select>
          </div>
        </div>

        {/* Schedule List */}
        <div className="space-y-4">
          {corridorSchedules.map((item) => (
            <div
              key={item.id}
              className="p-5 rounded-2xl bg-[var(--surface-raised)] border border-[var(--glass-border)] hover:border-[#0f4a38]/40 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-4">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                    item.type === "train"
                      ? "bg-[#0f4a38] text-white"
                      : item.type === "bus"
                      ? "bg-[#f4a340]/20 text-[#f4a340]"
                      : item.type === "ferry"
                      ? "bg-[#38bdf8]/20 text-[#38bdf8]"
                      : "bg-[#a78bfa]/20 text-[#a78bfa]"
                  }`}
                >
                  {item.type === "train" ? (
                    <Train className="w-6 h-6" />
                  ) : item.type === "bus" ? (
                    <Bus className="w-6 h-6" />
                  ) : (
                    <Ticket className="w-6 h-6" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm sm:text-base font-black text-foreground">
                      {item.operator}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-xs font-extrabold uppercase bg-[var(--surface)] border border-[var(--glass-border)]">
                      {item.type}
                    </span>
                    {item.lastChecked && (
                      <span className="text-[11px] font-medium text-[var(--text-muted)]">
                        {isBn ? `যাচাই: ${item.lastChecked}` : `Last checked: ${item.lastChecked}`}
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-medium text-[var(--text-muted)] line-clamp-1">
                    {item.coach}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-[var(--text-muted)] mt-2">
                    <span className="flex items-center gap-1 font-semibold text-foreground">
                      <Clock className="w-3.5 h-3.5 text-[#0f4a38] dark:text-[#2ecc71]" />
                      {item.depart} → {item.arrive}
                    </span>
                    {ENABLE_BOOKING_DEMO && (
                      <>
                        <span>•</span>
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                          {item.seatsLeft} {isBn ? "সিট বাকি" : "seats left"}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Price & Real Contact / Action Bar */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between md:justify-end gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-[var(--glass-border)]">
                <div className="text-left md:text-right">
                  <span className="text-xs font-semibold text-[var(--text-muted)] block">{isBn ? "ভাড়া প্রতি সিট" : "Fare / Seat"}</span>
                  <span className="text-lg font-black text-[#0f4a38] dark:text-[#2ecc71]">
                    ৳{item.fare.toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {/* Direct Counter Phone */}
                  <a
                    href={`tel:${(() => {
                      const raw = (OPERATOR_CONTACTS[item.operator]?.phone || "131").replace(/[^0-9+]/g, "");
                      if (raw.length <= 5) return raw;
                      return raw.startsWith("+") ? raw : `+88${raw}`;
                    })()}`}
                    className="min-h-[40px] px-3 py-2 rounded-xl bg-[#0f4a38]/10 hover:bg-[#0f4a38] text-[#0f4a38] hover:text-white dark:bg-[#1f9d76]/20 dark:text-[#2ecc71] dark:hover:bg-[#1f9d76] dark:hover:text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                    title={isBn ? "কাউন্টারে সরাসরি ফোন করুন" : "Direct Call Counter"}
                  >
                    <PhoneCall className="w-3.5 h-3.5 shrink-0" />
                    <span>{isBn ? "কাউন্টার কল" : "Call"}</span>
                  </a>

                  {/* WhatsApp Inquiry if available */}
                  {OPERATOR_CONTACTS[item.operator]?.whatsapp && (
                    <a
                      href={`https://wa.me/${OPERATOR_CONTACTS[item.operator].whatsapp}?text=${encodeURIComponent(
                        isBn
                          ? `আসসালামু আলাইকুম, আমি ঘুরাঘুরি (Ghuraghuri) অ্যাপ থেকে ${item.operator} (${item.coach})-এর সিট বুকিং সংক্রান্ত তথ্য জানতে চাচ্ছি।`
                          : `Hello, I found ${item.operator} on Ghuraghuri App and want to inquire about seat booking.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="min-h-[40px] px-3 py-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-600 text-emerald-700 hover:text-white dark:bg-emerald-500/25 dark:text-emerald-300 dark:hover:bg-emerald-600 dark:hover:text-white text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer shadow-sm"
                      title={isBn ? "হোয়াটসঅ্যাপে মেসেজ পাঠান" : "WhatsApp Inquiry"}
                    >
                      <MessageCircle className="w-3.5 h-3.5 shrink-0" />
                      <span className="hidden sm:inline">{isBn ? "মেসেজ" : "Chat"}</span>
                    </a>
                  )}

                  {/* Seat Selection Button (Demo) */}
                  {ENABLE_BOOKING_DEMO && (
                    <button
                      type="button"
                      onClick={() => openTransportBooking(item)}
                      className="min-h-[40px] px-4 py-2 rounded-xl bg-[#0f4a38] hover:bg-[#156b50] text-white text-xs font-bold shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span>{isBn ? "সিট বাছুন" : "Select Seats"}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Floating Action Pill Bar */}
      {ENABLE_BOOKING_DEMO && (
        <div className="fixed bottom-6 right-6 z-40 flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveModal("myBookings")}
            className="px-5 py-3 rounded-full bg-gradient-to-r from-[#0f4a38] to-[#15803d] text-white font-bold text-xs sm:text-sm shadow-2xl border border-white/20 flex items-center gap-2 hover:scale-105 transition-all"
          >
            <Ticket className="w-4 h-4" />
            <span>{isBn ? "আমার বুকিং" : "My Bookings"}</span>
            <span className="px-2 py-0.5 rounded-full bg-[#f4a340] text-black font-extrabold text-xs">
              {savedBookings.length}
            </span>
          </button>
        </div>
      )}

      {/* =========================================================================
          MODAL 1: INTERACTIVE SEAT PICKER & TRANSPORT BOOKING
          ========================================================================= */}
      {ENABLE_BOOKING_DEMO && activeModal === "transport" && selectedSchedule && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-[var(--surface)] border border-[var(--glass-border)] rounded-3xl p-6 sm:p-8 shadow-2xl my-8 animate-in fade-in zoom-in-95 duration-200">
            <button
              type="button"
              onClick={() => setActiveModal(null)}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-[var(--surface-raised)] text-[var(--text-muted)]"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="mb-4">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#0f4a38]/10 text-[#0f4a38] dark:bg-[#1f9d76]/20 dark:text-[#2ecc71] inline-block mb-2">
                {selectedSchedule.type === "train" ? "🚆 বাংলাদেশ রেলওয়ে ই-টিকেট" : "🎫 আন্তঃনগর টিকেট বুকিং"}
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-foreground">
                {selectedSchedule.operator}
              </h3>
              <p className="text-xs text-[var(--text-muted)] mt-1">
                {selectedSchedule.coach} · <strong>{activeCorridor.toUpperCase()}</strong>
              </p>
            </div>

            {/* Live Counter Direct Access & Official Portal Banner */}
            <div className="p-3.5 mb-6 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-950 dark:text-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
                <span>
                  {isBn
                    ? "সরাসরি বাসের কাউন্টারে বুকিং করতে বা রেলওয়ের অফিশিয়াল সার্ভারে আসন কাটতে:"
                    : "For immediate live seat reservation or official Railway ticketing:"}
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {OPERATOR_CONTACTS[selectedSchedule.operator]?.phone && (
                  <a
                    href={`tel:${(() => {
                      const raw = (OPERATOR_CONTACTS[selectedSchedule.operator]?.phone || "131").replace(/[^0-9+]/g, "");
                      return raw.length <= 5 ? raw : (raw.startsWith("+") ? raw : `+88${raw}`);
                    })()}`}
                    className="px-3 py-1.5 rounded-xl bg-[#0f4a38] text-white hover:bg-[#156b50] font-bold text-xs inline-flex items-center gap-1.5 shadow-sm"
                  >
                    <PhoneCall className="w-3 h-3" />
                    <span>{OPERATOR_CONTACTS[selectedSchedule.operator].phone}</span>
                  </a>
                )}
                {OPERATOR_CONTACTS[selectedSchedule.operator]?.portalUrl && (
                  <a
                    href={OPERATOR_CONTACTS[selectedSchedule.operator].portalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-xl bg-[var(--surface)] text-foreground border border-[var(--glass-border)] font-bold text-xs hover:border-[#0f4a38] inline-flex items-center gap-1 shadow-sm"
                  >
                    <span>{isBn ? "অফিশিয়াল পোর্টাল" : "Official Portal"}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>

            {/* Train Bogie & Class Selectors */}
            {selectedSchedule.type === "train" && (
              <div className="space-y-4 mb-6">
                <div>
                  <label className="text-xs font-bold text-[var(--text-muted)] block mb-1.5">
                    {isBn ? "বগি নির্বাচন করুন (Coach):" : "Select Coach Bogie:"}
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {BOGIES.map((b) => (
                      <button
                        key={b}
                        type="button"
                        onClick={() => {
                          setSelectedBogie(b);
                          setSelectedSeats([]);
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                          selectedBogie === b
                            ? "bg-[#0f4a38] text-white border-[#0f4a38]"
                            : "bg-[var(--surface-raised)] text-foreground border-[var(--glass-border)]"
                        }`}
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-[var(--text-muted)] block mb-1.5">
                    {isBn ? "আসন শ্রেণী (Coach Class):" : "Coach Class:"}
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { key: "snigdha", label: "স্নিগ্ধা (AC)", factor: 1.0 },
                      { key: "shovon", label: "শোভন (Non-AC)", factor: 0.52 },
                      { key: "berth", label: "বার্থ/কেবিন", factor: 1.75 },
                    ].map((c) => (
                      <button
                        key={c.key}
                        type="button"
                        onClick={() => {
                          setSelectedClass(c.key as "snigdha" | "shovon" | "berth");
                          setSelectedSeats([]);
                        }}
                        className={`p-2.5 rounded-xl text-left border transition-all ${
                          selectedClass === c.key
                            ? "bg-[#0f4a38]/10 border-[#0f4a38] text-[#0f4a38] dark:text-[#2ecc71]"
                            : "bg-[var(--surface-raised)] border-[var(--glass-border)] text-foreground"
                        }`}
                      >
                        <div className="text-xs font-bold">{c.label}</div>
                        <div className="text-xs font-black mt-0.5">
                          ৳{Math.round(selectedSchedule.fare * c.factor).toLocaleString()}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Visual Seat Picker Layout */}
            <div className="p-4 rounded-2xl bg-[var(--surface-raised)] border border-[var(--glass-border)] mb-6">
              <div className="flex items-center justify-between text-xs font-bold mb-3">
                <span>{isBn ? "আসন নির্বাচন করুন (সর্বোচ্চ ৪টি)" : "Select Seats (Max 4)"}</span>
                <div className="flex items-center gap-3 text-xs">
                  <span className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded bg-[var(--surface)] border border-gray-400"></span>
                    {isBn ? "খালি" : "Available"}
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded bg-[#0f4a38] text-white"></span>
                    {isBn ? "নির্বাচিত" : "Selected"}
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded bg-gray-300 dark:bg-gray-700"></span>
                    {isBn ? "বুকড" : "Booked"}
                  </span>
                </div>
              </div>

              {/* Indicator */}
              <div className="text-center py-1 rounded bg-[var(--surface)] text-xs font-bold text-[var(--text-muted)] mb-3">
                {selectedSchedule.type === "train" ? "🚆 ইঞ্জিন সামনের দিকে ➔" : "🚌 সামনের দিক (ড্রাইভার)"}
              </div>

              {/* Grid Layout */}
              {selectedSchedule.type === "train" ? (
                <div className="grid grid-cols-5 gap-2 max-h-52 overflow-y-auto p-1">
                  {Array.from({ length: 8 }, (_, r) => {
                    const s1 = String((r + 1) * 4 - 3).padStart(2, "0");
                    const s2 = String((r + 1) * 4 - 2).padStart(2, "0");
                    const s3 = String((r + 1) * 4 - 1).padStart(2, "0");
                    const s4 = String((r + 1) * 4).padStart(2, "0");
                    const booked1 = r === 1 || r === 5;
                    const booked3 = r === 2 || r === 6;

                    return (
                      <React.Fragment key={r}>
                        <button
                          type="button"
                          disabled={booked1}
                          onClick={() => toggleSeat(s1)}
                          className={`p-2 rounded-lg text-xs font-bold border transition-all ${
                            booked1
                              ? "bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed"
                              : selectedSeats.includes(s1)
                              ? "bg-[#0f4a38] text-white border-[#0f4a38]"
                              : "bg-[var(--surface)] hover:bg-[#0f4a38]/10 text-foreground"
                          }`}
                        >
                          {s1} <small className="text-[9px]">W</small>
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleSeat(s2)}
                          className={`p-2 rounded-lg text-xs font-bold border transition-all ${
                            selectedSeats.includes(s2)
                              ? "bg-[#0f4a38] text-white border-[#0f4a38]"
                              : "bg-[var(--surface)] hover:bg-[#0f4a38]/10 text-foreground"
                          }`}
                        >
                          {s2}
                        </button>
                        <div className="flex items-center justify-center text-xs text-gray-400">||</div>
                        <button
                          type="button"
                          disabled={booked3}
                          onClick={() => toggleSeat(s3)}
                          className={`p-2 rounded-lg text-xs font-bold border transition-all ${
                            booked3
                              ? "bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed"
                              : selectedSeats.includes(s3)
                              ? "bg-[#0f4a38] text-white border-[#0f4a38]"
                              : "bg-[var(--surface)] hover:bg-[#0f4a38]/10 text-foreground"
                          }`}
                        >
                          {s3}
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleSeat(s4)}
                          className={`p-2 rounded-lg text-xs font-bold border transition-all ${
                            selectedSeats.includes(s4)
                              ? "bg-[#0f4a38] text-white border-[#0f4a38]"
                              : "bg-[var(--surface)] hover:bg-[#0f4a38]/10 text-foreground"
                          }`}
                        >
                          {s4} <small className="text-[9px]">W</small>
                        </button>
                      </React.Fragment>
                    );
                  })}
                </div>
              ) : (
                <div className="grid grid-cols-5 gap-2 max-h-52 overflow-y-auto p-1">
                  {["A", "B", "C", "D", "E", "F"].map((row, rIdx) => {
                    const s1 = `${row}1`;
                    const s2 = `${row}2`;
                    const s3 = `${row}3`;
                    const s4 = `${row}4`;
                    const booked = rIdx === 1 || rIdx === 4;

                    return (
                      <React.Fragment key={row}>
                        <button
                          type="button"
                          disabled={booked}
                          onClick={() => toggleSeat(s1)}
                          className={`p-2 rounded-lg text-xs font-bold border transition-all ${
                            booked
                              ? "bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed"
                              : selectedSeats.includes(s1)
                              ? "bg-[#0f4a38] text-white border-[#0f4a38]"
                              : "bg-[var(--surface)] hover:bg-[#0f4a38]/10 text-foreground"
                          }`}
                        >
                          {s1}
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleSeat(s2)}
                          className={`p-2 rounded-lg text-xs font-bold border transition-all ${
                            selectedSeats.includes(s2)
                              ? "bg-[#0f4a38] text-white border-[#0f4a38]"
                              : "bg-[var(--surface)] hover:bg-[#0f4a38]/10 text-foreground"
                          }`}
                        >
                          {s2}
                        </button>
                        <div className="flex items-center justify-center text-xs text-gray-400">||</div>
                        <button
                          type="button"
                          onClick={() => toggleSeat(s3)}
                          className={`p-2 rounded-lg text-xs font-bold border transition-all ${
                            selectedSeats.includes(s3)
                              ? "bg-[#0f4a38] text-white border-[#0f4a38]"
                              : "bg-[var(--surface)] hover:bg-[#0f4a38]/10 text-foreground"
                          }`}
                        >
                          {s3}
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleSeat(s4)}
                          className={`p-2 rounded-lg text-xs font-bold border transition-all ${
                            selectedSeats.includes(s4)
                              ? "bg-[#0f4a38] text-white border-[#0f4a38]"
                              : "bg-[var(--surface)] hover:bg-[#0f4a38]/10 text-foreground"
                          }`}
                        >
                          {s4}
                        </button>
                      </React.Fragment>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Passenger Form */}
            <form onSubmit={handleConfirmTransport} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-[var(--text-muted)] block mb-1">
                    {isBn ? "যাত্রীর পুরো নাম *" : "Passenger Full Name *"}
                  </label>
                  <input
                    type="text"
                    required
                    value={passengerName}
                    onChange={(e) => setPassengerName(e.target.value)}
                    placeholder={isBn ? "যেমন: তানভীর আহমেদ" : "e.g. Tanvir Ahmed"}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--surface-raised)] border border-[var(--glass-border)] text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-[#0f4a38]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[var(--text-muted)] block mb-1">
                    {isBn ? "মোবাইল নম্বর *" : "Phone Number *"}
                  </label>
                  <input
                    type="tel"
                    required
                    value={passengerPhone}
                    onChange={(e) => setPassengerPhone(e.target.value)}
                    placeholder="017xxxxxxxx"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--surface-raised)] border border-[var(--glass-border)] text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-[#0f4a38]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-[var(--text-muted)] block mb-1">
                  {isBn ? "বোর্ডিং স্টেশন / পয়েন্ট *" : "Boarding Point *"}
                </label>
                <select
                  value={boardingPoint}
                  onChange={(e) => setBoardingPoint(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--surface-raised)] border border-[var(--glass-border)] text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-[#0f4a38]"
                >
                  {selectedSchedule.boarding.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>

              {/* Total Summary */}
              <div className="p-4 rounded-xl bg-[#0f4a38]/10 border border-[#0f4a38]/20 flex items-center justify-between text-xs font-bold">
                <div>
                  <span className="text-[var(--text-muted)] block">
                    {isBn ? "নির্বাচিত আসন:" : "Selected Seats:"}
                  </span>
                  <span className="text-sm font-extrabold text-[#0f4a38] dark:text-[#2ecc71]">
                    {selectedSeats.length > 0 ? selectedSeats.join(", ") : isBn ? "কোনোটি নয়" : "None"}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[var(--text-muted)] block">
                    {isBn ? "মোট ভাড়া:" : "Total Fare:"}
                  </span>
                  <span className="text-base font-black text-[#0f4a38] dark:text-[#2ecc71]">
                    ৳{totalTransportPayable.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={selectedSeats.length === 0}
                className="w-full py-3.5 rounded-xl bg-[#0f4a38] hover:bg-[#156b50] disabled:bg-gray-400 text-white font-bold text-sm shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>
                  {isBn
                    ? "টিকেট কনফার্ম করুন ও ই-ভাউচার নিন"
                    : "Confirm Booking & Generate Ticket Voucher"}
                </span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 2: HOTEL ROOM BOOKING
          ========================================================================= */}
      {ENABLE_BOOKING_DEMO && activeModal === "hotel" && hotelItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative w-full max-w-xl bg-[var(--surface)] border border-[var(--glass-border)] rounded-3xl p-6 sm:p-8 shadow-2xl my-8">
            <button
              type="button"
              onClick={() => setActiveModal(null)}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-[var(--surface-raised)] text-[var(--text-muted)]"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-6">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#38bdf8]/15 text-[#0284c7] dark:text-[#38bdf8] inline-block mb-2">
                🏨 {isBn ? "হোটেল ও রিসোর্ট রুম রিজার্ভেশন" : "Hotel Room Reservation"}
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-foreground">
                {hotelItem.name}
              </h3>
              <p className="text-xs text-[var(--text-muted)] mt-1">📍 {hotelItem.address}</p>
            </div>

            <form onSubmit={handleConfirmHotel} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-[var(--text-muted)] block mb-1">
                  {isBn ? "রুম ক্যাটাগরি নির্বাচন করুন:" : "Select Room Type:"}
                </label>
                <select
                  onChange={(e) => {
                    const [mult, title] = e.target.value.split("|");
                    setHtRoomMultiplier(parseFloat(mult));
                    setHtRoomTitle(title);
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--surface-raised)] border border-[var(--glass-border)] text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-[#0f4a38]"
                >
                  <option value="1.0|Standard Deluxe Room">Standard Deluxe Room (৳{hotelItem.price.toLocaleString()}/night)</option>
                  <option value="1.8|Luxury Sea/Hill-View Suite">Luxury Sea/Hill-View Suite (৳{Math.round(hotelItem.price * 1.8).toLocaleString()}/night)</option>
                  <option value="2.5|Executive Family Villa">Executive Family Villa (৳{Math.round(hotelItem.price * 2.5).toLocaleString()}/night)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-[var(--text-muted)] block mb-1">
                    {isBn ? "চেক-ইন তারিখ *" : "Check-in Date *"}
                  </label>
                  <input
                    type="date"
                    required
                    value={htCheckIn}
                    onChange={(e) => setHtCheckIn(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--surface-raised)] border border-[var(--glass-border)] text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-[#0f4a38]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[var(--text-muted)] block mb-1">
                    {isBn ? "চেক-আউট তারিখ *" : "Check-out Date *"}
                  </label>
                  <input
                    type="date"
                    required
                    value={htCheckOut}
                    onChange={(e) => setHtCheckOut(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--surface-raised)] border border-[var(--glass-border)] text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-[#0f4a38]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-[var(--text-muted)] block mb-1">
                    {isBn ? "রুম সংখ্যা:" : "Rooms:"}
                  </label>
                  <select
                    value={htRooms}
                    onChange={(e) => setHtRooms(parseInt(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--surface-raised)] border border-[var(--glass-border)] text-sm font-medium text-foreground"
                  >
                    <option value={1}>1 Room</option>
                    <option value={2}>2 Rooms</option>
                    <option value={3}>3 Rooms</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-[var(--text-muted)] block mb-1">
                    {isBn ? "অতিথি সংখ্যা:" : "Guests:"}
                  </label>
                  <select
                    value={htGuests}
                    onChange={(e) => setHtGuests(parseInt(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--surface-raised)] border border-[var(--glass-border)] text-sm font-medium text-foreground"
                  >
                    <option value={1}>1 Guest</option>
                    <option value={2}>2 Guests</option>
                    <option value={3}>3 Guests</option>
                    <option value={4}>4 Guests</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-[var(--text-muted)] block mb-1">
                    {isBn ? "প্রধান অতিথির নাম *" : "Lead Guest Name *"}
                  </label>
                  <input
                    type="text"
                    required
                    value={htName}
                    onChange={(e) => setHtName(e.target.value)}
                    placeholder="Mohammad Rahim"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--surface-raised)] border border-[var(--glass-border)] text-sm font-medium text-foreground"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[var(--text-muted)] block mb-1">
                    {isBn ? "মোবাইল নম্বর *" : "Phone Number *"}
                  </label>
                  <input
                    type="tel"
                    required
                    value={htPhone}
                    onChange={(e) => setHtPhone(e.target.value)}
                    placeholder="017xxxxxxxx"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--surface-raised)] border border-[var(--glass-border)] text-sm font-medium text-foreground"
                  />
                </div>
              </div>

              {/* Total Calculation */}
              <div className="p-4 rounded-xl bg-[#38bdf8]/10 border border-[#38bdf8]/20 flex items-center justify-between text-xs font-bold">
                <div>
                  <span className="text-[var(--text-muted)] block">{htNights} {isBn ? "রাত" : "nights"} ({htRooms} room)</span>
                  <span className="text-sm font-extrabold text-[#0284c7] dark:text-[#38bdf8]">
                    {htRoomTitle}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[var(--text-muted)] block">{isBn ? "সর্বমোট প্রদেয় বিল:" : "Total Payable:"}</span>
                  <span className="text-base font-black text-[#0284c7] dark:text-[#38bdf8]">
                    ৳{totalHotelPayable.toLocaleString()}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-[#0f4a38] hover:bg-[#156b50] text-white font-bold text-sm shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isBn ? "রুম বুকিং নিশ্চিত করুন ও ভাউচার নিন" : "Confirm Room Booking & Get Stay Voucher"}</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 3: RESTAURANT TABLE RESERVATION
          ========================================================================= */}
      {ENABLE_BOOKING_DEMO && activeModal === "restaurant" && restItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative w-full max-w-xl bg-[var(--surface)] border border-[var(--glass-border)] rounded-3xl p-6 sm:p-8 shadow-2xl my-8">
            <button
              type="button"
              onClick={() => setActiveModal(null)}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-[var(--surface-raised)] text-[var(--text-muted)]"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-6">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#f4a340]/15 text-[#f4a340] inline-block mb-2">
                🍽️ {isBn ? "রেস্তোরাঁ টেবিল রিজার্ভেশন" : "Table Reservation"}
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-foreground">
                {restItem.name}
              </h3>
              <p className="text-xs text-[var(--text-muted)] mt-1">📍 {restItem.address}</p>
            </div>

            <form onSubmit={handleConfirmRestaurant} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-[var(--text-muted)] block mb-1">
                    {isBn ? "তারিখ *" : "Reservation Date *"}
                  </label>
                  <input
                    type="date"
                    required
                    value={rtDate}
                    onChange={(e) => setRtDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--surface-raised)] border border-[var(--glass-border)] text-sm font-medium text-foreground"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[var(--text-muted)] block mb-1">
                    {isBn ? "খাবার সময় বা স্লট *" : "Dining Slot *"}
                  </label>
                  <select
                    value={rtTimeSlot}
                    onChange={(e) => setRtTimeSlot(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--surface-raised)] border border-[var(--glass-border)] text-sm font-medium text-foreground"
                  >
                    <optgroup label="Lunch (দুপুর)">
                      <option value="01:00 PM">01:00 PM (Lunch Prime)</option>
                      <option value="02:00 PM">02:00 PM</option>
                      <option value="03:00 PM">03:00 PM</option>
                    </optgroup>
                    <optgroup label="Dinner (রাত)">
                      <option value="08:00 PM">08:00 PM (Dinner Prime)</option>
                      <option value="09:00 PM">09:00 PM</option>
                      <option value="10:00 PM">10:00 PM</option>
                    </optgroup>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-[var(--text-muted)] block mb-1">
                  {isBn ? "অতিথি সংখ্যা *" : "Guest Count *"}
                </label>
                <select
                  value={rtGuests}
                  onChange={(e) => setRtGuests(parseInt(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--surface-raised)] border border-[var(--glass-border)] text-sm font-medium text-foreground"
                >
                  {[1, 2, 4, 6, 8, 10].map((g) => (
                    <option key={g} value={g}>
                      {g} {isBn ? "জন অতিথি" : "Guests"}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-[var(--text-muted)] block mb-1">
                    {isBn ? "অতিথির নাম *" : "Guest Name *"}
                  </label>
                  <input
                    type="text"
                    required
                    value={rtName}
                    onChange={(e) => setRtName(e.target.value)}
                    placeholder="Sharif Ahmed"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--surface-raised)] border border-[var(--glass-border)] text-sm font-medium text-foreground"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[var(--text-muted)] block mb-1">
                    {isBn ? "মোবাইল নম্বর *" : "Phone Number *"}
                  </label>
                  <input
                    type="tel"
                    required
                    value={rtPhone}
                    onChange={(e) => setRtPhone(e.target.value)}
                    placeholder="018xxxxxxxx"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--surface-raised)] border border-[var(--glass-border)] text-sm font-medium text-foreground"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-[var(--text-muted)] block mb-1">
                  {isBn ? "বিশেষ অনুরোধ (ঐচ্ছিক):" : "Special Requests (Optional):"}
                </label>
                <input
                  type="text"
                  value={rtRequests}
                  onChange={(e) => setRtRequests(e.target.value)}
                  placeholder={isBn ? "যেমন: উইন্ডো সাইড টেবিল, জন্মদিনের মোমবাতি" : "e.g. Window table, quiet corner"}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--surface-raised)] border border-[var(--glass-border)] text-sm font-medium text-foreground"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-[#0f4a38] hover:bg-[#156b50] text-white font-bold text-sm shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isBn ? "টেবিল নিশ্চিত করুন ও পাস নিন" : "Confirm Table & Generate Dining Pass"}</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 4: CONFIRMED VOUCHER SLIP
          ========================================================================= */}
      {ENABLE_BOOKING_DEMO && activeModal === "confirmation" && currentVoucher && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative w-full max-w-lg bg-[var(--surface)] border border-[var(--glass-border)] rounded-3xl p-6 sm:p-8 shadow-2xl my-8">
            <button
              type="button"
              onClick={() => setActiveModal(null)}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-[var(--surface-raised)] text-[var(--text-muted)]"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Success Icon */}
            <div className="text-center mb-6">
              <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-3 shadow-lg">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-black text-foreground">
                {isBn ? "বুকিং সফলভাবে সম্পন্ন হয়েছে!" : "Booking Confirmed Successfully!"}
              </h3>
              <p className="text-xs text-[var(--text-muted)] mt-1">
                {isBn ? "রেফারেন্স নম্বর:" : "Booking Reference:"} <strong className="text-foreground">{currentVoucher.ref}</strong>
              </p>
            </div>

            {/* Printable Ticket Card */}
            <div className="p-6 rounded-2xl bg-gradient-to-b from-[#0f4a38] to-[#07251c] text-white shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-white/20 pb-3">
                <span className="text-xs font-black uppercase tracking-widest text-[#f4a340]">
                  GHURAGHURI TRAVELS · বাংলাদেশ
                </span>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-white/20 text-white">
                  {currentVoucher.category.toUpperCase()}
                </span>
              </div>

              <div>
                <h4 className="text-lg font-black">{currentVoucher.title}</h4>
                {currentVoucher.route && <p className="text-xs text-white/80 mt-0.5">{currentVoucher.route}</p>}
                {currentVoucher.address && <p className="text-xs text-white/80 mt-0.5">📍 {currentVoucher.address}</p>}
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-white/10">
                {currentVoucher.pnr && (
                  <div>
                    <span className="text-white/60 block text-xs">PNR:</span>
                    <strong className="text-[#f4a340]">{currentVoucher.pnr}</strong>
                  </div>
                )}
                <div>
                  <span className="text-white/60 block text-xs">{isBn ? "তারিখ:" : "Date:"}</span>
                  <strong>{currentVoucher.date}</strong>
                </div>
                {currentVoucher.time && (
                  <div>
                    <span className="text-white/60 block text-xs">{isBn ? "সময়:" : "Time:"}</span>
                    <strong>{currentVoucher.time}</strong>
                  </div>
                )}
                {currentVoucher.seats && (
                  <div>
                    <span className="text-white/60 block text-xs">{isBn ? "আসন নম্বর:" : "Seats:"}</span>
                    <strong className="text-[#2ecc71]">{currentVoucher.seats.join(", ")}</strong>
                  </div>
                )}
                {currentVoucher.room && (
                  <div>
                    <span className="text-white/60 block text-xs">{isBn ? "রুম ক্যাটাগরি:" : "Room:"}</span>
                    <strong>{currentVoucher.room}</strong>
                  </div>
                )}
                {currentVoucher.diningSlot && (
                  <div>
                    <span className="text-white/60 block text-xs">{isBn ? "ডাইনিং স্লট:" : "Slot:"}</span>
                    <strong className="text-[#f4a340]">{currentVoucher.diningSlot}</strong>
                  </div>
                )}
                <div>
                  <span className="text-white/60 block text-xs">{isBn ? "যাত্রী / অতিথি:" : "Guest:"}</span>
                  <strong>{currentVoucher.passenger || currentVoucher.guest}</strong>
                </div>
                <div>
                  <span className="text-white/60 block text-xs">{isBn ? "যোগাযোগ:" : "Phone:"}</span>
                  <strong>{currentVoucher.phone}</strong>
                </div>
              </div>

              {/* Barcode & Total */}
              <div className="flex items-center justify-between pt-3 border-t border-white/20">
                <div className="flex gap-1 h-6 items-center">
                  {[4, 2, 6, 2, 8, 3, 5, 2, 7, 2, 4].map((w, idx) => (
                    <span
                      key={idx}
                      className="h-full bg-white/70 rounded-xs"
                      style={{ width: `${w}px` }}
                    />
                  ))}
                </div>
                <div className="text-right">
                  <span className="text-xs text-white/60 block">{isBn ? "পরিশোধ স্ট্যাটাস:" : "Payment:"}</span>
                  <span className="text-base font-black text-[#f4a340]">
                    {currentVoucher.total > 0 ? `৳${currentVoucher.total.toLocaleString()}` : isBn ? "ফ্রি রিজার্ভেশন" : "Free Reserve"}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => window.print()}
                className="flex-1 py-3 rounded-xl bg-[#0f4a38] hover:bg-[#156b50] text-white text-xs font-bold shadow-md transition-all flex items-center justify-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                <span>{isBn ? "ভাউচার প্রিন্ট / সেভ করুন" : "Print Voucher"}</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-6 py-3 rounded-xl bg-[var(--surface-raised)] border border-[var(--glass-border)] text-foreground text-xs font-bold hover:bg-[#0f4a38]/10"
              >
                {isBn ? "সম্পন্ন" : "Done"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 5: "MY BOOKINGS" DRAWER
          ========================================================================= */}
      {ENABLE_BOOKING_DEMO && activeModal === "myBookings" && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-[var(--surface)] border border-[var(--glass-border)] rounded-3xl p-6 sm:p-8 shadow-2xl my-8">
            <button
              type="button"
              onClick={() => setActiveModal(null)}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-[var(--surface-raised)] text-[var(--text-muted)]"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0f4a38]/10 text-[#0f4a38] dark:bg-[#1f9d76]/20 dark:text-[#2ecc71] text-xs font-bold mb-2">
                <Ticket className="w-3.5 h-3.5" />
                <span>{isBn ? "সংরক্ষিত টিকিট ও ভাউচার" : "Stored Travel Vouchers"}</span>
              </div>
              <h3 className="text-2xl font-black text-foreground">
                {isBn ? "আমার বুকিং তালিকা" : "My Bookings"}
              </h3>
              <p className="text-xs text-[var(--text-muted)] mt-1">
                {isBn
                  ? "আপনার ব্রাউজারে সংরক্ষিত সকল টিকিট ও ভাউচার এখান থেকে দেখতে ও প্রিন্ট করতে পারবেন।"
                  : "All your stored tickets and booking slips are preserved securely on this device."}
              </p>
            </div>

            {savedBookings.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-[var(--glass-border)] rounded-2xl">
                <Ticket className="w-12 h-12 text-[var(--text-muted)] mx-auto mb-3 opacity-40" />
                <h4 className="text-base font-bold text-foreground">
                  {isBn ? "কোনো সক্রিয় বুকিং পাওয়া যায়নি" : "No active bookings found"}
                </h4>
                <p className="text-xs text-[var(--text-muted)] mt-1 max-w-sm mx-auto">
                  {isBn
                    ? "উপরে উল্লেখিত বাস, ট্রেন, হোটেল বা রেস্তোরাঁ থেকে যেকোনো বুকিং সম্পন্ন করলে এখানে দেখা যাবে।"
                    : "Select a bus, train, hotel or table above to generate your first travel voucher."}
                </p>
              </div>
            ) : (
              <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
                {savedBookings.map((b) => (
                  <div
                    key={b.ref}
                    className="p-5 rounded-2xl bg-[var(--surface-raised)] border border-[var(--glass-border)] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 rounded-full text-xs font-extrabold uppercase bg-[#0f4a38]/10 text-[#0f4a38] dark:text-[#2ecc71]">
                          {b.category}
                        </span>
                        <strong className="text-sm font-bold text-foreground">{b.title}</strong>
                      </div>
                      <p className="text-xs text-[var(--text-muted)]">
                        {isBn ? "রেফারেন্স:" : "Ref:"} <span className="font-mono font-bold text-foreground">{b.ref}</span> • {b.date}
                        {b.seats && ` • Seats: ${b.seats.join(", ")}`}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setCurrentVoucher(b);
                          setActiveModal("confirmation");
                        }}
                        className="px-4 py-2 rounded-xl bg-[#0f4a38] hover:bg-[#156b50] text-white text-xs font-bold transition-all"
                      >
                        {isBn ? "ভাউচার দেখুন" : "View Voucher"}
                      </button>
                      <button
                        type="button"
                        onClick={() => removeBooking(b.ref)}
                        className="p-2 rounded-xl hover:bg-rose-100 dark:hover:bg-rose-950/40 text-rose-600 transition-all"
                        title={isBn ? "বাতিল করুন" : "Cancel"}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
