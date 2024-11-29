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
const SIITTokenAddress = "0x7a2088a1bFc9d81c55368AE168C2C02570cB814F";
const ProposalManagerAddress = "0x09635F643e140090A9A8Dcd712eD6285858ceBef";
const TreasuryAddress = "0xc5a5C42992dECbae36851359345FE25997F5C42d";
const VotingAddress = "0x67d269191c92Caf3cD7723F116c85e6E9bf55933";
const GovernanceAddress = "0xE6E340D132b5f46d1e472DebcD681B2aBc16e57E";

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
