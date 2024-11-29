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
const SIITTokenAddress = "0xcbEAF3BDe82155F56486Fb5a1072cb8baAf547cc";
const ProposalManagerAddress = "0x1429859428C0aBc9C2C47C8Ee9FBaf82cFA0F20f";
const TreasuryAddress = "0xB0D4afd8879eD9F52b28595d31B441D079B2Ca07";
const VotingAddress = "0x162A433068F51e18b7d13932F27e66a3f99E6890";
const GovernanceAddress = "0x922D6956C99E12DFeB3224DEA977D0939758A1Fe";

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
