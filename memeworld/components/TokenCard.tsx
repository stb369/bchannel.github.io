import { useMemo } from 'react'
import { formatPrice } from '../data/tokens'
import type { Token } from '../types'
import styles from './TokenCard.module.css'

interface SVGPaths {
  line: string
  fill: string
}

function generateSVGPath(up: boolean, seed: number): SVGPaths {
  const pts: string[] = []
  let y = up ? 35 : 5
  let s = seed
  const rng = (): number => {
    s = (s * 1664525 + 1013904223) & 0xffffffff
    return (s >>> 0) / 0xffffffff
  }
  for (let x = 0; x <= 200; x += 20) {
    y += (rng() - (up ? 0.42 : 0.58)) * 14
    y = Math.max(3, Math.min(37, y))
    pts.push(`${x},${y}`)
  }
  const line = 'M' + pts.join(' L')
  const fill = line + ' L200,42 L0,42 Z'
  return { line, fill }
}

interface TokenCardProps {
  token: Token
  onSelect: (token: Token) => void
  highlight: boolean
}

export default function TokenCard({ token, onSelect, highlight }: TokenCardProps) {
  const { line, fill } = useMemo(
    () => generateSVGPath(token.up, token.id * 7919),
    [token.id, token.up],
  )
  const color = token.up ? 'var(--up)' : 'var(--down)'

  return (
    <div
      className={[
        styles.card,
        token.hot  ? styles.hot       : '',
        highlight  ? styles.highlight : '',
      ].join(' ')}
      onClick={() => onSelect(token)}
    >
      {token.hot && <div className={styles.hotBadge}>🔥 HOT</div>}

      <div className={styles.header}>
        <div className={styles.icon}>{token.emoji}</div>
        <div className={styles.info}>
          <div className={styles.symbol}>{token.symbol}</div>
          <div className={styles.name}>{token.name}</div>
        </div>
        <div className={styles.chainBadge}>{token.chain}</div>
      </div>

      <div className={styles.priceRow}>
        <div className={styles.price}>{formatPrice(token.price)}</div>
        <div className={`${styles.change} ${token.up ? styles.up : styles.down}`}>
          {token.up ? '+' : ''}{token.change}%
        </div>
      </div>

      <div className={styles.chart}>
        <svg viewBox="0 0 200 42" preserveAspectRatio="none" width="100%" height="100%">
          <path d={fill} fill={token.up ? 'rgba(0,255,136,0.07)' : 'rgba(255,60,60,0.07)'} />
          <path d={line} fill="none" stroke={color} strokeWidth="1.8" />
        </svg>
      </div>

      <div className={styles.stats}>
        <div className={styles.stat}>
          <div className={styles.statLabel}>MCAP</div>
          <div className={styles.statValue}>{token.mcap}</div>
        </div>
        <div className={styles.stat}>
          <div className={styles.statLabel}>VOL 24H</div>
          <div className={styles.statValue}>{token.vol}</div>
        </div>
      </div>

      <div className={styles.bc}>
        <div className={styles.bcLabel}>
          <span>BONDING CURVE</span>
          <span>{token.bc}%</span>
        </div>
        <div className={styles.bcBar}>
          <div
            className={styles.bcFill}
            style={{
              width: `${token.bc}%`,
              background:
                token.bc > 80
                  ? 'linear-gradient(90deg,var(--accent3),#ff9900)'
                  : 'linear-gradient(90deg,var(--accent),#00ccff)',
            }}
          />
        </div>
      </div>
    </div>
  )
}
