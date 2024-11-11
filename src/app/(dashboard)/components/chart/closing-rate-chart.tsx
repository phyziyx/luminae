"use client";

import * as React from "react";
import { TrendingUp } from "lucide-react";
import { Label, Pie, PieChart } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
const chartData = [
  { status: "onboarded", clients: 15, fill: "var(--color-onboarded)" },
  { status: "lost", clients: 30, fill: "var(--color-lost)" },
  { status: "closed", clients: 45, fill: "var(--color-closed)" },
];

const chartConfig = {
  clients: {
    label: "Clients",
  },
  onboarded: {
    label: "Onboarded",
    color: "hsl(var(--chart-5))",
  },
  lost: {
    label: "Lost",
    color: "hsl(var(--chart-1))",
  },
  closed: {
    label: "Closed",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export function ClosingRateChart() {
  const closingRate = React.useMemo(() => {
    const totalClosed =
      chartData.find((data) => data.status === "closed")?.clients || 0;
    const totalLost =
      chartData.find((data) => data.status === "lost")?.clients || 0;

    return Math.round((totalClosed / (totalClosed + totalLost)) * 100);
  }, []);

  const totalClients = chartData.reduce(
    (acc, data) => acc + (data.clients || 0),
    0
  );

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Clients Closing Rate</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="clients"
              nameKey="status"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {closingRate.toLocaleString()}%
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Closing Rate
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total clients ({totalClients}) for the last 6 months
        </div>
      </CardFooter>
    </Card>
  );
}
