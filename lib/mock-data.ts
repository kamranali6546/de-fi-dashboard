import type {
  ProtocolMetrics,
  TimeSeriesPoint,
  ConfidenceIntervalPoint,
  RiskPosition,
  OracleEvent,
  AssetDistribution,
} from "@/types/defi"

export function generateProtocolMetrics(protocol: string): ProtocolMetrics {
  const baseValues: Record<string, number> = {
    aave: 8.5e9,
    compound: 3.2e9,
    makerdao: 6.8e9,
    curve: 4.1e9,
    uniswap: 5.5e9,
  }

  const baseTVL = baseValues[protocol] || 5e9
  const randomVariation = 0.95 + Math.random() * 0.1

  return {
    protocol,
    tvl: baseTVL * randomVariation,
    totalBorrowed: baseTVL * 0.6 * randomVariation,
    utilizationRate: 0.55 + Math.random() * 0.25,
    averageHealthFactor: 1.8 + Math.random() * 0.8,
    liquidationsLast24h: Math.floor(Math.random() * 15),
    uniqueUsers: Math.floor(25000 + Math.random() * 50000),
    timestamp: Date.now(),
  }
}

export function generateTimeSeriesData(days: number): TimeSeriesPoint[] {
  const data: TimeSeriesPoint[] = []
  const now = Date.now()
  const dayMs = 24 * 60 * 60 * 1000
  let baseValue = 5e9 + Math.random() * 3e9

  for (let i = days - 1; i >= 0; i--) {
    const trend = (Math.random() - 0.45) * 0.03
    baseValue = baseValue * (1 + trend)

    data.push({
      timestamp: now - i * dayMs,
      value: baseValue,
    })
  }

  return data
}

export function generateConfidenceIntervalData(days: number, confidenceLevel: number): ConfidenceIntervalPoint[] {
  const data: ConfidenceIntervalPoint[] = []
  const now = Date.now()
  const dayMs = 24 * 60 * 60 * 1000
  let baseValue = 0.05 + Math.random() * 0.03

  const intervalWidth = confidenceLevel === 95 ? 0.015 : 0.012

  for (let i = days - 1; i >= 0; i--) {
    const trend = (Math.random() - 0.5) * 0.002
    baseValue = Math.max(0.02, Math.min(0.12, baseValue + trend))

    const upperVariation = intervalWidth * (0.8 + Math.random() * 0.4)
    const lowerVariation = intervalWidth * (0.8 + Math.random() * 0.4)

    data.push({
      timestamp: now - i * dayMs,
      value: baseValue,
      upperBound: baseValue + upperVariation,
      lowerBound: Math.max(0.01, baseValue - lowerVariation),
    })
  }

  return data
}

export function generateLiquidationRisks(count: number): RiskPosition[] {
  const assets = ["ETH", "WBTC", "USDC", "DAI", "LINK", "UNI", "AAVE"]
  const positions: RiskPosition[] = []

  for (let i = 0; i < count; i++) {
    const healthFactor = 0.8 + Math.random() * 2.5
    let riskLevel: RiskPosition["riskLevel"]

    if (healthFactor < 1.2) riskLevel = "critical"
    else if (healthFactor < 1.5) riskLevel = "high"
    else if (healthFactor < 2.0) riskLevel = "medium"
    else riskLevel = "low"

    const collateral = 50000 + Math.random() * 450000
    const borrowed = (collateral / healthFactor) * 0.75

    positions.push({
      id: `pos-${i}`,
      userAddress: `0x${Math.random().toString(16).slice(2, 10)}...`,
      collateralUSD: collateral,
      borrowedUSD: borrowed,
      healthFactor,
      liquidationPrice: 1500 + Math.random() * 1000,
      asset: assets[Math.floor(Math.random() * assets.length)],
      riskLevel,
    })
  }

  return positions
}

export function generateOracleEvents(count: number): OracleEvent[] {
  const assets = ["ETH/USD", "BTC/USD", "LINK/USD", "UNI/USD", "AAVE/USD"]
  const sources = ["Chainlink", "Band Protocol", "API3", "Uniswap TWAP"]
  const events: OracleEvent[] = []

  for (let i = 0; i < count; i++) {
    const asset = assets[Math.floor(Math.random() * assets.length)]
    const basePrice = asset.startsWith("BTC") ? 45000 : asset.startsWith("ETH") ? 2500 : 15
    const deviation = (Math.random() - 0.5) * 4
    const price = basePrice * (1 + deviation / 100)

    let severity: OracleEvent["severity"]
    if (Math.abs(deviation) > 2) severity = "critical"
    else if (Math.abs(deviation) > 1) severity = "warning"
    else severity = "info"

    events.push({
      id: `oracle-${i}`,
      timestamp: Date.now() - Math.random() * 3600000,
      asset,
      priceSource: sources[Math.floor(Math.random() * sources.length)],
      price,
      deviation,
      severity,
    })
  }

  return events.sort((a, b) => b.timestamp - a.timestamp)
}

export function generateAssetDistribution(): AssetDistribution[] {
  const assets = ["ETH", "WBTC", "stETH", "USDC", "DAI"]
  const values = assets.map(() => Math.random() * 3e9 + 1e9)
  const total = values.reduce((sum, val) => sum + val, 0)

  return assets.map((asset, i) => ({
    asset,
    value: values[i],
    percentage: values[i] / total,
  }))
}
