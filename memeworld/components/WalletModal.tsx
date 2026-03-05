import { useState } from 'react'
import type { WalletOption } from '../types'
import styles from './WalletModal.module.css'

interface WalletModalProps {
  onClose: () => void
  onConnect: (address: string) => void
}

const WALLETS: WalletOption[] = [
  { id: 'phantom',       name: 'Phantom',         icon: '👻', desc: 'Solanaの定番ウォレット' },
  { id: 'metamask',      name: 'MetaMask',         icon: '🦊', desc: 'EVM互換ネットワーク対応' },
  { id: 'coinbase',      name: 'Coinbase Wallet',  icon: '🔵', desc: 'Coinbase公式ウォレット' },
  { id: 'walletconnect', name: 'WalletConnect',    icon: '🔗', desc: '200以上のウォレットに対応' },
  { id: 'okx',           name: 'OKX Wallet',       icon: '⭕', desc: 'マルチチェーン対応' },
]

function randomAddress(): string {
  const hex = '0123456789abcdef'
  let addr = '0x'
  for (let i = 0; i < 40; i++) addr += hex[Math.floor(Math.random() * 16)]
  return addr
}

export default function WalletModal({ onClose, onConnect }: WalletModalProps) {
  const [connecting, setConnecting] = useState<string | null>(null)
  const [error, setError]           = useState<string | null>(null)

  const handleConnect = async (wallet: WalletOption): Promise<void> => {
    setConnecting(wallet.id)
    setError(null)
    await new Promise<void>((r) => setTimeout(r, 1200))
    if (Math.random() < 0.1) {
      setError(`${wallet.name} への接続が拒否されました。再度お試しください。`)
      setConnecting(null)
      return
    }
    onConnect(randomAddress())
    onClose()
  }

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>): void => {
    if (e.target === e.currentTarget) onClose()
  }

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <div className={styles.modalTitle}>CONNECT WALLET</div>
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        <div className={styles.modalBody}>
          <p className={styles.modalDesc}>ウォレットを接続して取引を開始しましょう</p>

          {error && <div className={styles.errorBox}>⚠ {error}</div>}

          <div className={styles.walletList}>
            {WALLETS.map((w) => (
              <button
                key={w.id}
                className={`${styles.walletBtn} ${connecting === w.id ? styles.connecting : ''}`}
                onClick={() => handleConnect(w)}
                disabled={connecting !== null}
              >
                <span className={styles.walletIcon}>{w.icon}</span>
                <div className={styles.walletInfo}>
                  <span className={styles.walletName}>{w.name}</span>
                  <span className={styles.walletDesc}>{w.desc}</span>
                </div>
                {connecting === w.id ? (
                  <span className={styles.spinner} />
                ) : (
                  <span className={styles.arrow}>→</span>
                )}
              </button>
            ))}
          </div>

          <p className={styles.disclaimer}>
            接続することで<span>利用規約</span>と<span>プライバシーポリシー</span>に同意したことになります
          </p>
        </div>
      </div>
    </div>
  )
}
