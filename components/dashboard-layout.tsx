"use client"

import { useState, useEffect } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { ProtocolOverview } from "@/components/protocol-overview"
import { TVLChart } from "@/components/tvl-chart"
import { ConfidenceIntervalChart } from "@/components/confidence-interval-chart"
import { LiquidationHeatmap } from "@/components/liquidation-heatmap"
import { CollateralBreakdown } from "@/components/collateral-breakdown"
import { OracleDeviation } from "@/components/oracle-deviation"
import { ProtocolComparison } from "@/components/protocol-comparison"
import { ErrorBoundary } from "@/components/error-boundary"
import { WebSocketSimulator } from "@/lib/websocket-simulator"
import type { ProtocolMetrics } from "@/types/defi"

export function DashboardLayout() {
  const [selectedProtocol, setSelectedProtocol] = useState("aave")
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [realTimeData, setRealTimeData] = useState<ProtocolMetrics | null>(null)

  useEffect(() => {
    const ws = new WebSocketSimulator()

    ws.connect((data) => {
      if (data.protocol === selectedProtocol) {
        setRealTimeData(data)
      }
    })

    return () => ws.disconnect()
  }, [selectedProtocol])

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)} />

      <div className="flex">
        <DashboardSidebar
          selectedProtocol={selectedProtocol}
          onProtocolChange={setSelectedProtocol}
          isOpen={isSidebarOpen}
        />

        <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? "lg:ml-64" : "ml-0"} p-3 sm:p-4 md:p-6`}>
          <div className="max-w-[1800px] mx-auto space-y-4 md:space-y-6">
            <ErrorBoundary>
              <ProtocolOverview protocol={selectedProtocol} realTimeData={realTimeData} />
            </ErrorBoundary>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6">
              <ErrorBoundary>
                <TVLChart protocol={selectedProtocol} />
              </ErrorBoundary>

              <ErrorBoundary>
                <ConfidenceIntervalChart protocol={selectedProtocol} />
              </ErrorBoundary>
            </div>

            <ErrorBoundary>
              <LiquidationHeatmap protocol={selectedProtocol} />
            </ErrorBoundary>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6">
              <ErrorBoundary>
                <CollateralBreakdown protocol={selectedProtocol} />
              </ErrorBoundary>

              <ErrorBoundary>
                <OracleDeviation protocol={selectedProtocol} />
              </ErrorBoundary>
            </div>

            <ErrorBoundary>
              <ProtocolComparison />
            </ErrorBoundary>
          </div>
        </main>
      </div>
    </div>
  )
}
