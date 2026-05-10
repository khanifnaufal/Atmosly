import { createContext } from "react";
import { APP, WEATHER_API } from "@/config";
import { useState, useEffect, useCallback } from "react";
import type { CurrentWeather, MinutelyForecast, HourlyForecast, DailyForecast, Alert, Geocoding, WeatherTimezone, OneCallWeatherRes } from "@/types";
import { openWeatherApi } from "@/api";

type Weather = {
    current: CurrentWeather;
    minutely: MinutelyForecast[];
    hourly: HourlyForecast[];
    daily: DailyForecast[];
    alerts?: Alert[];
    location: Geocoding;
    timezone: WeatherTimezone;
};

export type WeatherUnitType = 'metric' | 'imperial';

type WeatherStateParam = {
    lat?: number;
    lon?: number;
    unit?: WeatherUnitType;
};

type WeatherProviderState = {
    weather: Weather | null;
    setWeather: (weather: WeatherStateParam) => void;
};

const initialState: WeatherProviderState = {
    weather: null,
    setWeather: () => null,
}

export const WeatherProviderContext = createContext<WeatherProviderState>(initialState);
export const WeatherProvider = ({ children }: React.PropsWithChildren) => {
    const defaultLat = Number(localStorage.getItem(APP.STORE_KEY.LAT)) || WEATHER_API.DEFAULTS.LAT;
    const defaultLon = Number(localStorage.getItem(APP.STORE_KEY.LON)) || WEATHER_API.DEFAULTS.LON;
    const defaultUnit = (localStorage.getItem(APP.STORE_KEY.UNIT) as WeatherUnitType) || WEATHER_API.DEFAULTS.UNIT;

    const [weather, setWeather] = useState<Weather | null>(null);
    const oneCall = useCallback(async (lat: number, lon: number, units: WeatherUnitType) => {
        const response = await openWeatherApi.get('/data/3.0/onecall', {
            params: {
                lat,
                lon,
                units,

            }
        });

        console.log(response.data);
        return response.data as OneCallWeatherRes;
    }, []);

    const reverseGeo = useCallback(async (lat: number, lon: number, limit = 1) => {
        const response = await openWeatherApi.get('/geo/1.0/reverse', {
            params: {
                lat,
                lon,
                limit,
            }
        });

        return response.data as Geocoding[];
    }, []);
    const getWeather = useCallback(async ({ lat = defaultLat, lon = defaultLon, unit = defaultUnit }: WeatherStateParam) => {
        const oneCallRes = await oneCall(lat, lon, unit);
        const reverseGeoRes = await reverseGeo(lat, lon);
        setWeather({
            current: oneCallRes.current,
            minutely: oneCallRes.minutely,
            hourly: oneCallRes.hourly,
            daily: oneCallRes.daily,
            alerts: oneCallRes.alerts,
            location: reverseGeoRes[0],
            timezone: {
                timezone: oneCallRes.timezone,
                offset: oneCallRes.timezone_offset,
            },
        });


    },
        [defaultLat, defaultLon, defaultUnit, oneCall, reverseGeo],
    );

    useEffect(() => {
        (async () => await getWeather({}))();
    }, []);



    return (
        <WeatherProviderContext.Provider value={{ weather, setWeather: getWeather }}>
            {children}
        </WeatherProviderContext.Provider>
    )
}