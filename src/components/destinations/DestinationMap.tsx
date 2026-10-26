"use client";

import React, { useEffect, useRef, useState } from "react";
import "leaflet/dist/leaflet.css";

interface DestinationMapProps {
  name: string;
  latitude: number;
  longitude: number;
}

export default function DestinationMap({ name, latitude, longitude }: DestinationMapProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<any>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !mapContainerRef.current) return;

    let isCancelled = false;

    // Dynamically import Leaflet client-side
    import("leaflet").then((L) => {
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
  }, [mounted, latitude, longitude, name]);

  if (!mounted) {
    return (
      <div className="w-full h-56 rounded-2xl bg-[var(--surface-raised)] border border-[var(--glass-border)] animate-pulse flex items-center justify-center text-xs text-[var(--text-muted)] font-medium">
        Loading Map...
      </div>
    );
  }

  return (
    <div className="w-full h-56 rounded-2xl overflow-hidden border border-[var(--glass-border)] shadow-sm relative z-0">
      <div ref={mapContainerRef} className="w-full h-full" />
    </div>
  );
}
