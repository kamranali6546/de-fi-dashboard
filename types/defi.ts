export interface ProtocolMetrics {
  protocol: string
  tvl: number
  totalBorrowed: number
  utilizationRate: number
  averageHealthFactor: number
  liquidationsLast24h: number
  uniqueUsers: number
  timestamp: number
}

export interface TimeSeriesPoint {
  timestamp: number
  value: number
}

export interface RiskPosition {
  id: string
  userAddress: string
  collateralUSD: number
  borrowedUSD: number
  healthFactor: number
  liquidationPrice: number
  asset: string
  riskLevel: "low" | "medium" | "high" | "critical"
}

export interface OracleEvent {
  id: string
  timestamp: number
  asset: string
  priceSource: string
  price: number
  deviation: number
  severity: "info" | "warning" | "critical"
}

export interface ConfidenceIntervalPoint {
  timestamp: number
  value: number
  upperBound: number
  lowerBound: number
}

export interface AssetDistribution {
  asset: string
  value: number
  percentage: number
}
