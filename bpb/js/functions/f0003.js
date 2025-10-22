//管理表はこちら
//
//指定したウォレットアドレスに貧乏神をTransferFromする&成功した場合Receiptを生成する
//arg1…貧乏神のコントラクトアドレス
//arg2…Fromウォレットアドレス
//arg3…Toウォレットアドレス
//arg4…amount
//arg5
//arg6
  


const contractAddress = "0xYourBimboGummyAddress"; // ← 自分のデプロイ済みアドレスに差し替えてください

    const contractABI = [
      {
        "inputs": [
          { "internalType": "address", "name": "to", "type": "address" },
          { "internalType": "uint256", "name": "amount", "type": "uint256" }
        ],
        "name": "mint",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          { "internalType": "address", "name": "recipient", "type": "address" },
          { "internalType": "uint256", "name": "amount", "type": "uint256" }
        ],
        "name": "transfer",
        "outputs": [
          { "internalType": "bool", "name": "", "type": "bool" }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          { "internalType": "address", "name": "sender", "type": "address" },
          { "internalType": "address", "name": "recipient", "type": "address" },
          { "internalType": "uint256", "name": "amount", "type": "uint256" }
        ],
        "name": "transferFrom",
        "outputs": [
          { "internalType": "bool", "name": "", "type": "bool" }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "anonymous": false,
        "inputs": [
          { "indexed": true, "internalType": "address", "name": "from", "type": "address" },
          { "indexed": true, "internalType": "address", "name": "to", "type": "address" },
          { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" },
          { "indexed": false, "internalType": "uint256", "name": "receiptTokenId", "type": "uint256" },
          { "indexed": false, "internalType": "bytes32", "name": "txHash", "type": "bytes32" }
        ],
        "name": "ReceiptIssued",
        "type": "event"
      }
    ];

    let contract, provider;

export default function f0002(arg1,arg2,arg3,arg4,arg5,arg6) {
  
  console.log("f0003 launched");
  transferTokens(arg1,arg2,arg3,arg4);
  
}

    async function getContract(arg1) {
      if (!window.ethereum) {
        alert("Please install MetaMask");
        return;
      }
      //provider = new ethers.providers.Web3Provider(window.ethereum);
      provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      contract = new ethers.Contract(arg1, contractABI, signer);
      listenToEvents();
      return contract;
    }

    async function mintTokens() {
      const contract = await getContract();
      const to = document.getElementById("mintTo").value;
      const amount = document.getElementById("mintAmount").value;
      try {
        const tx = await contract.mint(to, ethers.parseUnits(amount, 18));
        console.log("Mint TX:", tx.hash);
        await tx.wait();
        alert("✅ Mint successful!");
      } catch (err) {
        console.error(err);
        alert("❌ Mint failed: " + err.message);
      }
    }

    async function transferTokens(arg1,arg2,arg3,arg4) {
      const contract = await getContract(arg1);
      const to = arg3;
      const amount = arg4;
      try {
        const tx = await contract.transfer(to, ethers.parseUnits(amount, 18));
        console.log("Transfer TX:", tx.hash);
        await tx.wait();
        alert("✅ Transfer successful!");
      } catch (err) {
        console.error(err);
        alert("❌ Transfer failed: " + err.message);
      }
    }

    async function transferFromTokens(arg1,arg2,arg3,arg4) {
      const contract = await getContract();
      const from = document.getElementById("transferFrom").value;
      const to = document.getElementById("transferTo2").value;
      const amount = document.getElementById("transferAmount2").value;
      try {
        const tx = await contract.transferFrom(from, to, ethers.parseUnits(amount, 18));
        console.log("TransferFrom TX:", tx.hash);
        await tx.wait();
        alert("✅ TransferFrom successful!");
      } catch (err) {
        console.error(err);
        alert("❌ TransferFrom failed: " + err.message);
      }
    }

    function listenToEvents() {
      if (!contract) return;

      const logEl = document.getElementById("eventLog");
      contract.on("ReceiptIssued", (from, to, amount, tokenId, txHash) => {
        const msg = `📘 ReceiptIssued: from=${from}, to=${to}, amount=${ethers.formatUnits(amount, 18)}, tokenId=${tokenId}`;
        console.log(msg);
        const entry = document.createElement("div");
        entry.textContent = msg;
        logEl.prepend(entry);
      });
    }
          
       
