"use client";

import { useEffect, useState } from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useIsMobile } from "@/hooks/use-mobile";

import { useInventoryMovementsChartData } from "../_hooks/use-inventory-movements-chart-data";

const chartConfig = {
  entradas: {
    label: "Entradas",
    color: "var(--chart-1)",
  },
  salidas: {
    label: "Salidas",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

const ChartInventoryMovements = () => {
  const isMobile = useIsMobile();
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d">("90d");

  useEffect(() => {
    if (isMobile) {
      setTimeRange("7d");
    }
  }, [isMobile]);

  const { chartData } = useInventoryMovementsChartData(timeRange);

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Movimientos de Inventario</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            Entradas y salidas registradas
          </span>
          <span className="@[540px]/card:hidden">Últimos movimientos</span>
        </CardDescription>
        <CardAction>
          <ToggleGroup
            type="single"
            value={timeRange}
            size="sm"
            onValueChange={(v) => v && setTimeRange(v as typeof timeRange)}
            className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
          >
            <ToggleGroupItem value="90d">Últimos 3 meses</ToggleGroupItem>
            <ToggleGroupItem value="30d">Últimos 30 días</ToggleGroupItem>
            <ToggleGroupItem value="7d">Últimos 7 días</ToggleGroupItem>
          </ToggleGroup>
          <Select
            value={timeRange}
            onValueChange={(v) => setTimeRange(v as typeof timeRange)}
          >
            <SelectTrigger
              className="**:data-[slot=select-value]:block @[767px]/card:hidden"
              size="sm"
              aria-label="Rango de fechas"
            >
              <SelectValue placeholder="Últimos 3 meses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="90d">Últimos 3 meses</SelectItem>
              <SelectItem value="30d">Últimos 30 días</SelectItem>
              <SelectItem value="7d">Últimos 7 días</SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="fillEntradas" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--chart-1)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--chart-1)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillSalidas" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--chart-2)"
                  stopOpacity={1.0}
                />
                <stop
                  offset="95%"
                  stopColor="var(--chart-2)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("es-CL", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              cursor={false}
              defaultIndex={isMobile ? -1 : 5}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) =>
                    new Date(value).toLocaleDateString("es-CL", {
                      month: "short",
                      day: "numeric",
                    })
                  }
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="entradas"
              type="natural"
              fill="url(#fillEntradas)"
              stroke="var(--chart-1)"
              stackId="a"
            />
            <Area
              dataKey="salidas"
              type="natural"
              fill="url(#fillSalidas)"
              stroke="var(--chart-2)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default ChartInventoryMovements;
