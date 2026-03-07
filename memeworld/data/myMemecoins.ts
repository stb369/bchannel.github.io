import type { MyMemeToken } from '../types'

/**
 * Local registry of creator-owned meme coins.
 * Price fields (price, change24h, mcap, vol, up) start at placeholder values
 * and are populated at runtime by the CoinGecko service.
 *
 * NOTE: The contract addresses below are illustrative placeholders.
 * Replace them with your actual deployed contract addresses.
 */
export const MY_MEMECOINS: MyMemeToken[] = [
  {
    id: 'my-shib2',
    emoji: '🐕',
    symbol: 'SHIB2',
    name: 'My Shiba 2.0',
    chain: 'ETH',
    contractAddress: '0x000000000000000000000000000000000000DEAD',
    launchDate: '2024-03-15',
    description: '第一弾 ETH ミームコイン',
    price: 0,
    change24h: 0,
    mcap: '$—',
    vol: '$—',
    up: true,
    source: 'owned',
  },
  {
    id: 'my-solpepe',
    emoji: '🐸',
    symbol: 'SOLPEPE',
    name: 'Sol Pepe',
    chain: 'SOL',
    contractAddress: 'So11111111111111111111111111111111111111112',
    pda: 'PepeVaultSo11111111111111111111111111111111',
    launchDate: '2024-05-01',
    description: 'Solana 上のカエルコイン',
    price: 0,
    change24h: 0,
    mcap: '$—',
    vol: '$—',
    up: true,
    source: 'owned',
  },
  {
    id: 'my-basemoon',
    emoji: '🌕',
    symbol: 'BMOON',
    name: 'Base Moon',
    chain: 'BASE',
    contractAddress: '0x000000000000000000000000000000000000BEEF',
    launchDate: '2024-08-10',
    description: 'Base ネットワーク初のムーンコイン',
    price: 0,
    change24h: 0,
    mcap: '$—',
    vol: '$—',
    up: true,
    source: 'owned',
  },
  {
    id: 'my-ethcat',
    emoji: '😸',
    symbol: 'ETHCAT',
    name: 'ETH Cat',
    chain: 'ETH',
    contractAddress: '0x000000000000000000000000000000000000C47C',
    launchDate: '2024-10-20',
    description: 'ETH ネココイン — 安定した笑顔',
    price: 0,
    change24h: 0,
    mcap: '$—',
    vol: '$—',
    up: true,
    source: 'owned',
  },
]
