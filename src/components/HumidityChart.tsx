import { useMemo } from "react";
import { useWeather } from "@/hooks/useWeather";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "./ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import type { ChartConfig } from "@/components/ui/chart";

const chartConfig = {
    humidity: {
        label: 'Humidity',
        color: 'var(--humidity)'
    },
    dew_point: {
        label: 'Dew Point',
        color: 'var(--dew_point)'
    }
} satisfies ChartConfig

export const HumidityChart = () => {
    const { weather } = useWeather();

    const chartData = useMemo(() => {
        return weather?.hourly.map((item) => ({
            time: new Date(item.dt * 1000).toLocaleTimeString('en-US', { hour: 'numeric', hour12: true }),
            humidity: item.humidity,
            dew_point: item.dew_point,
        }));
    }, [weather]);

    if (!chartData) return <Skeleton className="h-[360px]" />

    return (
        <ChartContainer config={chartConfig} className="h-[360px] w-full">
            <AreaChart
                accessibilityLayer
                data={chartData}
            >
                <CartesianGrid strokeDasharray="4 4"/>
                <XAxis dataKey='time'
                tickLine={false}
                axisLine={false}
                tickCount={12}
                tickMargin={16}
                />
                <YAxis
                dataKey='humidity'
                tickLine={false}
                axisLine={false}
                tickMargin={16}
                />
                <ChartTooltip cursor={false} content= {
                    <ChartTooltipContent />
                }/>

                <defs>
                    <linearGradient id="fillHumidity" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="var(--humidity)" stopOpacity={1}/>
                        <stop offset="100%" stopColor="var(--humidity)" stopOpacity={0}/>
                    </linearGradient>
                </defs>
                <Area dataKey='humidity' type='natural' fill="url(#fillHumidity)" fillOpacity={0.5} stroke='var(--humidity)' strokeOpacity={0}/>
                <Area dataKey='dew_point' type='natural' fillOpacity={0} stroke='var(--dew-point)' strokeWidth={2} activeDot={false} />
                <ChartLegend content={<ChartLegendContent/>}/>
                
            </AreaChart>

        </ChartContainer>
    )
}