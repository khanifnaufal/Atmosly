import { useMemo } from "react";
import { useWeather } from "@/hooks/useWeather";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "./ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import type { ChartConfig } from "@/components/ui/chart";

const chartConfig = {
    uv: {
        label: 'UV Index',
        color: 'var(--uv)'
    },
} satisfies ChartConfig

export const UvIndexChart = () => {
    const { weather } = useWeather();

    const chartData = useMemo(() => {
        return weather?.hourly.map((item) => ({
            time: new Date(item.dt * 1000).toLocaleTimeString('en-US', { hour: 'numeric', hour12: true }),
            uv: item.uvi,
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
                    dataKey='uv'
                    domain={[0, 12]}
                    tickLine={false}
                    axisLine={false}
                    tickMargin={16}
                />
                <ChartTooltip cursor={false} content={
                    <ChartTooltipContent />
                } />
                <defs>
                    <linearGradient id="fillUv" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="var(--uv)" stopOpacity={1} />
                        <stop offset="100%" stopColor="var(--uv)" stopOpacity={0} />
                    </linearGradient>
                </defs>

                <Area dataKey='uv' type='natural' fill="url(#fillUv)" fillOpacity={0.5} stroke='var(--uv)' strokeWidth={2} />
                <ChartLegend content={<ChartLegendContent />} />

            </AreaChart>

        </ChartContainer>
    )
}