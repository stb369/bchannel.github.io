import { useState } from 'react'
import type { Connector } from '@web3-react/types'
import { NoMetaMaskError } from '@web3-react/metamask'
import {
  metaMask,
  coinbaseWallet,
  walletConnectV2,
  phantom,
  okxWallet,
  WalletNotInstalledError,
  WC_PROJECT_ID,
} from '../src/connectors'
import type { WalletOption } from '../types'
import styles from './WalletModal.module.css'

interface WalletModalProps {
  onClose: () => void
}

interface WalletEntry extends WalletOption {
  connector: Connector
  installUrl: string
}

const WALLETS: WalletEntry[] = [
  {
    id: 'phantom',
    name: 'Phantom',
    icon: '👻',
    desc: 'Solanaの定番ウォレット',
    connector: phantom,
    installUrl: 'https://phantom.app/',
  },
  {
    id: 'metamask',
    name: 'MetaMask',
    icon: '🦊',
    desc: 'EVM互換ネットワーク対応',
    connector: metaMask,
    installUrl: 'https://metamask.io/download/',
  },
  {
    id: 'coinbase',
    name: 'Coinbase Wallet',
    icon: '🔵',
    desc: 'Coinbase公式ウォレット',
    connector: coinbaseWallet,
    installUrl: 'https://www.coinbase.com/wallet/downloads',
  },
  {
    id: 'walletconnect',
    name: 'WalletConnect',
    icon: '🔗',
    desc: '200以上のウォレットに対応',
    connector: walletConnectV2,
    installUrl: 'https://walletconnect.com/',
  },
  {
    id: 'okx',
    name: 'OKX Wallet',
    icon: '⭕',
    desc: 'マルチチェーン対応',
    connector: okxWallet,
    installUrl: 'https://www.okx.com/web3',
  },
]

export default function WalletModal({ onClose }: WalletModalProps) {
  const [connecting, setConnecting] = useState<string | null>(null)
  const [error, setError]           = useState<string | null>(null)

  const handleConnect = async (wallet: WalletEntry): Promise<void> => {
    // Early validation for WalletConnect project ID
    if (wallet.id === 'walletconnect' && !WC_PROJECT_ID) {
      setError('WalletConnect の設定が必要です。VITE_WALLETCONNECT_PROJECT_ID を設定してください。')
      return
    }

    setConnecting(wallet.id)
    setError(null)
    try {
      await wallet.connector.activate()
      onClose()
    } catch (err: unknown) {
      const code = (err as { code?: number }).code
      if (err instanceof WalletNotInstalledError || err instanceof NoMetaMaskError) {
        setError(`${wallet.name} がインストールされていません。`)
        window.open(wallet.installUrl, '_blank', 'noopener,noreferrer')
      } else if (code === 4001) {
        setError('接続が拒否されました。ウォレットで承認してください。')
      } else {
        const message = err instanceof Error ? err.message : String(err)
        setError(`接続エラー: ${message}`)
      }
    } finally {
      setConnecting(null)
    }
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
                onClick={() => void handleConnect(w)}
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


