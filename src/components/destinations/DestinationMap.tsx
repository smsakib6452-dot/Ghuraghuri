"use client";

import React, { useEffect, useRef, useState } from "react";

interface DestinationMapProps {
  name: string;
  latitude: number;
  longitude: number;
}

export default function DestinationMap({ name, latitude, longitude }: DestinationMapProps) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<any>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isMapReady, setIsMapReady] = useState(false);

  // IntersectionObserver: trigger only when map container nears viewport (300px)
  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    if (!("IntersectionObserver" in window)) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "300px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible || !mapContainerRef.current) return;

    let isCancelled = false;

    // Dynamically import Leaflet JS & CSS only after entering viewport proximity
    Promise.all([
      import("leaflet"),
      import("leaflet/dist/leaflet.css"),
    ]).then(([leafletModule]) => {
      const L = (leafletModule.default || leafletModule) as typeof import("leaflet");
      if (isCancelled || !mapContainerRef.current) return;

      // Clean existing instance
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
      (mapContainerRef.current as any)._leaflet_id = null;

      const map = L.map(mapContainerRef.current, {
        center: [latitude, longitude],
        zoom: 12,
        scrollWheelZoom: false,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);

      // Custom marker icon
      const customIcon = L.divIcon({
        className: "custom-dest-pin",
        html: `<div style="background:#0f4a38;color:#fff;width:34px;height:34px;border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 14px rgba(0,0,0,0.3);border:2px solid #2ecc71;font-size:16px;">📍</div>`,
        iconSize: [34, 34],
        iconAnchor: [17, 34],
      });

      L.marker([latitude, longitude], { icon: customIcon })
        .addTo(map)
        .bindPopup(`<b>${name}</b><br><span style="font-size:12px;color:#666;">${latitude.toFixed(4)}, ${longitude.toFixed(4)}</span>`)
        .openPopup();

      const isTouchDevice =
        typeof window !== "undefined" &&
        ("ontouchstart" in window || navigator.maxTouchPoints > 0);

      if (isTouchDevice) {
        map.dragging.disable();
      }

      const container = mapContainerRef.current;
      const handleTouchStart = (e: TouchEvent) => {
        if (e.touches.length >= 2) {
          map.dragging.enable();
        } else {
          map.dragging.disable();
        }
      };
      const handleTouchEnd = () => {
        if (isTouchDevice) {
          map.dragging.disable();
        }
      };

      if (container) {
        container.addEventListener("touchstart", handleTouchStart, { passive: true });
        container.addEventListener("touchend", handleTouchEnd, { passive: true });
      }

      mapInstanceRef.current = map;
      setIsMapReady(true);
    }).catch(() => {
      // Graceful fallback if offline
    });

    return () => {
      isCancelled = true;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
      if (mapContainerRef.current) {
        (mapContainerRef.current as any)._leaflet_id = null;
      }
    };
  }, [isVisible, latitude, longitude, name]);

  return (
    <div
      ref={wrapperRef}
      className="w-full h-56 rounded-2xl overflow-hidden border border-[var(--glass-border)] shadow-sm relative z-0 bg-[var(--surface-raised)]"
    >
      <div ref={mapContainerRef} className="w-full h-full">
        {!isMapReady && (
          <div className="w-full h-full flex flex-col items-center justify-center text-xs text-[var(--text-muted)] font-medium gap-1.5 animate-pulse">
            <span className="text-xl">📍</span>
            <span>Interactive Map</span>
          </div>
        )}
      </div>
    </div>
  );
}
