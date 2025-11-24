"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Skeleton } from "@/components/ui/skeleton"
import { generateAssetDistribution } from "@/lib/mock-data"
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell } from "recharts"

interface CollateralBreakdownProps {
  protocol: string
}

export function CollateralBreakdown({ protocol }: CollateralBreakdownProps) {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    setTimeout(() => {
      const distribution = generateAssetDistribution()
      setData(distribution)
      setLoading(false)
    }, 600)
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

  const colors = ["#2f9e8f", "#3db5a3", "#267a6e", "#4ac9b5", "#1f5e56"]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base sm:text-lg">Collateral Asset Distribution</CardTitle>
        <CardDescription className="text-xs sm:text-sm">Total value locked by asset type</CardDescription>
      </CardHeader>
      <CardContent className="p-2 sm:p-6">
        <ChartContainer
          config={data.reduce(
            (acc, item, index) => ({
              ...acc,
              [item.asset]: {
                label: item.asset,
                color: colors[index % colors.length],
              },
            }),
            {},
          )}
          className="h-[300px] sm:h-[350px] md:h-[400px] w-full"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 10, left: 0, bottom: 20 }}>
              <defs>
                {data.map((_, index) => (
                  <linearGradient key={`gradient-${index}`} id={`barGradient${index}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={colors[index % colors.length]} stopOpacity={1} />
                    <stop offset="100%" stopColor={colors[index % colors.length]} stopOpacity={0.7} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} vertical={false} />
              <XAxis
                dataKey="asset"
                stroke="hsl(var(--foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickMargin={10}
              />
              <YAxis
                stroke="hsl(var(--foreground))"
                fontSize={12}
                tickFormatter={(value) => `$${(value / 1e9).toFixed(1)}B`}
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                width={60}
              />
              <ChartTooltip
                content={<ChartTooltipContent />}
                formatter={(value: any, name: string) => [`$${(Number(value) / 1e9).toFixed(2)}B`, name]}
                cursor={{ fill: "hsl(var(--muted))", opacity: 0.2 }}
              />
              <Bar dataKey="value" radius={[8, 8, 0, 0]} maxBarSize={80}>
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={`url(#barGradient${index})`}
                    className="transition-opacity hover:opacity-80 cursor-pointer"
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>

        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
          {data.map((item, index) => (
            <div key={item.asset} className="flex items-center gap-2">
              <div
                className="h-3 w-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: colors[index % colors.length] }}
              />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium truncate">{item.asset}</p>
                <p className="text-xs text-muted-foreground">${(item.value / 1e9).toFixed(2)}B</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
