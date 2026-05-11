import { APP, WEATHER_API } from '@/config'
import { useWeather } from '@/hooks/useWeather'
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Navigation2Icon, Sunrise, Sunset } from 'lucide-react'
import type { WeatherUnitType } from '@/components/WeatherProvider'
import { cn } from '@/lib/utils'

/**
 * ANIMATED WEATHER ICONS (Pure CSS)
 * Custom component to render animated weather icons based on OpenWeatherMap codes
 */
const AnimatedWeatherIcon = ({ iconCode }: { iconCode: string }) => {
  const isDay = iconCode.endsWith('d');
  const code = iconCode.substring(0, 2);

  return (
    <div className="relative w-20 h-20 flex items-center justify-center">
      <style>{`
        @keyframes sun-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes cloud-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        @keyframes rain-fall {
          0% { transform: translateY(-10px); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateY(10px); opacity: 0; }
        }
        @keyframes snow-fall {
          0% { transform: translateY(-10px) translateX(0); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateY(10px) translateX(5px); opacity: 0; }
        }
        @keyframes lightning-flash {
          0%, 90%, 100% { opacity: 0; }
          92%, 95% { opacity: 1; }
        }
        .weather-sun { animation: sun-spin 10s linear infinite; }
        .weather-cloud { animation: cloud-float 3s ease-in-out infinite; }
        .weather-rain-drop { animation: rain-fall 1s linear infinite; }
        .weather-snow-flake { animation: snow-fall 2s linear infinite; }
        .weather-lightning { animation: lightning-flash 2s linear infinite; }
      `}</style>
      
      {/* 01: Clear Sky */}
      {code === '01' && (
        <div className={cn("w-12 h-12 rounded-full weather-sun shadow-[0_0_20px_rgba(252,211,77,0.8)]", 
          isDay ? "bg-amber-400" : "bg-slate-200 shadow-[0_0_15px_rgba(255,255,255,0.5)]")}>
          {!isDay && <div className="absolute top-1 right-1 w-8 h-8 bg-slate-800 rounded-full" />}
        </div>
      )}

      {/* 02, 03, 04: Clouds */}
      {(code === '02' || code === '03' || code === '04') && (
        <div className="relative">
          {code === '02' && (
            <div className="absolute -top-4 -right-2 w-8 h-8 bg-amber-400 rounded-full weather-sun" />
          )}
          <div className="weather-cloud relative">
            <div className="w-14 h-6 bg-white dark:bg-slate-300 rounded-full shadow-md" />
            <div className="absolute -top-4 left-2 w-7 h-7 bg-white dark:bg-slate-300 rounded-full" />
            <div className="absolute -top-3 left-6 w-5 h-5 bg-white dark:bg-slate-300 rounded-full" />
          </div>
        </div>
      )}

      {/* 09, 10: Rain */}
      {(code === '09' || code === '10') && (
        <div className="relative">
          <div className="weather-cloud relative z-10">
            <div className="w-14 h-6 bg-slate-400 rounded-full" />
            <div className="absolute -top-4 left-2 w-7 h-7 bg-slate-400 rounded-full" />
          </div>
          <div className="absolute top-6 left-2 flex gap-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="weather-rain-drop w-0.5 h-3 bg-blue-400 rounded-full" style={{ animationDelay: `${i * 0.3}s` }} />
            ))}
          </div>
        </div>
      )}

      {/* 11: Thunderstorm */}
      {code === '11' && (
        <div className="relative">
          <div className="weather-cloud relative z-10">
            <div className="w-14 h-6 bg-slate-600 rounded-full" />
            <div className="absolute -top-4 left-2 w-7 h-7 bg-slate-600 rounded-full" />
          </div>
          <div className="weather-lightning absolute top-4 left-4 text-yellow-400">
            <svg width="20" height="30" viewBox="0 0 24 24" fill="currentColor">
              <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" />
            </svg>
          </div>
        </div>
      )}

      {/* 13: Snow */}
      {code === '13' && (
        <div className="relative">
          <div className="weather-cloud relative z-10">
            <div className="w-14 h-6 bg-slate-200 rounded-full" />
          </div>
          <div className="absolute top-6 left-2 flex gap-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="weather-snow-flake w-1.5 h-1.5 bg-white rounded-full shadow-sm" style={{ animationDelay: `${i * 0.5}s` }} />
            ))}
          </div>
        </div>
      )}

      {/* 50: Mist/Atmosphere */}
      {code === '50' && (
        <div className="flex flex-col gap-1">
          {[1, 2, 3].map((i) => (
            <div key={i} className="w-12 h-1 bg-slate-300 rounded-full animate-pulse" style={{ animationDelay: `${i * 0.4}s` }} />
          ))}
        </div>
      )}
    </div>
  );
};

interface CurrentWeatherCardProps {
    weatherData?: any; // To allow passing raw response from API
}

export const CurrentWeatherCard = ({ weatherData }: CurrentWeatherCardProps) => {
    // Fallback to hook if props are not provided
    const { weather: contextWeather } = useWeather();
    const weather = weatherData || contextWeather;

    if (!weather) return <Skeleton className='min-h-[300px] rounded-xl' />

    // Mapping data from One Call 3.0 (weather.current) or direct Weather API (weatherData)
    const current = weather.current || weather;
    const sys = current.sys || weather.sys || {};
    
    const CurrentWeather = {
        dt: current.dt,
        formattedTime: new Date(current.dt * 1000).toLocaleString('en-US', {
            timeStyle: 'short',
        }),
        iconCode: current.weather[0].icon,
        temp: current.temp.toFixed(),
        description: current.weather[0].description,
        feelsLike: current.feels_like.toFixed(),
        windSpeed: (current.wind_speed || current.wind?.speed || 0).toFixed(),
        windDeg: current.wind_deg || current.wind?.deg || 0,
        humidity: current.humidity,
        visibility: (current.visibility / 1000).toFixed(),
        pressure: current.pressure,
        dewPoint: current.dew_point || 0,
        sunrise: current.sunrise || sys.sunrise,
        sunset: current.sunset || sys.sunset,
        timezone: weather.timezone?.offset || weather.timezone || 0,
    };

    const weatherUnit = (localStorage.getItem(APP.STORE_KEY.UNIT) as WeatherUnitType) || WEATHER_API.DEFAULTS.UNIT;

    // 2. SUNRISE & SUNSET BAR LOGIC
    const now = CurrentWeather.dt;
    const sunrise = CurrentWeather.sunrise;
    const sunset = CurrentWeather.sunset;
    let sunPosition = 0;
    
    if (now > sunset) sunPosition = 100;
    else if (now < sunrise) sunPosition = 0;
    else sunPosition = ((now - sunrise) / (sunset - sunrise)) * 100;

    const formatLocalTime = (timestamp: number) => {
        return new Date(timestamp * 1000).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });
    };

    // 3. COMFORT LEVEL INDICATOR LOGIC
    const getComfortLevel = (dewPoint: number) => {
        if (dewPoint > 24) return { label: "Sangat Gerah", color: "bg-red-500" };
        if (dewPoint > 21) return { label: "Gerah", color: "bg-orange-500" };
        if (dewPoint > 18) return { label: "Cukup Gerah", color: "bg-yellow-500 text-black" };
        return { label: "Nyaman", color: "bg-green-500" };
    };
    const comfort = getComfortLevel(CurrentWeather.dewPoint);

    // 4. FEELS LIKE CONTEXT LABEL LOGIC
    const getFeelsLikeContext = (temp: number) => {
        if (temp > 35) return "🔥 Sangat panas, hindari aktivitas luar ruangan";
        if (temp > 28) return "☀️ Panas, tetap terhidrasi";
        if (temp > 20) return "😊 Nyaman untuk beraktivitas";
        return "🧥 Sejuk, pertimbangkan pakai jaket";
    };
    const feelsLikeContext = getFeelsLikeContext(Number(CurrentWeather.feelsLike));

    return (
        <Card className='@container min-h-[300px] overflow-hidden'>
            <CardHeader>
                <CardTitle>
                    Current Weather
                </CardTitle>
                <CardDescription>
                    {CurrentWeather.formattedTime}
                </CardDescription>
            </CardHeader>
            <CardContent className='grow space-y-6'>
                <div className="flex flex-wrap items-center gap-x-6">
                    {/* 1. ANIMATED WEATHER ICON */}
                    <AnimatedWeatherIcon iconCode={CurrentWeather.iconCode} />
                    
                    <p className="text-5xl font-medium flex items-start sm:text-7xl">
                        {CurrentWeather.temp}
                        <span className="text-3xl">
                            {APP.UNIT.TEMP[weatherUnit]}
                        </span>
                    </p>
                    
                    <div className="flex-1 min-w-[150px]">
                        <p className="font-medium capitalize sm:text-lg">
                            {CurrentWeather.description}
                        </p>
                        <div className="space-y-1">
                            <div className="text-sm flex items-center gap-2">
                                <span className="text-muted-foreground">
                                    Feels like 
                                </span>
                                <span className="font-semibold">{CurrentWeather.feelsLike}°</span>
                            </div>
                            
                            {/* 3. COMFORT LEVEL BADGE */}
                            <div className={cn("inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider", comfort.color)}>
                                {comfort.label}
                            </div>
                            
                            {/* 4. FEELS LIKE CONTEXT */}
                            <p className="text-xs text-muted-foreground italic">
                                {feelsLikeContext}
                            </p>
                        </div>
                    </div>
                </div>

                {/* 2. SUNRISE & SUNSET BAR */}
                <div className="space-y-2 py-2">
                    <div className="flex justify-between text-[10px] text-muted-foreground font-medium uppercase tracking-tighter">
                        <div className="flex items-center gap-1">
                            <Sunrise size={12} className="text-amber-500" />
                            <span>Sunrise {formatLocalTime(sunrise)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Sunset size={12} className="text-orange-500" />
                            <span>Sunset {formatLocalTime(sunset)}</span>
                        </div>
                    </div>
                    <div className="relative h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                        <div 
                            className="absolute top-0 left-0 h-full bg-gradient-to-r from-amber-300 via-amber-500 to-orange-400 transition-all duration-1000"
                            style={{ width: `${sunPosition}%` }}
                        />
                        {/* Sun position indicator */}
                        <div 
                            className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white border-2 border-amber-500 rounded-full shadow-[0_0_8px_rgba(245,158,11,0.8)] transition-all duration-1000"
                            style={{ left: `calc(${sunPosition}% - 6px)` }}
                        />
                    </div>
                </div>

            </CardContent>
            
            {/* EXISTING STATS ROW */}
            <CardFooter className='flex-wrap gap-x-8 gap-y-4 @lg:justify-between border-t pt-4'>
                <div>
                    <p className="text-xs text-muted-foreground font-medium uppercase">Wind</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                        <Navigation2Icon size={14} className="text-primary fill-primary/20"
                        style={{rotate: `${CurrentWeather.windDeg}deg`,}}/>
                        <p className="text-sm font-semibold">{CurrentWeather.windSpeed} {APP.UNIT.WIND[weatherUnit]}</p>
                    </div>
                </div>

                <div>
                    <p className="text-xs text-muted-foreground font-medium uppercase">Humidity</p>
                    <div className="mt-0.5">
                        <p className="text-sm font-semibold">{CurrentWeather.humidity}%</p>
                    </div>
                </div>
                <div>
                    <p className="text-xs text-muted-foreground font-medium uppercase">Visibility</p>
                    <div className="mt-0.5">
                        <p className="text-sm font-semibold">{CurrentWeather.visibility} km</p>
                    </div>
                </div>
                <div>
                    <p className="text-xs text-muted-foreground font-medium uppercase">Pressure</p>
                    <div className="mt-0.5">
                        <p className="text-sm font-semibold">{CurrentWeather.pressure} hPa</p>
                    </div>
                </div>
                <div>
                    <p className="text-xs text-muted-foreground font-medium uppercase">Dew Point</p>
                    <div className="mt-0.5">
                        <p className="text-sm font-semibold">{CurrentWeather.dewPoint.toFixed()}°</p>
                    </div>
                </div>
            </CardFooter>
        </Card>
    )
}