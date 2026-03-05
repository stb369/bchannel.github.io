import { useState, useEffect } from 'react'
import { formatPrice } from '../data/tokens'
import type { Token, TradeTab } from '../types'
import styles from './TradePanel.module.css'

interface TradePanelProps {
  token: Token
  wallet: string | null
  onConnectWallet: () => void
}

export default function TradePanel({ token, wallet, onConnectWallet }: TradePanelProps) {
  const [tab, setTab]       = useState<TradeTab>('buy')
  const [amount, setAmount] = useState<string>('0.1')

  const parsedAmount = parseFloat(amount) || 0
  const receive      = Math.floor(parsedAmount * 842110)
  const fee          = (parsedAmount * 0.01).toFixed(4)

  useEffect(() => {
    setAmount('0.1')
  }, [token.id])

  const handleExecute = (): void => {
    if (!wallet) {
      onConnectWallet()
      return
    }
    alert(`${tab.toUpperCase()} ${amount} SOL → ${token.symbol} (demo)`)
  }

  return (
    <div className={styles.panel}>
      <div className={styles.panelHeader}>
        <div className={styles.panelTitle}>QUICK TRADE</div>
        <div className={styles.slippage}>
          SLIPPAGE: <span>1%</span>
        </div>
      </div>

      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${tab === 'buy' ? styles.activeBuy : ''}`}
          onClick={() => setTab('buy')}
        >
          BUY
        </button>
        <button
          className={`${styles.tab} ${tab === 'sell' ? styles.activeSell : ''}`}
          onClick={() => setTab('sell')}
        >
          SELL
        </button>
      </div>

      <div className={styles.body}>
        {/* Selected token */}
        <div className={styles.selectedToken}>
          <span className={styles.stIcon}>{token.emoji}</span>
          <div className={styles.stInfo}>
            <div className={styles.stSymbol}>{token.symbol}</div>
            <div className={styles.stPrice}>{formatPrice(token.price)}</div>
          </div>
          <div className={`${styles.stChange} ${token.up ? styles.up : styles.down}`}>
            {token.up ? '+' : ''}{token.change}%
          </div>
        </div>

        {/* Amount input */}
        <div className={styles.inputGroup}>
          <div className={styles.inputLabel}>
            <span>AMOUNT</span>
            <span className={styles.maxBtn} onClick={() => setAmount('4.2')}>MAX</span>
          </div>
          <div className={styles.inputWrap}>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className={styles.input}
              min="0"
            />
            <div className={styles.currency}>SOL</div>
          </div>
        </div>

        {/* Quick amounts */}
        <div className={styles.quickAmounts}>
          {(['0.1', '0.5', '1', '5'] as const).map((v) => (
            <button key={v} className={styles.quickBtn} onClick={() => setAmount(v)}>
              {v}
            </button>
          ))}
        </div>

        {/* Trade info */}
        <div className={styles.tradeInfo}>
          <div className={styles.row}>
            <span>YOU RECEIVE</span>
            <span>{receive.toLocaleString()} {token.symbol}</span>
          </div>
          <div className={styles.row}>
            <span>PRICE IMPACT</span>
            <span className={styles.warn}>0.12%</span>
          </div>
          <div className={styles.row}>
            <span>FEE</span>
            <span>{fee} SOL</span>
          </div>
          <div className={styles.row}>
            <span>MIN RECEIVED</span>
            <span>{Math.floor(receive * 0.99).toLocaleString()} {token.symbol}</span>
          </div>
        </div>

        <button
          className={`${styles.executeBtn} ${tab === 'buy' ? styles.execBuy : styles.execSell}`}
          onClick={handleExecute}
        >
          {wallet ? `${tab.toUpperCase()} ${token.symbol}` : 'CONNECT WALLET'}
        </button>
      </div>
    </div>
  )
}
