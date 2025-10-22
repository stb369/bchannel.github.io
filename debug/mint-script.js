// 必要なライブラリをインストール
// npm install ethers

const { ethers } = require('ethers');

// 設定
const CONTRACT_ADDRESS = "0x..."; // あなたのコントラクトアドレス

// コントラクトABI（必要な部分のみ）
const CONTRACT_ABI = [
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "count",
        "type": "uint256"
      }
    ],
    "name": "Mint",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "count",
        "type": "uint256"
      }
    ],
    "name": "MintBimboGummy",
    "type": "event"
  }
];

// Metamaskの接続確認
async function checkMetamask() {
  if (typeof window.ethereum !== 'undefined') {
    console.log('MetaMask is installed!');
    return true;
  } else {
    console.log('MetaMask is not installed. Please install MetaMask.');
    return false;
  }
}

// Metamaskに接続
async function connectMetamask() {
  try {
    // MetaMaskが利用可能かチェック
    if (!await checkMetamask()) {
      throw new Error('MetaMask is not available');
    }

    // アカウントへの接続を要求
    const accounts = await window.ethereum.request({ 
      method: 'eth_requestAccounts' 
    });
    
    console.log('Connected to MetaMask');
    console.log('Account:', accounts[0]);
    
    return accounts[0];
  } catch (error) {
    console.error('Failed to connect to MetaMask:', error);
    throw error;
  }
}

// ネットワークの確認・切り替え
async function checkNetwork(targetChainId = '0x1') { // 0x1 = Ethereum Mainnet
  try {
    const chainId = await window.ethereum.request({ method: 'eth_chainId' });
    
    if (chainId !== targetChainId) {
      console.log(`Current network: ${chainId}, switching to: ${targetChainId}`);
      
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: targetChainId }],
        });
      } catch (switchError) {
        console.error('Failed to switch network:', switchError);
        throw switchError;
      }
    }
    
    console.log('Network is correct');
  } catch (error) {
    console.error('Network check failed:', error);
    throw error;
  }
}

// Mint関数を呼び出す関数（Metamask使用版）
async function mintTokens(count, ethValue = "0") {
  try {
    // 1. Metamaskに接続
    const account = await connectMetamask();
    
    // 2. ネットワークを確認（必要に応じて）
    await checkNetwork('0x1'); // Ethereum Mainnet
    
    // 3. Metamaskプロバイダーを取得
    const provider = new ethers.BrowserProvider(window.ethereum);
    
    // 4. Signerを取得（Metamaskのウォレット）
    const signer = await provider.getSigner();
    
    // 5. コントラクトインスタンスを作成
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
    
    // 6. Mint関数を呼び出し
    console.log(`Minting ${count} tokens from account: ${account}`);
    
    const tx = await contract.Mint(count, {
      value: ethers.parseEther(ethValue), // payable関数なので、必要に応じてETHを送信
      gasLimit: 300000, // ガス制限を設定（必要に応じて調整）
    });
    
    console.log("Transaction sent:", tx.hash);
    
    // 7. トランザクションの確認を待つ
    const receipt = await tx.wait();
    console.log("Transaction confirmed:", receipt.hash);
    
    // 8. イベントログを確認
    const mintEvent = receipt.logs.find(log => {
      try {
        const parsedLog = contract.interface.parseLog(log);
        return parsedLog.name === 'MintBimboGummy';
      } catch (e) {
        return false;
      }
    });
    
    if (mintEvent) {
      const parsedEvent = contract.interface.parseLog(mintEvent);
      console.log("Mint event emitted:", parsedEvent.args.count.toString());
    }
    
    return receipt;
    
  } catch (error) {
    console.error("Error minting tokens:", error);
    
    // Metamask特有のエラーハンドリング
    if (error.code === 4001) {
      console.error("User rejected the request");
    } else if (error.code === -32002) {
      console.error("Request already pending");
    } else if (error.code === -32603) {
      console.error("Internal error");
    }
    
    throw error;
  }
}

// ユーザーの残高を確認する関数
async function checkBalance() {
  try {
    const account = await connectMetamask();
    const provider = new ethers.BrowserProvider(window.ethereum);
    
    // ETH残高を取得
    const balance = await provider.getBalance(account);
    console.log(`ETH Balance: ${ethers.formatEther(balance)} ETH`);
    
    // トークン残高を取得（balanceOf関数が必要）
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, [
      {
        "inputs": [{"internalType": "address", "name": "account", "type": "address"}],
        "name": "balanceOf",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
      }
    ], signer);
    
    const tokenBalance = await contract.balanceOf(account);
    console.log(`Token Balance: ${tokenBalance.toString()} tokens`);
    
    return { ethBalance: balance, tokenBalance: tokenBalance };
  } catch (error) {
    console.error("Error checking balance:", error);
    throw error;
  }
}

// アカウント変更の監視
function watchAccountChanges() {
  if (window.ethereum) {
    window.ethereum.on('accountsChanged', (accounts) => {
      console.log('Account changed:', accounts[0]);
      // 必要に応じてUIを更新
    });
    
    window.ethereum.on('chainChanged', (chainId) => {
      console.log('Network changed:', chainId);
      // 必要に応じてページをリロード
      window.location.reload();
    });
  }
}

// HTMLボタンと連携する例
function setupUI() {
  // HTMLファイルに以下のボタンを追加
  /*
  <button id="connectBtn">Connect MetaMask</button>
  <button id="mintBtn">Mint Tokens</button>
  <button id="balanceBtn">Check Balance</button>
  <input id="countInput" type="number" placeholder="Token count" value="100">
  <input id="ethInput" type="number" placeholder="ETH amount" value="0" step="0.001">
  */
  
  document.getElementById('connectBtn')?.addEventListener('click', async () => {
    try {
      await connectMetamask();
      alert('Connected to MetaMask!');
    } catch (error) {
      alert('Failed to connect: ' + error.message);
    }
  });
  
  document.getElementById('mintBtn')?.addEventListener('click', async () => {
    try {
      const count = document.getElementById('countInput').value;
      const ethValue = document.getElementById('ethInput').value;
      
      await mintTokens(count, ethValue);
      alert('Tokens minted successfully!');
    } catch (error) {
      alert('Failed to mint: ' + error.message);
    }
  });
  
  document.getElementById('balanceBtn')?.addEventListener('click', async () => {
    try {
      await checkBalance();
    } catch (error) {
      alert('Failed to check balance: ' + error.message);
    }
  });
}

// 使用例
async function main() {
  try {
    // アカウント変更の監視を開始
    watchAccountChanges();
    
    // UIをセットアップ
    setupUI();
    
    // 直接実行する場合
    // await mintTokens(100);
    
  } catch (error) {
    console.error("Failed to execute:", error);
  }
}

// DOMが読み込まれた後に実行
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', main);
  } else {
    main();
  }
}

// Node.js環境の場合はエラーを表示
if (typeof window === 'undefined') {
  console.error('This script must be run in a browser with MetaMask installed.');
}
