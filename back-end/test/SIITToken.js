const { expect } = require("chai");

describe("SIITToken", function () {
  let Token, token, deployer, addr1;

  before(async function () {
    [deployer, addr1] = await ethers.getSigners();
    Token = await ethers.getContractFactory("SIITToken");
    token = await Token.deploy();
    await token.waitForDeployment();
  });

  it("Should mint tokens successfully", async function () {
    const initialBalance = await token.balanceOf(deployer.address);

    const mintAmount = ethers.parseEther("1000");
    await token.mint(deployer.address, mintAmount);

    const newBalance = await token.balanceOf(deployer.address);
    const expectedBalance = initialBalance + mintAmount;
    expect(newBalance).to.equal(expectedBalance);
  });

  it("Should transfer tokens successfully", async function () {
    const amount = ethers.parseEther("500");
    await token.transfer(addr1.address, amount);
    const balance = await token.balanceOf(addr1.address);
    expect(balance).to.equal(amount);
  });
});
