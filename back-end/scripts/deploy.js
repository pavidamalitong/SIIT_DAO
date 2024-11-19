const hre = require("hardhat");

async function main() {
  const [executor, proposer, admin] = await hre.ethers.getSigners();

  // Deploy SiitToken
  const SiitToken = await ethers.getContractFactory("SiitToken");
  const siitToken = await SiitToken.deploy(admin.address);
  await siitToken.waitForDeployment();
  console.log(`SiitToken deployed at: ${siitToken.target}`);

  // Deploy TimeLock
  const minDelay = 0; // Change this if needed
  const proposers = [proposer.address];
  const executors = [executor.address];
  const TimeLock = await hre.ethers.getContractFactory("TimeLock");
  const timeLock = await TimeLock.deploy(minDelay, proposers, executors, admin.address);
  await timeLock.waitForDeployment();
  console.log("TimeLock deployed at:", timeLock.target);

  // Deploy Treasury
  const Treasury = await hre.ethers.getContractFactory("Treasury");
  const treasury = await Treasury.deploy(siitToken.target);
  await treasury.waitForDeployment();
  console.log("Treasury deployed at:", treasury.target);

  // Deploy ProposalContract
  const ProposalContract = await hre.ethers.getContractFactory("ProposalContract");
  const proposalContract = await ProposalContract.deploy();
  await proposalContract.waitForDeployment();
  console.log("ProposalContract deployed at:", proposalContract.target);

  // Deploy VotingContract
  const VotingContract = await hre.ethers.getContractFactory("Voting");
  const votingContract = await VotingContract.deploy(siitToken.target);
  await votingContract.waitForDeployment();
  console.log("VotingContract deployed at:", votingContract.target);

  // Deploy GovernorContract
  const votingDelay = 0;
  const votingPeriod = 5;
  const quorumPercentage = 20;
  const GovernorContract = await hre.ethers.getContractFactory("GovernorContract");
  const governorContract = await GovernorContract.deploy(
    siitToken.target,
    timeLock.target,
    votingDelay,
    votingPeriod,
    quorumPercentage
  );
  await governorContract.waitForDeployment();
  console.log("GovernorContract deployed at:", governorContract.target);

  const currentOwner = await siitToken.owner();
  console.log("Current owner of SiitToken:", currentOwner);
  console.log("Admin address:", admin.address);

  // Transfer ownership of SiitToken to TimeLock
  const transferTx = await siitToken.connect(admin).transferOwnership(timeLock.target);
  await transferTx.wait();
  console.log("Transferred ownership of SiitToken to TimeLock");

  console.log("Deployment completed successfully!");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
