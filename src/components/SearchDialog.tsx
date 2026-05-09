import { APP, WEATHER_API } from "@/config";
import { useEffect, useCallback, useState } from "react";

import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Kbd, KbdGroup } from "@/components/ui/kbd";
import { Separator } from "@/components/ui/separator";
import { Item, ItemContent, ItemGroup, ItemTitle, ItemDescription, ItemActions } from "@/components/ui/item";
import { Button } from "@/components/ui/button";

import { MapPinnedIcon, SearchIcon } from "lucide-react";

import type { Geocoding } from '@/types';
import { openWeatherApi } from "@/api";
import { Input } from "@base-ui/react";
import { useWeather } from "@/hooks/useWeather";

export const SearchDialog = () => {
    const { setWeather } = useWeather();
    const [search, setSearch] = useState<string>('');
    const [results, setResults] = useState<Geocoding[]>([]);
    const [SearchDialogOpen, setSearchDialogOpen] = useState<boolean>(false);

    const geocoding = useCallback(async (search: string) => {
        if (!search) return;

        const response = await openWeatherApi.get<Geocoding[]>('/geo/1.0/direct', {
            params: {
                q: search,
                limit: WEATHER_API.DEFAULTS.SEARCH_RESULT_LIMIT,
            },
        });

        return response.data as Geocoding[];

    }, []);

    useEffect(() => {
        const shortcut = (event: KeyboardEvent) => {
            if (event.key === 'k' && (event.metaKey || event.ctrlKey)) {
                event.preventDefault();
                setSearchDialogOpen(true);
            }
        }
        document.addEventListener('keydown', shortcut);

        return () => document.removeEventListener('keydown', shortcut);
    }, [])

    useEffect(() => {
        if (!search) return;

        (async () => {
            const results = await geocoding(search);

            console.log("results found", results);

            if (results) setResults(results);
        })()
    }, [search, geocoding]);

    return (
        <Dialog open={SearchDialogOpen} onOpenChange={setSearchDialogOpen}>
            <DialogTrigger render={
                <Button variant="ghost" className="me-auto max-lg:size=9 lg:bg-secondary dark:lg:bg-secondary/50"
                    onClick={() => setSearchDialogOpen((prev) => !prev)}>
                    <SearchIcon className="lg:text-muted-foreground" />
                    <div className="flex justify-between w-[250px] max-lg:hidden">Search Weather...
                        <KbdGroup>
                            <Kbd>Ctrl</Kbd>
                            <Kbd>K</Kbd>
                        </KbdGroup>
                    </div>
                </Button>
            } />
            <DialogContent className='p-0 bg-card gap-0' showCloseButton={false}>
                <DialogHeader className="sr-only">
                    <DialogTitle>Search Weather</DialogTitle>
                    <DialogDescription>Search for a city to get the weather forecast</DialogDescription>
                </DialogHeader>
                <InputGroup className="ring-0! border-t-0! border-x-0! border-b border-border! rounded-b-none bg-transparent!">
                    <InputGroupInput placeholder="Search weather..." value={search} onInput={(e) => setSearch(e.currentTarget.value)} />

                    <InputGroupAddon>
                        <SearchIcon />
                    </InputGroupAddon>
                </InputGroup>
                <ItemGroup className="min-h-80 p-4 overflow-y-auto">
                    {!results.length && (
                        <p className="text-center text-sm py-4">No result found!</p>
                    )}
                    {results.map(({ name, lat, lon, state, country }) => (
                        <Item 
                            key={name + lat + lon} 
                            size="sm" 
                            className="relative p-2 cursor-pointer hover:bg-accent rounded-md transition-colors flex items-center justify-between group"
                            onClick={() => {
                                setWeather({ lat, lon });
                                localStorage.setItem(APP.STORE_KEY.LAT, lat.toString());
                                localStorage.setItem(APP.STORE_KEY.LON, lon.toString());
                                setSearchDialogOpen(false);
                            }}
                        >
                            <ItemContent>
                                <ItemTitle className="font-medium">{name}</ItemTitle>
                                <ItemDescription className="text-xs text-muted-foreground">
                                    {state ? state + ', ' : ''}{country}
                                </ItemDescription>
                            </ItemContent>
                            <ItemActions>
                                <MapPinnedIcon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                            </ItemActions>
                        </Item>
                    ))}

                </ItemGroup>
            </DialogContent>

        </Dialog>
    )
}