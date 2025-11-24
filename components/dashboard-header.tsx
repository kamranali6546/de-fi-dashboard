"use client"

import { Moon, Sun, RefreshCw, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/hooks/use-theme"
import { useState } from "react"
import Image from "next/image"

interface DashboardHeaderProps {
  onMenuToggle: () => void
}

export function DashboardHeader({ onMenuToggle }: DashboardHeaderProps) {
  const { theme, toggleTheme } = useTheme()
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => setIsRefreshing(false), 1000)
    window.location.reload()
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
      <div className="flex h-14 sm:h-16 items-center justify-between px-3 sm:px-4 md:px-6">
        <div className="flex items-center gap-2 sm:gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 sm:h-10 sm:w-10"
            onClick={onMenuToggle}
            aria-label="Toggle sidebar"
          >
            <Menu className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>

          <div className="relative h-8 w-28 sm:h-10 sm:w-36 md:h-12 md:w-44">
            <Image
              src="/llamarisk-logo.png"
              alt="LlamaRisk Dashboard"
              fill
              className="object-contain dark:brightness-110"
              priority
            />
          </div>
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 sm:h-10 sm:w-10"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 sm:h-5 sm:w-5 ${isRefreshing ? "animate-spin" : ""}`} />
          </Button>

          <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-10 sm:w-10" onClick={toggleTheme}>
            {theme === "dark" ? <Sun className="h-4 w-4 sm:h-5 sm:w-5" /> : <Moon className="h-4 w-4 sm:h-5 sm:w-5" />}
          </Button>
        </div>
      </div>
    </header>
  )
}
