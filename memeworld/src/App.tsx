import { useState, useMemo } from 'react'
import { TOKENS, formatPrice } from '../data/tokens'
import type { Token, FilterOption } from '../types'
import Header from '../components/Header'
import Ticker from '../components/Ticker'
import TokenCard from '../components/TokenCard'
import TradePanel from '../components/TradePanel'
import LiveFeed from '../components/LiveFeed'
import WalletModal from '../components/WalletModal'
import styles from './App.module.css'

const FILTERS: FilterOption[] = ['ALL', 'NEW', '🔥 HOT', 'SOL', 'ETH', 'BASE']
const TABLE_TOKENS: Token[] = [...TOKENS].sort((a, b) => b.change - a.change).slice(0, 6)

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

export default function App() {
  const [searchQuery, setSearchQuery]     = useState<string>('')
  const [activeFilter, setActiveFilter]   = useState<FilterOption>('ALL')
  const [selectedToken, setSelectedToken] = useState<Token>(TOKENS[0])
  const [wallet, setWallet]               = useState<string | null>(null)
  const [showWallet, setShowWallet]       = useState<boolean>(false)

  const filteredTokens = useMemo<Token[]>(() => {
    const q = searchQuery.trim().toLowerCase()
    return TOKENS.filter((t) => {
      const matchSearch =
        !q ||
        t.symbol.toLowerCase().includes(q) ||
        t.name.toLowerCase().includes(q)

      const matchFilter: boolean =
        activeFilter === 'ALL'    ? true :
        activeFilter === '🔥 HOT' ? t.hot :
        activeFilter === 'NEW'    ? t.bc < 40 :
        t.chain === activeFilter

      return matchSearch && matchFilter
    })
  }, [searchQuery, activeFilter])

  const handleConnect = (addr: string): void => {
    setWallet(addr)
    setShowWallet(false)
  }

  const handleDisconnect = (): void => {
    if (window.confirm('ウォレットを切断しますか？')) setWallet(null)
  }

  return (
    <div className={styles.app}>
      <div className={styles.bgGrid} />
      <div className={styles.bgGlow} />
      <div className={styles.bgGlow2} />

      <Header
        searchQuery={searchQuery}
        onSearch={setSearchQuery}
        wallet={wallet}
        onConnect={wallet ? handleDisconnect : () => setShowWallet(true)}
      />
      <Ticker />

      <div className={styles.container}>
        <div className={styles.mainLayout}>
          {/* Left: token list */}
          <div>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionTitle}>
                {searchQuery
                  ? `"${searchQuery.toUpperCase()}" の検索結果 (${filteredTokens.length})`
                  : 'TRENDING NOW'}
              </div>
              <div className={styles.filters}>
                {FILTERS.map((f) => (
                  <button
                    key={f}
                    className={`${styles.filterBtn} ${activeFilter === f ? styles.filterActive : ''}`}
                    onClick={() => setActiveFilter(f)}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {filteredTokens.length > 0 ? (
              <div className={styles.tokenGrid}>
                {filteredTokens.map((t) => (
                  <TokenCard
                    key={t.id}
                    token={t}
                    onSelect={setSelectedToken}
                    highlight={selectedToken?.id === t.id}
                  />
                ))}
              </div>
            ) : (
              <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>🔍</div>
                <div className={styles.emptyTitle}>トークンが見つかりませんでした</div>
                <div className={styles.emptyDesc}>
                  "{searchQuery}" に一致するトークンはありません。
                </div>
                <button className={styles.clearSearch} onClick={() => setSearchQuery('')}>
                  検索をクリア
                </button>
              </div>
            )}

            {!searchQuery && (
              <>
                <div className={styles.sectionHeader} style={{ marginTop: 32 }}>
                  <div className={styles.sectionTitle}>TOP GAINERS 24H</div>
                  <button className={styles.viewAll}>VIEW ALL →</button>
                </div>
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
                      {TABLE_TOKENS.map((t, i) => (
                        <tr key={t.id} onClick={() => setSelectedToken(t)}>
                          <td className={styles.rank}>{i + 1}</td>
                          <td>
                            <div className={styles.coinCell}>
                              <span className={styles.coinEmoji}>{t.emoji}</span>
                              <div>
                                <div className={styles.coinSymbol}>{t.symbol}</div>
                                <div className={styles.coinName}>{t.name}</div>
                              </div>
                            </div>
                          </td>
                          <td className={styles.mono}>{formatPrice(t.price)}</td>
                          <td className={t.up ? styles.upCell : styles.downCell}>
                            {t.up ? '+' : ''}{t.change}%
                          </td>
                          <td className={styles.mono}>{t.mcap}</td>
                          <td className={styles.mono}>{t.vol}</td>
                          <td><MiniChart up={t.up} seed={t.id * 3571} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>

          {/* Right: trade + feed */}
          <div>
            <TradePanel
              token={selectedToken}
              wallet={wallet}
              onConnectWallet={() => setShowWallet(true)}
            />
            <LiveFeed />
          </div>
        </div>
      </div>

      {showWallet && (
        <WalletModal
          onClose={() => setShowWallet(false)}
          onConnect={handleConnect}
        />
      )}
    </div>
  )
}
