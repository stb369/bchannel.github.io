import { useState, useEffect, useCallback } from 'react'
import { Connection, PublicKey } from '@solana/web3.js'
import { fetchVirtualMarketsFromChain } from '../services/fetchMarketStates'
import type { VirtualMarket } from '../services/fetchMarketStates'

// ─── Configuration ───────────────────────────────────────────────────────────
// Override via VITE_VSMC_PROGRAM_ID and VITE_SOLANA_RPC env vars.
const DEFAULT_PROGRAM_ID = import.meta.env.VITE_VSMC_PROGRAM_ID as string | undefined
const DEFAULT_RPC =
  (import.meta.env.VITE_SOLANA_RPC as string | undefined) ??
  'https://api.devnet.solana.com'

// ─── Sub-components ──────────────────────────────────────────────────────────

function DirectionBadge({ direction }: { direction: number }) {
  const label = direction === 0 ? 'UP / BUY' : 'DOWN / SELL'
  const color = direction === 0 ? '#22c55e' : '#ef4444'
  return (
    <span style={{ color, fontWeight: 600, fontSize: 12 }}>{label}</span>
  )
}

interface MarketCardProps {
  market: VirtualMarket
}

function MarketCard({ market }: MarketCardProps) {
  return (
    <div
      style={{
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.12)',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <span style={{ fontWeight: 700, fontSize: 16 }}>{market.name}</span>
        <span style={{ fontSize: 12, color: market.isActive ? '#22c55e' : '#6b7280' }}>
          {market.isActive ? '● ACTIVE' : '○ CLOSED'}
        </span>
      </div>

      <div style={{ fontSize: 11, color: '#9ca3af', marginBottom: 8, wordBreak: 'break-all' }}>
        {market.pubkey.toBase58()}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 8 }}>
        <div>
          <div style={{ fontSize: 10, color: '#9ca3af' }}>Total Liquidity</div>
          <div style={{ fontSize: 14 }}>{market.totalLiquidity.toLocaleString()}</div>
        </div>
        <div>
          <div style={{ fontSize: 10, color: '#9ca3af' }}>Directions</div>
          <div style={{ fontSize: 14 }}>{market.directions.length}</div>
        </div>
      </div>

      {market.directions.length === 0 ? (
        <div style={{ fontSize: 12, color: '#6b7280', fontStyle: 'italic' }}>
          No direction parameters found
        </div>
      ) : (
        <table style={{ width: '100%', fontSize: 12, borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ color: '#9ca3af' }}>
              <th style={{ textAlign: 'left', paddingBottom: 4 }}>Direction</th>
              <th style={{ textAlign: 'right', paddingBottom: 4 }}>Price</th>
              <th style={{ textAlign: 'right', paddingBottom: 4 }}>Pool</th>
              <th style={{ textAlign: 'right', paddingBottom: 4 }}>Bets</th>
            </tr>
          </thead>
          <tbody>
            {market.directions.map((d, i) => (
              <tr key={i}>
                <td style={{ paddingBottom: 2 }}>
                  <DirectionBadge direction={d.direction} />
                </td>
                <td style={{ textAlign: 'right' }}>{d.price.toLocaleString()}</td>
                <td style={{ textAlign: 'right' }}>{d.poolAmount.toLocaleString()}</td>
                <td style={{ textAlign: 'right' }}>{d.betCount.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div style={{ fontSize: 10, color: '#6b7280', marginTop: 8 }}>
        Created: {market.createdAt.toLocaleDateString()}
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function VsmcTopPage() {
  const [markets, setMarkets] = useState<VirtualMarket[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [programIdInput, setProgramIdInput] = useState(DEFAULT_PROGRAM_ID ?? '')
  const [rpcInput, setRpcInput] = useState(DEFAULT_RPC)

  // UI messages are intentionally in Japanese – this app targets Japanese users.
  const fetchMarkets = useCallback(async () => {
    if (!programIdInput.trim()) {
      setError('Program ID を入力してください')
      return
    }

    let programId: PublicKey
    try {
      programId = new PublicKey(programIdInput.trim())
    } catch {
      setError(`無効な Program ID: ${programIdInput}`)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const connection = new Connection(rpcInput.trim(), 'confirmed')
      const result = await fetchVirtualMarketsFromChain(connection, programId)
      setMarkets(result)
      if (result.length === 0) {
        console.info('[VSMC] No MarketState accounts found for this program ID and cluster.')
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      console.error('[VSMC] fetchVirtualMarketsFromChain error:', err)
      setError(msg)
    } finally {
      setLoading(false)
    }
  }, [programIdInput, rpcInput])

  // Auto-fetch when a default program ID is configured
  useEffect(() => {
    if (DEFAULT_PROGRAM_ID) {
      void fetchMarkets()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#0d0d1a',
        color: '#f1f1f1',
        fontFamily: "'Segoe UI', sans-serif",
        padding: '24px 16px',
      }}
    >
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>
        🏛 VSMC Market States
      </h1>
      <p style={{ fontSize: 13, color: '#9ca3af', marginBottom: 24 }}>
        Anchor account deserialization diagnostics for MarketState
      </p>

      {/* Config panel */}
      <div
        style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 12,
          padding: 16,
          marginBottom: 24,
        }}
      >
        <div style={{ marginBottom: 12 }}>
          <label style={{ display: 'block', fontSize: 12, color: '#9ca3af', marginBottom: 4 }}>
            Program ID
          </label>
          <input
            value={programIdInput}
            onChange={(e) => setProgramIdInput(e.target.value)}
            placeholder="11111111111111111111111111111111"
            style={{
              width: '100%',
              padding: '8px 12px',
              background: 'rgba(255,255,255,0.07)',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: 8,
              color: '#f1f1f1',
              fontSize: 13,
              boxSizing: 'border-box',
            }}
          />
        </div>

        <div style={{ marginBottom: 12 }}>
          <label style={{ display: 'block', fontSize: 12, color: '#9ca3af', marginBottom: 4 }}>
            RPC Endpoint
          </label>
          <input
            value={rpcInput}
            onChange={(e) => setRpcInput(e.target.value)}
            placeholder="https://api.devnet.solana.com"
            style={{
              width: '100%',
              padding: '8px 12px',
              background: 'rgba(255,255,255,0.07)',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: 8,
              color: '#f1f1f1',
              fontSize: 13,
              boxSizing: 'border-box',
            }}
          />
        </div>

        <button
          onClick={() => void fetchMarkets()}
          disabled={loading}
          style={{
            background: loading ? '#374151' : '#6366f1',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            padding: '10px 24px',
            fontSize: 14,
            cursor: loading ? 'not-allowed' : 'pointer',
            fontWeight: 600,
          }}
        >
          {loading ? '取得中…' : 'マーケット取得'}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div
          style={{
            background: 'rgba(239,68,68,0.1)',
            border: '1px solid #ef4444',
            borderRadius: 8,
            padding: '12px 16px',
            marginBottom: 16,
            color: '#fca5a5',
            fontSize: 13,
          }}
        >
          ⚠ {error}
        </div>
      )}

      {/* Results */}
      {!loading && markets.length > 0 && (
        <div>
          <div style={{ fontSize: 13, color: '#9ca3af', marginBottom: 12 }}>
            {markets.length} マーケット取得済み
          </div>
          {markets.map((m) => (
            <MarketCard key={m.pubkey.toBase58()} market={m} />
          ))}
        </div>
      )}

      {!loading && !error && markets.length === 0 && (
        <div style={{ color: '#6b7280', fontSize: 14, textAlign: 'center', paddingTop: 40 }}>
          マーケットがありません。Program ID と RPC を確認してください。
          <br />
          <span style={{ fontSize: 12 }}>
            ブラウザ DevTools の Console タブで [VSMC] ログを確認してください。
          </span>
        </div>
      )}
    </div>
  )
}
