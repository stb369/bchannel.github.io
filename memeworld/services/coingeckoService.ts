import type { Chain } from '../types'

/** Shape of a single token entry returned by the CoinGecko token-price endpoint */
export interface CoinGeckoPriceData {
  usd?: number
  usd_24h_change?: number
  usd_market_cap?: number
  usd_24h_vol?: number
}

interface CacheEntry {
  data: CoinGeckoPriceData
  timestamp: number
}

/** In-memory cache to stay within the free-tier rate limit (30 req/min) */
const priceCache = new Map<string, CacheEntry>()
const CACHE_TTL_MS = 60_000 // 1 minute

/** Map our internal chain identifiers to CoinGecko platform slugs */
const CHAIN_TO_PLATFORM: Record<Chain, string> = {
  ETH: 'ethereum',
  SOL: 'solana',
  BASE: 'base',
}

/**
 * Fetch the current price and market data for a token identified by its
 * contract address on a given chain.
 *
 * Returns `null` when:
 * - the network request fails
 * - CoinGecko does not know the contract address
 * - the chain is not supported
 */
export async function fetchTokenPrice(
  contractAddress: string,
  chain: Chain,
): Promise<CoinGeckoPriceData | null> {
  const platform = CHAIN_TO_PLATFORM[chain]
  if (!platform) return null

  const normalised = contractAddress.toLowerCase()
  const cacheKey = `${platform}:${normalised}`

  const cached = priceCache.get(cacheKey)
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.data
  }

  try {
    const url =
      `https://api.coingecko.com/api/v3/simple/token_price/${platform}` +
      `?contract_addresses=${encodeURIComponent(normalised)}` +
      `&vs_currencies=usd` +
      `&include_market_cap=true` +
      `&include_24hr_vol=true` +
      `&include_24hr_change=true`

    const response = await fetch(url)
    if (!response.ok) return null

    const json = (await response.json()) as Record<string, CoinGeckoPriceData>
    const data = json[normalised] ?? null
    if (data) {
      priceCache.set(cacheKey, { data, timestamp: Date.now() })
    }
    return data
  } catch {
    return null
  }
}

/** Resolve a CoinGecko coin ID from a contract address using the /coins/{id}/contract endpoint */
export async function fetchCoinIdByContract(
  contractAddress: string,
  chain: Chain,
): Promise<string | null> {
  const platform = CHAIN_TO_PLATFORM[chain]
  if (!platform) return null

  try {
    const url = `https://api.coingecko.com/api/v3/coins/${platform}/contract/${encodeURIComponent(contractAddress.toLowerCase())}`
    const response = await fetch(url)
    if (!response.ok) return null

    const json = (await response.json()) as { id?: string }
    return json.id ?? null
  } catch {
    return null
  }
}

/** Helper: format a raw USD number to a human-readable string like "$412M" */
export function formatMarketValue(value: number | undefined): string {
  if (value == null || value === 0) return '$—'
  if (value >= 1_000_000_000) return `$${(value / 1_000_000_000).toFixed(1)}B`
  if (value >= 1_000_000)     return `$${(value / 1_000_000).toFixed(0)}M`
  if (value >= 1_000)         return `$${(value / 1_000).toFixed(0)}K`
  return `$${value.toFixed(2)}`
}
