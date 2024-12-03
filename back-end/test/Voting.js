const { expect } = require("chai");

describe("Voting", function () {
  let Token,
    token,
    ProposalManager,
    proposalManager,
    Voting,
    voting,
    deployer,
    voter1,
    voter2;

  before(async function () {
    [deployer, voter1, voter2] = await ethers.getSigners();

    // Deploy SIITToken
    Token = await ethers.getContractFactory("SIITToken");
    token = await Token.deploy();
    await token.waitForDeployment();

    // Deploy ProposalManager
    ProposalManager = await ethers.getContractFactory("ProposalManager");
    proposalManager = await ProposalManager.deploy(token.target);
    await proposalManager.waitForDeployment();

    // Deploy Voting
    Voting = await ethers.getContractFactory("Voting");
    voting = await Voting.deploy(proposalManager.target, token.target); // pass ProposalManager and SIITToken address to Voting
    await voting.waitForDeployment();

    // Mint tokens to voter1 for voting purposes
    await token.mint(voter1.address, ethers.parseEther("10"));

    // Create a proposal
    await proposalManager.createProposal(
      "Proposal Title",
      "Proposal Description",
      voter2.address,
      ethers.parseEther("100"),
      2
    );
  });

  it("Should allow users to vote on a proposal", async function () {
    const proposalId = 0;

    // Vote "for" the proposal
    await voting.connect(voter1).vote(proposalId, true);
    const updatedProposal = await proposalManager.getProposal(proposalId);

    // Check if forVotes is incremented
    expect(updatedProposal.forVotes).to.equal(1);
    expect(updatedProposal.againstVotes).to.equal(0);

    // Try voting "against" the proposal (this should fail since the user has already voted)
    await expect(
      voting.connect(voter1).vote(proposalId, false)
    ).to.be.revertedWith("Already voted");

    const finalProposal = await proposalManager.proposals(proposalId);
    expect(finalProposal.forVotes).to.equal(1);
    expect(finalProposal.againstVotes).to.equal(0);
  });

  it("Should not allow non-token holders to vote on a proposal", async function () {
    const proposalId = 0;

    await expect(
      voting.connect(voter2).vote(proposalId, false)
    ).to.be.revertedWith("Insufficient SIITToken balance");
  });

  it("Should not allow voting if proposal is not active", async function () {
    const title = "Build a Community Center";
    const description =
      "Proposal to build a community center for local residents.";
    const amount = ethers.parseEther("100");
    const quorum = 1;

    const tx = await proposalManager
      .connect(deployer)
      .createProposal(title, description, voter2.address, amount, quorum);
    const receipt = await tx.wait();
    const proposalId = receipt.logs[0].args[0];

    await voting.connect(voter1).vote(proposalId, true);

    // Attempt to vote after execution
    await expect(
      voting.connect(voter1).vote(proposalId, false)
    ).to.be.revertedWith("Proposal is not active");
  });
});
