import { useState, useEffect } from 'react'
import { TOKENS, FEED_NAMES } from '../data/tokens'
import type { FeedItem } from '../types'
import styles from './LiveFeed.module.css'

function generateItem(): FeedItem {
  const t    = TOKENS[Math.floor(Math.random() * TOKENS.length)]
  const buy  = Math.random() > 0.45
  const amt  = (Math.random() * 5 + 0.05).toFixed(3)
  const name = FEED_NAMES[Math.floor(Math.random() * FEED_NAMES.length)]
  const mins = Math.floor(Math.random() * 5)
  return { id: Date.now() + Math.random(), t, buy, amt, name, mins }
}

export default function LiveFeed() {
  const [items, setItems] = useState<FeedItem[]>(() =>
    Array.from({ length: 14 }, generateItem),
  )

  useEffect(() => {
    const timer = setInterval(() => {
      setItems((prev) => [generateItem(), ...prev.slice(0, 24)])
    }, 2200)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className={styles.feed}>
      <div className={styles.header}>
        <div className={styles.liveDot} />
        LIVE TRADES
      </div>
      <div className={styles.body}>
        {items.map((item) => (
          <div key={item.id} className={styles.item}>
            <div className={`${styles.type} ${item.buy ? styles.buy : styles.sell}`}>
              {item.buy ? 'BUY' : 'SELL'}
            </div>
            <div className={styles.details}>
              <span className={styles.tokenName}>{item.t.symbol}</span>
              <span className={styles.sub}> · {item.amt} SOL · {item.name}</span>
            </div>
            <div className={styles.time}>{item.mins}m ago</div>
          </div>
        ))}
      </div>
    </div>
  )
}
