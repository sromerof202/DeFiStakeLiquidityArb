const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("LiquidityProviderPool", function () {
  let LiquidityProviderPool, liquidityProviderPool, owner, addr1, addr2;
  let token, MyToken;

  beforeEach(async function () {
    // Get the ContractFactory and Signers here.
    MyToken = await ethers.getContractFactory("MyToken");
    LiquidityProviderPool = await ethers.getContractFactory("LiquidityProviderPool");

    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

    // Deploy MyToken contract and mint some tokens to addr1
    token = await MyToken.deploy(1000);
    await token.deployed();
    await token.transfer(addr1.address, 500);

    // Deploy LiquidityProviderPool contract
    liquidityProviderPool = await LiquidityProviderPool.deploy(token.address, owner.address);
    await liquidityProviderPool.deployed();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await liquidityProviderPool.owner()).to.equal(owner.address);
    });

    it("Should set the right liquidity token", async function () {
      expect(await liquidityProviderPool.liquidityToken()).to.equal(token.address);
    });
  });

  describe("Transactions", function () {
    it("Should add liquidity", async function () {
      await token.connect(addr1).approve(liquidityProviderPool.address, 100);
      await liquidityProviderPool.connect(addr1).addLiquidity(100);
      expect((await liquidityProviderPool.providerBalances(addr1.address)).toString()).to.equal('100');
      expect((await liquidityProviderPool.totalLiquidity()).toString()).to.equal('100');
    });

    it("Should remove liquidity", async function () {
      await token.connect(addr1).approve(liquidityProviderPool.address, 100);
      await liquidityProviderPool.connect(addr1).addLiquidity(100);
      await liquidityProviderPool.connect(addr1).removeLiquidity(50, addr2.address);
      expect((await liquidityProviderPool.providerBalances(addr1.address)).toString()).to.equal('50');
      expect((await liquidityProviderPool.totalLiquidity()).toString()).to.equal('50');
    });

/*describe("Reward and Restake", function () {
    let tokenStake;
    let core;
    let arbitrageBot;
    let initialOwner;
    let tokenAddress;

    before(async function () {
        // Get the list of accounts
        const accounts = await ethers.getSigners();
        initialOwner = accounts[0]; // Use the first account as the initial owner

        // Deploy the MyToken contract
        const MyToken = await ethers.getContractFactory("MyToken");
        const token = await MyToken.deploy();
        await token.deployed();
        tokenAddress = token.address; // Get the address of the deployed token

        // Deploy the TokenStake contract
        const TokenStake = await ethers.getContractFactory("TokenStake");
        tokenStake = await TokenStake.deploy(tokenAddress);
        await tokenStake.deployed();

        // Deploy the ArbitrageBot contract
        const ArbitrageBot = await ethers.getContractFactory("ArbitrageBot");
        arbitrageBot = await ArbitrageBot.deploy(initialOwner.address, tokenAddress);
        await arbitrageBot.deployed();

        // Deploy the Core contract
        const Core = await ethers.getContractFactory("Core");
        core = await Core.deploy(tokenAddress, tokenStake.address, liquidityProviderPool.address, arbitrageBot.address);
        await core.deployed();
    });
        
        it("Should restake rewards", async function () {
          await token.transfer(liquidityProviderPool.address, 100); // Increase the transferred amount
          await liquidityProviderPool.updateRewards(addr1.address, 100); // Increase the rewards
          await liquidityProviderPool.connect(addr1).restake();
          expect((await liquidityProviderPool.providerBalances(addr1.address)).toString()).to.equal('150');
          expect((await liquidityProviderPool.totalLiquidity()).toString()).to.equal('150');
          expect((await liquidityProviderPool.rewards(addr1.address)).toString()).to.equal('0');
        });
        
      
        it("Should allow integrated restake", async function () {
            // Transfer tokens to the liquidityProviderPool
            await token.transfer(liquidityProviderPool.address, 100); // Increase the transferred amount
            await liquidityProviderPool.updateRewards(addr1.address, 100); // Increase the rewards
            await core.integratedRestake(addr1.address); // Call it through the Core contract
            expect((await liquidityProviderPool.providerBalances(addr1.address)).toString()).to.equal('150');
            expect((await liquidityProviderPool.totalLiquidity()).toString()).to.equal('150');
            expect((await liquidityProviderPool.rewards(addr1.address)).toString()).to.equal('0');
          });
    });
     */ 
      describe("Interest and Balance", function () {
        it("Should calculate interest", async function () {
            // Transfer 1000 tokens to addr1
            await token.transfer(addr1.address, 1000);
          
            await token.connect(addr1).approve(liquidityProviderPool.address, 1000);
            await liquidityProviderPool.connect(addr1).addLiquidity(1000);
            await ethers.provider.send("evm_increaseTime", [60 * 60 * 24 * 7]);
            await ethers.provider.send("evm_mine");
          
            let amount = 1000;
            expect((await liquidityProviderPool.calculateInterest(addr1.address, amount)).toString()).to.equal('1');
          });
      
        it("Should get provider balance", async function () {
          await token.connect(addr1).approve(liquidityProviderPool.address, 100);
          await liquidityProviderPool.connect(addr1).addLiquidity(100);
          expect((await liquidityProviderPool.getBalance(addr1.address)).toString()).to.equal('100');
        });
      });
  });
});