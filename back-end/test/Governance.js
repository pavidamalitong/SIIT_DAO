const { expect } = require("chai");

describe("Governance", function () {
  let Token,
    token,
    ProposalManager,
    proposalManager,
    Treasury,
    treasury,
    Voting,
    voting,
    Governance,
    governance,
    deployer,
    voter1,
    beneficiary;

  before(async function () {
    [deployer, voter1, beneficiary] = await ethers.getSigners();

    // Deploy SIITToken
    Token = await ethers.getContractFactory("SIITToken");
    token = await Token.deploy();
    await token.waitForDeployment();

    // Deploy ProposalManager
    ProposalManager = await ethers.getContractFactory("ProposalManager");
    proposalManager = await ProposalManager.deploy(token.target);
    await proposalManager.waitForDeployment();

    // Deploy Treasury
    Treasury = await ethers.getContractFactory("Treasury");
    treasury = await Treasury.deploy(token.target);
    await treasury.waitForDeployment();

    // Mint tokens to Treasury
    const treasuryAmount = ethers.parseEther("1000");
    await token.mint(treasury.target, treasuryAmount);

    // Deploy Voting
    Voting = await ethers.getContractFactory("Voting");
    voting = await Voting.deploy(proposalManager.target, token.target);
    await voting.waitForDeployment();

    // Deploy Governance
    Governance = await ethers.getContractFactory("Governance");
    governance = await Governance.deploy(
      proposalManager.target,
      treasury.target,
      token.target
    );
    await governance.waitForDeployment();

    // Mint tokens to voter1 for voting purposes
    await token.mint(voter1.address, ethers.parseEther("10"));

    // Create a proposal
    await proposalManager.createProposal(
      "Proposal Title",
      "Proposal Description",
      beneficiary.address,
      ethers.parseEther("100"),
      1 // Set a quorum of 1 for testing
    );
  });

  it("Should allow users to vote on a proposal and execute it if passed", async function () {
    const proposalId = 0;

    // Vote "for" the proposal
    await voting.connect(voter1).vote(proposalId, true);
    const updatedProposal = await proposalManager.getProposal(proposalId);
    expect(updatedProposal.forVotes).to.equal(1);
    expect(updatedProposal.againstVotes).to.equal(0);

    // Execute the proposal
    await governance.executeProposal(proposalId);
    const executedProposal = await proposalManager.getProposal(proposalId);
    expect(executedProposal.executed).to.equal(true);

    // Check if the beneficiary received the amount
    const beneficiaryBalance = await token.balanceOf(beneficiary.address);
    expect(beneficiaryBalance).to.equal(ethers.parseEther("100"));
  });

  it("Should not allow execution of a proposal if it is already executed", async function () {
    const proposalId = 0;

    // Attempt to execute the proposal
    await expect(governance.executeProposal(proposalId)).to.be.revertedWith(
      "Proposal already executed"
    );
  });

  it("Should not allow execution of a proposal if not enough votes for", async function () {
    const proposalId = 1;

    await proposalManager.createProposal(
      "Another Proposal",
      "Another Proposal Description",
      beneficiary.address,
      ethers.parseEther("100"),
      1 
    );

    // Vote "against" the proposal
    await voting.connect(voter1).vote(proposalId, false);

    // Refetch the updated proposal after the vote
    const updatedProposal = await proposalManager.getProposal(proposalId);

    // Check if the proposal did not pass
    expect(updatedProposal.forVotes).to.equal(0);
    expect(updatedProposal.againstVotes).to.equal(1);

    // Attempt to execute the proposal
    await expect(governance.executeProposal(proposalId)).to.be.revertedWith(
      "Proposal not approved"
    );
  });

  it("Should not allow execution of a proposal if quorum is not met", async function () {
    const proposalId = 2;

    await proposalManager.createProposal(
      "Another Proposal",
      "Another Proposal Description",
      beneficiary.address,
      ethers.parseEther("100"),
      2 
    );

    // Vote "against" the proposal
    await voting.connect(voter1).vote(proposalId, false);

    // Refetch the updated proposal after the vote
    const updatedProposal = await proposalManager.getProposal(proposalId);

    // Check if the proposal did not pass
    expect(updatedProposal.forVotes).to.equal(0);
    expect(updatedProposal.againstVotes).to.equal(1);

    // Attempt to execute the proposal
    await expect(governance.executeProposal(proposalId)).to.be.revertedWith(
      "Quorum not met"
    );
  });

});
