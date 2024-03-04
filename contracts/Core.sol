pragma solidity ^0.8.18;
//work in progress
    /*
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "./TokenStake.sol";
import "./LiquidityProviderPool.sol";
import "./ArbitrageBot.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Core is Ownable {
    // Public variables for the token and other contracts
    IERC20 public token;
    TokenStake public tokenStake;
    LiquidityProviderPool public liquidityProviderPool;
    ArbitrageBot public arbitrageBot;

    // Constructor to initialize the contract with the addresses of the token and other contracts
    constructor(
        address _tokenAddress,
        address _tokenStakeAddress,
        address _liquidityProviderPoolAddress,
        address _arbitrageBotAddress
    ) Ownable(msg.sender) {
        token = IERC20(_tokenAddress);
        tokenStake = TokenStake(_tokenStakeAddress);
        liquidityProviderPool = LiquidityProviderPool(_liquidityProviderPoolAddress);
        arbitrageBot = ArbitrageBot(_arbitrageBotAddress);
    }

    // Function to stake tokens
function stakeTokens(uint256 amount) public {
    // Transfer tokens from the sender to the staking contract
    require(token.transferFrom(msg.sender, address(tokenStake), amount), "Token transfer failed");
    // Stake the tokens
    tokenStake.stake(msg.sender, amount);
}

    function unstakeTokens(uint256 amount) public {
        tokenStake.unstake(amount, msg.sender); // Directly specify the recipient
    }

    // Function to add liquidity
    function addLiquidity(uint256 amount) public {
        // Transfer tokens from the sender to the liquidity pool
        require(token.transferFrom(msg.sender, address(liquidityProviderPool), amount), "Token transfer failed");
        // Add the liquidity
        liquidityProviderPool.addLiquidity(amount);
    }

    // Function to remove liquidity
    function removeLiquidity(uint256 amount) public {
        liquidityProviderPool.removeLiquidity(amount, msg.sender); // Include the direct transfer logic
    }

    // Function to execute arbitrage, only callable by the owner
    function executeArbitrage() public onlyOwner {
        arbitrageBot.executeArbitrage();
    }

    // Function to handle rewards and restake
    function handleRewardsAndRestake() public {
        // TokenStake and LiquidityProviderPool have integrated restake functions
        tokenStake.integratedRestake(msg.sender);
        liquidityProviderPool.integratedRestake(msg.sender);
        
        // Handle token rewards for ArbitrageBot
        uint256 rewards = token.balanceOf(address(this));
        if(rewards > 0) {
            token.transfer(address(arbitrageBot), rewards);
            // Assuming ArbitrageBot has a method to notify or handle received tokens
            arbitrageBot.notifyTokenReceived(rewards);
        }
    }
    

    // Function to withdraw tokens from the contract, only callable by the owner
    function withdrawTokens(uint256 amount) external onlyOwner {
        // Check that the contract has enough balance
        require(amount <= token.balanceOf(address(this)), "Insufficient balance");
        // Transfer the tokens to the owner
        token.transfer(owner(), amount);
    }
}

*/