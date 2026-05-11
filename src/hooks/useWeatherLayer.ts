import { useEffect, useState } from 'react';
import type { Map } from 'mapbox-gl';

/**
 * Custom hook to handle OpenWeatherMap tile layers on a Mapbox instance.
 * Handles adding/removing sources and layers with smooth opacity transitions.
 */
export const useWeatherLayer = (map: Map | null, activeLayer: string, owmApiKey: string) => {
    const [isLayerLoading, setIsLayerLoading] = useState(false);

    useEffect(() => {
        if (!map) return;

        const layerId = 'owm-weather-layer';
        const sourceId = 'owm-weather-source';

        // Helper to remove existing layer and source
        const cleanup = () => {
            if (map.getLayer(layerId)) {
                map.removeLayer(layerId);
            }
            if (map.getSource(sourceId)) {
                map.removeSource(sourceId);
            }
        };

        // If 'none', just clean up and exit
        if (activeLayer === 'none') {
            cleanup();
            setIsLayerLoading(false);
            return;
        }

        // Mapping internal keys to OWM layer names
        const owmLayerMap: Record<string, string> = {
            precipitation: 'precipitation_new',
            clouds: 'clouds_new',
            temperature: 'temp_new',
            wind: 'wind_new',
            pressure: 'pressure_new',
        };

        const owmLayerName = owmLayerMap[activeLayer];
        if (!owmLayerName) return;

        setIsLayerLoading(true);
        cleanup();

        console.log(`Adding weather layer: ${activeLayer} with URL: https://tile.openweathermap.org/map/${owmLayerName}/{z}/{x}/{y}.png?appid=...`);

        // Add new source
        map.addSource(sourceId, {
            type: 'raster',
            tiles: [
                `https://tile.openweathermap.org/map/${owmLayerName}/{z}/{x}/{y}.png?appid=${owmApiKey}`
            ],
            tileSize: 256,
        });

        // Add new layer
        map.addLayer({
            id: layerId,
            type: 'raster',
            source: sourceId,
            paint: {
                'raster-opacity': 0.7, // Set directly to 0.7 for testing
                'raster-opacity-transition': { duration: 500 }
            }
        });

        setIsLayerLoading(false);

        return () => {
            cleanup();
        };
    }, [map, activeLayer, owmApiKey]);

    return { isLayerLoading };
};
