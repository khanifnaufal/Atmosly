import { APP, WEATHER_API } from "@/config"

import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuRadioGroup,
    DropdownMenuGroup,
    DropdownMenuLabel,
    DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu"
import { useWeather } from "@/hooks/useWeather"
import type { WeatherUnitType } from "@/components/WeatherProvider"


export const UnitDropdown = () => {
    const {setWeather} = useWeather();

    const [unit, setUnit] = useState<WeatherUnitType>((localStorage.getItem(APP.STORE_KEY.UNIT) as WeatherUnitType) || WEATHER_API.DEFAULTS.UNIT);

    useEffect(() => {
        setWeather({
            unit,
        })

        localStorage.setItem(APP.STORE_KEY.UNIT, unit);
    }, [unit]);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="secondary" size="icon">
                    °{unit === 'metric' ? 'C' : 'F'}
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-[150px]">
                {/* Bungkus bagian ini dengan DropdownMenuGroup */}
                <DropdownMenuGroup>
                    <DropdownMenuLabel className="text-muted-foreground">
                        Weather Settings
                    </DropdownMenuLabel>
                    <DropdownMenuRadioGroup value={unit} onValueChange={(value) => setUnit(value as WeatherUnitType)}>
                        <DropdownMenuRadioItem value="metric">
                            Metrics ℃
                        </DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="imperial">
                            Fahrenheit °F
                        </DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}