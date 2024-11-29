// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ProposalManager {
    struct Proposal {
        uint256 id;
        string title;
        string description;
        address proposer;
        address beneficiary;
        uint256 amount;
        uint256 forVotes;
        uint256 againstVotes;
        bool executed;
    }

    mapping(uint256 => Proposal) public proposals;
    uint256 public nextProposalId;

    event ProposalCreated(
        uint256 id,
        string title,
        address proposer,
        address beneficiary,
        uint256 amount
    );

    event ProposalUpdated(
        uint256 id,
        uint256 forVotes,
        uint256 againstVotes,
        bool executed
    );

    function createProposal(
        string calldata title,
        string calldata description,
        address beneficiary,
        uint256 amount
    ) external returns (uint256) {
        proposals[nextProposalId] = Proposal(
            nextProposalId,
            title,
            description,
            msg.sender,
            beneficiary,
            amount,
            0,
            0,
            false
        );
        emit ProposalCreated(
            nextProposalId,
            title,
            msg.sender,
            beneficiary,
            amount
        );
        return nextProposalId++;
    }

    function getProposal(uint256 id) external view returns (Proposal memory) {
        require(id < nextProposalId, "Proposal does not exist");
        return proposals[id];
    }

    function setProposal(
        uint256 id,
        uint256 newForVotes,
        uint256 newAgainstVotes,
        bool newExecuted
    ) external {
        require(id < nextProposalId, "Proposal does not exist");

        Proposal storage proposal = proposals[id];

        // Ensure the proposal is not executed already
        require(!proposal.executed, "Proposal already executed");

        proposal.forVotes = newForVotes;
        proposal.againstVotes = newAgainstVotes;
        proposal.executed = newExecuted;

        emit ProposalUpdated(id, newForVotes, newAgainstVotes, newExecuted);
    }

    function getProposalCount() public view returns (uint256) {
        return nextProposalId;
    }
}
