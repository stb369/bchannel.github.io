let contractABI = null;
let contract, provider;

export default function f0008(arg1,arg2,arg3,arg4,arg5,arg6) {
  
  console.log("f0008 launched");
  execSolidity(arg1,arg2,arg3,arg4,arg5,arg6);
    
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

    async function execSolidity(arg1,arg2,arg3,arg4,arg5,arg6) {
	  await loadABI("./js/functions/11_abi.json");
      const contract = await getContract(arg1);
      const tokenIdA = arg4 / 1000;
      const tokenIdB = arg4 % 1000;
      try {
        const tx = await contract.initPool(arg2,arg3,tokenIdA,tokenIdB,ethers.parseUnits(arg5, 18),ethers.parseUnits(arg6, 18));
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
      contract.on("PoolInitialized", (coordCode, gavar, energy, ) => {
        const msg = `📘 PoolInitialized: coordCode=${coordCode}, gavar=${ethers.formatUnits(gavar, 18)}, energy=${ethers.formatUnits(energy, 18)}`;
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
       
