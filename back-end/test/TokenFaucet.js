const { expect } = require("chai");

describe("TokenFaucet", function () {
  let Token, token, TokenFaucet, tokenFaucet, deployer, addr1, addr2;

  before(async function () {
    [deployer, addr1, addr2] = await ethers.getSigners();

    // Deploy SIITToken
    Token = await ethers.getContractFactory("SIITToken");
    token = await Token.deploy();
    await token.waitForDeployment();

    // Deploy TokenFaucet
    TokenFaucet = await ethers.getContractFactory("TokenFaucet");
    tokenFaucet = await TokenFaucet.deploy(token.target);
    await tokenFaucet.waitForDeployment();

    // Mint some tokens to the faucet
    const faucetAmount = ethers.parseEther("1000");
    await token.mint(tokenFaucet.target, faucetAmount);
  });

  it("Should allow a user to claim tokens", async function () {
    const initialBalance = await token.balanceOf(addr1.address);

    // User claims tokens for the first time
    await tokenFaucet.connect(addr1).claimTokens();

    // Check if the user received the correct amount of tokens
    const newBalance = await token.balanceOf(addr1.address);
    const claimAmount = ethers.parseEther("10");
    const expectedBalance = initialBalance + claimAmount;
    expect(newBalance).to.equal(expectedBalance);
  });

  it("Should not allow a user to claim tokens more than once", async function () {
    // User tries to claim again
    await expect(tokenFaucet.connect(addr1).claimTokens()).to.be.revertedWith(
      "Already claimed"
    );
  });

  it("Should not allow a user to claim tokens if they already have a balance", async function () {
    // Mint tokens to addr2 to ensure they have a balance already
    await token.mint(addr2.address, ethers.parseEther("5"));

    // Try claiming again after already having tokens
    await expect(tokenFaucet.connect(addr2).claimTokens()).to.be.revertedWith(
      "Already claimed"
    );
  });
});
