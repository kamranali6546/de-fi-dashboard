"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { generateOracleEvents } from "@/lib/mock-data"
import { AlertCircle, CheckCircle, AlertTriangle } from "lucide-react"

interface OracleDeviationProps {
  protocol: string
}

export function OracleDeviation({ protocol }: OracleDeviationProps) {
  const [events, setEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    setTimeout(() => {
      const oracleEvents = generateOracleEvents(10)
      setEvents(oracleEvents)
      setLoading(false)
    }, 650)
  }, [protocol])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64 mt-2" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "critical":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      default:
        return <CheckCircle className="h-4 w-4 text-green-500" />
    }
  }

  const getSeverityBadge = (severity: string) => {
    const variants: Record<string, any> = {
      critical: "destructive",
      warning: "secondary",
      info: "outline",
    }
    return (
      <Badge variant={variants[severity] || "outline"} className="text-xs">
        {severity.toUpperCase()}
      </Badge>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base sm:text-lg">Oracle Price Deviations</CardTitle>
        <CardDescription className="text-xs sm:text-sm">
          Recent price feed discrepancies across oracle sources
        </CardDescription>
      </CardHeader>
      <CardContent className="p-2 sm:p-6">
        <div className="space-y-2 sm:space-y-3">
          {events.map((event) => (
            <div
              key={event.id}
              className="flex items-start gap-2 sm:gap-3 rounded-lg border border-border p-2 sm:p-3 transition-colors hover:bg-muted/50"
            >
              <div className="mt-0.5">{getSeverityIcon(event.severity)}</div>
              <div className="flex-1 space-y-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <div className="font-medium text-sm sm:text-base truncate">{event.asset}</div>
                  {getSeverityBadge(event.severity)}
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground">
                  {event.priceSource}: ${event.price.toLocaleString()}
                  <span className="ml-2">
                    Deviation: {event.deviation > 0 ? "+" : ""}
                    {event.deviation.toFixed(2)}%
                  </span>
                </div>
                <div className="text-xs text-muted-foreground">{new Date(event.timestamp).toLocaleString()}</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
