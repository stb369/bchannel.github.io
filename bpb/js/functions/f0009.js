let contractABI = null;
let contract, provider;

export default function f0009(arg1,arg2,arg3,arg4,arg5,arg6) {
  
  console.log("f0009 launched");
  execSolidity(arg1,arg2,arg3,arg4,arg5);
    
}
    async function getContract(arg1) {
      if (!window.ethereum) {
        alert("Please install MetaMask");
        return;
      }
      //provider = new ethers.providers.Web3Provider(window.ethereum);
		provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      contract = new ethers.Contract(arg1, contractABI, signer);
      listenToEvents();
      return contract;
    }

    async function execSolidity(arg1,arg2,arg3,arg4,arg5) {
	  await loadABI("./js/functions/11_abi.json");
      const contract = await getContract(arg1);
      try {
        const tx = await contract.addLiquidity(arg2,arg3,arg4,arg5);
        console.log("Mint TX:", tx.hash);
        await tx.wait();
        alert("✅ Mint successful!");
      } catch (err) {
        console.error(err);
        alert("❌ Mint failed: " + err.message);
      }
    }

    function listenToEvents() {
      if (!contract) return;

      const logEl = document.getElementById("eventLog");
      contract.on("LiquidityAdded(", (user, coordCode, gavar, energy) => {
        const msg = `📘 ReceiptIssued: user=${user}, coordCode=${coordCode}, gavar=${ethers.formatUnits(gavar, 18)}, energy=${energy}`;
        console.log(msg);
        const entry = document.createElement("div");
        entry.textContent = msg;
        logEl.prepend(entry);
      });
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
       
