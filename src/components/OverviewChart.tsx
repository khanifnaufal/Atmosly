import { useMemo } from "react";
import { useWeather } from "@/hooks/useWeather";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "./ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import { APP } from "@/config";
import type { ChartConfig } from "@/components/ui/chart";

const chartConfig = {
    temp: {
        label: 'Temperature',
        color: 'var(--chart-1)'
    },
    feels: {
        label: 'Feels like',
        color: 'var(--muted-foreground)'
    }
} satisfies ChartConfig

export const OverviewChart = () => {
    const { weather, unit } = useWeather();

    const chartData = useMemo(() => {
        return weather?.hourly.map((item) => ({
            time: new Date(item.dt * 1000).toLocaleTimeString('en-US', { hour: 'numeric', hour12: true }),
            temp: item.temp.toFixed(),
            feels: item.feels_like.toFixed(),
        }));
    }, [weather]);

    if (!chartData) return <Skeleton className="h-[360px]" />

    return (
        <ChartContainer config={chartConfig} className="h-[360px] w-full">
            <AreaChart
                accessibilityLayer
                data={chartData}
            >
                <CartesianGrid strokeDasharray="4 4" />
                <XAxis dataKey='time'
                    tickLine={false}
                    axisLine={false}
                    tickCount={12}
                    tickMargin={16}
                />
                <YAxis
                    dataKey='temp'
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value}${APP.UNIT.TEMP[unit]}`}
                    tickCount={5}
                    tickMargin={16}
                />
                <ChartTooltip cursor={false} content={
                    <ChartTooltipContent />
                } />

                <defs>
                    <linearGradient id="fillTemp" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={1} />
                        <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
                    </linearGradient>
                </defs>
                <Area dataKey='temp' type='natural' fill="url(#fillTemp)" fillOpacity={0.5} stroke='var(--chart-1)' strokeWidth={2} />
                <Area dataKey='feels' type='natural' fillOpacity={0} stroke='var(--muted-foreground)' strokeWidth={2} strokeDasharray="4 4" activeDot={false} />
                <ChartLegend content={<ChartLegendContent />} />

            </AreaChart>

        </ChartContainer>
    )
}