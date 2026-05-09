import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

type GeoLocationRes = {
  lat: number;
  lon: number;
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getUserLocation = (): Promise<GeoLocationRes> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation){
      reject('Geolocation not supported')
    } else{
      navigator.geolocation.getCurrentPosition((position) => {
        resolve({lat:position.coords.latitude, lon:position.coords.longitude})
      }, (err) => {
        reject(err.message)
      })
    }
  })
}
