import { useState, useEffect, useRef } from 'react'
import { TOKENS, formatPrice } from '../data/tokens'
import type { Token } from '../types'
import styles from './Header.module.css'

interface HeaderProps {
  searchQuery: string
  onSearch: (q: string) => void
  wallet: string | null
  onConnect: () => void
}

export default function Header({ searchQuery, onSearch, wallet, onConnect }: HeaderProps) {
  const [inputValue, setInputValue]       = useState<string>(searchQuery)
  const [suggestions, setSuggestions]     = useState<Token[]>([])
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false)

  const inputRef = useRef<HTMLInputElement>(null)
  const wrapRef  = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const q = inputValue.trim().toLowerCase()
    if (q.length === 0) {
      setSuggestions([])
      onSearch('')
      return
    }
    const matches = TOKENS.filter(
      (t) =>
        t.symbol.toLowerCase().includes(q) ||
        t.name.toLowerCase().includes(q),
    ).slice(0, 5)
    setSuggestions(matches)
    onSearch(inputValue)
  }, [inputValue, onSearch])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleSelect = (token: Token): void => {
    setInputValue(token.symbol)
    onSearch(token.symbol)
    setShowSuggestions(false)
  }

  const handleClear = (): void => {
    setInputValue('')
    onSearch('')
    inputRef.current?.focus()
  }

  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <span className={styles.logoDot} />
        MEME WORLD
      </div>

      <div className={styles.headerStats}>
        <div>24H VOL <span>$4.2B</span></div>
        <div>TOKENS <span>12,847</span></div>
        <div>TRADERS <span>89,342</span></div>
        <div>GAS <span>12 GWEI</span></div>
      </div>

      <div className={styles.headerRight}>
        {/* Search */}
        <div className={styles.searchWrap} ref={wrapRef}>
          <div className={`${styles.searchBar} ${inputValue ? styles.active : ''}`}>
            <span className={styles.searchIcon}>⌕</span>
            <input
              ref={inputRef}
              type="text"
              placeholder="Search tokens..."
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value)
                setShowSuggestions(true)
              }}
              onFocus={() => setShowSuggestions(true)}
              onKeyDown={(e) => {
                if (e.key === 'Escape') { setShowSuggestions(false); handleClear() }
                if (e.key === 'Enter')  setShowSuggestions(false)
              }}
            />
            {inputValue && (
              <button className={styles.clearBtn} onClick={handleClear}>✕</button>
            )}
          </div>

          {/* Suggestions dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div className={styles.suggestions}>
              {suggestions.map((t) => (
                <div
                  key={t.id}
                  className={styles.suggestion}
                  onMouseDown={() => handleSelect(t)}
                >
                  <span className={styles.suggEmoji}>{t.emoji}</span>
                  <div className={styles.suggInfo}>
                    <span className={styles.suggSymbol}>{t.symbol}</span>
                    <span className={styles.suggName}>{t.name}</span>
                  </div>
                  <span className={t.up ? styles.up : styles.down}>
                    {t.up ? '+' : ''}{t.change}%
                  </span>
                  <span className={styles.suggPrice}>{formatPrice(t.price)}</span>
                </div>
              ))}
            </div>
          )}

          {/* No results */}
          {showSuggestions && inputValue && suggestions.length === 0 && (
            <div className={styles.suggestions}>
              <div className={styles.noResult}>No tokens found for "{inputValue}"</div>
            </div>
          )}
        </div>

        <button className={styles.btnDocs}>DOCS</button>

        {wallet ? (
          <button className={styles.btnWallet} onClick={onConnect}>
            <span className={styles.walletDot} />
            {wallet.slice(0, 6)}...{wallet.slice(-4)}
          </button>
        ) : (
          <button className={styles.btnConnect} onClick={onConnect}>
            CONNECT WALLET
          </button>
        )}
      </div>
    </header>
  )
}
