import React, { useEffect, useState } from 'react';
import Web3 from 'web3';
import BigNumber from 'bignumber.js';
import { MyTokenABI } from './ABIs.js';

function TokenComponent() {
  const [contract, setContract] = useState(null);
  const [totalSupply, setTotalSupply] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const setup = async () => {
      if (window.ethereum) {
        try {
          window.web3 = new Web3(window.ethereum);
          await window.ethereum.request({ method: 'eth_requestAccounts' });

          const contractABI = MyTokenABI;
          const contractAddress = process.env.REACT_APP_MY_TOKEN_ADDRESSES;
          const contract = new window.web3.eth.Contract(contractABI, contractAddress);

          setContract(contract);
          console.log(contract); // Debug statement
          
          // Call the totalSupply method
          const supply = await contract.methods.totalSupply().call();
          const supplyInStandardUnit = new BigNumber(supply).dividedBy(new BigNumber(10).pow(18)).toFixed();
          setTotalSupply(supplyInStandardUnit);
          console.log(supply); // Debug statement
            } catch (error) {
            console.error(error);
            setError("User denied account access");
          }
      } else {
        setError("Please install MetaMask!");
      }
    };

    setup();
  }, []);

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h2>Total Supply: {totalSupply}</h2>
    </div>
  );
}

export default TokenComponent;