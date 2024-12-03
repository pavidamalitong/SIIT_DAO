import Web3 from "web3";
// Import contract ABIs and addresses
import SIITTokenABI from "./artifacts/contracts/SiitToken.sol/SIITToken.json";
import ProposalManagerABI from "./artifacts/contracts/ProposalManager.sol/ProposalManager.json";
import TreasuryABI from "./artifacts/contracts/Treasury.sol/Treasury.json";
import VotingABI from "./artifacts/contracts/Voting.sol/Voting.json";
import GovernanceABI from "./artifacts/contracts/Governance.sol/Governance.json";
import TokenFaucetABI from "./artifacts/contracts/TokenFaucet.sol/TokenFaucet.json";

// Initialize Web3 instance for local Hardhat network
const web3 = new Web3("http://127.0.0.1:8545");

// Replace with actual deployed contract addresses from your local blockchain
const SIITTokenAddress = "0x9A676e781A523b5d0C0e43731313A708CB607508";
const ProposalManagerAddress = "0x0B306BF915C4d645ff596e518fAf3F9669b97016";
const TreasuryAddress = "0x959922bE3CAee4b8Cd9a407cc3ac1C251C2007B1";
const VotingAddress = "0x9A9f2CCfdE556A7E9Ff0848998Aa4a0CFD8863AE";
const GovernanceAddress = "0x68B1D87F95878fE05B998F19b66F4baba5De1aed";
const TokenFaucetAddress = "0x3Aa5ebB10DC797CAC828524e59A333d0A371443c";

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
export const TokenFaucet = new web3.eth.Contract(
  TokenFaucetABI.abi,
  TokenFaucetAddress
);

export default web3;
