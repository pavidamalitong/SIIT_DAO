const { expect } = require("chai");

describe("Voting", function () {
  let Token,
    token,
    ProposalManager,
    proposalManager,
    Voting,
    voting,
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

    // Deploy Voting with ProposalManager address
    Voting = await ethers.getContractFactory("Voting");
    voting = await Voting.deploy(proposalManager.target); // pass ProposalManager address to Voting
    await voting.waitForDeployment();

    // Create a proposal
    await proposalManager.createProposal(
      "Proposal Title",
      "Proposal Description",
      addr1.address,
      ethers.parseEther("100")
    );
  });

  it("Should allow users to vote on a proposal", async function () {
    const proposalId = 0; 

    // Vote "for" the proposal
    await voting.vote(proposalId, true);
    const updatedProposal = await proposalManager.proposals(proposalId);
    
    // Check if forVotes is incremented
    expect(updatedProposal.forVotes).to.equal(1);
    expect(updatedProposal.againstVotes).to.equal(0);

    // Try voting "against" the proposal (this should fail since the user has already voted)
    await expect(voting.vote(proposalId, false))
      .to.be.revertedWith("Already voted");

    const finalProposal = await proposalManager.proposals(proposalId);
    expect(finalProposal.forVotes).to.equal(1); 
    expect(finalProposal.againstVotes).to.equal(0); 
  });
});
