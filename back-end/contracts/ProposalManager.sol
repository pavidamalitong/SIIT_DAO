// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ProposalManager {
    enum Status {
        Active,
        Approved,
        Rejected
    }

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
        uint quorum;
        Status status;
    }

    mapping(uint256 => Proposal) public proposals;
    uint256 public nextProposalId;
    uint256 public quorum = 1; // Set a default quorum value

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
        bool executed,
        Status status
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
            false,
            quorum,
            Status.Active
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

        // After updating votes, check if the quorum is met and update the status accordingly
        if (hasQuorum(id)) {
            if (proposal.forVotes > proposal.againstVotes) {
                setProposalStatus(id, Status.Approved);
            } else {
                setProposalStatus(id, Status.Rejected);
            }
        }

        emit ProposalUpdated(
            id,
            newForVotes,
            newAgainstVotes,
            newExecuted,
            proposal.status
        );
    }

    function getProposalCount() public view returns (uint256) {
        return nextProposalId;
    }

    // Function to check if the quorum is met
    function hasQuorum(uint256 proposalId) public view returns (bool) {
        Proposal storage proposal = proposals[proposalId];
        uint256 totalVotes = proposal.forVotes + proposal.againstVotes;
        return totalVotes >= proposal.quorum;
    }

    // Update proposal status
    function setProposalStatus(uint256 proposalId, Status _status) public {
        Proposal storage proposal = proposals[proposalId];
        proposal.status = _status;
    }
}
