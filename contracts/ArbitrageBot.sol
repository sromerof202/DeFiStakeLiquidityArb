// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/access/Ownable.sol"; 
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol"; 
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract ArbitrageBot is Ownable, ReentrancyGuard {
    IERC20 public token;
    uint256 public tokenFundsAvailable;

    // State variable to store the Core contract's address
    address private coreContract;

    event FundsReceived(address from, uint256 amount);
    event ArbitrageExecuted(uint256 profit);

    constructor(address initialOwner, address tokenAddress) Ownable(initialOwner) {
        token = IERC20(tokenAddress);
    }

    // Setter method for the coreContract address
    function setCoreContract(address _coreContract) external onlyOwner {
        require(_coreContract != address(0), "Invalid address");
        coreContract = _coreContract;
    }

    // Function to receive ERC20 token funds from the Core contract
    function receiveTokenFunds(uint256 amount) external {
        require(msg.sender == coreContract, "Only Core contract can call this");
        uint256 balanceBefore = token.balanceOf(address(this));
        token.transferFrom(msg.sender, address(this), amount);
        uint256 balanceAfter = token.balanceOf(address(this));
        require(balanceAfter - balanceBefore == amount, "Must send funds to operate.");
        tokenFundsAvailable += amount;
        emit FundsReceived(msg.sender, amount);
    }

    // Function to perform arbitrage
    function executeArbitrage() external onlyOwner nonReentrant {
        uint256 profit = tokenFundsAvailable / 10; // Assume 10% profit for demonstration
        tokenFundsAvailable += profit;
        emit ArbitrageExecuted(profit);
    }
        
    function notifyTokenReceived(uint256 amount) external {
        require(msg.sender == address(coreContract), "Only Core contract can call this");
        emit FundsReceived(msg.sender, amount); // Log the event of receiving funds
    }


    // Function to withdraw profits from the contract
    function withdrawProfit(address to, uint256 amount) external onlyOwner {
        require(amount <= tokenFundsAvailable, "Insufficient token funds."); // Ensure there are enough token funds
        tokenFundsAvailable -= amount;
        token.transfer(to, amount); // Transfer the specified amount of tokens to the provided address
    }

    // Function to return the contract's ERC20 token balance
    function getTokenBalance() external view returns (uint256) {
        return token.balanceOf(address(this)); // Return the balance of the contract
    }
    
}