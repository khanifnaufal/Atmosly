import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

type GeoLocationRes = {
  lat: number;
  lon: number;
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
