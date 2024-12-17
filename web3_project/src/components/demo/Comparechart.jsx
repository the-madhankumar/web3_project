import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../ui/chart"

// Updated chart data for doctors' patient count and average patient count
const chartData = [
  { month: "January", doctorPatients: 150, avgPatients: 120 },
  { month: "February", doctorPatients: 200, avgPatients: 180 },
  { month: "March", doctorPatients: 180, avgPatients: 170 },
  { month: "April", doctorPatients: 90, avgPatients: 100 },
  { month: "May", doctorPatients: 250, avgPatients: 220 },
  { month: "June", doctorPatients: 220, avgPatients: 210 },
]

// Updated chart configuration for doctor and average patient counts
const chartConfig = {
  doctorPatients: {
    label: "Doctor's Patient Count",
    color: "hsl(var(--chart-1))",
  },
  avgPatients: {
    label: "Average Patient Count",
    color: "hsl(var(--chart-2))",
  },
}

export default function Comparechart() {
  return (
    <Card className="h-[752px]">
      <CardHeader>
        <CardTitle>Doctors' Patient Count Comparison</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              top: 20,
            }}
          >
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
              content={<ChartTooltipContent hideLabel />}
            />
            {/* Bar for Doctor's Patient Count */}
            <Bar dataKey="doctorPatients" fill="var(--color-desktop)" radius={8}>
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
            {/* Bar for Average Patient Count */}
            <Bar dataKey="avgPatients" fill="var(--color-average)" radius={8}>
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing patient count comparison for the last 6 months
        </div>
      </CardFooter>
    </Card>
  )
}
