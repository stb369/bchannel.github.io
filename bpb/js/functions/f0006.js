let contractABI = null;
let contract, provider;

export default async function f0006(arg1,arg2,arg3,arg4,arg5,arg6) {
  
  console.log("f0006 launched");
  await mintTokens(arg1,arg2,arg3);
    
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

    async function mintTokens(arg1,arg2,arg3) {
	  await loadABI("./js/functions/a0011.json");
      const contract = await getContract(arg1);
      const tokenId = arg2;//uint[]
      const amount = arg3;//uint[]
      const bigamount = ethers.parseUnits(amount[i], 18);
		console.log("amount:",bigamount);
		console.log("amountType:",(typeof result));
      try {
        const tx = await contract.mintResourceToken([tokenId], [amount]);
        console.log("Mint TX:", tx.hash);
        await tx.wait();
        alert("Mint successful!");
      } catch (err) {
        console.error(err);
        alert("Mint failed: " + err.message);
      }
    }

    function listenToEvents() {
      if (!contract) return;
		/*
      const logEl = document.getElementById("eventLog");
      contract.on("ReceiptIssued", (from, to, amount, tokenId, txHash) => {
        const msg = `ReceiptIssued: from=${from}, to=${to}, amount=${ethers.formatUnits(amount, 18)}, tokenId=${tokenId}`;
        console.log(msg);
        const entry = document.createElement("div");
        entry.textContent = msg;
        logEl.prepend(entry);
      });
	  */
    }

//  外部JSONからABIを取得
async function loadABI(path) {
  try {
    const response = await fetch(path);
    if (!response.ok) throw new Error(`Failed to load ABI: ${response.statusText}`);
    const json = await response.json();
    contractABI = json;
    console.log("ABI loaded successfully.");
  } catch (err) {
    console.error("ABI load failed:", err);
  }
}
          
       
