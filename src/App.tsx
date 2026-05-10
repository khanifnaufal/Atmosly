import { ThemeProvider } from "./components/ThemeProvider";
import { WeatherProvider } from "./components/WeatherProvider";
import { TopAppBar } from "./components/TopAppBar";
import { PageHeader } from "./components/PageHeader";
import { CurrentWeatherCard } from "@/components/CurrentWeatherCard";
import { Map } from "@/components/Map";
import { HourlyWeatherTabs } from "@/components/HourlyWeatherTabs";


export const App = () => {
  return (
    <ThemeProvider>
      <WeatherProvider>

      <TopAppBar/>
      <main className="py-4">
        <div className="container">
          <PageHeader/>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <CurrentWeatherCard/>

            <Map/>
          </div>

          <HourlyWeatherTabs/>
        </div>
      </main>
      </WeatherProvider>
    </ThemeProvider>
  )
}