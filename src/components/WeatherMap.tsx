import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { MAPBOX } from "@/config";

import { useEffect, useMemo, useRef, useState } from "react";
import { useTheme } from "@/components/ThemeProvider";
import { useWeather } from "@/hooks/useWeather";
import type { LngLatLike, Map as MapType } from "mapbox-gl";
import { Marker } from "@/components/Marker";
import { useWeatherLayer } from "@/hooks/useWeatherLayer";
import { LayerTogglePanel } from "./LayerTogglePanel";
import { WeatherLegend } from "./WeatherLegend";
import { openWeatherApi } from "@/api";

interface WeatherMapProps {
    onLocationChange?: (data: { lat: number; lng: number; weatherData: any }) => void;
}

/**
 * Enhanced Map component with weather layer toggles, legend, and click-to-locate functionality.
 */
export const WeatherMap = ({ onLocationChange }: WeatherMapProps) => {
    const { theme } = useTheme();
    const { weather } = useWeather();
    const mapContainerRef = useRef<HTMLDivElement | null>(null);
    const [map, setMap] = useState<MapType | null>(null);
    const [activeLayer, setActiveLayer] = useState('none');
    const [isLoading, setIsLoading] = useState(false);

    const owmApiKey = import.meta.env.VITE_OPENWEATHER_API;

    // Initialize weather layer logic via custom hook
    useWeatherLayer(map, activeLayer, owmApiKey);

    const center = useMemo<LngLatLike>(
        () => weather ? [weather.location.lon, weather.location.lat] : MAPBOX.DEFAULTS.CENTER,
        [weather]
    );

    useEffect(() => {
        const token = import.meta.env.VITE_MAPBOX_TOKEN;
        if (!mapContainerRef.current || !token) return;

        mapboxgl.accessToken = token;

        const mapInstance = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: "mapbox://styles/mapbox/standard",
            center,
            zoom: MAPBOX.DEFAULTS.ZOOM,
            interactive: true,
            attributionControl: false,
        });

        // Click handler to update location
        mapInstance.on('click', async (e) => {
            const { lng, lat } = e.lngLat;
            setIsLoading(true);
            
            try {
                // Fetch basic weather data for the new location
                const response = await openWeatherApi.get('/data/2.5/weather', {
                    params: { lat, lon: lng }
                });
                
                // Trigger callback if provided
                if (onLocationChange) {
                    onLocationChange({ lat, lng, weatherData: response.data });
                }
            } catch (error) {
                console.error("Failed to fetch weather for new location:", error);
            } finally {
                setIsLoading(false);
            }
        });

        setMap(mapInstance);

        return () => mapInstance.remove();
    }, []);

    // Synchronize map center with weather location changes
    useEffect(() => {
        if (!map || !center) return;
        map.flyTo({ center, duration: 2000, essential: true });
    }, [map, center]);

    // Handle theme changes for Mapbox style
    useEffect(() => {
        if (!map) return;

        const resolvedTheme = theme === 'system' 
            ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
            : theme;

        const applyTheme = () => {
            if (map.isStyleLoaded()) {
                map.setConfigProperty('basemap', 'lightPreset', resolvedTheme === 'light' ? 'day' : 'night');
            }
        };

        map.on('style.load', applyTheme);
        applyTheme();
    }, [map, theme]);

    return (
        <div 
            ref={mapContainerRef} 
            className="relative h-[400px] lg:h-full min-h-[400px] bg-card text-card-foreground rounded-xl border overflow-hidden shadow-sm isolate"
        >
            {/* Loading Overlay */}
            {isLoading && (
                <div className="absolute inset-0 z-50 bg-background/40 backdrop-blur-sm flex items-center justify-center animate-in fade-in duration-300">
                    <div className="flex flex-col items-center gap-3">
                        <div className="relative size-10">
                            <div className="absolute inset-0 rounded-full border-4 border-primary/20"></div>
                            <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
                        </div>
                        <span className="text-sm font-semibold tracking-tight text-foreground">Fetching weather data...</span>
                    </div>
                </div>
            )}
            
            {/* Overlay UI Components */}
            <LayerTogglePanel activeLayer={activeLayer} onLayerChange={setActiveLayer} />
            <WeatherLegend activeLayer={activeLayer} />

            {/* Marker Layer */}
            {map && (
                <Marker map={map} coordinates={center} />
            )}
        </div>
    );
};
