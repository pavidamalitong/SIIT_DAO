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
        require(proposal.forVotes > proposal.againstVotes, "Proposal did not pass");

        // Update the proposal state on the ProposalManager contract
        proposalManager.setProposal(proposalId, proposal.forVotes, proposal.againstVotes, true);

        // Transfer the amount to the beneficiary from the treasury
        treasury.transferToClub(proposal.beneficiary, proposal.amount);
    }
}
