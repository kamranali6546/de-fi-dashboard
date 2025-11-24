"use client"

import { LayoutDashboard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const protocols = [
  { id: "aave", name: "Aave", logo: "🏦" },
  { id: "compound", name: "Compound", logo: "🔷" },
  { id: "makerdao", name: "MakerDAO", logo: "🎯" },
  { id: "curve", name: "Curve", logo: "🌊" },
  { id: "uniswap", name: "Uniswap", logo: "🦄" },
]

interface DashboardSidebarProps {
  selectedProtocol: string
  onProtocolChange: (protocol: string) => void
  isOpen: boolean
}

export function DashboardSidebar({ selectedProtocol, onProtocolChange, isOpen }: DashboardSidebarProps) {
  return (
    <aside
      className={cn(
        "fixed left-0 top-14 sm:top-16 z-40 h-[calc(100vh-3.5rem)] sm:h-[calc(100vh-4rem)] w-64 border-r border-border bg-background transition-transform duration-300",
        !isOpen && "-translate-x-full",
      )}
    >
      <div className="flex h-full flex-col">
        <div className="flex items-center border-b border-border px-4 py-3">
          <h2 className="text-sm font-semibold text-muted-foreground">PROTOCOLS</h2>
        </div>

        <nav className="flex-1 space-y-1 p-2">
          <Button
            variant={selectedProtocol === "all" ? "secondary" : "ghost"}
            className="w-full justify-start"
            onClick={() => onProtocolChange("all")}
          >
            <LayoutDashboard className="mr-2 h-4 w-4" />
            All Protocols
          </Button>

          {protocols.map((protocol) => (
            <Button
              key={protocol.id}
              variant={selectedProtocol === protocol.id ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => onProtocolChange(protocol.id)}
            >
              <span className="mr-2">{protocol.logo}</span>
              {protocol.name}
            </Button>
          ))}
        </nav>
      </div>
    </aside>
  )
}
