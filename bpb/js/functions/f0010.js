   const contractABI = [
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "baseURI",
				"type": "string"
			},
			{
				"internalType": "address",
				"name": "godTicketAddress",
				"type": "address"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			}
		],
		"name": "OwnableInvalidOwner",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "account",
				"type": "address"
			}
		],
		"name": "OwnableUnauthorizedAccount",
		"type": "error"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "user",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "coordCode",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "gavar",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "energy",
				"type": "uint256"
			}
		],
		"name": "LiquidityAdded",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "previousOwner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "OwnershipTransferred",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "coordCode",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "gavar",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "energy",
				"type": "uint256"
			}
		],
		"name": "PoolInitialized",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "resourceAddress",
				"type": "address"
			}
		],
		"name": "ResourceDeployed",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "int256",
				"name": "x",
				"type": "int256"
			},
			{
				"indexed": false,
				"internalType": "int256",
				"name": "y",
				"type": "int256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "spotType",
				"type": "uint256"
			}
		],
		"name": "SpotCreated",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "user",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "coordCode",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "poolType",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "tokenIn",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "tokenOut",
				"type": "uint256"
			}
		],
		"name": "SwapTokens",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "user",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "spotType",
				"type": "uint256"
			}
		],
		"name": "WorkPerformed",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "BASEYIELD",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "DIAMINE",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "DIAMONDEXC",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "ENERGY_MAX",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "ENERGY_RECOVERY_AMOUNT",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "ENERGY_RECOVERY_INTERVAL",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "FOREST",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "INN",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "IRONEXC",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "MINE",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "QUARRY",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "STONEEXC",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "TIMBEREXC",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "int256",
				"name": "_x",
				"type": "int256"
			},
			{
				"internalType": "int256",
				"name": "_y",
				"type": "int256"
			},
			{
				"internalType": "uint256",
				"name": "_tokenAmountA",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_tokenAmountB",
				"type": "uint256"
			}
		],
		"name": "addLiquidity",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "claimEnergy",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "int256",
				"name": "x",
				"type": "int256"
			},
			{
				"internalType": "int256",
				"name": "y",
				"type": "int256"
			},
			{
				"internalType": "uint256",
				"name": "spotType",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "initialScale",
				"type": "uint256"
			}
		],
		"name": "createSpot",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "int256",
				"name": "x",
				"type": "int256"
			},
			{
				"internalType": "int256",
				"name": "y",
				"type": "int256"
			}
		],
		"name": "getSpot",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "godTicket",
		"outputs": [
			{
				"internalType": "contract IGodTicket",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "int256",
				"name": "_x",
				"type": "int256"
			},
			{
				"internalType": "int256",
				"name": "_y",
				"type": "int256"
			},
			{
				"internalType": "uint256",
				"name": "_tokenIdA",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_tokenIdB",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_tokenAmountA",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_tokenAmountB",
				"type": "uint256"
			}
		],
		"name": "initPool",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256[]",
				"name": "tokenId",
				"type": "uint256[]"
			},
			{
				"internalType": "uint256[]",
				"name": "amount",
				"type": "uint256[]"
			}
		],
		"name": "mintResourceToken",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "pools",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "tokenIdA",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "tokenIdB",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "tokenReserveA",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "tokenReserveB",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "k",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "baseYield",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "exists",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "renounceOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "int256",
				"name": "x",
				"type": "int256"
			},
			{
				"internalType": "int256",
				"name": "y",
				"type": "int256"
			}
		],
		"name": "resetPool",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "resource",
		"outputs": [
			{
				"internalType": "contract ResourceManager",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "int256",
				"name": "x",
				"type": "int256"
			},
			{
				"internalType": "int256",
				"name": "y",
				"type": "int256"
			},
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "inTokenAmount",
				"type": "uint256"
			}
		],
		"name": "swapTokens",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "transferOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
];

    let contract, provider;

export default function f0010(arg1,arg2,arg3,arg4,arg5,arg6) {
  
  console.log("f0010 launched");
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
      const signer = provider.getSigner();
      contract = new ethers.Contract(arg1, contractABI, signer);
      listenToEvents();
      return contract;
    }

    async function execSolidity(arg1,arg2,arg3,arg4,arg5) {
      const contract = await getContract(arg1);
      try {
        const tx = await contract.swapTokens(arg2,arg3,arg4,arg5);
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
      contract.on("ReceiptIssued", (from, to, amount, tokenId, txHash) => {
        const msg = `📘 ReceiptIssued: from=${from}, to=${to}, amount=${ethers.formatUnits(amount, 18)}, tokenId=${tokenId}`;
        console.log(msg);
        const entry = document.createElement("div");
        entry.textContent = msg;
        logEl.prepend(entry);
      });
    }
          
       
