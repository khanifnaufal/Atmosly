import { useMemo } from "react";
import { useWeather } from "@/hooks/useWeather";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "./ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import { APP } from "@/config";
import type { ChartConfig } from "@/components/ui/chart";

const chartConfig = {
    feels: {
        label: 'Feels Like',
        color: 'var(--chart-2)'
    }
} satisfies ChartConfig

export const FeelsLikeChart = () => {
    const { weather, unit } = useWeather();

    const chartData = useMemo(() => {
        return weather?.hourly.map((item) => ({
            time: new Date(item.dt * 1000).toLocaleTimeString('en-US', { hour: 'numeric', hour12: true }),
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
                    dataKey='feels'
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
                    <linearGradient id="fillFeels" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="var(--chart-2)" stopOpacity={1} />
                        <stop offset="100%" stopColor="var(--chart-2)" stopOpacity={0} />
                    </linearGradient>
                </defs>

                <Area dataKey='feels' type='natural' fill="url(#fillFeels)" fillOpacity={0.5} stroke='var(--chart-2)' strokeWidth={2} />
                <ChartLegend content={<ChartLegendContent />} />

            </AreaChart>

        </ChartContainer>
    )
}
