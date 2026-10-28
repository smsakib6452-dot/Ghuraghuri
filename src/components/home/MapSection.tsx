"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type * as Leaflet from "leaflet";
import "leaflet/dist/leaflet.css";
import Image from "next/image";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import destinationsData from "@/data/destinations.json";
import { Destination } from "@/types/destination";
import {
  MapPin,
  Compass,
  ArrowRight,
  RotateCcw,
  Plus,
  Minus,
  X,
  Layers,
  Sparkles,
  Hand,
} from "lucide-react";
import { TOTAL_DESTINATIONS, DIVISION_COUNTS } from "@/lib/constants";
import { formatNumberEnBn } from "@/lib/utils";
import { formatDigits, getDistrictBn, getDivisionBn, CATEGORIES_BN } from "@/lib/i18n";
import translationsData from "@/data/translations.json";

const translations: Record<string, { shortDesc?: string; name_bn?: string }> =
  translationsData as unknown as Record<string, { shortDesc?: string; name_bn?: string }>;


const allDestinations = (destinationsData as unknown as Destination[]).filter(
  (d) =>
    typeof d.latitude === "number" &&
    typeof d.longitude === "number" &&
    d.latitude !== 0 &&
    d.longitude !== 0
);

interface ClusterItem {
  id: string;
  lat: number;
  lng: number;
  count: number;
  points: Destination[];
}

export function MapSection() {
  const { language, theme } = useApp();
  const isBn = language === "bn";

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<Leaflet.Map | null>(null);
  const tileLayerRef = useRef<Leaflet.TileLayer | null>(null);
  const markersLayerRef = useRef<Leaflet.LayerGroup | null>(null);

  const [selectedDivision, setSelectedDivision] = useState<string>("all");
  const [activeSpot, setActiveSpot] = useState<Destination | null>(null);
  const [currentZoom, setCurrentZoom] = useState<number>(7);
  const [showTouchHint, setShowTouchHint] = useState<boolean>(false);
  const touchHintTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const updateMapMarkersRef = useRef<((L: typeof Leaflet) => Promise<void>) | null>(null);

  const divisions = useMemo(
    () => [
      { id: "all", name: "All Bangladesh", name_bn: "সমগ্র বাংলাদেশ" },
      { id: "Chattogram", name: "Chattogram", name_bn: "চট্টগ্রাম" },
      { id: "Sylhet", name: "Sylhet", name_bn: "সিলেট" },
      { id: "Dhaka", name: "Dhaka", name_bn: "ঢাকা" },
      { id: "Khulna", name: "Khulna", name_bn: "খুলনা" },
      { id: "Barishal", name: "Barishal", name_bn: "বরিশাল" },
      { id: "Rajshahi", name: "Rajshahi", name_bn: "রাজশাহী" },
      { id: "Rangpur", name: "Rangpur", name_bn: "রংপুর" },
      { id: "Mymensingh", name: "Mymensingh", name_bn: "ময়মনসিংহ" },
    ],
    []
  );

  // Canonical destination counts per division
  const divisionCounts = useMemo<Record<string, number>>(() => {
    return {
      all: TOTAL_DESTINATIONS,
      ...DIVISION_COUNTS,
    };
  }, []);

  // Filter destinations based on active division
  const filteredDestinations = useMemo(() => {
    if (selectedDivision === "all") return allDestinations;
    return allDestinations.filter((d) => d.division === selectedDivision);
  }, [selectedDivision]);

  // Spatial clustering algorithm
  const computeClusters = useCallback(
    (
      destinations: Destination[],
      map: Leaflet.Map,
      L: typeof Leaflet,
      radiusPixels: number = 65
    ): ClusterItem[] => {
      const zoom = map.getZoom();

      // Deep inspection zoom: show single pins
      if (zoom >= 12) {
        return destinations.map((dest) => ({
          id: `single-${dest.id}`,
          lat: dest.latitude,
          lng: dest.longitude,
          count: 1,
          points: [dest],
        }));
      }

      const clusters: ClusterItem[] = [];
      const projected = destinations.map((dest) => ({
        dest,
        pt: map.project(L.latLng(dest.latitude, dest.longitude), zoom),
      }));

      for (const item of projected) {
        let merged = false;
        for (const cluster of clusters) {
          const clusterPt = map.project(L.latLng(cluster.lat, cluster.lng), zoom);
          const dist = clusterPt.distanceTo(item.pt);
          if (dist <= radiusPixels) {
            const nextCount = cluster.count + 1;
            cluster.lat = (cluster.lat * cluster.count + item.dest.latitude) / nextCount;
            cluster.lng = (cluster.lng * cluster.count + item.dest.longitude) / nextCount;
            cluster.points.push(item.dest);
            cluster.count = nextCount;
            merged = true;
            break;
          }
        }

        if (!merged) {
          clusters.push({
            id: `cluster-${item.dest.id}`,
            lat: item.dest.latitude,
            lng: item.dest.longitude,
            count: 1,
            points: [item.dest],
          });
        }
      }

      return clusters;
    },
    []
  );

  // Render clusters and single markers onto the map
  const updateMapMarkers = useCallback(
    async (L: typeof Leaflet) => {
      const map = mapInstanceRef.current;
      const markersGroup = markersLayerRef.current;
      if (!map || !markersGroup) return;

      markersGroup.clearLayers();

      const clusters = computeClusters(filteredDestinations, map, L, 65);

      clusters.forEach((cluster) => {
        if (cluster.count === 1) {
          // Render Single Marker Pin
          const dest = cluster.points[0];
          const singlePinIcon = L.divIcon({
            className: "gh-single-pin-wrapper",
            html: `
              <div class="gh-single-pin" title="${dest.name}">
                <div class="gh-single-pin-inner"></div>
              </div>
            `,
            iconSize: [32, 32],
            iconAnchor: [16, 32],
            popupAnchor: [0, -32],
          });

          const marker = L.marker([dest.latitude, dest.longitude], {
            icon: singlePinIcon,
            title: isBn ? dest.name_bn || dest.name : dest.name,
          });

          marker.on("click", () => {
            setActiveSpot(dest);
            map.panTo([dest.latitude, dest.longitude], { animate: true });
          });

          markersGroup.addLayer(marker);
        } else {
          // Render Cluster Bubble
          let sizeClass = "gh-cluster-sm";
          let iconDimensions: [number, number] = [42, 42];

          if (cluster.count >= 40) {
            sizeClass = "gh-cluster-lg gh-cluster-pulse";
            iconDimensions = [58, 58];
          } else if (cluster.count >= 10) {
            sizeClass = "gh-cluster-md";
            iconDimensions = [50, 50];
          }

          const clusterIcon = L.divIcon({
            className: "gh-cluster-bubble-wrapper",
            html: `
              <div class="gh-cluster-bubble ${sizeClass}" title="${formatDigits(cluster.count, isBn)} ${
              isBn ? "টি গন্তব্য (জুম করতে ট্যাপ করুন)" : "Destinations (Tap to zoom)"
            }">
                <span>${formatDigits(cluster.count, isBn)}</span>
              </div>
            `,
            iconSize: iconDimensions,
            iconAnchor: [iconDimensions[0] / 2, iconDimensions[1] / 2],
          });

          const clusterMarker = L.marker([cluster.lat, cluster.lng], {
            icon: clusterIcon,
          });

          clusterMarker.on("click", () => {
            if (cluster.points.length > 0) {
              const bounds = L.latLngBounds(
                cluster.points.map((p) => [p.latitude, p.longitude])
              );
              map.fitBounds(bounds.pad(0.35), {
                padding: [28, 28],
                maxZoom: Math.min(map.getZoom() + 3, 14),
                animate: true,
              });
            }
          });

          markersGroup.addLayer(clusterMarker);
        }
      });
    },
    [computeClusters, filteredDestinations, isBn]
  );

  updateMapMarkersRef.current = updateMapMarkers;

  // Initialize Map
  useEffect(() => {
    let isMounted = true;
    let handleTouchStart: ((e: TouchEvent) => void) | null = null;
    let handleTouchMove: ((e: TouchEvent) => void) | null = null;
    let handleTouchEnd: (() => void) | null = null;

    async function initMap() {
      if (!mapContainerRef.current) return;

      const L = (await import("leaflet")).default;
      if (!isMounted || !mapContainerRef.current) return;

      // Clean up previous instance
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      const container = mapContainerRef.current as HTMLElement & {
        _leaflet_id?: number | null;
      };
      if (container._leaflet_id) {
        container._leaflet_id = null;
      }

      // Initialize map with disabled default zoomControl (we use custom sleek controls)
      const map = L.map(container, {
        center: [23.75, 90.35],
        zoom: 7,
        minZoom: 6,
        maxZoom: 16,
        zoomControl: false,
        scrollWheelZoom: false,
      });

      // Clean OpenStreetMap standard tile layer (100% free, no API key required, zero watermarks)
      const tileUrl = "https://tile.openstreetmap.org/{z}/{x}/{y}.png";

      const tileLayer = L.tileLayer(tileUrl, {
        maxZoom: 19,
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors',
      }).addTo(map);

      tileLayerRef.current = tileLayer;

      // Create LayerGroup for markers
      const markersLayer = L.layerGroup().addTo(map);
      markersLayerRef.current = markersLayer;

      mapInstanceRef.current = map;

      // Touch gesture handling: avoid mobile scroll trapping (two-finger pan/zoom only)
      const isTouchDevice =
        typeof window !== "undefined" &&
        ("ontouchstart" in window || navigator.maxTouchPoints > 0);

      if (isTouchDevice) {
        map.dragging.disable();
      }

      handleTouchStart = (e: TouchEvent) => {
        if (e.touches.length >= 2) {
          map.dragging.enable();
          setShowTouchHint(false);
          if (touchHintTimeoutRef.current) clearTimeout(touchHintTimeoutRef.current);
        } else {
          map.dragging.disable();
        }
      };

      handleTouchMove = (e: TouchEvent) => {
        if (e.touches.length === 1) {
          setShowTouchHint(true);
          if (touchHintTimeoutRef.current) clearTimeout(touchHintTimeoutRef.current);
          touchHintTimeoutRef.current = setTimeout(() => {
            setShowTouchHint(false);
          }, 1500);
        } else if (e.touches.length >= 2) {
          map.dragging.enable();
          setShowTouchHint(false);
          if (touchHintTimeoutRef.current) clearTimeout(touchHintTimeoutRef.current);
        }
      };

      handleTouchEnd = () => {
        if (isTouchDevice) {
          map.dragging.disable();
        }
      };

      container.addEventListener("touchstart", handleTouchStart, { passive: true });
      container.addEventListener("touchmove", handleTouchMove, { passive: true });
      container.addEventListener("touchend", handleTouchEnd, { passive: true });

      // Listen to map zoom & move to dynamically recalculate clusters
      map.on("zoomend", () => {
        setCurrentZoom(map.getZoom());
        if (updateMapMarkersRef.current) {
          void updateMapMarkersRef.current(L);
        }
      });

      map.on("moveend", () => {
        if (updateMapMarkersRef.current) {
          void updateMapMarkersRef.current(L);
        }
      });

      void updateMapMarkers(L);

      // Invalidate map size on window resize / orientation change and after mount
      const handleResize = () => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.invalidateSize();
        }
      };

      window.addEventListener("resize", handleResize);
      window.addEventListener("orientationchange", handleResize);

      const timerId = setTimeout(() => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.invalidateSize();
        }
      }, 250);

      cleanupResize = () => {
        window.removeEventListener("resize", handleResize);
        window.removeEventListener("orientationchange", handleResize);
        clearTimeout(timerId);
      };
    }

    let cleanupResize: (() => void) | null = null;
    void initMap();

    return () => {
      isMounted = false;
      if (cleanupResize) cleanupResize();
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
      if (mapContainerRef.current) {
        const container = mapContainerRef.current as HTMLElement & {
          _leaflet_id?: number | null;
        };
        if (container._leaflet_id) {
          container._leaflet_id = null;
        }
        if (handleTouchStart) container.removeEventListener("touchstart", handleTouchStart);
        if (handleTouchMove) container.removeEventListener("touchmove", handleTouchMove);
        if (handleTouchEnd) container.removeEventListener("touchend", handleTouchEnd);
      }
      if (touchHintTimeoutRef.current) {
        clearTimeout(touchHintTimeoutRef.current);
      }
    };
  }, [theme]); // Re-initialize or swap tile on theme change

  // Trigger marker update when division filter or language changes
  useEffect(() => {
    async function refreshMarkersOnFilter() {
      if (!mapInstanceRef.current) return;
      const L = (await import("leaflet")).default;
      const map = mapInstanceRef.current;

      void updateMapMarkers(L);

      // Smoothly zoom to division bounds
      if (selectedDivision !== "all" && filteredDestinations.length > 0) {
        const bounds = L.latLngBounds(
          filteredDestinations.map((d) => [d.latitude, d.longitude])
        );
        map.fitBounds(bounds.pad(0.2), { padding: [28, 28], animate: true });
      }
    }

    void refreshMarkersOnFilter();
  }, [selectedDivision, filteredDestinations, isBn, updateMapMarkers]);

  // Toolbar Actions
  const handleResetView = () => {
    setSelectedDivision("all");
    setActiveSpot(null);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([23.75, 90.35], 7, { animate: true });
    }
  };

  const handleZoomIn = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomIn();
    }
  };

  const handleZoomOut = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomOut();
    }
  };

  return (
    <section
      id="map"
      className="py-20 bg-[var(--surface-raised)] border-y border-[var(--border-color)] relative"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#047857]/10 text-xs font-bold text-[#047857] dark:text-[#2ecc71] mb-2 border border-[#047857]/20 dark:border-[#2ecc71]/20">
              <Compass className="w-3.5 h-3.5 animate-spin-slow" />
              <span>{isBn ? "স্মার্ট ভ্রমণ মানচিত্র" : "Smart Interactive Map"}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight">
              {isBn ? "মানচিত্রে খুঁজুন আপনার গন্তব্য" : "Explore Bangladesh On The Map"}
            </h2>
            <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
              {isBn
                ? `ক্লাস্টার বুদবুদে ট্যাপ করে জুম করুন অথবা নির্দিষ্ট বিভাগ বেছে নিয়ে ${formatNumberEnBn(TOTAL_DESTINATIONS, true)}+ দর্শনীয় স্থান আবিষ্কার করুন।`
                : `Tap clusters to zoom into regional highlights or filter by division to explore all ${TOTAL_DESTINATIONS}+ curated destinations.`}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/destinations"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface border border-[var(--border-color)] text-xs font-bold text-foreground hover:bg-[#0f4a38] hover:text-white dark:hover:bg-[#1f9d76] transition-all shadow-sm group"
            >
              <span>{isBn ? "সকল গন্তব্যের তালিকা" : "All Destinations Directory"}</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Division Filter Tabs: Scroll-safe container with proximity snap and edge padding */}
        <div className="flex items-center gap-2 overflow-x-auto overscroll-contain snap-x snap-proximity px-4 sm:px-0 -mx-4 sm:mx-0 scroll-px-4 pb-4 mb-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {divisions.map((d) => {
            if (
              d.id !== "all" &&
              divisionCounts[d.id] === undefined &&
              process.env.NODE_ENV !== "production"
            ) {
              console.warn(`[MapSection] Missing destination count for division key: "${d.id}"`);
            }
            const count = divisionCounts[d.id] || 0;
            const isSelected = selectedDivision === d.id;

            return (
              <button
                key={d.id}
                onClick={() => setSelectedDivision(d.id)}
                className={`flex-none snap-start px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? "bg-[#0f4a38] text-white shadow-md dark:bg-[#1f9d76] ring-2 ring-[#0f4a38]/30 dark:ring-[#1f9d76]/30"
                    : "bg-surface hover:bg-black/5 dark:hover:bg-white/10 text-foreground/80 border border-[var(--border-color)]"
                }`}
              >
                <span>{isBn ? d.name_bn : d.name}</span>
                <span
                  className={`text-xs px-1.5 py-0.2 rounded-full font-semibold ${
                    isSelected
                      ? "bg-[#f4a340] text-black"
                      : "bg-black/5 dark:bg-white/10 text-muted-foreground"
                  }`}
                >
                  {formatDigits(count, isBn)}
                </span>
              </button>
            );
          })}
          <div className="w-4 shrink-0 sm:hidden" aria-hidden="true" />
        </div>

        {/* Map Container & Overlays */}
        <div className="relative rounded-3xl overflow-hidden border border-[var(--border-color)] shadow-2xl bg-surface group pb-0.5">
          {/* Leaflet DOM Node */}
          <div
            ref={mapContainerRef}
            className="w-full h-[540px] sm:h-[620px] z-0 focus:outline-none"
            aria-label="Interactive Map of Bangladesh"
            tabIndex={0}
          />

          {/* Mobile 2-Finger Pan/Zoom Hint Overlay */}
          <div
            className={`absolute inset-0 bg-black/40 backdrop-blur-[2px] z-[650] flex items-center justify-center transition-opacity duration-300 pointer-events-none ${
              showTouchHint ? "opacity-100" : "opacity-0"
            }`}
            aria-live="polite"
          >
            <div className="px-5 py-3 rounded-2xl bg-black/85 text-white text-xs sm:text-sm font-bold shadow-2xl border border-white/20 flex items-center gap-2.5 animate-in fade-in zoom-in-95 duration-150">
              <Hand className="w-5 h-5 text-white shrink-0" strokeWidth={1.75} aria-hidden="true" />
              <span>
                {isBn
                  ? "মানচিত্র সরাতে দুটি আঙুল ব্যবহার করুন"
                  : "Use two fingers to move the map"}
              </span>
            </div>
          </div>

          {/* Single Unified Map Overlay Layer (z-[700] stays strictly above .leaflet-marker-pane at 600) */}
          <div className="absolute inset-x-0 top-0 p-3 z-[700] pointer-events-none flex items-start justify-between gap-2">
            {/* Status Chip when filter is active (no zoom text) */}
            {selectedDivision !== "all" ? (
              <div className="pointer-events-auto max-w-[calc(100%-84px)] truncate">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[rgba(7,26,19,0.88)] border border-white/15 backdrop-blur-[8px] shadow-lg text-xs font-semibold text-[#e8f5ee] max-w-full">
                  <Sparkles className="w-3.5 h-3.5 text-[#f4a340] shrink-0" />
                  <span className="truncate">
                    {isBn
                      ? `${formatDigits(filteredDestinations.length, true)} টি স্থান প্রদর্শিত`
                      : `Showing ${filteredDestinations.length} places`}
                  </span>
                </div>
              </div>
            ) : (
              <div />
            )}

            {/* Unified Themed Control Stack (Top-Right, 12px inset, column, gap:8px, buttons 44x44px) */}

            {/* Unified Themed Control Stack (Top-Right, 12px inset, column, gap:8px, buttons 44x44px) */}
            <div className="pointer-events-auto flex flex-col gap-2 shrink-0">
              {/* Zoom Controls */}
              <div className="flex flex-col gap-1 p-1 rounded-[12px] bg-[rgba(7,26,19,0.88)] border border-white/12 backdrop-blur-[8px] shadow-lg text-[#e8f5ee]">
                <button
                  onClick={handleZoomIn}
                  aria-label="Zoom in"
                  className="w-[44px] h-[44px] min-w-[44px] min-h-[44px] rounded-[10px] flex items-center justify-center hover:bg-white/10 active:bg-white/20 text-[#e8f5ee] transition-colors cursor-pointer"
                >
                  <Plus className="w-5 h-5" />
                </button>
                <div className="h-[1px] bg-white/10 mx-1" />
                <button
                  onClick={handleZoomOut}
                  aria-label="Zoom out"
                  className="w-[44px] h-[44px] min-w-[44px] min-h-[44px] rounded-[10px] flex items-center justify-center hover:bg-white/10 active:bg-white/20 text-[#e8f5ee] transition-colors cursor-pointer"
                >
                  <Minus className="w-5 h-5" />
                </button>
              </div>

              {/* Reset View Button */}
              <button
                onClick={handleResetView}
                title={isBn ? "মানচিত্র রিসেট করুন" : "Reset Map View"}
                aria-label="Reset Map View"
                className="w-[44px] h-[44px] min-w-[44px] min-h-[44px] rounded-[12px] bg-[rgba(7,26,19,0.88)] border border-white/12 backdrop-blur-[8px] shadow-lg flex items-center justify-center hover:bg-[#0f4a38] active:bg-[#156b50] text-[#e8f5ee] transition-all cursor-pointer group"
              >
                <RotateCcw className="w-4 h-4 group-hover:-rotate-45 transition-transform" />
              </button>
            </div>
          </div>

          {/* Active Spot Floating Card (Bottom-Left) */}
          {activeSpot && (() => {
            const activeSpotImageSrc = activeSpot.image
              ? activeSpot.image.startsWith("http") || activeSpot.image.startsWith("/")
                ? activeSpot.image
                : `/${activeSpot.image.replace(/^\/+/, "")}`
              : "/assets/destinations/sajek-valley.webp";

            return (
              <div className="absolute bottom-6 left-6 right-6 sm:right-auto sm:max-w-md z-[1000] p-4.5 rounded-2xl bg-white/95 dark:bg-[#0c241c]/95 backdrop-blur-xl border border-white/30 dark:border-white/10 shadow-2xl animate-in fade-in-50 slide-in-from-bottom-4 duration-250">
                <div className="flex gap-4">
                  {/* Thumbnail Image */}
                  <div className="relative w-24 h-24 rounded-xl overflow-hidden shrink-0 bg-gray-200 shadow-inner">
                    <Image
                      src={activeSpotImageSrc}
                      alt={
                        isBn
                          ? `${activeSpot.name_bn || activeSpot.name}, ${activeSpot.district}`
                          : `${activeSpot.name} in ${activeSpot.district}, ${activeSpot.division}`
                      }
                      fill
                      sizes="96px"
                      className="object-cover"
                    />
                  </div>

                  {/* Spot Details */}
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-start justify-between gap-1">
                      <h3 className="text-base font-black text-foreground truncate">
                        {isBn ? activeSpot.name_bn || activeSpot.name : activeSpot.name}
                      </h3>
                      <button
                        onClick={() => setActiveSpot(null)}
                        aria-label="Close"
                        className="text-muted-foreground hover:text-foreground p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <p className="text-xs text-muted-foreground flex items-center gap-1 font-medium">
                      <MapPin className="w-3 h-3 text-[#f4a340] shrink-0" />
                      <span className="truncate">
                        {isBn
                          ? `${getDistrictBn(activeSpot.district)}, ${getDivisionBn(activeSpot.division)}`
                          : `${activeSpot.district}, ${activeSpot.division}`}
                      </span>
                    </p>

                    <p className="text-xs text-foreground/85 line-clamp-2 leading-relaxed pt-0.5">
                      {isBn && translations[activeSpot.slug]?.shortDesc
                        ? translations[activeSpot.slug].shortDesc
                        : activeSpot.shortDesc}
                    </p>

                    <div className="pt-2 flex items-center gap-2">
                      <Link
                        href={`/destinations/${activeSpot.slug}`}
                        className="px-3.5 py-1.5 rounded-lg bg-[#0f4a38] text-white text-xs font-bold hover:bg-[#156b50] transition-colors inline-flex items-center gap-1 shadow-sm"
                      >
                        <span>{isBn ? "পূর্ণাঙ্গ ভ্রমণ গাইড" : "View Full Guide"}</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>

                      {activeSpot.category && (
                        <span className="text-xs font-semibold px-2 py-1 rounded-md bg-[#047857]/10 text-[#047857] dark:text-[#2ecc71] truncate max-w-[120px]">
                          {isBn ? CATEGORIES_BN[activeSpot.category] || activeSpot.category : activeSpot.category}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      </div>
    </section>
  );
}
