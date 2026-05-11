import { useState } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
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

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: { duration: 0.2 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 24 }
  },
};

export const HourlyWeatherTabs = () => {
    const [tab, setTab] = useState<Tab>('overview');
    
    return (
        <Tabs value={tab} onValueChange={(value) => setTab(value as Tab)} className="py-4 gap-4">
            <div className="flex items-center gap-4">
                <h2 className="text-lg font-semibold">
                    Hourly
                </h2>
                <TabsList 
                    className='bg-background gap-2 overflow-x-auto overflow-y-hidden justify-start scrollbar-hide' 
                    style={{ scrollbarWidth: 'none' }}
                >
                    {TABS_LIST.map((item) => (
                        <TabsTrigger 
                            key={item.value} 
                            value={item.value} 
                            className='relative border-none bg-secondary/50 h-9 px-4 rounded-full transition-colors data-active:text-primary-foreground!'
                        >
                            {tab === item.value && (
                                <motion.div
                                    layoutId="active-tab"
                                    className="absolute inset-0 bg-primary rounded-full"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}
                            <span className="relative z-10">{item.title}</span>
                        </TabsTrigger>
                    ))}
                </TabsList>
            </div>

            <div className="relative min-h-[400px]">
                <AnimatePresence mode="popLayout" initial={false}>
                    <motion.div
                        key={tab}
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="w-full"
                    >
                        {tab === 'overview' && (
                            <TabsContent value='overview'>
                                <Card>
                                    <motion.div variants={itemVariants}>
                                        <CardHeader>
                                            <CardTitle>Overview</CardTitle>
                                        </CardHeader>
                                    </motion.div>
                                    <motion.div variants={itemVariants}>
                                        <CardContent>
                                            <OverviewChart />
                                        </CardContent>
                                    </motion.div>
                                </Card>
                            </TabsContent>
                        )}

                        {tab === 'precipitation' && (
                            <TabsContent value='precipitation'>
                                <Card>
                                    <motion.div variants={itemVariants}>
                                        <CardHeader>
                                            <CardTitle>Precipitation</CardTitle>
                                        </CardHeader>
                                    </motion.div>
                                    <motion.div variants={itemVariants}>
                                        <CardContent>
                                            <PrecipitationChart />
                                        </CardContent>
                                    </motion.div>
                                </Card>
                            </TabsContent>
                        )}

                        {tab === 'wind' && (
                            <TabsContent value='wind'>
                                <Card>
                                    <motion.div variants={itemVariants}>
                                        <CardHeader>
                                            <CardTitle>Wind</CardTitle>
                                        </CardHeader>
                                    </motion.div>
                                    <motion.div variants={itemVariants}>
                                        <CardContent>
                                            <WindChart />
                                        </CardContent>
                                    </motion.div>
                                </Card>
                            </TabsContent>
                        )}

                        {tab === 'humidity' && (
                            <TabsContent value='humidity'>
                                <Card>
                                    <motion.div variants={itemVariants}>
                                        <CardHeader>
                                            <CardTitle>Humidity</CardTitle>
                                        </CardHeader>
                                    </motion.div>
                                    <motion.div variants={itemVariants}>
                                        <CardContent>
                                            <HumidityChart />
                                        </CardContent>
                                    </motion.div>
                                </Card>
                            </TabsContent>
                        )}

                        {tab === 'cloudCover' && (
                            <TabsContent value='cloudCover'>
                                <Card>
                                    <motion.div variants={itemVariants}>
                                        <CardHeader>
                                            <CardTitle>Cloud Cover</CardTitle>
                                        </CardHeader>
                                    </motion.div>
                                    <motion.div variants={itemVariants}>
                                        <CardContent>
                                            <CloudCoverChart />
                                        </CardContent>
                                    </motion.div>
                                </Card>
                            </TabsContent>
                        )}

                        {tab === 'pressure' && (
                            <TabsContent value='pressure'>
                                <Card>
                                    <motion.div variants={itemVariants}>
                                        <CardHeader>
                                            <CardTitle>Pressure</CardTitle>
                                        </CardHeader>
                                    </motion.div>
                                    <motion.div variants={itemVariants}>
                                        <CardContent>
                                            <PressureChart />
                                        </CardContent>
                                    </motion.div>
                                </Card>
                            </TabsContent>
                        )}

                        {tab === 'uv' && (
                            <TabsContent value='uv'>
                                <Card>
                                    <motion.div variants={itemVariants}>
                                        <CardHeader>
                                            <CardTitle>UV Index</CardTitle>
                                        </CardHeader>
                                    </motion.div>
                                    <motion.div variants={itemVariants}>
                                        <CardContent>
                                            <UvIndexChart />
                                        </CardContent>
                                    </motion.div>
                                </Card>
                            </TabsContent>
                        )}

                        {tab === 'visibility' && (
                            <TabsContent value='visibility'>
                                <Card>
                                    <motion.div variants={itemVariants}>
                                        <CardHeader>
                                            <CardTitle>Visibility</CardTitle>
                                        </CardHeader>
                                    </motion.div>
                                    <motion.div variants={itemVariants}>
                                        <CardContent>
                                            <VisibilityChart />
                                        </CardContent>
                                    </motion.div>
                                </Card>
                            </TabsContent>
                        )}

                        {tab === 'feelsLike' && (
                            <TabsContent value='feelsLike'>
                                <Card>
                                    <motion.div variants={itemVariants}>
                                        <CardHeader>
                                            <CardTitle>Feels Like</CardTitle>
                                        </CardHeader>
                                    </motion.div>
                                    <motion.div variants={itemVariants}>
                                        <CardContent>
                                            <FeelsLikeChart />
                                        </CardContent>
                                    </motion.div>
                                </Card>
                            </TabsContent>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </Tabs>
    )
}
