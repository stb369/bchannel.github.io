let contractABI = null;
let contract, provider;

export default function f0013(arg1,arg2,arg3,arg4,arg5,arg6) {
  
  console.log("f0013 launched");
  return execSolidity(arg1,arg2,arg3,arg4,arg5,arg6);
}
    
	// =========================
  // ユーティリティ関数
  // =========================
    async function execSolidity(arg1,arg2,arg3,arg4,arg5,arg6) {//arg1_address,arg2_abi,arg3_signature,arg4=arg6_filter
	  if (!window.ethereum) {
        alert("Please install MetaMask");
        return;
      }
	  const abipath = "./js/functions/" + arg2.split(".")[0] + ".json";
	  await loadABI(abipath);
	  provider = new ethers.BrowserProvider(window.ethereum);
	  const signature = getSignature(arg3, contractABI);
  	  const topic0 = ethers.id(signature);
      const iface = new ethers.Interface(contractABI);

		const normalizeTopic = (val) => {
    if (val === undefined || val === null) return null;

    // 文字列 '0' or 数値 0 → null扱い
    if (val === "0" || val === 0) return null;

    // すでにbytes32形式ならそのまま
    if (/^0x[0-9a-fA-F]{64}$/.test(val)) return val;

    // 数値 or 数値文字列なら uint256 として扱う
    if (!isNaN(val)) {
      const big = BigInt(val);
      return ethers.zeroPadValue(ethers.toBeHex(big), 32);
    }

    // 文字列の場合 → bytes32化（keccak256）
    if (typeof val === "string") {
      return ethers.id(val);
    }

    return null;
  };
// =========================
  // ユーティリティ関数終了
  // =========================
		
  	  // --- 各トピック生成 ---
  	  const topic1 = normalizeTopic(arg4);
  	  const topic2 = normalizeTopic(arg5);
  	  const topic3 = normalizeTopic(arg6);
      const filter = {
        address: arg1,
		topics: [topic0, topic1, topic2, topic3],
        fromBlock: 0,
        toBlock: "latest",
      };
		const logs = await provider.getLogs(filter);//型「Log」の配列
      	var resultString = "";
		// 2. filter()で null の要素を除外
    	const validLogs = logs.filter(item => item !== null);
		const extractedLogs = validLogs.map(log => {
    		const parsed = iface.parseLog(log);
    
    		// 💡 汎用的な引数（args）の抽出と整形
    		const formattedArgs = {};
    		if(parsed === null){
          		return null;
        	}
    		
			for (const [key, value] of Object.entries(parsed.args)) {
        		// キーが数字ではない（名前付き引数である）ことを確認
				let valueRaw;
				console.log(key.toString()+":"+value.toString());
				// BigIntの場合、精度を保つために文字列に変換するか、そのまま残すか選択します。
				// ここでは扱いやすいように文字列に変換（必要に応じてethers.formatUnitsで変換）
				if (typeof value === 'bigint') {
    				// Number.MAX_SAFE_INTEGER = 9007199254740991
    				if (value <= BigInt(Number.MAX_SAFE_INTEGER)) {
        				valueRaw = Number(value); // 安全に変換可能
    				} else {
    				    valueRaw = ethers.formatUnits(value, 18); // Decimal 18と仮定
    				}
				}else{
					valueRaw = value;
				}
				formattedArgs[key] = valueRaw;
    		}

    		return {
        		blockNumber: log.blockNumber,
        		transactionHash: log.transactionHash,
        		args: formattedArgs // 汎用的な整形済み引数オブジェクト
    		};
		});

	console.log("汎用的に抽出・整形されたログ:", extractedLogs);
	// 戻り値は抽出・整形されたログの配列に変更
	return JSON.stringify(extractedLogs, null, 2);
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


    
          
       
