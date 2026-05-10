import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { MAPBOX } from "@/config";

import { useEffect, useMemo, useRef, useState } from "react";
import { useTheme } from "@/components/ThemeProvider";
import { useWeather } from "@/hooks/useWeather";
import type { LngLatLike, Map as MapType } from "mapbox-gl";
import { Marker } from "@/components/Marker";

export const Map = () => {
    const { theme } = useTheme();
    const { weather } = useWeather();
    const mapContainerRef = useRef<HTMLDivElement | null>(null);
    const [map, setMap] = useState<MapType | null>(null);
    const [quotaExceeded, setQuotaExceeded] = useState(false);

    const center = useMemo<LngLatLike>(
        () => weather ? [weather.location.lon, weather.location.lat] : MAPBOX.DEFAULTS.CENTER,
        [weather]
    );

    useEffect(() => {
        const token = import.meta.env.VITE_MAPBOX_TOKEN;
        if (!mapContainerRef.current || !token) return;

        // Quota Check
        const currentMonth = new Date().getMonth();
        const stored = JSON.parse(localStorage.getItem(MAPBOX.QUOTA.STORE_KEY) || '{"count":0, "month":-1}');
        
        let newCount = stored.month === currentMonth ? stored.count : 0;
        
        if (newCount >= MAPBOX.QUOTA.MONTHLY_LIMIT) {
            setQuotaExceeded(true);
            return;
        }

        // Increment and store
        newCount += 1;
        localStorage.setItem(MAPBOX.QUOTA.STORE_KEY, JSON.stringify({ count: newCount, month: currentMonth }));

        mapboxgl.accessToken = token;

        const mapInstance = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: "mapbox://styles/mapbox/standard",
            center,
            zoom: MAPBOX.DEFAULTS.ZOOM,
            interactive: true,
            attributionControl: false,
        });

        setMap(mapInstance);

        return () => mapInstance.remove();
    }, []); // Initialize only once

    useEffect(() => {
        if (!map || !center) return;
        map.flyTo({ center, duration: 2000 });
    }, [map, center]);

    useEffect(() => {
        if (!map) return;

        const resolvedTheme = theme === 'system' 
            ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
            : theme;

        map.on('style.load', () => {
            map.setConfigProperty('basemap', 'lightPreset', resolvedTheme === 'light' ? 'day' : 'night');
        });

        if (map.isStyleLoaded()) {
            map.setConfigProperty('basemap', 'lightPreset', resolvedTheme === 'light' ? 'day' : 'night');
        }
    }, [map, theme]);


    return (
        <div ref={mapContainerRef} className="relative h-[300px] bg-card text-card-foreground rounded-xl border overflow-hidden shadow-sm flex items-center justify-center">
            {quotaExceeded && (
                <div className="text-center p-4">
                    <p className="text-sm font-medium text-muted-foreground">Map quota reached for this month.</p>
                </div>
            )}
            {map && (
                <Marker map={map} coordinates={center} />
            )}
        </div>
    )
}