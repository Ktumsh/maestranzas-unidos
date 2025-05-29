"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

import { useEntryByPartChartData } from "../_hooks/use-entry-by-part-chart-data";

const chartConfig = {
  total: {
    label: "Cantidad",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

const ChartEntriesByPart = () => {
  const { chartData } = useEntryByPartChartData();
  const showYAxis = chartData.length > 1;

  return (
    <Card className="@container/card md:col-span-2">
      <CardHeader>
        <CardTitle>Entradas por Pieza</CardTitle>
        <CardDescription>Total de piezas registradas por tipo</CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[260px] w-full"
        >
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 10, bottom: 40, left: 10 }}
          >
            <defs>
              <linearGradient id="barEntrada" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--chart-1)"
                  stopOpacity={0.9}
                />
                <stop
                  offset="95%"
                  stopColor="var(--chart-1)"
                  stopOpacity={0.2}
                />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="label"
              angle={-30}
              textAnchor="end"
              interval={0}
              tickLine={false}
              axisLine={false}
            />
            {showYAxis && <YAxis allowDecimals={false} />}

            <ChartTooltip
              content={
                <ChartTooltipContent
                  indicator="dot"
                  formatter={(value) => `${value} unidades`}
                />
              }
            />

            <Bar
              dataKey="total"
              fill="url(#barEntrada)"
              stroke="var(--chart-1)"
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default ChartEntriesByPart;
