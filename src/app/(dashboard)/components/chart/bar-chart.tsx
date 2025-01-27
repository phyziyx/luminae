"use client";

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
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

// Define the type for chart data
interface ChartData {
  month: string;
  clientsOnboarded: number;
}

const chartConfig = {
  clientsOnboarded: {
    label: "Active Clients",
    color: "hsl(var(--chart-3))", // Use a new color for clients
  },
} satisfies ChartConfig;

export function Component({ data }: { data: ChartData[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Bar Chart - Clients Onboarded</CardTitle>
        <CardDescription>Overview of the last 6 months</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={data}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <Bar
              dataKey="clientsOnboarded"
              fill="var(--color-clientsOnboarded)"
              radius={4}
              barSize={65}
              minPointSize={5}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="leading-none text-muted-foreground">
          Displaying the total number of active clients successfully onboarded
          over the past 6 months.
        </div>
      </CardFooter>
    </Card>
  );
}
