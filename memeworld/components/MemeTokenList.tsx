import { useState, useEffect, useCallback } from 'react'
import type { MemeToken, MyMemeToken, TokenSource } from '../types'
import { TOKENS, formatPrice } from '../data/tokens'
import { MY_MEMECOINS } from '../data/myMemecoins'
import { fetchTokenPrice, formatMarketValue } from '../services/coingeckoService'
import styles from './MemeTokenList.module.css'

// ── Mini sparkline chart (same logic as App.tsx) ─────────────────────────────

interface MiniChartProps {
  up: boolean
  seed: number
}

function MiniChart({ up, seed }: MiniChartProps) {
  const pts: string[] = []
  let y = up ? 20 : 4
  let s = seed
  for (let x = 0; x <= 80; x += 10) {
    s = (s * 1664525 + 1013904223) & 0xffffffff
    y += ((s >>> 0) / 0xffffffff - (up ? 0.42 : 0.58)) * 6
    y = Math.max(2, Math.min(22, y))
    pts.push(`${x},${y}`)
  }
  return (
    <svg width="80" height="24" viewBox="0 0 80 24">
      <path
        d={'M' + pts.join(' L')}
        fill="none"
        stroke={up ? 'var(--up)' : 'var(--down)'}
        strokeWidth="1.5"
      />
    </svg>
  )
}

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Convert existing Token objects to the unified MemeToken shape */
function toMemeTokens(): MemeToken[] {
  return TOKENS.map((t) => ({
    id: String(t.id),
    emoji: t.emoji,
    symbol: t.symbol,
    name: t.name,
    price: t.price,
    change24h: t.change,
    mcap: t.mcap,
    vol: t.vol,
    up: t.up,
    chain: t.chain,
    source: 'general' as const,
  }))
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function MemeTokenList() {
  const [activeSource, setActiveSource] = useState<TokenSource>('general')
  const [ownedCoins, setOwnedCoins] = useState<MyMemeToken[]>(MY_MEMECOINS)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch live prices for owned coins from CoinGecko
  const refreshOwnedPrices = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const updated = await Promise.all(
        MY_MEMECOINS.map(async (coin): Promise<MyMemeToken> => {
          if (!coin.contractAddress) return coin
          const data = await fetchTokenPrice(coin.contractAddress, coin.chain)
          if (!data) return coin
          const change24h = data.usd_24h_change ?? coin.change24h
          return {
            ...coin,
            price: data.usd ?? coin.price,
            change24h,
            mcap: formatMarketValue(data.usd_market_cap),
            vol: formatMarketValue(data.usd_24h_vol),
            up: change24h >= 0,
          }
        }),
      )
      setOwnedCoins(updated)
    } catch {
      setError('価格データの取得に失敗しました')
    } finally {
      setLoading(false)
    }
  }, [])

  // Load prices when the user switches to the owned tab
  useEffect(() => {
    if (activeSource === 'owned') {
      void refreshOwnedPrices()
    }
  }, [activeSource, refreshOwnedPrices])

  const generalTokens = toMemeTokens()
  const displayTokens: MemeToken[] = activeSource === 'general' ? generalTokens : ownedCoins

  return (
    <div className={styles.wrapper}>
      {/* ── Toggle ── */}
      <div className={styles.header}>
        <div className={styles.title}>MEME COINS</div>
        <div className={styles.toggle}>
          <button
            className={`${styles.toggleBtn} ${activeSource === 'general' ? styles.toggleActive : ''}`}
            onClick={() => setActiveSource('general')}
          >
            一般ミームコイン
          </button>
          <button
            className={`${styles.toggleBtn} ${activeSource === 'owned' ? styles.toggleActive : ''}`}
            onClick={() => setActiveSource('owned')}
          >
            自作ミームコイン
          </button>
        </div>
        {activeSource === 'owned' && (
          <button
            className={styles.refreshBtn}
            onClick={() => void refreshOwnedPrices()}
            disabled={loading}
            title="価格を更新"
          >
            {loading ? '⟳ 取得中…' : '⟳ 更新'}
          </button>
        )}
      </div>

      {/* ── Error banner ── */}
      {error && <div className={styles.errorBanner}>{error}</div>}

      {/* ── Table ── */}
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>#</th>
              <th>TOKEN</th>
              <th>PRICE</th>
              <th>24H</th>
              <th>MARKET CAP</th>
              <th>VOLUME</th>
              <th>CHART</th>
            </tr>
          </thead>
          <tbody>
            {displayTokens.map((t, i) => (
              <tr key={t.id}>
                <td className={styles.rank}>{i + 1}</td>
                <td>
                  <div className={styles.coinCell}>
                    <span className={styles.coinEmoji}>{t.emoji}</span>
                    <div>
                      <div className={styles.coinSymbol}>{t.symbol}</div>
                      <div className={styles.coinMeta}>
                        <span className={styles.coinName}>{t.name}</span>
                        <span className={styles.chainBadge}>{t.chain}</span>
                      </div>
                    </div>
                  </div>
                </td>
                <td className={styles.mono}>
                  {t.price > 0 ? formatPrice(t.price) : '$—'}
                </td>
                <td className={t.up ? styles.upCell : styles.downCell}>
                  {t.change24h !== 0
                    ? `${t.up ? '+' : ''}${t.change24h.toFixed(2)}%`
                    : '—'}
                </td>
                <td className={styles.mono}>{t.mcap}</td>
                <td className={styles.mono}>{t.vol}</td>
                <td>
                  <MiniChart up={t.up} seed={parseInt(t.id, 10) * 3571 || i * 3571} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Owned-coin contract info ── */}
      {activeSource === 'owned' && (
        <div className={styles.contractList}>
          {(ownedCoins as MyMemeToken[]).map((coin) => (
            <div key={coin.id} className={styles.contractRow}>
              <span className={styles.contractSymbol}>{coin.emoji} {coin.symbol}</span>
              {coin.contractAddress && (
                <span className={styles.contractAddr} title={coin.contractAddress}>
                  {coin.contractAddress.slice(0, 8)}…{coin.contractAddress.slice(-6)}
                </span>
              )}
              {coin.pda && (
                <span className={styles.pdaLabel}>PDA: {coin.pda.slice(0, 8)}…</span>
              )}
              <span className={styles.launchDate}>🗓 {coin.launchDate}</span>
              {coin.description && (
                <span className={styles.contractDesc}>{coin.description}</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
