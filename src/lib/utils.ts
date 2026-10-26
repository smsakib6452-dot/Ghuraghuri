import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPriceBDT(amount: number): string {
  return `৳${amount.toLocaleString("en-BD")}`;
}

export function formatNumberEnBn(num: number, isBn: boolean): string {
  if (!isBn) return num.toLocaleString("en-US");
  const bnDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
  return num
    .toString()
    .replace(/\d/g, (d) => bnDigits[parseInt(d, 10)]);
}
