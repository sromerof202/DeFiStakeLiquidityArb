import React, { useState, useEffect } from 'react';
import Web3 from 'web3';

const ABI = 
    [
        {
        "inputs": [
            {
            "internalType": "address",
            "name": "tokenAddress",
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
            "name": "target",
            "type": "address"
            }
        ],
        "name": "AddressEmptyCode",
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
        "name": "AddressInsufficientBalance",
        "type": "error"
        },
        {
        "inputs": [],
        "name": "FailedInnerCall",
        "type": "error"
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
        "inputs": [],
        "name": "ReentrancyGuardReentrantCall",
        "type": "error"
        },
        {
        "inputs": [
            {
            "internalType": "address",
            "name": "token",
            "type": "address"
            }
        ],
        "name": "SafeERC20FailedOperation",
        "type": "error"
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
            "internalType": "address",
            "name": "user",
            "type": "address"
            },
            {
            "indexed": false,
            "internalType": "uint256",
            "name": "reward",
            "type": "uint256"
            }
        ],
        "name": "RewardPaid",
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
            "name": "amount",
            "type": "uint256"
            },
            {
            "indexed": false,
            "internalType": "uint256",
            "name": "timestamp",
            "type": "uint256"
            }
        ],
        "name": "Staked",
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
            "name": "amount",
            "type": "uint256"
            },
            {
            "indexed": false,
            "internalType": "uint256",
            "name": "timestamp",
            "type": "uint256"
            }
        ],
        "name": "Unstaked",
        "type": "event"
        },
        {
        "inputs": [],
        "name": "claimRewards",
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
        "inputs": [],
        "name": "renounceOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
        },
        {
        "inputs": [],
        "name": "restake",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
        },
        {
        "inputs": [
            {
            "internalType": "address",
            "name": "staker",
            "type": "address"
            },
            {
            "internalType": "uint256",
            "name": "amount",
            "type": "uint256"
            }
        ],
        "name": "stake",
        "outputs": [],
        "stateMutability": "nonpayable",
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
        "name": "stakes",
        "outputs": [
            {
            "internalType": "uint256",
            "name": "amount",
            "type": "uint256"
            },
            {
            "internalType": "uint256",
            "name": "timestamp",
            "type": "uint256"
            },
            {
            "internalType": "uint256",
            "name": "accruedReward",
            "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
        },
        {
        "inputs": [],
        "name": "token",
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
        "name": "totalStaked",
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
            "name": "newOwner",
            "type": "address"
            }
        ],
        "name": "transferOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
        },
        {
        "inputs": [
            {
            "internalType": "uint256",
            "name": "amount",
            "type": "uint256"
            },
            {
            "internalType": "address",
            "name": "recipient",
            "type": "address"
            }
        ],
        "name": "unstake",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
        }
     ];
const TokenStakeComponent = ({ 
    contractAddress = '0x3e7Dd7921E0Cf11B6Ac35F0e1eD547D149324233', 
    abi = ABI
        
    }) => {
    const [web3, setWeb3] = useState(null);
    const [account, setAccount] = useState(null);
    const [contract, setContract] = useState(null);
    const [amount, setAmount] = useState(0);

    useEffect(() => {
        if (window.ethereum) {
            const web3Instance = new Web3(window.ethereum);
            setWeb3(web3Instance);
    
            window.ethereum.request({ method: 'eth_requestAccounts' }).then(accounts => {
                setAccount(accounts[0]);
            });
        } else {
            alert("Please install an Ethereum-compatible browser or extension like MetaMask to use this dApp!");
        }
    }, []);

    useEffect(() => {
        if (web3 && account) {
            const contractInstance = new web3.eth.Contract(abi, contractAddress);
            setContract(contractInstance);
        }
    }, [web3, account, abi, contractAddress]);

    const stakeTokens = async () => {
        if (contract) {
            if (amount <= 0) {
                alert('Please enter a positive number');
                return;
            }
            const weiAmount = web3.utils.toWei(amount, 'ether');
            try {
                const tokenAbi = [
                    {
                      "inputs": [
                        {
                          "internalType": "uint256",
                          "name": "initialSupply",
                          "type": "uint256"
                        }
                      ],
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
                const tokenAddress = '0xE42a7c033F634079C6fF3fA7d27bECfC9070EA9c'; 
                const tokenContract = new web3.eth.Contract(tokenAbi, tokenAddress);
                console.log(tokenContract.methods); // Log the tokenContract instance to see its methods
                console.log(tokenAbi); // Log the ABI to check if it includes the 'approve' function
                const amountToApprove = web3.utils.toWei(amount, 'ether');
                await tokenContract.methods.approve(contractAddress, amountToApprove).send({ from: account });
                await contract.methods.stake(account, weiAmount).send({ from: account });
            } catch (error) {
                if (error.code === 4001) {
                    alert('You have rejected the transaction');
                } else if (error.message.includes('TransactionBlockTimeoutError')) {
                    alert('The transaction was not mined in time. Please check your gas price and network congestion.');
                } else {
                    console.error("An error occurred while staking tokens:", error);
                }
            }
        }
    };
    return (
        <div>
            <h2>Stake Tokens</h2>
            <input type="text" value={amount} onChange={e => setAmount(e.target.value)} />
            <button onClick={stakeTokens}>Stake</button>
        </div>
    );
};

export default TokenStakeComponent;