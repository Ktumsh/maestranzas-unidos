"use client";

import { Pie, PieChart, Cell, Legend } from "recharts";

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
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart";

import { usePurchaseOrdersChartData } from "../_hooks/use-purchase-orders-chart-data";

const chartConfig = {
  pendiente: { label: "Pendiente", color: "var(--chart-1)" },
  recibida: { label: "Recibida", color: "var(--chart-5)" },
  enviada: { label: "Enviada", color: "var(--chart-3)" },
  sin_estado: { label: "Sin Estado", color: "var(--chart-4)" },
} satisfies ChartConfig;

const ChartOrdersByStatus = () => {
  const { chartData } = usePurchaseOrdersChartData();

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Órdenes por Estado</CardTitle>
        <CardDescription>Cantidad agrupada por estado actual</CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-60 w-full"
        >
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="label"
              cx="50%"
              cy="50%"
              outerRadius={100}
              innerRadius={0}
              paddingAngle={4}
              labelLine={false}
            >
              {chartData.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={`var(--chart-${index + 1})`}
                />
              ))}
            </Pie>
            <ChartTooltip
              content={
                <ChartTooltipContent
                  indicator="dot"
                  labelFormatter={(_, payload) => {
                    const item = payload?.[0];
                    const status = item?.payload?.status ?? "Desconocido";
                    return `Estado: ${status.charAt(0).toUpperCase() + status.slice(1)}`;
                  }}
                />
              }
            />

            <Legend verticalAlign="bottom" content={<ChartLegendContent />} />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default ChartOrdersByStatus;
