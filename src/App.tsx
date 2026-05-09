import { ThemeProvider } from "./components/ThemeProvider";
import { WeatherProvider } from "./components/WeatherProvider";
import { TopAppBar } from "./components/TopAppBar";
import { PageHeader } from "./components/PageHeader";


export const App = () => {
  return (
    <ThemeProvider>
      <WeatherProvider>

      <TopAppBar/>
      <main className="py-4">
        <div className="container">
          <PageHeader/>
        </div>
      </main>
      </WeatherProvider>
    </ThemeProvider>
  )
}