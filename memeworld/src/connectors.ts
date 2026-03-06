import { initializeConnector } from '@web3-react/core'
import { MetaMask } from '@web3-react/metamask'
import { CoinbaseWallet } from '@web3-react/coinbase-wallet'
import { WalletConnect as WalletConnectV2 } from '@web3-react/walletconnect-v2'
import { EIP1193 } from '@web3-react/eip1193'
import type { Provider } from '@web3-react/types'

/** Thrown by the stub provider when the wallet extension is not installed. */
export class WalletNotInstalledError extends Error {
  readonly walletName: string
  constructor(walletName: string) {
    super(`${walletName}がインストールされていません`)
    this.name = 'WalletNotInstalledError'
    this.walletName = walletName
  }
}

/**
 * Returns the injected EIP-1193 provider from `access()`, or a no-op stub
 * provider when the wallet extension is not installed.  The stub makes it safe
 * to construct an EIP1193 connector at module-load time even before the user
 * has installed the wallet; `activate()` will reject with `WalletNotInstalledError`
 * that WalletModal can catch and surface as an install prompt.
 */
function getInjectedProvider(access: () => Provider | undefined, walletName: string): Provider {
  const stub: Provider = {
    request: () => Promise.reject(new WalletNotInstalledError(walletName)),
    on: () => stub,
    removeListener: () => stub,
  }
  return access() ?? stub
}

// ── MetaMask ──────────────────────────────────────────────────────────────────
export const [metaMask, metaMaskHooks] = initializeConnector<MetaMask>(
  (actions) => new MetaMask({ actions })
)

// ── Coinbase Wallet ───────────────────────────────────────────────────────────
export const [coinbaseWallet, coinbaseWalletHooks] = initializeConnector<CoinbaseWallet>(
  (actions) =>
    new CoinbaseWallet({
      actions,
      options: {
        appName: 'MemeWorld',
        url: 'https://rpc.ankr.com/eth',
      },
    })
)

// ── WalletConnect v2 ─────────────────────────────────────────────────────────
// Set VITE_WALLETCONNECT_PROJECT_ID in your environment.
// Get a free project ID at https://cloud.walletconnect.com/
export const WC_PROJECT_ID = (import.meta.env.VITE_WALLETCONNECT_PROJECT_ID as string | undefined) ?? ''

export const [walletConnectV2, walletConnectV2Hooks] = initializeConnector<WalletConnectV2>(
  (actions) =>
    new WalletConnectV2({
      actions,
      options: {
        projectId: WC_PROJECT_ID,
        chains: [1],
        showQrModal: true,
      },
    })
)

// ── Phantom (EVM interface via window.phantom.ethereum) ──────────────────────
// Phantom exposes a standard EIP-1193 provider on its Ethereum interface.
export const [phantom, phantomHooks] = initializeConnector<EIP1193>(
  (actions) =>
    new EIP1193({
      actions,
      provider: getInjectedProvider(
        () => (window as { phantom?: { ethereum?: Provider } }).phantom?.ethereum,
        'Phantom'
      ),
    })
)

// ── OKX Wallet ────────────────────────────────────────────────────────────────
export const [okxWallet, okxWalletHooks] = initializeConnector<EIP1193>(
  (actions) =>
    new EIP1193({
      actions,
      provider: getInjectedProvider(
        () => (window as { okxwallet?: Provider }).okxwallet,
        'OKX Wallet'
      ),
    })
)
