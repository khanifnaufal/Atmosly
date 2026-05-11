import { ThemeProvider } from "./components/ThemeProvider";
import { WeatherProvider } from "./components/WeatherProvider";
import { TopAppBar } from "./components/TopAppBar";
import { PageHeader } from "./components/PageHeader";
import { CurrentWeatherCard } from "@/components/CurrentWeatherCard";
import { WeatherMap } from "@/components/WeatherMap";
import { HourlyWeatherTabs } from "@/components/HourlyWeatherTabs";
import { useWeather } from "@/hooks/useWeather";
import { useWeatherBackground } from "@/hooks/useWeatherBackground";

const AppContent = () => {
  const { weather, setWeather } = useWeather();
  const background = useWeatherBackground(
    weather?.current.weather[0].id,
    weather?.timezone.offset,
    weather?.current.sunrise,
    weather?.current.sunset
  );

  return (
    <div className="relative min-h-screen">
      {/* Dynamic Background Layers */}
      <div className={background.containerClass} />
      <div className={background.overlayClass} />
      
      <TopAppBar/>
      <main className="py-4 relative z-10">
        <div className="container">
          <PageHeader/>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <CurrentWeatherCard/>
            <WeatherMap onLocationChange={({ lat, lng }) => setWeather({ lat, lon: lng })} />
          </div>

          <HourlyWeatherTabs/>
        </div>
      </main>
    </div>
  );
}

export const App = () => {
  return (
    <ThemeProvider>
      <WeatherProvider>
        <AppContent />
      </WeatherProvider>
    </ThemeProvider>
  )
}