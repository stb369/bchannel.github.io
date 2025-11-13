let contractABI = null;
let contract, provider;

export default function f0013(arg1,arg2,arg3,arg4,arg5,arg6) {
  
  console.log("f0013 launched");
  return execSolidity(arg1,arg2,arg3,arg4);
}
    

    async function execSolidity(arg1,arg2,arg3,arg4) {//arg1_address,arg2_abi,arg3_signature,arg4_filter
	  if (!window.ethereum) {
        alert("Please install MetaMask");
        return;
      }
	  const abipath = "./js/functions/" + arg2.split(".")[0] + ".json";
	  await loadABI(abipath);
	  provider = new ethers.BrowserProvider(window.ethereum);
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
      	var resultString = "";
		// 2. filter()で null の要素を除外
    	const validLogs = logs.filter(item => item !== null);
		const extractedLogs = validLogs.map(log => {
    		const parsed = iface.parseLog(log).sort((a, b) => b.blockNumber - a.blockNumber);
    
    		// 💡 汎用的な引数（args）の抽出と整形
    		const formattedArgs = {};
    		if(parsed === null){
          		return null;
        	}
    		
			for (const [key, value] of Object.entries(parsed.args)) {
        		// キーが数字ではない（名前付き引数である）ことを確認
				console.log(i.toString()+"番目:"+parsed.args[i].toString());
				// BigIntの場合、精度を保つために文字列に変換するか、そのまま残すか選択します。
				// ここでは扱いやすいように文字列に変換（必要に応じてethers.formatUnitsで変換）
				if (typeof value === 'bigint') {
    				// Number.MAX_SAFE_INTEGER = 9007199254740991
    				if (value <= BigInt(Number.MAX_SAFE_INTEGER)) {
        				value = Number(value); // 安全に変換可能
    				} else {
    				    value = ethers.formatUnits(value, 18); // Decimal 18と仮定
    				}
				}
				formattedArgs[key] = value.toString();
    		}

    		return {
        		blockNumber: log.blockNumber,
        		transactionHash: log.transactionHash,
        		args: formattedArgs // 汎用的な整形済み引数オブジェクト
    		};
		});

console.log("汎用的に抽出・整形されたログ:", extractedLogs);

// 戻り値は抽出・整形されたログの配列に変更
return extractedLogs;
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


    
          
       
