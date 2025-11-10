

    let contract, provider;

export default function f0013(arg1,arg2,arg3,arg4,arg5,arg6) {
  
  console.log("f0013 launched");
  return execSolidity(arg1,arg2,arg3,arg4);
}
    

    async function execSolidity(arg1,arg2,arg3,arg4) {//arg1_address,arg2_abi,arg3_signature,arg4_filter
	  const abipath = "./js/functions/" + arg2.split(".")[0] + ".json";
	  const contractABI = await loadABI(abipath);
	  const signature = getSignature(arg3, contractABI);
      const iface = new ethers.Interface(contractABI);
	  const threadId = ethers.id(arg4);//indexe
      const filter = {
        address: arg1,
        topics: [
          ethers.id(signature), // イベントシグネチャをハッシュ化
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
		return messages;
    }

function getSignature(arg3, abiJson){
	  const Event = abiJson.find(item => item.name === arg3);
	  let eventName = "";
	  let inputTypes = [];
	  let signature = "";
	  if (Event) {
    	// イベント名を取得
    	eventName = Event.name;
    	// inputTypesを取得
    	if (Event.inputs) {
        	inputTypes = Event.inputs.map(input => input.type);
    	}
	  }
		if (eventName && inputTypes.length > 0) {
    	// 2. inputTypes配列の要素をカンマで結合してパラメータリスト文字列を作成
    	const parameters = inputTypes.join(',');
	    // 3. イベント名とパラメータリストを結合して署名文字列を生成
    	// 形式: EventName(type1,type2,type3,...)
    	signature = `${eventName}(${parameters})`;
	  }
	  console.log("generated signature:", signature);
	  return signature;
}

    
          
       
