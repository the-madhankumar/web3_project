"use client";

import * as React from "react";
import { Line, LineChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../ui/chart";

const chartData = [
    { date: "2024-04-01", patientCount: 150 },
    { date: "2024-04-02", patientCount: 180 },
    { date: "2024-04-03", patientCount: 140 },
    { date: "2024-04-04", patientCount: 200 },
    { date: "2024-04-05", patientCount: 250 },
    { date: "2024-04-06", patientCount: 210 },
    { date: "2024-04-07", patientCount: 190 },
    { date: "2024-04-08", patientCount: 230 },
    { date: "2024-04-09", patientCount: 170 },
    { date: "2024-04-10", patientCount: 220 },
    { date: "2024-04-11", patientCount: 260 },
    { date: "2024-04-12", patientCount: 240 },
    { date: "2024-04-13", patientCount: 280 },
    { date: "2024-04-14", patientCount: 180 },
    { date: "2024-04-15", patientCount: 150 },
    { date: "2024-04-16", patientCount: 160 },
    { date: "2024-04-17", patientCount: 300 },
    { date: "2024-04-18", patientCount: 270 },
    { date: "2024-04-19", patientCount: 200 },
    { date: "2024-04-20", patientCount: 130 },
    { date: "2024-04-21", patientCount: 160 },
    { date: "2024-04-22", patientCount: 180 },
    { date: "2024-04-23", patientCount: 220 },
    { date: "2024-04-24", patientCount: 240 },
    { date: "2024-04-25", patientCount: 190 },
    { date: "2024-04-26", patientCount: 120 },
    { date: "2024-04-27", patientCount: 250 },
    { date: "2024-04-28", patientCount: 160 },
    { date: "2024-04-29", patientCount: 230 },
    { date: "2024-04-30", patientCount: 210 },
    { date: "2024-05-01", patientCount: 180 },
    { date: "2024-05-02", patientCount: 220 },
    { date: "2024-05-03", patientCount: 200 },
    { date: "2024-05-04", patientCount: 250 },
    { date: "2024-05-05", patientCount: 270 },
    { date: "2024-05-06", patientCount: 290 },
    { date: "2024-05-07", patientCount: 230 },
    { date: "2024-05-08", patientCount: 180 },
    { date: "2024-05-09", patientCount: 210 },
    { date: "2024-05-10", patientCount: 240 },
    { date: "2024-05-11", patientCount: 220 },
    { date: "2024-05-12", patientCount: 160 },
    { date: "2024-05-13", patientCount: 190 },
    { date: "2024-05-14", patientCount: 270 },
    { date: "2024-05-15", patientCount: 230 },
    { date: "2024-05-16", patientCount: 210 },
    { date: "2024-05-17", patientCount: 280 },
    { date: "2024-05-18", patientCount: 250 },
    { date: "2024-05-19", patientCount: 220 },
    { date: "2024-05-20", patientCount: 180 },
    { date: "2024-05-21", patientCount: 150 },
    { date: "2024-05-22", patientCount: 170 },
    { date: "2024-05-23", patientCount: 230 },
    { date: "2024-05-24", patientCount: 240 },
    { date: "2024-05-25", patientCount: 190 },
    { date: "2024-05-26", patientCount: 200 },
    { date: "2024-05-27", patientCount: 250 },
    { date: "2024-05-28", patientCount: 230 },
    { date: "2024-05-29", patientCount: 210 },
    { date: "2024-05-30", patientCount: 240 },
    { date: "2024-05-31", patientCount: 220 },
    { date: "2024-06-01", patientCount: 230 },
    { date: "2024-06-02", patientCount: 280 },
  ];
  

// Function to group data by a selected interval (day, week, month)
const aggregateData = (data, filter) => {
  let aggregatedData = [];
  let currentDate;
  let count = 0;
  
  // Group by day, week, or month
  data.forEach((item, index) => {
    const date = new Date(item.date);
    const key = filter === "week" ? `Week ${Math.ceil((date.getDate() + 1) / 7)}` : filter === "month" ? date.toLocaleString("en-US", { month: "long", year: "numeric" }) : date.toLocaleDateString();

    if (currentDate === key) {
      count += item.patientCount;
    } else {
      if (currentDate) {
        aggregatedData.push({ date: currentDate, patientCount: count });
      }
      currentDate = key;
      count = item.patientCount;
    }

    if (index === data.length - 1) {
      aggregatedData.push({ date: currentDate, patientCount: count });
    }
  });

  return aggregatedData;
};



function LineCharpres() {
  const [activeFilter, setActiveFilter] = React.useState("day"); // day, week, or month
  const [filteredData, setFilteredData] = React.useState(chartData);

  React.useEffect(() => {
    setFilteredData(aggregateData(chartData, activeFilter));
  }, [activeFilter]);

  return (
    <Card className="bg-white">
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle><h2 className="text-2xl">Prescription Count</h2></CardTitle>    
        </div>
        <div className="flex">
          {["day", "week", "month"].map((filter) => (
            <button
              key={filter}
              data-active={activeFilter === filter}
              className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
              onClick={() => setActiveFilter(filter)}
            >
              <span className="text-lg text-muted-foreground">{filter}</span>
              <span className="text-lg font-bold leading-none sm:text-3xl">
                {filteredData.reduce((acc, curr) => acc + curr.patientCount, 0).toLocaleString()}
              </span>
            </button>
          ))}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={{ views: { label: "Patient Count" } }}
          className="aspect-auto h-[250px] w-full"
        >
          <LineChart
            accessibilityLayer
            data={filteredData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => value}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey="patientCount"
                  labelFormatter={(value) => value}
                />
              }
            />
            <Line dataKey="patientCount" fill="hsl(var(--chart-1))" />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export default LineCharpres;
