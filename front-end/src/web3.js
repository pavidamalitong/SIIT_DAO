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
const SIITTokenAddress = "0x68B1D87F95878fE05B998F19b66F4baba5De1aed";
const ProposalManagerAddress = "0x3Aa5ebB10DC797CAC828524e59A333d0A371443c";
const TreasuryAddress = "0xc6e7DF5E7b4f2A278906862b61205850344D4e7d";
const VotingAddress = "0x59b670e9fA9D0A427751Af201D676719a970857b";
const GovernanceAddress = "0x4ed7c70F96B99c776995fB64377f0d4aB3B0e1C1";

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
