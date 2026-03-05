import { TOKENS, formatPrice } from '../data/tokens'
import type { Token } from '../types'
import styles from './Ticker.module.css'

export default function Ticker() {
  const items: Token[] = [...TOKENS, ...TOKENS] // duplicate for seamless loop

  return (
    <div className={styles.ticker}>
      <div className={styles.inner}>
        {items.map((t, i) => (
          <div key={i} className={styles.item}>
            <span>{t.emoji}</span>
            <span className={styles.sym}>{t.symbol}</span>
            <span className={styles.price}>{formatPrice(t.price)}</span>
            <span className={t.up ? styles.up : styles.down}>
              {t.up ? '+' : ''}{t.change}%
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
