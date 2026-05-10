import { useMemo } from "react";
import { useWeather } from "@/hooks/useWeather";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "./ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import type { ChartConfig } from "@/components/ui/chart";

const chartConfig = {
    clouds: {
        label: 'Cloud Cover',
        color: 'var(--clouds)'
    },
} satisfies ChartConfig

export const CloudCoverChart = () => {
    const { weather } = useWeather();

    const chartData = useMemo(() => {
        return weather?.hourly.map((item) => ({
            time: new Date(item.dt * 1000).toLocaleTimeString('en-US', { hour: 'numeric', hour12: true }),
            clouds: item.clouds,
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
                    dataKey='clouds'
                    domain={[0, 100]}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value}%`}
                    tickMargin={16}
                />
                <ChartTooltip cursor={false} content={
                    <ChartTooltipContent />
                } />
                <defs>
                    <linearGradient id="fillClouds" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="var(--clouds)" stopOpacity={1} />
                        <stop offset="100%" stopColor="var(--clouds)" stopOpacity={0} />
                    </linearGradient>
                </defs>

                <Area dataKey='clouds' type='natural' fill="url(#fillClouds)" fillOpacity={0.5} stroke='var(--clouds)' strokeWidth={2} />
                <ChartLegend content={<ChartLegendContent />} />

            </AreaChart>

        </ChartContainer>
    )
}