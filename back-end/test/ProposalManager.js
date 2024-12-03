const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ProposalManager", function () {
  let ProposalManager,
    proposalManager,
    Voting,
    voting,
    token,
    deployer,
    beneficiary,
    voter1,
    voter2,
    voter3;

  before(async function () {
    [deployer, beneficiary, voter1, voter2, voter3] = await ethers.getSigners();

    // Deploy SIITToken
    const Token = await ethers.getContractFactory("SIITToken");
    token = await Token.deploy();
    await token.waitForDeployment();

    // Deploy ProposalManager
    ProposalManager = await ethers.getContractFactory("ProposalManager");
    proposalManager = await ProposalManager.deploy(token.target);
    await proposalManager.waitForDeployment();

    // Deploy Voting
    Voting = await ethers.getContractFactory("Voting");
    voting = await Voting.deploy(proposalManager.target, token.target);
    await voting.waitForDeployment();

    // Ensure voter1 and voter2 have enough tokens
    const amount = ethers.parseEther("100");
    await token.transfer(voter1.address, amount);
    await token.transfer(voter2.address, amount);
  });

  it("Should create a proposal successfully and retrieve its details", async function () {
    const title = "Build a Community Center";
    const description =
      "Proposal to build a community center for local residents.";
    const amount = ethers.parseEther("100");
    const quorum = 2;

    // Call createProposal and get the transaction
    const tx = await proposalManager
      .connect(deployer)
      .createProposal(title, description, beneficiary.address, amount, quorum);
    const receipt = await tx.wait();

    // Retrieve the proposal details
    const proposalId = receipt.logs[0].args[0];
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

  it("Should only allow token holders to create proposals", async function () {
    const title = "Build a Community Center";
    const description =
      "Proposal to build a community center for local residents.";
    const amount = ethers.parseEther("100");
    const quorum = 2;

    // Ensure that token holders can create proposals
    await expect(
      proposalManager
        .connect(voter1)
        .createProposal(title, description, beneficiary.address, amount, quorum)
    ).to.not.be.reverted;

    // Test with address without tokens
    await expect(
      proposalManager
        .connect(voter3)
        .createProposal(title, description, beneficiary.address, amount, quorum)
    ).to.be.revertedWith("Insufficient SIITToken balance");
  });

  it("Should update the proposal status based on votes", async function () {
    const title = "Build a Community Center";
    const description =
      "Proposal to build a community center for local residents.";
    const amount = ethers.parseEther("100");
    const quorum = 2;

    // Create a proposal via the ProposalManager contract
    const tx = await proposalManager
      .connect(deployer)
      .createProposal(title, description, beneficiary.address, amount, quorum);
    const receipt = await tx.wait();
    const proposalId = receipt.logs[0].args[0];

    // Vote For and Against the proposal
    await voting.connect(voter1).vote(proposalId, true); 
    await voting.connect(voter2).vote(proposalId, false); 

    // Retrieve the proposal details from ProposalManager
    const proposal = await proposalManager.getProposal(proposalId);

    // Check vote count
    expect(proposal.forVotes).to.equal(1);
    expect(proposal.againstVotes).to.equal(1);

    // Check that the status is Rejected after voting
    expect(proposal.status).to.equal(2); 
  });



  // it("Should handle quorum check correctly", async function () {
  //   const title = "Build a Community Center";
  //   const description = "Proposal to build a community center for local residents.";
  //   const amount = ethers.parseEther("100");
  //   const quorum = 2;

  //   const tx = await proposalManager.connect(deployer).createProposal(
  //     title,
  //     description,
  //     beneficiary.address,
  //     amount,
  //     quorum
  //   );
  //   const receipt = await tx.wait();
  //   const proposalId = receipt.logs[0].args[0];

  //   // Vote in favor, but total votes will not meet the quorum
  //   await proposalManager.connect(voter1).setProposal(proposalId, 1, 0, false);

  //   const proposal = await proposalManager.getProposal(proposalId);
  //   expect(proposal.status).to.equal(0); // Status.Active
  // });
});
