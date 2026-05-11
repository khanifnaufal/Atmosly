import React from 'react';
import { Cloud, Droplets, Thermometer, Wind, Gauge, Layers } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LayerTogglePanelProps {
    activeLayer: string;
    onLayerChange: (layer: string) => void;
}

const layers = [
    { id: 'none', label: 'None', icon: Layers },
    { id: 'precipitation', label: 'Precipitation', icon: Droplets },
    { id: 'clouds', label: 'Clouds', icon: Cloud },
    { id: 'temperature', label: 'Temperature', icon: Thermometer },
    { id: 'wind', label: 'Wind Speed', icon: Wind },
    { id: 'pressure', label: 'Pressure', icon: Gauge },
];

/**
 * A floating panel with glassmorphism style to toggle between different weather layers.
 */
export const LayerTogglePanel: React.FC<LayerTogglePanelProps> = ({ activeLayer, onLayerChange }) => {
    return (
        <div className="absolute top-4 right-4 z-20 flex flex-col gap-1 p-1.5 bg-background/60 backdrop-blur-md border border-white/20 rounded-xl shadow-2xl animate-in fade-in slide-in-from-right-4 duration-300">
            {layers.map((layer) => (
                <button
                    key={layer.id}
                    onClick={() => onLayerChange(layer.id)}
                    className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 group",
                        activeLayer === layer.id
                            ? "bg-primary text-primary-foreground shadow-md scale-[1.02]"
                            : "hover:bg-white/10 text-muted-foreground hover:text-foreground"
                    )}
                >
                    <layer.icon 
                        size={16} 
                        className={cn(
                            "transition-transform group-hover:scale-110",
                            activeLayer === layer.id ? "text-primary-foreground" : "text-primary"
                        )} 
                    />
                    <span className="whitespace-nowrap">{layer.label}</span>
                </button>
            ))}
        </div>
    );
};
