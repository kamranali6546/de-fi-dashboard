"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { TrendingUp } from "lucide-react"
import { generateTimeSeriesData } from "@/lib/mock-data"
import { Area, AreaChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer, ReferenceLine } from "recharts"

interface TVLChartProps {
  protocol: string
}

export function TVLChart({ protocol }: TVLChartProps) {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [change, setChange] = useState(0)

  useEffect(() => {
    setLoading(true)
    setTimeout(() => {
      const timeSeriesData = generateTimeSeriesData(30)
      const chartData = timeSeriesData.map((point) => ({
        date: new Date(point.timestamp).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        tvl: point.value,
        timestamp: point.timestamp,
      }))
      setData(chartData)

      const firstValue = chartData[0].tvl
      const lastValue = chartData[chartData.length - 1].tvl
      const percentChange = ((lastValue - firstValue) / firstValue) * 100
      setChange(percentChange)

      setLoading(false)
    }, 800)
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

  const avgTVL = data.reduce((sum, item) => sum + item.tvl, 0) / data.length

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-4">
        <div className="space-y-1">
          <CardTitle className="text-base sm:text-lg">Total Value Locked Over Time</CardTitle>
          <CardDescription className="text-xs sm:text-sm">30-day historical TVL data</CardDescription>
        </div>
        <Badge variant={change >= 0 ? "default" : "destructive"} className="gap-1 text-xs">
          <TrendingUp className="h-3 w-3" />
          {change >= 0 ? "+" : ""}
          {change.toFixed(2)}%
        </Badge>
      </CardHeader>
      <CardContent className="p-2 sm:p-6">
        <ChartContainer
          config={{
            tvl: {
              label: "TVL",
              color: "#2f9e8f",
            },
          }}
          className="h-[250px] sm:h-[300px] md:h-[350px] w-full"
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="tvlGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2f9e8f" stopOpacity={0.4} />
                  <stop offset="50%" stopColor="#2f9e8f" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#2f9e8f" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} vertical={false} />
              <ReferenceLine
                y={avgTVL}
                stroke="hsl(var(--muted-foreground))"
                strokeDasharray="5 5"
                strokeOpacity={0.5}
                label={{ value: "Avg", position: "right", fill: "hsl(var(--foreground))", fontSize: 11 }}
              />
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
                tickFormatter={(value) => `$${(value / 1e9).toFixed(1)}B`}
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                width={60}
                tick={{ fill: "hsl(var(--foreground))" }}
              />
              <ChartTooltip
                content={<ChartTooltipContent indicator="line" />}
                formatter={(value: any) => [`$${(value / 1e9).toFixed(2)}B`, "TVL"]}
              />
              <Area
                type="monotone"
                dataKey="tvl"
                stroke="#2f9e8f"
                fill="url(#tvlGradient)"
                strokeWidth={2.5}
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
