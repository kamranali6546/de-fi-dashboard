"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { generateConfidenceIntervalData } from "@/lib/mock-data"
import { Area, AreaChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"

interface ConfidenceIntervalChartProps {
  protocol: string
}

export function ConfidenceIntervalChart({ protocol }: ConfidenceIntervalChartProps) {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [confidenceLevel, setConfidenceLevel] = useState(95)

  useEffect(() => {
    setLoading(true)
    setTimeout(() => {
      const confidence = Math.random() > 0.5 ? 95 : 90
      setConfidenceLevel(confidence)
      const intervalData = generateConfidenceIntervalData(30, confidence)
      const chartData = intervalData.map((point) => ({
        date: new Date(point.timestamp).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        value: point.value,
        upper: point.upperBound,
        lower: point.lowerBound,
      }))
      setData(chartData)
      setLoading(false)
    }, 900)
  }, [protocol])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64 mt-2" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] sm:h-[350px] w-full" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div className="space-y-1">
          <CardTitle className="text-base sm:text-lg">Borrow Rate with Confidence Intervals</CardTitle>
          <CardDescription className="text-xs sm:text-sm">Predicted rates with statistical bounds</CardDescription>
        </div>
        <Badge variant="outline" className="font-mono text-xs">
          {confidenceLevel}% CI
        </Badge>
      </CardHeader>
      <CardContent className="p-2 sm:p-6">
        <ChartContainer
          config={{
            value: {
              label: "Rate",
              color: "#2f9e8f",
            },
            upper: {
              label: "Upper Bound",
              color: "#3db5a3",
            },
            lower: {
              label: "Lower Bound",
              color: "#3db5a3",
            },
          }}
          className="h-[250px] sm:h-[300px] md:h-[350px] w-full"
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="confidenceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3db5a3" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="#3db5a3" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} vertical={false} />
              <XAxis
                dataKey="date"
                stroke="hsl(var(--foreground))"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tick={{ fill: "hsl(var(--foreground))" }}
              />
              <YAxis
                stroke="hsl(var(--foreground))"
                fontSize={11}
                tickFormatter={(value) => `${(value * 100).toFixed(1)}%`}
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                width={55}
                tick={{ fill: "hsl(var(--foreground))" }}
              />
              <ChartTooltip
                content={<ChartTooltipContent indicator="line" />}
                formatter={(value: any, name: string) => [
                  `${(value * 100).toFixed(2)}%`,
                  name === "value" ? "Rate" : name === "upper" ? "Upper Bound" : "Lower Bound",
                ]}
              />
              <Area
                type="monotone"
                dataKey="upper"
                stroke="none"
                fill="url(#confidenceGradient)"
                stackId="confidence"
              />
              <Area
                type="monotone"
                dataKey="lower"
                stroke="none"
                fill="url(#confidenceGradient)"
                stackId="confidence"
              />
              <Line
                type="monotone"
                dataKey="upper"
                stroke="#3db5a3"
                strokeWidth={1.5}
                strokeDasharray="5 5"
                dot={false}
                opacity={0.6}
              />
              <Line
                type="monotone"
                dataKey="lower"
                stroke="#3db5a3"
                strokeWidth={1.5}
                strokeDasharray="5 5"
                dot={false}
                opacity={0.6}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#2f9e8f"
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 5, strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
