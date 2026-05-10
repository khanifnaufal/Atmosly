import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { OverviewChart } from './OverviewChart';
import { PrecipitationChart } from './PrecipitationChart';
import { WindChart } from './WindChart';
import { HumidityChart } from './HumidityChart';
import { CloudCoverChart } from './CloudCoverChart';
import { PressureChart } from './PressureChart';
import { UvIndexChart } from './UvIndexChart';
import { VisibilityChart } from './VisibilityChart';
import { FeelsLikeChart } from './FeelsLikeChart';

/**
 * Types
 */
type Tab =
  | 'overview'
  | 'precipitation'
  | 'wind'
  | 'humidity'
  | 'cloudCover'
  | 'pressure'
  | 'uv'
  | 'visibility'
  | 'feelsLike';

/**
 * Constants
 */
const TABS_LIST = [
  {
    title: 'Overview',
    value: 'overview',
  },
  {
    title: 'Precipitation',
    value: 'precipitation',
  },
  {
    title: 'Wind',
    value: 'wind',
  },
  {
    title: 'Humidity',
    value: 'humidity',
  },
  {
    title: 'Cloud cover',
    value: 'cloudCover',
  },
  {
    title: 'Pressure',
    value: 'pressure',
  },
  {
    title: 'UV',
    value: 'uv',
  },
  {
    title: 'Visibility',
    value: 'visibility',
  },
  {
    title: 'Feels like',
    value: 'feelsLike',
  },
];
export const HourlyWeatherTabs = () => {
    const [ tab,setTab] = useState<Tab>('overview');
    
    return (
        <Tabs value={tab} onValueChange={(value) => setTab(value as Tab)} className="py-4 gap-4">
            <div className="flex items-center gap-4">
                <h2 className="text-lg font-semibold">
                    Hourly
                </h2>
                <TabsList className='bg-background gap-2 overflow-x-auto overflow-y-hidden justify-start' style = {{scrollbarWidth:'none'}}>
                    {TABS_LIST.map((item) => (
                        <TabsTrigger key={item.value} value={item.value} className='border-none bg-secondary h-9 px-4 rounded-full data-active:bg-primary! data-active:text-primary-foreground!'>
                            {item.title}
                        </TabsTrigger>
                    ))}
                </TabsList>
            </div>
            <TabsContent value='overview'>
                <Card>
                    <CardHeader>
                        <CardTitle>Overview</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <OverviewChart/>
                    </CardContent>
                </Card>
            </TabsContent>

            <TabsContent value='precipitation'>
                <Card>
                    <CardHeader>
                        <CardTitle>Precipitation</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <PrecipitationChart/>
                    </CardContent>
                </Card>
            </TabsContent>

            <TabsContent value='wind'>
                <Card>
                    <CardHeader>
                        <CardTitle>Wind</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <WindChart/>
                    </CardContent>
                </Card>
            </TabsContent>

            <TabsContent value='humidity'>
                <Card>
                    <CardHeader>
                        <CardTitle>Humidity</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <HumidityChart/>
                    </CardContent>
                </Card>
            </TabsContent>

            <TabsContent value='cloudCover'>
                <Card>
                    <CardHeader>
                        <CardTitle>Cloud Cover</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <CloudCoverChart/>
                    </CardContent>
                </Card>
            </TabsContent>

            <TabsContent value='pressure'>
                <Card>
                    <CardHeader>
                        <CardTitle>Pressure</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <PressureChart/>
                    </CardContent>
                </Card>
            </TabsContent>

            <TabsContent value='uv'>
                <Card>
                    <CardHeader>
                        <CardTitle>UV Index</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <UvIndexChart/>
                    </CardContent>
                </Card>
            </TabsContent>

            <TabsContent value='visibility'>
                <Card>
                    <CardHeader>
                        <CardTitle>Visibility</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <VisibilityChart/>
                    </CardContent>
                </Card>
            </TabsContent>

            <TabsContent value='feelsLike'>
                <Card>
                    <CardHeader>
                        <CardTitle>Feels Like</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <FeelsLikeChart/>
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
    )
}