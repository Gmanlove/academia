"use client"

import { Line, LineChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

export function StudentTrendChart({ data = [] as { month: string; avg: number }[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Student Performance Trend</CardTitle>
      </CardHeader>
      <CardContent className="h-[280px]">
        <ChartContainer
          config={{
            avg: { label: "Average GPA", color: "hsl(var(--chart-1))" },
          }}
          className="h-full"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis domain={[0, 5]} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line type="monotone" dataKey="avg" stroke="var(--color-avg)" />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
