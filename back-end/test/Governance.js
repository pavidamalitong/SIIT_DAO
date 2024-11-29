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
    addr1;

  before(async function () {
    [deployer, addr1] = await ethers.getSigners();

    // Deploy SIITToken
    Token = await ethers.getContractFactory("SIITToken");
    token = await Token.deploy();
    await token.waitForDeployment();

    // Deploy ProposalManager
    ProposalManager = await ethers.getContractFactory("ProposalManager");
    proposalManager = await ProposalManager.deploy();
    await proposalManager.waitForDeployment();

    // Deploy Treasury with SIITToken address
    Treasury = await ethers.getContractFactory("Treasury");
    treasury = await Treasury.deploy(token.target);
    await treasury.waitForDeployment();

    // Mint tokens to Treasury
    const treasuryAmount = ethers.parseEther("1000");
    await token.mint(treasury.target, treasuryAmount);

    // Deploy Voting with ProposalManager address
    Voting = await ethers.getContractFactory("Voting");
    voting = await Voting.deploy(proposalManager.target);
    await voting.waitForDeployment();

    // Deploy Governance with ProposalManager and Treasury addresses
    Governance = await ethers.getContractFactory("Governance");
    governance = await Governance.deploy(
      proposalManager.target,
      treasury.target
    );
    await governance.waitForDeployment();

    // Create a proposal
    await proposalManager.createProposal(
      "Proposal Title",
      "Proposal Description",
      addr1.address,
      ethers.parseEther("100")
    );
  });

  it("Should allow users to vote on a proposal and execute it if passed", async function () {
    const proposalId = 0;

    // Vote "for" the proposal
    await voting.vote(proposalId, true);
    const updatedProposal = await proposalManager.proposals(proposalId);
    expect(updatedProposal.forVotes).to.equal(1);
    expect(updatedProposal.againstVotes).to.equal(0);

    // Execute the proposal
    await governance.executeProposal(proposalId);
    const executedProposal = await proposalManager.proposals(proposalId);
    expect(executedProposal.executed).to.equal(true);

    // Check if the beneficiary received the amount
    const beneficiaryBalance = await token.balanceOf(addr1.address);
    expect(beneficiaryBalance).to.equal(ethers.parseEther("100"));
  });

  it("Should not allow execution of a proposal if not enough votes for", async function () {
    const proposalId = 1;

    // Reset the proposal state
    await proposalManager.createProposal(
      "Another Proposal",
      "Another Proposal Description",
      addr1.address,
      ethers.parseEther("100")
    );

    // Vote "against" the proposal
    await voting.vote(proposalId, false);

    // Refetch the updated proposal after the vote
    const updatedProposal = await proposalManager.proposals(proposalId);

    // Check if the proposal did not pass
    expect(updatedProposal.forVotes).to.equal(0);
    expect(updatedProposal.againstVotes).to.equal(1);

    // Attempt to execute the proposal
    await expect(governance.executeProposal(proposalId))
      .to.be.revertedWith("Proposal did not pass");
  });
});
