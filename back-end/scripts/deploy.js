const hre = require("hardhat");

async function main() {
  // Get the contract factories
  const Token = await hre.ethers.getContractFactory("SIITToken");
  const Treasury = await hre.ethers.getContractFactory("Treasury");
  const Governance = await hre.ethers.getContractFactory("Governance");
  const Proposal = await hre.ethers.getContractFactory("ProposalManager");
  const Voting = await hre.ethers.getContractFactory("Voting");

  // Deploy the contracts
  console.log("Deploying SIIT Token...");
  const token = await Token.deploy();
  await token.waitForDeployment();
  console.log("SIIT Token deployed to:", token.target);

  console.log("Deploying Treasury...");
  const treasury = await Treasury.deploy(token.target);
  await treasury.waitForDeployment();
  console.log("Treasury deployed to:", treasury.target);

  console.log("Deploying Governance...");
  const governance = await Governance.deploy(treasury.target);
  await governance.waitForDeployment();
  console.log("Governance deployed to:", governance.target);

  console.log("Deploying Proposal Manager...");
  const proposal = await Proposal.deploy();
  await proposal.waitForDeployment();
  console.log("Proposal Manager deployed to:", proposal.target);

  console.log("Deploying Voting System...");
  const voting = await Voting.deploy();
  await voting.waitForDeployment();
  console.log("Voting System deployed to:", voting.target);

  console.log("Deployment completed!");
  console.log({
    SIITToken: token.target,
    Treasury: treasury.target,
    Governance: governance.target,
    Proposal: proposal.target,
    Voting: voting.target,
  });
}

// Catch errors
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
