const hre = require("hardhat");

async function main() {
  // Deploy SIITToken
  const SIITToken = await hre.ethers.getContractFactory("SIITToken");
  const siitToken = await SIITToken.deploy();
  await siitToken.waitForDeployment();
  console.log("SIITToken deployed to:", siitToken.target);

  // Deploy ProposalManager
  const ProposalManager = await hre.ethers.getContractFactory(
    "ProposalManager"
  );
  const proposalManager = await ProposalManager.deploy();
  await proposalManager.waitForDeployment();
  console.log("ProposalManager deployed to:", proposalManager.target);

  // Deploy Treasury
  const Treasury = await hre.ethers.getContractFactory("Treasury");
  const treasury = await Treasury.deploy(siitToken.target);
  await treasury.waitForDeployment();
  console.log("Treasury deployed to:", treasury.target);

  // Deploy Voting
  const Voting = await hre.ethers.getContractFactory("Voting");
  const voting = await Voting.deploy(proposalManager.target);
  await voting.waitForDeployment();
  console.log("Voting deployed to:", voting.target);

  // Deploy Governance
  const Governance = await hre.ethers.getContractFactory("Governance");
  const governance = await Governance.deploy(
    proposalManager.target,
    treasury.target
  );
  await governance.waitForDeployment();
  console.log("Governance deployed to:", governance.target);

  // Example Initialization: Mint tokens to Treasury
  const mintAmount = hre.ethers.parseEther("1000"); // 1000 tokens
  await siitToken.mint(treasury.target, mintAmount);
  console.log("Minted", mintAmount.toString(), "tokens to Treasury");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
