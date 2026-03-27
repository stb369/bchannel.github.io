export type Chain = 'SOL' | 'ETH' | 'BASE'

export interface Token {
  id: number
  emoji: string
  symbol: string
  name: string
  price: number
  change: number
  mcap: string
  vol: string
  up: boolean
  bc: number
  hot: boolean
  chain: Chain
}

export interface FeedItem {
  id: number
  t: Token
  buy: boolean
  amt: string
  name: string
  mins: number
}

export type TradeTab = 'buy' | 'sell'

export type FilterOption = 'ALL' | 'NEW' | '🔥 HOT' | 'SOL' | 'ETH' | 'BASE'

// ── CoinGecko / MemeToken integration ──────────────────────────────────────

export type TokenSource = 'general' | 'owned'

/** Unified meme-coin row displayed in MemeTokenList */
export interface MemeToken {
  id: string
  emoji: string
  symbol: string
  name: string
  /** Current price in USD */
  price: number
  /** 24-hour percentage change */
  change24h: number
  /** Formatted market cap string, e.g. "$412M" */
  mcap: string
  /** Formatted 24-hour volume string, e.g. "$89M" */
  vol: string
  /** true = price went up over 24 h */
  up: boolean
  chain: Chain
  contractAddress?: string
  source: TokenSource
}

/** Registry entry for a creator-owned meme coin */
export interface MyMemeToken extends MemeToken {
  /** Solana PDA (if applicable) */
  pda?: string
  /** CoinGecko coin ID, stored after first successful lookup */
  coingeckoId?: string
  /** ISO date string of the token launch */
  launchDate: string
  description?: string
}
