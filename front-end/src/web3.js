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

// Replace with actual deployed contract addresses from local blockchain
const SIITTokenAddress = "0x4ed7c70F96B99c776995fB64377f0d4aB3B0e1C1";
const ProposalManagerAddress = "0x322813Fd9A801c5507c9de605d63CEA4f2CE6c44";
const TreasuryAddress = "0xa85233C63b9Ee964Add6F2cffe00Fd84eb32338f";
const VotingAddress = "0x4A679253410272dd5232B3Ff7cF5dbB88f295319";
const GovernanceAddress = "0x7a2088a1bFc9d81c55368AE168C2C02570cB814F";
const TokenFaucetAddress = "0x09635F643e140090A9A8Dcd712eD6285858ceBef";

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
