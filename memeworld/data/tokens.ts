import type { Token } from '../types'

export const TOKENS: Token[] = [
  { id: 1,  emoji: '🐸', symbol: 'PEPE',  name: 'Pepe Classic',     price: 0.00000123, change: 142.3,  mcap: '$412M', vol: '$89M',  up: true,  bc: 78, hot: true,  chain: 'SOL'  },
  { id: 2,  emoji: '🐶', symbol: 'DOGE2', name: 'Doge 2.0',         price: 0.0034,     change: 89.1,   mcap: '$220M', vol: '$44M',  up: true,  bc: 45, hot: true,  chain: 'ETH'  },
  { id: 3,  emoji: '🚀', symbol: 'MOON',  name: 'Moonshot Token',   price: 0.000892,   change: 67.4,   mcap: '$178M', vol: '$31M',  up: true,  bc: 62, hot: false, chain: 'SOL'  },
  { id: 4,  emoji: '🌊', symbol: 'WAVE',  name: 'WaveFi',           price: 0.00421,    change: -12.3,  mcap: '$95M',  vol: '$18M',  up: false, bc: 33, hot: false, chain: 'BASE' },
  { id: 5,  emoji: '🦍', symbol: 'APE',   name: 'Ape Gang',         price: 0.00182,    change: 234.7,  mcap: '$340M', vol: '$72M',  up: true,  bc: 91, hot: true,  chain: 'SOL'  },
  { id: 6,  emoji: '💎', symbol: 'DIAMO', name: 'Diamond Hands',    price: 0.000056,   change: 18.2,   mcap: '$56M',  vol: '$12M',  up: true,  bc: 24, hot: false, chain: 'ETH'  },
  { id: 7,  emoji: '🐱', symbol: 'CATK',  name: 'Cat King',         price: 0.00892,    change: -5.7,   mcap: '$134M', vol: '$23M',  up: false, bc: 55, hot: false, chain: 'BASE' },
  { id: 8,  emoji: '⚡', symbol: 'BOLT',  name: 'Lightning Meme',   price: 0.00234,    change: 445.9,  mcap: '$567M', vol: '$143M', up: true,  bc: 97, hot: true,  chain: 'SOL'  },
  { id: 9,  emoji: '🦊', symbol: 'FOXE',  name: 'Fox Coin',         price: 0.00078,    change: 31.4,   mcap: '$78M',  vol: '$16M',  up: true,  bc: 41, hot: false, chain: 'ETH'  },
  { id: 10, emoji: '🍌', symbol: 'BANA',  name: 'Banana Finance',   price: 0.00341,    change: -8.9,   mcap: '$88M',  vol: '$19M',  up: false, bc: 29, hot: false, chain: 'SOL'  },
  { id: 11, emoji: '🌙', symbol: 'LUNE',  name: 'Lune Protocol',    price: 0.0000412,  change: 512.1,  mcap: '$290M', vol: '$61M',  up: true,  bc: 88, hot: true,  chain: 'BASE' },
  { id: 12, emoji: '🐻', symbol: 'BEAR',  name: 'Bear Market Coin', price: 0.00067,    change: -24.5,  mcap: '$67M',  vol: '$14M',  up: false, bc: 18, hot: false, chain: 'ETH'  },
]

export function formatPrice(p: number): string {
  if (p < 0.0001) return `$${p.toFixed(8)}`
  if (p < 0.01)   return `$${p.toFixed(6)}`
  return `$${p.toFixed(4)}`
}

export const FEED_NAMES: string[] = [
  '0x4f2a...3c1d', '0x8b7e...9f2a', '0x1c3d...7e4b',
  '0x9a2f...1d8c', '0xde4b...2f9a', '0x7c91...4e3f',
]
