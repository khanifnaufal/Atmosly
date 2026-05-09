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
import { Navigation2Icon } from 'lucide-react'
import type { WeatherUnitType } from '@/components/WeatherProvider'

export const CurrentWeatherCard = () => {
    const { weather } = useWeather();
    if (!weather) return <Skeleton className='min-h-[300px] rounded-xl' />
    const CurrentWeather = {
        dt: new Date(weather.current.dt * 1000).toLocaleString('en-US', {
            timeStyle: 'short',
        }),
        iconCode: weather.current.weather[0].icon,
        temp: weather.current.temp.toFixed(),
        description: weather.current.weather[0].description,
        feelsLike: weather.current.feels_like.toFixed(),
        windSpeed: weather.current.wind_speed.toFixed(),
        windDeg: weather.current.wind_deg,
        humidity: weather.current.humidity.toFixed(),
        visibility: (weather.current.visibility / 1000).toFixed(),
        pressure: weather.current.pressure,
        dewPoint: weather.current.dew_point.toFixed(),
    };
    const weatherUnit = (localStorage.getItem(APP.STORE_KEY.UNIT) as WeatherUnitType) || WEATHER_API.DEFAULTS.UNIT;
    return (
        <Card className='@container min-h-[300px]'>
            <CardHeader>
                <CardTitle>
                    Current Weather
                </CardTitle>
                <CardDescription>
                    {CurrentWeather.dt}
                </CardDescription>
            </CardHeader>
            <CardContent className='grow'>
                <div className="flex flex-wrap items-center gap-x-6">
                    <figure>
                        <img src={`https://openweathermap.org/img/wn/${CurrentWeather.iconCode}@4x.png`}
                            alt={CurrentWeather.description}
                            width={70}
                            height={70}
                            className='object-contain' />
                    </figure>
                    <p className="text-5xl font-medium flex items-start sm:text-7xl">
                        {CurrentWeather.temp}
                        <span className="text-3xl">
                            {APP.UNIT.TEMP[weatherUnit]}
                        </span>
                    </p>
                    <div>
                        <p className="font-medium capitalize sm:text-lg">
                            {CurrentWeather.description}
                        </p>
                        <div className="text-sm flex items-center gap-2">
                            <span className="text-muted-foreground">
                                Feels like 
                            </span>
                            <span>{CurrentWeather.feelsLike}°</span>
                        </div>
                    </div>
                </div>

            </CardContent>
            <CardFooter className='flex-wrap gap-x-8 gap-y-2 @lg:justify-between'>
                <div>
                    <p className="text-sm text-muted-foreground">Wind</p>
                    <div className="flex items-center gap-1">
                        <p>{CurrentWeather.windSpeed} {APP.UNIT.WIND[weatherUnit]}</p>
                        <Navigation2Icon size={14} fill='currentColor'
                        style={{rotate: `${CurrentWeather.windDeg}deg`,}}/>
                    </div>
                </div>

                <div>
                    <p className="text-sm text-muted-foreground">Humidity</p>
                    <div className="flex itemns-center gap-1">
                        <p>{CurrentWeather.humidity}%</p>
                    </div>
                </div>
                <div>
                    <p className="text-sm text-muted-foreground">Visibility</p>
                    <div className="flex itemns-center gap-1">
                        <p>{CurrentWeather.visibility} km</p>
                    </div>
                </div>
                <div>
                    <p className="text-sm text-muted-foreground">Pressure</p>
                    <div className="flex itemns-center gap-1">
                        <p>{CurrentWeather.pressure} hPa</p>
                    </div>
                </div>
                <div>
                    <p className="text-sm text-muted-foreground">Dew Point</p>
                    <div className="flex itemns-center gap-1">
                        <p>{CurrentWeather.dewPoint}°</p>
                    </div>
                </div>
            </CardFooter>
        </Card>
    )
}