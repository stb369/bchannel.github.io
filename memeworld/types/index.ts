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

export interface WalletOption {
  id: string
  name: string
  icon: string
  desc: string
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
