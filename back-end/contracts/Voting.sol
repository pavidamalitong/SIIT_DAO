// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./ProposalManager.sol";

contract Voting {
    ProposalManager public proposalManager;
    mapping(uint256 => mapping(address => bool)) public votes;

    event Voted(uint256 proposalId, address voter, bool support);

    constructor(address proposalManagerAddress) {
        proposalManager = ProposalManager(proposalManagerAddress);
    }

    function vote(uint256 proposalId, bool support) external {
        // Fetch the proposal from the ProposalManager contract
        ProposalManager.Proposal memory proposal = proposalManager.getProposal(proposalId);

        // Ensure the proposal exists and is not executed
        require(!proposal.executed, "Proposal already executed");
        require(!votes[proposalId][msg.sender], "Already voted");

        // Mark as voted
        votes[proposalId][msg.sender] = true;

        // Update the proposal's votes
        uint256 newForVotes = proposal.forVotes;
        uint256 newAgainstVotes = proposal.againstVotes;

        if (support) {
            newForVotes++;
        } else {
            newAgainstVotes++;
        }

        // Update the proposal state on the ProposalManager contract
        proposalManager.setProposal(proposalId, newForVotes, newAgainstVotes, proposal.executed);

        emit Voted(proposalId, msg.sender, support);
    }

    // Function to check if a user has voted on a specific proposal
    function hasVoted(uint256 proposalId, address user) external view returns (bool) {
        return votes[proposalId][user];
    }
}
