import React from 'react';

interface WeatherLegendProps {
    activeLayer: string;
}

const legendConfig: Record<string, { label: string; unit: string; gradient: string; min: string; max: string }> = {
    precipitation: {
        label: 'Precipitation',
        unit: 'mm',
        gradient: 'linear-gradient(to right, #ffffff, #87ceeb, #0000ff, #800080)',
        min: '0',
        max: '100+',
    },
    clouds: {
        label: 'Clouds',
        unit: '%',
        gradient: 'linear-gradient(to right, transparent, #d1d5db, #ffffff)',
        min: '0',
        max: '100',
    },
    temperature: {
        label: 'Temperature',
        unit: '°C',
        gradient: 'linear-gradient(to right, #4575b4, #91bfdb, #fee090, #fc8d59, #d73027)',
        min: '-40',
        max: '40',
    },
    wind: {
        label: 'Wind Speed',
        unit: 'm/s',
        gradient: 'linear-gradient(to right, #ffffff, #ffff00, #ffa500, #ff0000)',
        min: '0',
        max: '50',
    },
    pressure: {
        label: 'Pressure',
        unit: 'hPa',
        gradient: 'linear-gradient(to right, #00ff00, #ffff00, #ff0000)',
        min: '950',
        max: '1070',
    },
};

/**
 * Displays a color scale legend for the active weather layer.
 */
export const WeatherLegend: React.FC<WeatherLegendProps> = ({ activeLayer }) => {
    const config = legendConfig[activeLayer];

    if (!config) return null;

    return (
        <div className="absolute bottom-4 right-4 z-20 w-64 p-3 bg-background/60 backdrop-blur-md border border-white/20 rounded-xl shadow-2xl animate-in slide-in-from-bottom-4 duration-300">
            <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{config.label}</span>
                <span className="text-[10px] font-medium bg-secondary px-1.5 py-0.5 rounded text-secondary-foreground">{config.unit}</span>
            </div>
            
            <div 
                className="h-2 w-full rounded-full mb-1.5" 
                style={{ background: config.gradient }}
            />
            
            <div className="flex justify-between text-[10px] font-mono text-muted-foreground">
                <span>{config.min}</span>
                <span>{config.max}</span>
            </div>
        </div>
    );
};
