const { ethers } = require("hardhat");

async function main() {
  const [deployer, beneficiary] = await ethers.getSigners();

  const proposalManagerAddress = "0x3Aa5ebB10DC797CAC828524e59A333d0A371443c";

  // Create a contract instance
  const proposalManager = await ethers.getContractAt(
    "ProposalManager",
    proposalManagerAddress
  );

  // Example proposal details
  const title = "Build a Computer Lab";
  const description =
    "Proposal to build a community center for local residents.";
  const beneficiaryAddress = beneficiary.address; 
  const amount = ethers.parseEther("20"); 

  // Create a proposal
  console.log("Creating proposal...");
  const tx = await proposalManager.createProposal(
    title,
    description,
    beneficiaryAddress,
    amount
  );
  const receipt = await tx.wait();

  // Get proposal ID from event logs
  const proposalId = receipt.logs[0].args[0];
  console.log(`Proposal created with ID: ${proposalId.toString()}`);

  // Retrieve proposal details
  const proposal = await proposalManager.getProposal(proposalId);
  console.log("Proposal details:");
  console.log(`  Title: ${proposal.title}`);
  console.log(`  Description: ${proposal.description}`);
  console.log(`  Proposer: ${proposal.proposer}`);
  console.log(`  Beneficiary: ${proposal.beneficiary}`);
  console.log(`  Amount: ${ethers.formatEther(proposal.amount)} tokens`);
  console.log(`  For Votes: ${proposal.forVotes}`);
  console.log(`  Against Votes: ${proposal.againstVotes}`);
  console.log(`  Executed: ${proposal.executed}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
