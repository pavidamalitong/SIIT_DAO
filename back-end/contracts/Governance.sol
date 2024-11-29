// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Treasury.sol";
import "./Voting.sol";
import "./ProposalManager.sol";

contract Governance is Voting {
    Treasury public treasury;

    constructor(address proposalManagerAddress, address treasuryAddress) 
        Voting(proposalManagerAddress) 
    {
        treasury = Treasury(treasuryAddress);
    }

    function executeProposal(uint256 proposalId) external {
        // Fetch the proposal from the ProposalManager contract
        ProposalManager.Proposal memory proposal = proposalManager.getProposal(proposalId);

        require(!proposal.executed, "Proposal already executed");
        require(proposalManager.hasQuorum(proposalId), "Quorum not met");
        require(proposal.status == ProposalManager.Status.Approved, "Proposal not approved");

        // Mark proposal as executed
        proposalManager.setProposal(proposalId, proposal.forVotes, proposal.againstVotes, true);

        // Transfer the amount to the beneficiary from the treasury
        treasury.transferToClub(proposal.beneficiary, proposal.amount);
    }
}
