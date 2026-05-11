import { useTheme } from "@/components/ThemeProvider";
import { useMemo } from "react";

/**
 * Custom hook to generate a dynamic background based on weather condition and time of day.
 * 
 * @param weatherId - OpenWeatherMap weather condition ID
 * @param timezone - Timezone offset in seconds from UTC
 * @param sunrise - Sunrise Unix timestamp
 * @param sunset - Sunset Unix timestamp
 * @returns An object containing className and style for the background
 */
export const useWeatherBackground = (
  weatherId?: number, 
  timezone: number = 0, 
  sunrise?: number, 
  sunset?: number
) => {
  const { theme } = useTheme();

  const background = useMemo(() => {
    // Determine effective theme (handle 'system')
    const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

    // Calculate local time
    const now = Math.floor(Date.now() / 1000);
    const localTime = now + timezone;
    const date = new Date(localTime * 1000);
    const hour = date.getUTCHours();

    // Determine time phase
    let timePhase: 'morning' | 'noon' | 'evening' | 'night' = 'noon';
    if (hour >= 5 && hour < 9) timePhase = 'morning';
    else if (hour >= 9 && hour < 15) timePhase = 'noon';
    else if (hour >= 15 && hour < 18) timePhase = 'evening';
    else timePhase = 'night';

    // Base Gradients (Light Mode)
    const lightGradients = {
      morning: 'from-amber-100 via-orange-100 to-sky-200',
      noon: 'from-sky-300 via-blue-200 to-white',
      evening: 'from-orange-200 via-red-200 to-purple-300',
      night: 'from-slate-800 via-slate-900 to-black',
    };

    // Base Gradients (Dark Mode)
    const darkGradients = {
      morning: 'from-orange-950 via-slate-900 to-slate-950',
      noon: 'from-blue-950 via-slate-900 to-black',
      evening: 'from-purple-950 via-red-950 to-black',
      night: 'from-black via-slate-950 to-blue-950',
    };

    const baseGradient = isDark ? darkGradients[timePhase] : lightGradients[timePhase];

    // Weather Effects (Overrides/Overlays)
    let weatherOverlay = '';
    if (weatherId) {
      if (weatherId >= 200 && weatherId < 300) { // Thunderstorm
        weatherOverlay = isDark ? 'bg-purple-950/40' : 'bg-slate-900/30';
      } else if (weatherId >= 300 && weatherId < 600) { // Rain/Drizzle
        weatherOverlay = isDark ? 'bg-blue-950/30' : 'bg-blue-200/20';
      } else if (weatherId >= 600 && weatherId < 700) { // Snow
        weatherOverlay = isDark ? 'bg-blue-100/10' : 'bg-white/40';
      } else if (weatherId >= 700 && weatherId < 800) { // Mist/Fog
        weatherOverlay = 'backdrop-blur-sm bg-white/10';
      } else if (weatherId > 800) { // Clouds
        weatherOverlay = isDark ? 'bg-slate-800/20' : 'bg-slate-400/10';
      }
    }

    return {
      containerClass: `fixed inset-0 -z-10 bg-gradient-to-br ${baseGradient} transition-all duration-1000`,
      overlayClass: `fixed inset-0 -z-10 ${weatherOverlay} transition-all duration-1000`,
    };
  }, [weatherId, timezone, theme]);

  return background;
};
