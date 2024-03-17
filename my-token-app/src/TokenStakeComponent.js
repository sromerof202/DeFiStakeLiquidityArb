import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import { TokenStakeABI } from './ABIs.js';
import { MyTokenABI } from './ABIs.js';

const TokenStakeComponent = ({ 
    contractAddress = process.env.REACT_APP_TOKEN_STAKE_ADDRESSES, 
    abi = TokenStakeABI
        
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
                const tokenAbi = MyTokenABI ;//call abi from my-token-app/ABIs.js "mytokenabi"
                const tokenAddress = process.env.REACT_APP_MY_TOKEN_ADDRESSES; 
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