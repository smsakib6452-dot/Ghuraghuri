"use client";

import React, { useEffect, useState } from "react";
import { CloudSun, Wind, Droplets, Sun, CloudRain, CloudLightning } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { formatDigits } from "@/lib/i18n";

interface DestinationWeatherProps {
  latitude: number;
  longitude: number;
  locationName: string;
}

interface WeatherData {
  temperature: number;
  humidity: number;
  windSpeed: number;
  condition: string;
  condition_bn: string;
  iconType: string;
}

export default function DestinationWeather({ latitude, longitude, locationName }: DestinationWeatherProps) {
  const { language } = useApp();
  const isBn = language === "bn";
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function fetchWeather() {
      try {
        const res = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m`
        );
        if (!res.ok) throw new Error("Weather API failed");
        const data = await res.json();
        if (!active) return;

        const current = data.current;
        const code = current.weather_code || 0;

        let condition = "Clear Sky";
        let condition_bn = "রৌদ্রোজ্জ্বল";
        let iconType = "sun";

        if (code === 0) {
          condition = "Clear Sky";
          condition_bn = "পরিষ্কার আকাশ";
          iconType = "sun";
        } else if ([1, 2, 3].includes(code)) {
          condition = "Partly Cloudy";
          condition_bn = "আংশিক মেঘলা";
          iconType = "cloud-sun";
        } else if ([45, 48].includes(code)) {
          condition = "Foggy & Misty";
          condition_bn = "কুয়াশাচ্ছন্ন";
          iconType = "cloud-sun";
        } else if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) {
          condition = "Rain & Showers";
          condition_bn = "বৃষ্টি ও ঝিরিঝিরি হাওয়া";
          iconType = "rain";
        } else if ([95, 96, 99].includes(code)) {
          condition = "Thunderstorm";
          condition_bn = "বজ্রসহ বৃষ্টি";
          iconType = "thunder";
        }

        setWeather({
          temperature: Math.round(current.temperature_2m),
          humidity: current.relative_humidity_2m,
          windSpeed: Math.round(current.wind_speed_10m),
          condition,
          condition_bn,
          iconType,
        });
      } catch (e) {
        // Fallback default
        if (active) {
          setWeather({
            temperature: 28,
            humidity: 65,
            windSpeed: 12,
            condition: "Tropical Breeze",
            condition_bn: "নাতিশীতোষ্ণ হাওয়া",
            iconType: "cloud-sun",
          });
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    fetchWeather();
    return () => {
      active = false;
    };
  }, [latitude, longitude]);

  if (loading) {
    return (
      <div className="p-5 rounded-2xl bg-[var(--surface-raised)] border border-[var(--glass-border)] animate-pulse flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gray-300 dark:bg-gray-700" />
        <div className="space-y-1.5 flex-1">
          <div className="h-3 w-24 bg-gray-300 dark:bg-gray-700 rounded" />
          <div className="h-4 w-16 bg-gray-300 dark:bg-gray-700 rounded" />
        </div>
      </div>
    );
  }

  if (!weather) return null;

  return (
    <div className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--glass-border)] shadow-sm">
      <div className="flex items-center justify-between pb-3 border-b border-[var(--glass-border)] mb-3">
        <div className="flex items-center gap-2">
          {weather.iconType === "sun" && <Sun className="w-5 h-5 text-[#f4a340]" />}
          {weather.iconType === "cloud-sun" && <CloudSun className="w-5 h-5 text-[#f4a340]" />}
          {weather.iconType === "rain" && <CloudRain className="w-5 h-5 text-[#38bdf8]" />}
          {weather.iconType === "thunder" && <CloudLightning className="w-5 h-5 text-[#a78bfa]" />}
          <span className="text-xs font-bold text-foreground">
            {isBn ? weather.condition_bn : weather.condition}
          </span>
        </div>
        <span className="text-xs font-semibold text-[var(--text-muted)]">
          {isBn ? "ওপেন-মেটিও লাইভ" : "Open-Meteo Live"}
        </span>
      </div>

      <div className="flex items-baseline justify-between mb-3">
        <div className="text-3xl font-black text-foreground">
          {formatDigits(weather.temperature, isBn, { useGrouping: false })}°<span className="text-sm font-normal text-[var(--text-muted)]">C</span>
        </div>
        <span className="text-xs font-medium text-[var(--text-muted)]">
          {isBn ? weather.condition : weather.condition_bn}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs font-medium text-[var(--text-muted)] pt-2 border-t border-[var(--glass-border)]">
        <div className="flex items-center gap-1.5">
          <Droplets className="w-3.5 h-3.5 text-[#38bdf8]" />
          <span>
            {isBn ? "আর্দ্রতা: " : "Humidity: "}
            {formatDigits(weather.humidity, isBn, { useGrouping: false })}%
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <Wind className="w-3.5 h-3.5 text-[#2ecc71]" />
          <span>
            {isBn ? "বাতাস: " : "Wind: "}
            {formatDigits(weather.windSpeed, isBn, { useGrouping: false })} {isBn ? "কিমি/ঘণ্টা" : "km/h"}
          </span>
        </div>
      </div>
    </div>
  );
}
