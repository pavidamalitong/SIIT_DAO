// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./ProposalManager.sol";
import "./SiitToken.sol";

contract Voting {
    ProposalManager public proposalManager;
    SIITToken public siitToken;
    mapping(uint256 => mapping(address => bool)) public votes;

    event Voted(uint256 proposalId, address voter, bool support);

    constructor(address proposalManagerAddress, address siitTokenAddress) {
        proposalManager = ProposalManager(proposalManagerAddress);
        siitToken = SIITToken(siitTokenAddress);
    }

    modifier onlyTokenHolders() {
        require(siitToken.balanceOf(msg.sender) >= 1 ether, "Insufficient SIITToken balance");
        _;
    }

    function vote(uint256 proposalId, bool support) external onlyTokenHolders {
        // Fetch the proposal from the ProposalManager contract
        ProposalManager.Proposal memory proposal = proposalManager.getProposal(
            proposalId
        );

        // Ensure the proposal is active and not already executed
        require(!proposal.executed, "Proposal already executed");
        require(
            proposal.status == ProposalManager.Status.Active,
            "Proposal is not active"
        );
        require(!votes[proposalId][msg.sender], "Already voted");

        // Mark as voted
        votes[proposalId][msg.sender] = true;

        // Update the proposal's votes
        if (support) {
            proposal.forVotes++;
        } else {
            proposal.againstVotes++;
        }

        // Update the proposal state in the ProposalManager contract
        proposalManager.setProposal(
            proposalId,
            proposal.forVotes,
            proposal.againstVotes,
            proposal.executed
        );

        emit Voted(proposalId, msg.sender, support);
    }

    // For Checking that User has voted 
    function hasVoted(
        uint256 proposalId,
        address user
    ) external view returns (bool) {
        return votes[proposalId][user];
    }
}
