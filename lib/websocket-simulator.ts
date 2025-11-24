import { generateProtocolMetrics } from "./mock-data"
import type { ProtocolMetrics } from "@/types/defi"

export class WebSocketSimulator {
  private intervalId: NodeJS.Timeout | null = null
  private callback: ((data: ProtocolMetrics) => void) | null = null

  connect(callback: (data: ProtocolMetrics) => void) {
    this.callback = callback

    // Simulate WebSocket updates every 5 seconds
    this.intervalId = setInterval(() => {
      const protocols = ["aave", "compound", "makerdao", "curve", "uniswap"]
      const randomProtocol = protocols[Math.floor(Math.random() * protocols.length)]
      const data = generateProtocolMetrics(randomProtocol)

      if (this.callback) {
        this.callback(data)
      }
    }, 5000)
  }

  disconnect() {
    if (this.intervalId) {
      clearInterval(this.intervalId)
      this.intervalId = null
    }
    this.callback = null
  }
}
