const memeTokenAddress = "0xB6Afd155dE5eE15ED489B7793346155aF714D705";
const quizContractAddress = "0x119CFa5bF364B5D4F9d66c8E65Fc46BD5B42c8ba";

let web3;
let account;
let memeToken;
let quizContract;

const questions = [
	{ 
	  question: "What is the primary function of blockchain technology?", 
	  options: ["Storing images", "Maintaining a decentralized ledger", "Encrypting emails", "Hosting websites"], 
	  correctAnswer: 1
	},
	{ 
	  question: "What was the first cryptocurrency to use blockchain technology?", 
	  options: ["Ethereum", "Bitcoin", "Litecoin", "Dogecoin"], 
	  correctAnswer: 1
	},
	{ 
	  question: "What is a 'smart contract'?", 
	  options: ["A legal document", "A self-executing code on a blockchain", "A programming language", "A cryptocurrency wallet"], 
	  correctAnswer: 1
	},
	{ 
	  question: "Which consensus mechanism is used by Bitcoin?", 
	  options: ["Proof of Stake", "Proof of Work", "Delegated Proof of Stake", "Proof of Authority"], 
	  correctAnswer: 1
	},
	{ 
	  question: "Which blockchain introduced smart contracts?", 
	  options: ["Bitcoin", "Ethereum", "Cardano", "Polkadot"], 
	  correctAnswer: 1
	},
	{ 
	  question: "What is the smallest unit of Bitcoin called?", 
	  options: ["Wei", "Satoshi", "Gwei", "Nano"], 
	  correctAnswer: 1
	},
	{ 
	  question: "What does 'decentralization' mean in blockchain?", 
	  options: ["Centralized control by one entity", "Distribution of power among multiple nodes", "Storing data on one server", "Using a single private key"], 
	  correctAnswer: 1
	},
	{ 
	  question: "What is the purpose of gas fees in Ethereum?", 
	  options: ["To mine Bitcoin", "To incentivize miners and validate transactions", "To host websites", "To buy Ethereum"], 
	  correctAnswer: 1
	},
	{ 
	  question: "What does a blockchain block contain?", 
	  options: ["Only text data", "Transaction data, timestamp, and hash", "Images and videos", "Program code"], 
	  correctAnswer: 1
	},
	{ 
	  question: "What is a private key in blockchain?", 
	  options: ["A public password", "A secret key for accessing your wallet", "A mining tool", "A hash algorithm"], 
	  correctAnswer: 1
	}
  ];
  

let currentQuestionIndex = 0;

async function connectWallet() {
  if (window.ethereum) {
    web3 = new Web3(window.ethereum);
    const accounts = await ethereum.request({ method: "eth_requestAccounts" });
    account = accounts[0];
    document.getElementById("wallet-address").innerText = `Wallet: ${account}`;
    memeToken = new web3.eth.Contract(ERC20_ABI, memeTokenAddress);
    quizContract = new web3.eth.Contract(QUIZ_CONTRACT_ABI, quizContractAddress);
  } else {
    alert("Please install MetaMask to use this application.");
  }
}

async function claimTokens() {
	await memeToken.methods.claimTokens(web3.utils.toWei("100", "ether")).send({ from: account });
  	alert("100 Tokens claimed successfully!");
}

async function startQuiz() {
	await memeToken.methods.approve(quizContractAddress, 10e18).send({ from: account });
  await quizContract.methods.startGame().send({ from: account });
  document.getElementById("quiz-container").style.display = "block";
  displayQuestion();
}

function displayQuestion() {
  if (currentQuestionIndex >= questions.length) {
    alert("No more questions! Please end the quiz.");
    return;
  }

  const question = questions[currentQuestionIndex];
  document.getElementById("question").innerText = question.question;

  const optionsContainer = document.getElementById("options");
  optionsContainer.innerHTML = "";

  question.options.forEach((option, index) => {
    const button = document.createElement("button");
    button.innerText = option;
    button.addEventListener("click", () => submitAnswer(index));
    optionsContainer.appendChild(button);
  });

  document.getElementById("next-question").style.display = currentQuestionIndex < questions.length - 1 ? "inline-block" : "none";
  document.getElementById("previous-question").style.display = currentQuestionIndex > 0 ? "inline-block" : "none";
}

async function submitAnswer(selectedIndex) {
  const correct = selectedIndex === questions[currentQuestionIndex].correctAnswer;
  await quizContract.methods.submitAnswer(correct, false).send({ from: account });
  currentQuestionIndex++;
  displayQuestion();
}

async function endQuiz() {
  await quizContract.methods.endGame().send({ from: account });
  document.getElementById("quiz-container").style.display = "none";
  alert("Quiz ended!");
}

document.getElementById("connect-wallet").addEventListener("click", connectWallet);
document.getElementById("claim-tokens").addEventListener("click", claimTokens);
document.getElementById("start-quiz").addEventListener("click", startQuiz);
document.getElementById("next-question").addEventListener("click", () => {
  currentQuestionIndex++;
  displayQuestion();
});
document.getElementById("previous-question").addEventListener("click", () => {
  currentQuestionIndex--;
  displayQuestion();
});
document.getElementById("end-quiz").addEventListener("click", endQuiz);

const ERC20_ABI = [
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "spender",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "allowance",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "needed",
				"type": "uint256"
			}
		],
		"name": "ERC20InsufficientAllowance",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "sender",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "balance",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "needed",
				"type": "uint256"
			}
		],
		"name": "ERC20InsufficientBalance",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "approver",
				"type": "address"
			}
		],
		"name": "ERC20InvalidApprover",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "receiver",
				"type": "address"
			}
		],
		"name": "ERC20InvalidReceiver",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "sender",
				"type": "address"
			}
		],
		"name": "ERC20InvalidSender",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "spender",
				"type": "address"
			}
		],
		"name": "ERC20InvalidSpender",
		"type": "error"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "spender",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "Approval",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "Transfer",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "spender",
				"type": "address"
			}
		],
		"name": "allowance",
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
				"internalType": "address",
				"name": "spender",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "approve",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "account",
				"type": "address"
			}
		],
		"name": "balanceOf",
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
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "claimTokens",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "decimals",
		"outputs": [
			{
				"internalType": "uint8",
				"name": "",
				"type": "uint8"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "mint",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "name",
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
		"name": "symbol",
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
		"name": "totalSupply",
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
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "transfer",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "transferFrom",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	}
];
const QUIZ_CONTRACT_ABI = [
	{
		"inputs": [],
		"name": "endGame",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_memeToken",
				"type": "address"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "player",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "score",
				"type": "uint256"
			}
		],
		"name": "GameEnded",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "player",
				"type": "address"
			}
		],
		"name": "GameStarted",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "startGame",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bool",
				"name": "isCorrect",
				"type": "bool"
			},
			{
				"internalType": "bool",
				"name": "isSkipped",
				"type": "bool"
			}
		],
		"name": "submitAnswer",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "ENTRY_FEE",
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
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "gameInProgress",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "memeToken",
		"outputs": [
			{
				"internalType": "contract IERC20",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
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
		"inputs": [],
		"name": "PENALTY_PER_WRONG",
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
		"name": "REWARD_PER_CORRECT",
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
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "scores",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];
