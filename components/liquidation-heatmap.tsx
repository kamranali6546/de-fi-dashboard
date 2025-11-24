"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { generateLiquidationRisks } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

interface LiquidationHeatmapProps {
  protocol: string
}

export function LiquidationHeatmap({ protocol }: LiquidationHeatmapProps) {
  const [positions, setPositions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    setTimeout(() => {
      const risks = generateLiquidationRisks(50)
      setPositions(risks)
      setLoading(false)
    }, 700)
  }, [protocol])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64 mt-2" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[200px] w-full" />
        </CardContent>
      </Card>
    )
  }

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case "critical":
        return "bg-gradient-to-br from-red-500 to-red-600 dark:from-red-600 dark:to-red-700 hover:scale-110 hover:shadow-lg shadow-red-500/50 border border-red-400/20"
      case "high":
        return "bg-gradient-to-br from-orange-500 to-orange-600 dark:from-orange-600 dark:to-orange-700 hover:scale-110 hover:shadow-lg shadow-orange-500/50 border border-orange-400/20"
      case "medium":
        return "bg-gradient-to-br from-yellow-500 to-yellow-600 dark:from-yellow-600 dark:to-yellow-700 hover:scale-105 border border-yellow-400/20"
      case "low":
        return "bg-gradient-to-br from-green-500 to-green-600 dark:from-green-600 dark:to-green-700 hover:scale-105 border border-green-400/20"
      default:
        return "bg-muted hover:bg-muted/80"
    }
  }

  const riskCounts = positions.reduce(
    (acc, pos) => {
      acc[pos.riskLevel] = (acc[pos.riskLevel] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const totalAtRisk = positions
    .filter((p) => p.riskLevel === "critical" || p.riskLevel === "high")
    .reduce((sum, p) => sum + (p.amount || 0), 0)

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-4">
        <div className="space-y-1">
          <CardTitle className="text-base sm:text-lg">Liquidation Risk Heatmap</CardTitle>
          <CardDescription className="text-xs sm:text-sm">Visual representation of positions at risk</CardDescription>
        </div>
        <Badge variant="destructive" className="font-mono text-xs">
          {riskCounts.critical + riskCounts.high} at risk
        </Badge>
      </CardHeader>
      <CardContent className="p-2 sm:p-6">
        <div className="space-y-4">
          <div className="grid grid-cols-8 sm:grid-cols-10 md:grid-cols-12 lg:grid-cols-14 xl:grid-cols-16 gap-1.5 sm:gap-2 p-2 sm:p-3 bg-muted/30 rounded-lg">
            {positions.map((position) => (
              <div
                key={position.id}
                className={cn(
                  "aspect-square rounded transition-all duration-200 cursor-pointer",
                  getRiskColor(position.riskLevel),
                )}
                title={`Health Factor: ${position.healthFactor.toFixed(2)} - ${position.riskLevel.toUpperCase()}`}
              />
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 sm:gap-4 pt-3 border-t border-border">
            <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 sm:h-4 sm:w-4 rounded bg-gradient-to-br from-green-500 to-green-600 dark:from-green-600 dark:to-green-700 border border-green-400/20" />
                <span className="text-xs sm:text-sm text-muted-foreground">
                  Low <span className="font-mono text-foreground">({riskCounts.low || 0})</span>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 sm:h-4 sm:w-4 rounded bg-gradient-to-br from-yellow-500 to-yellow-600 dark:from-yellow-600 dark:to-yellow-700 border border-yellow-400/20" />
                <span className="text-xs sm:text-sm text-muted-foreground">
                  Medium <span className="font-mono text-foreground">({riskCounts.medium || 0})</span>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 sm:h-4 sm:w-4 rounded bg-gradient-to-br from-orange-500 to-orange-600 dark:from-orange-600 dark:to-orange-700 border border-orange-400/20" />
                <span className="text-xs sm:text-sm text-muted-foreground">
                  High <span className="font-mono text-foreground">({riskCounts.high || 0})</span>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 sm:h-4 sm:w-4 rounded bg-gradient-to-br from-red-500 to-red-600 dark:from-red-600 dark:to-red-700 border border-red-400/20" />
                <span className="text-xs sm:text-sm text-muted-foreground">
                  Critical <span className="font-mono text-foreground">({riskCounts.critical || 0})</span>
                </span>
              </div>
            </div>
            <div className="text-xs sm:text-sm font-semibold">
              Total: <span className="font-mono">{positions.length}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
