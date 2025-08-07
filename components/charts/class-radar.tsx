"use client"

import { PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

type Item = { className: string; math: number; eng: number; sci: number }

export function ClassRadarChart({ data = [] as Item[] }) {
  const reshaped = data.flatMap((d) => [
    { key: "Math", className: d.className, value: d.math },
    { key: "Eng", className: d.className, value: d.eng },
    { key: "Sci", className: d.className, value: d.sci },
  ])
  return (
    <Card>
      <CardHeader>
        <CardTitle>Class Comparison</CardTitle>
      </CardHeader>
      <CardContent className="h-[280px]">
        <ChartContainer
          config={{
            value: { label: "Score", color: "hsl(var(--chart-3))" },
          }}
          className="h-full"
        >
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={reshaped}>
              <PolarGrid />
              <PolarAngleAxis dataKey="className" />
              <PolarRadiusAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Radar name="Score" dataKey="value" stroke="var(--color-value)" fill="var(--color-value)" fillOpacity={0.3} />
            </RadarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
