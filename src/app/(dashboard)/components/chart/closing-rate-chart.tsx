"use client";

import * as React from "react";
import { Pie, PieChart, Label } from "recharts";

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
import { BirdIcon } from "lucide-react";

// Define the type for chart data
interface ChartData {
  status: string;
  clients: number;
  fill: string;
}

interface ClosingRateChartProps {
  data: {
    activeClients: number;
    lostClients: number;
    totalClients: number;
    closingRate: number;
    leadsClients: number; // Add leads clients to the props
  };
}

const chartConfig = {
  clients: {
    label: "Clients",
  },
  onboarded: {
    label: "Leads",
    color: "hsl(var(--chart-3))",
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

export function ClosingRateChart({
  data: { activeClients, lostClients, totalClients, closingRate, leadsClients }, // Destructure leadsClients from props
}: ClosingRateChartProps) {
  const chartData: ChartData[] = [
    {
      status: "Leads", // Add leads
      clients: leadsClients,
      fill: "hsl(var(--chart-4))", // Color for leads (can be blue)
    },
    {
      status: "Active",
      clients: activeClients,
      fill: "green", // Color for active (green)
    },
    {
      status: "Lost",
      clients: lostClients,
      fill: "red", // Color for lost (red)
    },
  ];

  const isEmpty = totalClients === 0;

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Clients Closing Rate</CardTitle>
        <CardDescription>
          Overview of all clients (Leads, Active, Lost)
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        {isEmpty ? (
          <BirdIcon className="mt-2 mb-2 w-20 h-20 mx-auto text-muted-foreground" />
        ) : (
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
        )}
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="leading-none text-muted-foreground">
          {isEmpty ? (
            <>Wow, such empty</>
          ) : (
            <>Showing data for {totalClients.toLocaleString()} total clients</>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
