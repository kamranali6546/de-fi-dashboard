// DeFiLlama API integration for real protocol data
export async function fetchDefiLlamaData(protocol: string) {
  try {
    const protocolMap: Record<string, string> = {
      aave: "aave",
      compound: "compound-finance",
      makerdao: "makerdao",
      curve: "curve-dex",
      uniswap: "uniswap",
    }

    const slug = protocolMap[protocol] || protocol
    
    const response = await fetch(`https://api.llama.fi/protocol/${slug}`)

    if (!response.ok) {
      throw new Error("Failed to fetch from DeFiLlama")
    }

    const data = await response.json()

    // Extract the latest TVL value
    const latestTVL = data.tvl?.[data.tvl.length - 1]?.totalLiquidityUSD || data.chainTvls?.["Ethereum"]?.tvl?.[0] || 0

    return {
      tvl: latestTVL,
      name: data.name,
      symbol: data.symbol,
      chains: data.chains,
    }
  } catch (error) {
    console.error("Error fetching DeFiLlama data:", error)
    return null
  }
}
