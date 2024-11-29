import Web3 from "web3";
// Import contract ABIs and addresses
import SIITTokenABI from "./artifacts/contracts/SiitToken.sol/SIITToken.json";
import ProposalManagerABI from "./artifacts/contracts/ProposalManager.sol/ProposalManager.json";
import TreasuryABI from "./artifacts/contracts/Treasury.sol/Treasury.json";
import VotingABI from "./artifacts/contracts/Voting.sol/Voting.json";
import GovernanceABI from "./artifacts/contracts/Governance.sol/Governance.json";

// Initialize Web3 instance for local Hardhat network
const web3 = new Web3("http://127.0.0.1:8545");


// Replace with actual deployed contract addresses from your local blockchain
const SIITTokenAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const ProposalManagerAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
const TreasuryAddress = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";
const VotingAddress = "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9";
const GovernanceAddress = "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9";

// Initialize contract instances
export const SIITToken = new web3.eth.Contract(
  SIITTokenABI.abi,
  SIITTokenAddress
);
export const ProposalManager = new web3.eth.Contract(
  ProposalManagerABI.abi,
  ProposalManagerAddress
);
export const Treasury = new web3.eth.Contract(TreasuryABI.abi, TreasuryAddress);
export const Voting = new web3.eth.Contract(VotingABI.abi, VotingAddress);
export const Governance = new web3.eth.Contract(
  GovernanceABI.abi,
  GovernanceAddress
);

export default web3;
