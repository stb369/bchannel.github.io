const RANKING_ABI = [
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
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
		"name": "e_ResetBattleResult",
		"type": "event"
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
		"name": "e_UpdateBattleResult",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "battleResults",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "rankScore",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "chainCode",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "lastBlueUpdate",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_walletAddress",
				"type": "address"
			}
		],
		"name": "getPlayerRank",
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
				"internalType": "uint256",
				"name": "rankScore",
				"type": "uint256"
			}
		],
		"name": "getRankNumber",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "pure",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "playerList",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "maxRankScore",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "rankNumber",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "playerCurrentWeek",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_walletAddress",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "_code",
				"type": "uint256"
			}
		],
		"name": "updateBattleResult",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
]