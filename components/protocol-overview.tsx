"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { generateProtocolMetrics } from "@/lib/mock-data"
import { fetchDefiLlamaData } from "@/lib/defillama-api"
import { TrendingUp, TrendingDown, Activity, AlertTriangle } from "lucide-react"
import type { ProtocolMetrics } from "@/types/defi"

interface ProtocolOverviewProps {
  protocol: string
  realTimeData?: ProtocolMetrics | null
}

export function ProtocolOverview({ protocol, realTimeData }: ProtocolOverviewProps) {
  const [metrics, setMetrics] = useState<ProtocolMetrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [apiData, setApiData] = useState<any>(null)

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)

      const llama = await fetchDefiLlamaData(protocol)
      setApiData(llama)

      const mockData = generateProtocolMetrics(protocol)
      setMetrics(mockData)

      setLoading(false)
    }

    loadData()
  }, [protocol])

  useEffect(() => {
    if (realTimeData) {
      setMetrics(realTimeData)
    }
  }, [realTimeData])

  if (loading) {
    return (
      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-7 sm:h-8 w-28 sm:w-32 mb-2" />
              <Skeleton className="h-3 w-16 sm:w-20" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (!metrics) return null

  const tvlValue = apiData?.tvl || metrics.tvl
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      notation: "compact",
      maximumFractionDigits: 2,
    }).format(value)
  }

  const formatPercent = (value: number) => {
    return `${(value * 100).toFixed(2)}%`
  }

  return (
    <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs sm:text-sm font-medium">Total Value Locked</CardTitle>
          <Activity className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-xl sm:text-2xl font-bold">{formatCurrency(tvlValue)}</div>
          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
            <TrendingUp className="h-3 w-3 text-green-500" />
            <span className="text-green-500">+5.2%</span> from last week
          </p>
          {apiData && <p className="text-xs text-muted-foreground mt-1">Live data from DeFiLlama</p>}
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs sm:text-sm font-medium">Utilization Rate</CardTitle>
          <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-xl sm:text-2xl font-bold">{formatPercent(metrics.utilizationRate)}</div>
          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
            <TrendingDown className="h-3 w-3 text-red-500" />
            <span className="text-red-500">-1.4%</span> from yesterday
          </p>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs sm:text-sm font-medium">Avg Health Factor</CardTitle>
          <Activity className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-xl sm:text-2xl font-bold">{metrics.averageHealthFactor.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground mt-1">
            {metrics.averageHealthFactor > 2 ? (
              <span className="text-green-500">Healthy</span>
            ) : metrics.averageHealthFactor > 1.5 ? (
              <span className="text-yellow-500">Moderate</span>
            ) : (
              <span className="text-red-500">At Risk</span>
            )}
          </p>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs sm:text-sm font-medium">Liquidations (24h)</CardTitle>
          <AlertTriangle className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-xl sm:text-2xl font-bold">{metrics.liquidationsLast24h}</div>
          <p className="text-xs text-muted-foreground mt-1">
            {formatCurrency(metrics.liquidationsLast24h * 125000)} volume
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
