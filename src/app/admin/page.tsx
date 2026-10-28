"use client";

import React, { useState, useEffect } from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import rawDestinations from "@/data/destinations.json";
import { Destination } from "@/types/destination";
import {
  Plus,
  Search,
  Filter,
  Edit3,
  Trash2,
  Upload,
  Download,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Star,
  MapPin,
  Eye,
  Compass,
  ArrowLeft,
  X,
  Save,
} from "lucide-react";

const STORAGE_CUSTOM_DESTS = "ghuraghuri_custom_destinations";

const BADGES = [
  { id: "topRated", label: "✨ শীর্ষ রেটেড (Top Rated)", labelEn: "Top Rated" },
  { id: "mustVisit", label: "🌟 অবশ্য দর্শনীয় (Must Visit)", labelEn: "Must Visit" },
  { id: "ecoExplorer", label: "🌿 প্রকৃতিপ্রেমীদের পছন্দ (Eco Explorer)", labelEn: "Eco Explorer" },
  { id: "heritageLandmark", label: "🏛️ ঐতিহাসিক ঐতিহ্য (Heritage Landmark)", labelEn: "Heritage Landmark" },
  { id: "hiddenGem", label: "💎 অচেনা রত্ন (Hidden Gem)", labelEn: "Hidden Gem" },
  { id: "coastalCharm", label: "🏖️ উপকূলীয় সৌন্দর্য (Coastal Charm)", labelEn: "Coastal Charm" },
  { id: "familyFavorite", label: "👨‍👩‍👧 পরিবারবান্ধব (Family Favorite)", labelEn: "Family Favorite" },
];

const DIVISIONS = [
  "All",
  "Chattogram",
  "Sylhet",
  "Dhaka",
  "Khulna",
  "Barishal",
  "Rajshahi",
  "Rangpur",
  "Mymensingh",
];

export default function AdminPage() {
  // Fail closed: In production, /admin is completely disabled and returns a real 404
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  const { language } = useApp();
  const isBn = language === "bn";

  // Destinations state
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedDivision, setSelectedDivision] = useState<string>("All");
  const [toastMessage, setToastMessage] = useState<string>("");

  // Modal / Editor state
  const [isEditorOpen, setIsEditorOpen] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  // Form Fields
  const [formName, setFormName] = useState<string>("");
  const [formNameBn, setFormNameBn] = useState<string>("");
  const [formSlug, setFormSlug] = useState<string>("");
  const [formDivision, setFormDivision] = useState<string>("Chattogram");
  const [formDistrict, setFormDistrict] = useState<string>("");
  const [formCategory, setFormCategory] = useState<string>("Hill");
  const [formRating, setFormRating] = useState<number>(4.8);
  const [formBadge, setFormBadge] = useState<string>("topRated");
  const [formShortDesc, setFormShortDesc] = useState<string>("");
  const [formDescription, setFormDescription] = useState<string>("");
  const [formLatitude, setFormLatitude] = useState<string>("23.8103");
  const [formLongitude, setFormLongitude] = useState<string>("90.4125");
  const [formImage, setFormImage] = useState<string>("");
  const [formImagePreview, setFormImagePreview] = useState<string>("");
  const [formThingsToDo, setFormThingsToDo] = useState<string>("");
  const [formAttractions, setFormAttractions] = useState<string>("");

  // Load destinations and merge custom local overrides
  useEffect(() => {
    const baseList = (rawDestinations as unknown as Destination[]) || [];
    try {
      const customSaved = localStorage.getItem(STORAGE_CUSTOM_DESTS);
      if (customSaved) {
        const customItems: Destination[] = JSON.parse(customSaved);
        const map = new Map<number, Destination>();
        baseList.forEach((d) => map.set(d.id, d));
        customItems.forEach((d) => map.set(d.id, d));
        setDestinations(Array.from(map.values()));
        return;
      }
    } catch {}
    setDestinations(baseList);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 4000);
  };

  const openNewEditor = () => {
    setEditingId(null);
    setFormName("");
    setFormNameBn("");
    setFormSlug("");
    setFormDivision("Chattogram");
    setFormDistrict("");
    setFormCategory("Hill");
    setFormRating(4.8);
    setFormBadge("topRated");
    setFormShortDesc("");
    setFormDescription("");
    setFormLatitude("23.8103");
    setFormLongitude("90.4125");
    setFormImage("/assets/destinations/sajek-valley.webp");
    setFormImagePreview("/assets/destinations/sajek-valley.webp");
    setFormThingsToDo("");
    setFormAttractions("");
    setIsEditorOpen(true);
  };

  const openEditEditor = (dest: Destination) => {
    setEditingId(dest.id);
    setFormName(dest.name || "");
    setFormNameBn(dest.name_bn || "");
    setFormSlug(dest.slug || "");
    setFormDivision(dest.division || "Chattogram");
    setFormDistrict(dest.district || "");
    setFormCategory(dest.category || "Hill");
    setFormRating(dest.rating || 4.8);
    setFormBadge(dest.badge || "topRated");
    setFormShortDesc(dest.shortDesc || "");
    setFormDescription(dest.description || "");
    setFormLatitude(String(dest.latitude || 23.8103));
    setFormLongitude(String(dest.longitude || 90.4125));
    setFormImage(dest.image || "");
    setFormImagePreview(dest.image || "");
    setFormThingsToDo((dest.activities || []).join("\n"));
    setFormAttractions((dest.attractions || []).join("\n"));
    setIsEditorOpen(true);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (loadEvent) => {
      const dataUrl = loadEvent.target?.result as string;
      setFormImage(dataUrl);
      setFormImagePreview(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveDestination = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formName.trim() || !formDivision || !formDistrict.trim()) {
      alert("Name, Division, and District are required.");
      return;
    }

    const slug =
      formSlug.trim() ||
      formName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

    const newDest: Destination = {
      id: editingId || Date.now(),
      name: formName.trim(),
      name_bn: formNameBn.trim() || formName.trim(),
      slug: slug,
      division: formDivision,
      district: formDistrict.trim(),
      category: formCategory,
      categories: [formCategory],
      rating: Number(formRating) || 4.8,
      reviews: 0,
      badge: formBadge,
      latitude: parseFloat(formLatitude) || 23.8103,
      longitude: parseFloat(formLongitude) || 90.4125,
      image: formImage || "/assets/destinations/sajek-valley.webp",
      imageLg: formImage || "/assets/destinations/sajek-valley.webp",
      shortDesc: formShortDesc.trim() || formDescription.trim().slice(0, 140),
      description: formDescription.trim() || formShortDesc.trim(),
      bestTime: "October – March",
      recommendedDays: "2-3 Days",
      difficulty: "Easy",
      budget: "Moderate",
      travelType: "Sightseeing",
      activities: formThingsToDo
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
      attractions: formAttractions
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
    };

    const updated = destinations.map((d) => (d.id === newDest.id ? newDest : d));
    if (!editingId) {
      updated.unshift(newDest);
    }

    setDestinations(updated);
    try {
      localStorage.setItem(STORAGE_CUSTOM_DESTS, JSON.stringify(updated));
    } catch {}

    setIsEditorOpen(false);
    showToast(
      isBn
        ? "গন্তব্য সফলভাবে সংরক্ষিত হয়েছে!"
        : "Destination saved successfully!"
    );
  };

  const handleDelete = (id: number) => {
    if (
      !confirm(
        isBn
          ? "আপনি কি নিশ্চিতভাবে এই স্থানটি অপসারণ করতে চান?"
          : "Are you sure you want to remove this destination?"
      )
    ) {
      return;
    }
    const updated = destinations.filter((d) => d.id !== id);
    setDestinations(updated);
    try {
      localStorage.setItem(STORAGE_CUSTOM_DESTS, JSON.stringify(updated));
    } catch {}
    showToast(isBn ? "স্থানটি অপসারিত হয়েছে।" : "Destination removed.");
  };

  const handleExportJSON = () => {
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(destinations, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "destinations.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast(
      isBn
        ? "destinations.json ফাইল ডাউনলোড হয়েছে!"
        : "destinations.json exported!"
    );
  };

  // Filtered destinations list
  const filteredDestinations = destinations.filter((d) => {
    const matchesSearch =
      !searchTerm ||
      d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (d.name_bn && d.name_bn.includes(searchTerm)) ||
      d.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.division.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDivision =
      selectedDivision === "All" || d.division === selectedDivision;

    return matchesSearch && matchesDivision;
  });

  // DASHBOARD (Dev-Only)
  return (
    <div className="min-h-screen bg-[#fbfdfc] dark:bg-[#061510] py-8 px-4 sm:px-6 lg:px-8">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0f4a38] text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-[#f4a340]" />
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto space-y-8">
        {/* Top Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-[#0c241c] p-6 rounded-3xl border border-[#0f4a38]/10 dark:border-white/10 shadow-sm">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#f4a340] uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4" />
              <span>{isBn ? "লাইভ কন্ট্রোল রুম (ডেভ মোড)" : "Master Control (Dev Mode)"}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#0f4a38] dark:text-white">
              {isBn ? "ঘুরাঘুরি ডেস্টিনেশন ম্যানেজার" : "Destination Studio & Manager"}
            </h1>
            <p className="text-xs sm:text-sm text-[#4e6b60] dark:text-[#95b3a6] mt-1">
              {isBn
                ? `মোট ${destinations.length} টি দর্শনীয় স্থান সক্রিয় রয়েছে`
                : `${destinations.length} destinations active & ready`}
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={openNewEditor}
              className="px-4 py-2.5 rounded-xl font-bold text-white bg-[#0f4a38] hover:bg-[#156b50] flex items-center gap-2 shadow-md transition-all cursor-pointer text-sm"
            >
              <Plus className="w-4 h-4" />
              <span>{isBn ? "নতুন স্থান যুক্ত করুন" : "Add Destination"}</span>
            </button>

            <button
              onClick={handleExportJSON}
              className="px-4 py-2.5 rounded-xl font-semibold text-[#0f4a38] dark:text-white bg-[#f2f7f4] dark:bg-[#123328] hover:bg-[#e4ede8] flex items-center gap-2 border border-[#0f4a38]/15 dark:border-white/10 text-sm transition-all cursor-pointer"
              title="Export updated destinations.json"
            >
              <Download className="w-4 h-4 text-[#f4a340]" />
              <span>{isBn ? "JSON এক্সপোর্ট" : "Export JSON"}</span>
            </button>

            <Link
              href="/"
              className="px-4 py-2.5 rounded-xl font-semibold text-[#0f4a38] dark:text-[#2ecc71] bg-[#0f4a38]/10 hover:bg-[#0f4a38]/20 flex items-center gap-2 text-sm transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{isBn ? "হোমপেজে ফিরুন" : "Back to Home"}</span>
            </Link>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative md:col-span-2">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-[#4e6b60]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={
                isBn
                  ? "নাম, জেলা বা বিভাগ দিয়ে খুঁজুন..."
                  : "Search destination by name, district, division..."
              }
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-[#0f4a38]/15 dark:border-white/10 bg-white dark:bg-[#0c241c] text-sm focus:outline-none focus:ring-2 focus:ring-[#0f4a38] dark:focus:ring-[#1f9d76]"
            />
          </div>

          <div className="relative">
            <Filter className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#4e6b60]" />
            <select
              value={selectedDivision}
              onChange={(e) => setSelectedDivision(e.target.value)}
              className="w-full pl-11 pr-8 py-3.5 rounded-2xl border border-[#0f4a38]/15 dark:border-white/10 bg-white dark:bg-[#0c241c] text-sm focus:outline-none focus:ring-2 focus:ring-[#0f4a38] dark:focus:ring-[#1f9d76] appearance-none cursor-pointer"
            >
              {DIVISIONS.map((div) => (
                <option key={div} value={div}>
                  {div === "All"
                    ? isBn
                      ? "সকল বিভাগ (All Divisions)"
                      : "All Divisions"
                    : div}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Destination Table */}
        <div className="bg-white dark:bg-[#0c241c] rounded-3xl border border-[#0f4a38]/10 dark:border-white/10 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#0f4a38]/10 dark:border-white/10 bg-[#fbfdfc] dark:bg-[#061510] text-xs font-bold uppercase tracking-wider text-[#4e6b60] dark:text-[#95b3a6]">
                  <th className="py-4 px-6">ID & Photo</th>
                  <th className="py-4 px-6">Destination</th>
                  <th className="py-4 px-6">Division / District</th>
                  <th className="py-4 px-6">Explorer Score</th>
                  <th className="py-4 px-6">Badge Pill</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#0f4a38]/5 dark:divide-white/5 text-sm">
                {filteredDestinations.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-[#4e6b60]">
                      {isBn ? "কোনো ফলাফল পাওয়া যায়নি।" : "No destinations found."}
                    </td>
                  </tr>
                ) : (
                  filteredDestinations.slice(0, 50).map((dest) => {
                    const badgeObj = BADGES.find((b) => b.id === dest.badge);
                    return (
                      <tr
                        key={dest.id}
                        className="hover:bg-[#f2f7f4] dark:hover:bg-[#123328]/60 transition-colors"
                      >
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <span className="text-xs font-mono text-[#4e6b60] w-7">
                              #{dest.id}
                            </span>
                            <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                              <Image
                                src={
                                  dest.image
                                    ? (dest.image.startsWith("http") || dest.image.startsWith("/")
                                        ? dest.image
                                        : `/${dest.image.replace(/^\/+/, "")}`)
                                    : "/assets/destinations/sajek-valley.webp"
                                }
                                alt=""
                                aria-hidden="true"
                                fill
                                sizes="48px"
                                className="object-cover"
                              />
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="font-bold text-[#0d211a] dark:text-white">
                            {dest.name}
                          </div>
                          {dest.name_bn && (
                            <div className="text-xs text-[#4e6b60] dark:text-[#95b3a6]">
                              {dest.name_bn}
                            </div>
                          )}
                        </td>
                        <td className="py-4 px-6">
                          <div className="font-medium text-[#0f4a38] dark:text-[#2ecc71]">
                            {dest.division}
                          </div>
                          <div className="text-xs text-[#4e6b60] dark:text-[#95b3a6]">
                            {dest.district}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#f4a340]/15 text-[#b45309] dark:text-[#f4a340] font-bold text-xs">
                            <Star className="w-3.5 h-3.5 fill-[#f4a340]" />
                            <span>{dest.rating.toFixed(1)}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          {badgeObj ? (
                            <span className="inline-block text-xs font-semibold px-2.5 py-1 rounded-full bg-[#0f4a38]/10 text-[#0f4a38] dark:bg-[#1f9d76]/20 dark:text-[#2ecc71]">
                              {badgeObj.labelEn}
                            </span>
                          ) : (
                            <span className="text-xs text-[#4e6b60]">—</span>
                          )}
                        </td>
                        <td className="py-4 px-6 text-right space-x-2">
                          <Link
                            href={`/destinations/${dest.slug}`}
                            target="_blank"
                            className="p-2 inline-flex items-center text-[#4e6b60] hover:text-[#0f4a38] dark:hover:text-white rounded-lg hover:bg-white/80 dark:hover:bg-white/10"
                            title="View Destination Page"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => openEditEditor(dest)}
                            className="p-2 inline-flex items-center text-[#0f4a38] dark:text-[#2ecc71] hover:bg-[#0f4a38]/10 rounded-lg cursor-pointer"
                            title="Edit Destination"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(dest.id)}
                            className="p-2 inline-flex items-center text-red-500 hover:bg-red-50 dark:hover:bg-red-950/50 rounded-lg cursor-pointer"
                            title="Remove Destination"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {filteredDestinations.length > 50 && (
            <div className="p-4 text-center text-xs text-[#4e6b60] bg-[#fbfdfc] dark:bg-[#061510] border-t border-[#0f4a38]/10 dark:border-white/10">
              {isBn
                ? `প্রথম ৫০টি প্রদর্শিত হচ্ছে (মোট ${filteredDestinations.length} টি)। নির্দিষ্ট ফলাফল পেতে সার্চ করুন।`
                : `Showing first 50 of ${filteredDestinations.length}. Use search to narrow down.`}
            </div>
          )}
        </div>
      </div>

      {/* MODAL / EDITOR DRAWER */}
      {isEditorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-3xl bg-white dark:bg-[#0c241c] rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#0f4a38]/20 dark:border-white/20 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#0f4a38]/10 dark:border-white/10">
              <h2 className="text-xl font-bold text-[#0f4a38] dark:text-white">
                {editingId
                  ? isBn
                    ? "গন্তব্য এডিট করুন"
                    : "Edit Destination"
                  : isBn
                  ? "নতুন গন্তব্য যুক্ত করুন"
                  : "Add New Destination"}
              </h2>
              <button
                onClick={() => setIsEditorOpen(false)}
                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 cursor-pointer"
              >
                <X className="w-5 h-5 text-[#4e6b60]" />
              </button>
            </div>

            <form onSubmit={handleSaveDestination} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#4e6b60] dark:text-[#95b3a6] mb-1.5">
                    Name (English) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. Sajek Valley"
                    className="w-full px-4 py-2.5 rounded-xl border border-[#0f4a38]/20 dark:border-white/20 bg-transparent text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#4e6b60] dark:text-[#95b3a6] mb-1.5">
                    Name (বাংলা)
                  </label>
                  <input
                    type="text"
                    value={formNameBn}
                    onChange={(e) => setFormNameBn(e.target.value)}
                    placeholder="যেমন: সাজেক ভ্যালি"
                    className="w-full px-4 py-2.5 rounded-xl border border-[#0f4a38]/20 dark:border-white/20 bg-transparent text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#4e6b60] dark:text-[#95b3a6] mb-1.5">
                    Division *
                  </label>
                  <select
                    value={formDivision}
                    onChange={(e) => setFormDivision(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-[#0f4a38]/20 dark:border-white/20 bg-white dark:bg-[#0c241c] text-sm"
                  >
                    {DIVISIONS.filter((d) => d !== "All").map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#4e6b60] dark:text-[#95b3a6] mb-1.5">
                    District *
                  </label>
                  <input
                    type="text"
                    required
                    value={formDistrict}
                    onChange={(e) => setFormDistrict(e.target.value)}
                    placeholder="e.g. Rangamati"
                    className="w-full px-4 py-2.5 rounded-xl border border-[#0f4a38]/20 dark:border-white/20 bg-transparent text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#4e6b60] dark:text-[#95b3a6] mb-1.5">
                    Category
                  </label>
                  <input
                    type="text"
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    placeholder="Hill, Beach, Heritage..."
                    className="w-full px-4 py-2.5 rounded-xl border border-[#0f4a38]/20 dark:border-white/20 bg-transparent text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#4e6b60] dark:text-[#95b3a6] mb-1.5">
                    Explorer Score (0.0 – 5.0)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    value={formRating}
                    onChange={(e) => setFormRating(parseFloat(e.target.value) || 0)}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#0f4a38]/20 dark:border-white/20 bg-transparent text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#4e6b60] dark:text-[#95b3a6] mb-1.5">
                    Curated Quality Badge
                  </label>
                  <select
                    value={formBadge}
                    onChange={(e) => setFormBadge(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-[#0f4a38]/20 dark:border-white/20 bg-white dark:bg-[#0c241c] text-sm"
                  >
                    {BADGES.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* PHOTO UPLOAD & PREVIEW */}
              <div className="p-5 rounded-2xl bg-[#f2f7f4] dark:bg-[#123328]/50 border border-[#0f4a38]/10 dark:border-white/10 space-y-4">
                <span className="block text-xs font-bold uppercase tracking-wider text-[#0f4a38] dark:text-[#2ecc71]">
                  {isBn
                    ? "ছবি আপলোড (কম্পিউটার/মোবাইল) অথবা ইউআরএল"
                    : "Direct Device Photo Upload or Asset URL"}
                </span>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="relative w-24 h-24 rounded-2xl overflow-hidden bg-slate-200 border border-black/10 shrink-0">
                    {formImagePreview ? (
                      <Image
                        src={formImagePreview}
                        alt="Uploaded preview"
                        fill
                        sizes="96px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-slate-400">
                        No image
                      </div>
                    )}
                  </div>

                  <div className="flex-1 space-y-2 w-full">
                    <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-[#0c241c] border border-[#0f4a38]/20 dark:border-white/20 text-xs font-bold text-[#0f4a38] dark:text-white cursor-pointer hover:bg-slate-50">
                      <Upload className="w-4 h-4 text-[#f4a340]" />
                      <span>
                        {isBn
                          ? "ডিভাইস থেকে ফাইল নির্বাচন করুন"
                          : "Choose from device..."}
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="sr-only"
                      />
                    </label>

                    <input
                      type="text"
                      value={formImage}
                      onChange={(e) => {
                        setFormImage(e.target.value);
                        setFormImagePreview(e.target.value);
                      }}
                      placeholder="/assets/destinations/custom.webp or https://..."
                      className="w-full px-3 py-2 rounded-xl border border-[#0f4a38]/15 dark:border-white/15 bg-white dark:bg-[#0c241c] text-xs font-mono"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#4e6b60] dark:text-[#95b3a6] mb-1.5">
                  Short Description
                </label>
                <textarea
                  rows={2}
                  value={formShortDesc}
                  onChange={(e) => setFormShortDesc(e.target.value)}
                  placeholder="One or two compelling sentences about this destination..."
                  className="w-full px-4 py-2.5 rounded-xl border border-[#0f4a38]/20 dark:border-white/20 bg-transparent text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#4e6b60] dark:text-[#95b3a6] mb-1.5">
                  Full Story & Description
                </label>
                <textarea
                  rows={4}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Comprehensive historical, geographical and travel context..."
                  className="w-full px-4 py-2.5 rounded-xl border border-[#0f4a38]/20 dark:border-white/20 bg-transparent text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#4e6b60] dark:text-[#95b3a6] mb-1.5">
                    Things To Do (One per line)
                  </label>
                  <textarea
                    rows={3}
                    value={formThingsToDo}
                    onChange={(e) => setFormThingsToDo(e.target.value)}
                    placeholder="Hiking&#10;Photography&#10;Camping"
                    className="w-full px-4 py-2 rounded-xl border border-[#0f4a38]/20 dark:border-white/20 bg-transparent text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#4e6b60] dark:text-[#95b3a6] mb-1.5">
                    Attractions (One per line)
                  </label>
                  <textarea
                    rows={3}
                    value={formAttractions}
                    onChange={(e) => setFormAttractions(e.target.value)}
                    placeholder="Konglak Peak&#10;Ruilui Para&#10;Helipad View"
                    className="w-full px-4 py-2 rounded-xl border border-[#0f4a38]/20 dark:border-white/20 bg-transparent text-xs"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#0f4a38]/10 dark:border-white/10">
                <button
                  type="button"
                  onClick={() => setIsEditorOpen(false)}
                  className="px-5 py-2.5 rounded-xl font-semibold text-[#4e6b60] hover:bg-slate-100 dark:hover:bg-white/10 text-sm cursor-pointer"
                >
                  {isBn ? "বাতিল" : "Cancel"}
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl font-bold text-white bg-[#0f4a38] hover:bg-[#156b50] flex items-center gap-2 shadow-lg shadow-[#0f4a38]/25 text-sm cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>
                    {editingId
                      ? isBn
                        ? "পরিবর্তন সংরক্ষণ করুন"
                        : "Update Destination"
                      : isBn
                      ? "স্থানটি সংরক্ষণ করুন"
                      : "Save Destination"}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
