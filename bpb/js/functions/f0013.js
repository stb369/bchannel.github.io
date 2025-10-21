

    let contract, provider;

export default function f0013(arg1,arg2,arg3,arg4,arg5,arg6) {
  
  console.log("f0013 launched");
  execSolidity(arg1,arg2,arg3,arg4);
    
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

    async function execSolidity(arg1,arg2,arg3,arg4) {//arg1_address,arg2_abi,arg3_signature,arg4_filter
      //const contract = await getContract(arg1);
      const iface = new ethers.Interface(arg2);
	  const signature = arg3;//例："MessagePosted(bytes32,uint256,bytes32,string,string,uint256)"
	  const threadId = ethers.id(arg4);//indexe
      const filter = {
        address: arg1,
        topics: [
          ethers.id(arg3), // イベントシグネチャをハッシュ化
          //iface.getEvent("MessagePosted")?.topic,
          ethers.zeroPadValue(threadId, 32) // threadIdでフィルタリング。ここをスレッド名のハッシュ値にする
        ],
        fromBlock: 0,
        toBlock: "latest",
      };
		const logs = await provider.getLogs(filter);//型「Log」の配列
      
      const parsedLogs = logs.map(log => iface.parseLog(log));
      const messages = logs.map(log => {
        const parsed = iface.parseLog(log);
        if(parsed === null){
          return null;
        }
		return log.data;
      });
		console.log(messages);
		SendMessage('ContractCompiler', 'OnEventLog', messages);
    }

    
          
       
