const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ProposalManager", function () {
  let ProposalManager, proposalManager, deployer, beneficiary;

  before(async function () {
    [deployer, beneficiary] = await ethers.getSigners();

    // Deploy ProposalManager
    ProposalManager = await ethers.getContractFactory("ProposalManager");
    proposalManager = await ProposalManager.deploy();
    await proposalManager.waitForDeployment();
  });

  it("Should create a proposal successfully and retrieve its details", async function () {
    const title = "Build a Community Center";
    const description =
      "Proposal to build a community center for local residents.";
    const amount = ethers.parseEther("100");

    // Call createProposal and get the transaction
    const tx = await proposalManager.createProposal(
      title,
      description,
      beneficiary.address,
      amount
    );
    const receipt = await tx.wait();

    // Decode the return value from the receipt
    const proposalId = receipt.logs[0].args[0];

    // Retrieve the proposal details
    const proposal = await proposalManager.getProposal(proposalId);

    // Validate the proposal details
    expect(proposal.id).to.equal(proposalId);
    expect(proposal.title).to.equal(title);
    expect(proposal.description).to.equal(description);
    expect(proposal.proposer).to.equal(deployer.address);
    expect(proposal.beneficiary).to.equal(beneficiary.address);
    expect(proposal.amount).to.equal(amount);
    expect(proposal.forVotes).to.equal(0);
    expect(proposal.againstVotes).to.equal(0);
    expect(proposal.executed).to.equal(false);
  });
});
