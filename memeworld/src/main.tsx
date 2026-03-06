import React from 'react'
import ReactDOM from 'react-dom/client'
import { Web3ReactProvider } from '@web3-react/core'
import App from './App'
import './index.css'
import {
  metaMask,         metaMaskHooks,
  coinbaseWallet,   coinbaseWalletHooks,
  walletConnectV2,  walletConnectV2Hooks,
  phantom,          phantomHooks,
  okxWallet,        okxWalletHooks,
} from './connectors'
import type { Connector } from '@web3-react/types'
import type { Web3ReactHooks } from '@web3-react/core'

const connectors: [Connector, Web3ReactHooks][] = [
  [metaMask,        metaMaskHooks],
  [coinbaseWallet,  coinbaseWalletHooks],
  [walletConnectV2, walletConnectV2Hooks],
  [phantom,         phantomHooks],
  [okxWallet,       okxWalletHooks],
]

const rootEl = document.getElementById('root')
if (!rootEl) throw new Error('Root element not found')

ReactDOM.createRoot(rootEl).render(
  <React.StrictMode>
    <Web3ReactProvider connectors={connectors}>
      <App />
    </Web3ReactProvider>
  </React.StrictMode>,
)
