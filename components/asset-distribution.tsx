"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Skeleton } from "@/components/ui/skeleton"
import { generateAssetDistribution } from "@/lib/mock-data"
import { Pie, PieChart, Cell, ResponsiveContainer, Legend } from "recharts"

interface AssetDistributionProps {
  protocol: string
}

export function AssetDistribution({ protocol }: AssetDistributionProps) {
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
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
    )
  }

  const getComputedColor = (index: number) => {
    const colors = [
      "#2f9e8f", // Teal (primary brand color)
      "#3db5a3", // Light teal
      "#267a6e", // Dark teal
      "#4ac9b5", // Bright teal
      "#1f5e56", // Deep teal
    ]
    return colors[index % colors.length]
  }

  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180))
    const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180))

    if (percent < 0.05) return null

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor="middle"
        dominantBaseline="central"
        className="font-semibold text-xs sm:text-sm"
        style={{ textShadow: "0 1px 2px rgba(0,0,0,0.3)" }}
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base sm:text-lg">Collateral Asset Distribution</CardTitle>
        <CardDescription className="text-xs sm:text-sm">Breakdown of assets used as collateral</CardDescription>
      </CardHeader>
      <CardContent className="p-2 sm:p-6">
        <ChartContainer
          config={data.reduce(
            (acc, item, index) => ({
              ...acc,
              [item.asset]: {
                label: item.asset,
                color: getComputedColor(index),
              },
            }),
            {},
          )}
          className="h-[300px] sm:h-[350px] md:h-[400px] w-full"
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <defs>
                {data.map((_, index) => (
                  <linearGradient key={`gradient-${index}`} id={`pieGradient${index}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={getComputedColor(index)} stopOpacity={1} />
                    <stop offset="100%" stopColor={getComputedColor(index)} stopOpacity={0.8} />
                  </linearGradient>
                ))}
              </defs>
              <Pie
                data={data}
                cx="50%"
                cy="40%"
                labelLine={false}
                label={renderCustomLabel}
                outerRadius="65%"
                innerRadius="45%"
                dataKey="value"
                paddingAngle={3}
                animationBegin={0}
                animationDuration={800}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={`url(#pieGradient${index})`}
                    stroke="hsl(var(--background))"
                    strokeWidth={2}
                    className="transition-opacity hover:opacity-90 cursor-pointer"
                  />
                ))}
              </Pie>
              <Legend
                verticalAlign="bottom"
                height={60}
                wrapperStyle={{ fontSize: "12px" }}
                formatter={(value, entry: any) => {
                  const item = data.find((d) => d.asset === value)
                  return (
                    <span className="text-xs sm:text-sm">
                      <span className="font-medium">{value}</span>
                      <span className="text-muted-foreground"> ${(item.value / 1e9).toFixed(1)}B</span>
                    </span>
                  )
                }}
              />
              <ChartTooltip
                content={<ChartTooltipContent hideLabel />}
                formatter={(value: any, name: string) => [`$${(Number(value) / 1e9).toFixed(2)}B`, name]}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
