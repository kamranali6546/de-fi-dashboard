"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { generateProtocolMetrics } from "@/lib/mock-data"
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ProtocolComparison() {
  const [protocols, setProtocols] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [sortKey, setSortKey] = useState<string>("tvl")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")

  useEffect(() => {
    setLoading(true)
    setTimeout(() => {
      const protocolNames = ["aave", "compound", "makerdao", "curve", "uniswap"]
      const data = protocolNames.map((name) => ({
        ...generateProtocolMetrics(name),
        name: name.charAt(0).toUpperCase() + name.slice(1),
      }))
      setProtocols(data)
      setLoading(false)
    }, 750)
  }, [])

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortKey(key)
      setSortOrder("desc")
    }
  }

  const sortedProtocols = [...protocols].sort((a, b) => {
    const aValue = a[sortKey]
    const bValue = b[sortKey]
    const modifier = sortOrder === "asc" ? 1 : -1
    return (aValue - bValue) * modifier
  })

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

  const SortIcon = ({ field }: { field: string }) => {
    if (sortKey !== field) return <ArrowUpDown className="h-4 w-4" />
    return sortOrder === "asc" ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base sm:text-lg">Protocol Comparison</CardTitle>
        <CardDescription className="text-xs sm:text-sm">
          Compare key metrics across different DeFi protocols
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <div className="min-w-[600px] px-4 sm:px-6 pb-4 sm:pb-6">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="pb-3 text-left font-semibold text-foreground text-xs sm:text-sm whitespace-nowrap">
                    Protocol
                  </th>
                  <th className="pb-3 text-right whitespace-nowrap">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSort("tvl")}
                      className="h-auto p-0 text-xs sm:text-sm font-semibold text-foreground hover:bg-transparent hover:text-foreground/80"
                    >
                      TVL <SortIcon field="tvl" />
                    </Button>
                  </th>
                  <th className="pb-3 text-right whitespace-nowrap">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSort("utilizationRate")}
                      className="h-auto p-0 text-xs sm:text-sm font-semibold text-foreground hover:bg-transparent hover:text-foreground/80"
                    >
                      Utilization <SortIcon field="utilizationRate" />
                    </Button>
                  </th>
                  <th className="pb-3 text-right whitespace-nowrap">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSort("averageHealthFactor")}
                      className="h-auto p-0 text-xs sm:text-sm font-semibold text-foreground hover:bg-transparent hover:text-foreground/80"
                    >
                      Health <SortIcon field="averageHealthFactor" />
                    </Button>
                  </th>
                  <th className="pb-3 text-right whitespace-nowrap">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSort("uniqueUsers")}
                      className="h-auto p-0 text-xs sm:text-sm font-semibold text-foreground hover:bg-transparent hover:text-foreground/80"
                    >
                      Users <SortIcon field="uniqueUsers" />
                    </Button>
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedProtocols.map((protocol) => (
                  <tr key={protocol.protocol} className="border-b border-border transition-colors hover:bg-muted/50">
                    <td className="py-3 font-medium text-xs sm:text-sm whitespace-nowrap">{protocol.name}</td>
                    <td className="py-3 text-right text-xs sm:text-sm whitespace-nowrap">
                      {formatCurrency(protocol.tvl)}
                    </td>
                    <td className="py-3 text-right text-xs sm:text-sm whitespace-nowrap">
                      {formatPercent(protocol.utilizationRate)}
                    </td>
                    <td className="py-3 text-right text-xs sm:text-sm whitespace-nowrap">
                      <span
                        className={
                          protocol.averageHealthFactor > 2
                            ? "text-green-600 dark:text-green-500 font-semibold"
                            : protocol.averageHealthFactor > 1.5
                              ? "text-yellow-600 dark:text-yellow-500 font-semibold"
                              : "text-red-600 dark:text-red-500 font-semibold"
                        }
                      >
                        {protocol.averageHealthFactor.toFixed(2)}
                      </span>
                    </td>
                    <td className="py-3 text-right text-xs sm:text-sm whitespace-nowrap">
                      {protocol.uniqueUsers.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
