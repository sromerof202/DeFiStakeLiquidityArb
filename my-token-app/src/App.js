import logo from './logo.svg';
import './App.css';
import React, { useEffect } from 'react';
import Web3 from 'web3';
import TokenComponent from './TokenComponent'; // import the TokenComponent

function App() {
  useEffect(() => {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      window.ethereum.enable();
    }
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1>My App</h1>
        <TokenComponent /> {/* use the TokenComponent */}
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;