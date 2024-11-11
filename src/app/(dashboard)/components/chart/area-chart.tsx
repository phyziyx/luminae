"use client";

import { CartesianGrid, Line, LineChart, XAxis } from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
const chartData = [
  { month: "January", income: 186 },
  { month: "February", income: 305 },
  { month: "March", income: 237 },
  { month: "April", income: 73 },
  { month: "May", income: 209 },
  { month: "June", income: 214 },
];

const chartConfig = {
  income: {
    label: "Income",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export function SampleChart() {
  return (
    <ChartContainer config={chartConfig}>
      <LineChart
        accessibilityLayer
        data={chartData}
        margin={{
          left: 12,
          right: 12,
        }}
      >
        {/* NOTE: 
          To make the grid lines visible, we need to set the stroke color and opacity.
          The `stroke` prop sets the color of the grid lines.
          The `strokeOpacity` prop sets the opacity of the grid lines.
          This is the base configuration for the grid lines, which is needed for the className to work.
         */}
        <CartesianGrid
          stroke={"#000000"}
          strokeOpacity={1}
          vertical={false}
          className="stroke-black/50 dark:stroke-white/50"
        />
        <XAxis
          dataKey="month"
          tickLine={true}
          axisLine={true}
          tickMargin={8}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        <Line
          dataKey="income"
          type="natural"
          stroke="var(--color-income)"
          strokeWidth={2}
          dot={{
            fill: "var(--color-income)",
          }}
          activeDot={{
            r: 6,
          }}
        />
      </LineChart>
    </ChartContainer>
  );
}
