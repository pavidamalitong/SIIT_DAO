const { expect } = require("chai");

describe("Treasury", function () {
  let Token, token, Treasury, treasury, deployer, club, nonOwner;

  before(async function () {
    [deployer, club, nonOwner] = await ethers.getSigners();

    // Deploy SIITToken
    Token = await ethers.getContractFactory("SIITToken");
    token = await Token.deploy();
    await token.waitForDeployment();

    // Deploy Treasury
    Treasury = await ethers.getContractFactory("Treasury");
    treasury = await Treasury.deploy(token.target);
    await treasury.waitForDeployment();

    // Mint tokens to the deployer
    const mintAmount = ethers.parseEther("1000");
    await token.mint(deployer.address, mintAmount);

    // Transfer tokens directly to the Treasury
    const transferAmount = ethers.parseEther("500");
    await token.transfer(treasury.target, transferAmount);
  });

  it("Should transfer tokens to a club successfully", async function () {
    const transferAmount = ethers.parseEther("100");
    await treasury.transferToClub(club.address, transferAmount);

    const clubBalance = await token.balanceOf(club.address);
    expect(clubBalance).to.equal(transferAmount);

    const treasuryBalance = await token.balanceOf(treasury.target);
    expect(treasuryBalance).to.equal(ethers.parseEther("400")); // Remaining balance
  });

  it("Should not transfer tokens if the treasury has insufficient balance", async function () {
    const transferAmount = ethers.parseEther("600"); // More than available balance
    await expect(
      treasury.transferToClub(club.address, transferAmount)
    ).to.be.revertedWith("Insufficient balance");

    const treasuryBalance = await token.balanceOf(treasury.target);
    expect(treasuryBalance).to.equal(ethers.parseEther("400")); // Should still have the same balance
  });

  it("Should return correct treasury balance", async function () {
    const treasuryBalance = await treasury.getTreasuryBalance();
    expect(treasuryBalance).to.equal(ethers.parseEther("400"));
  });
});
