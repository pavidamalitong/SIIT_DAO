// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./SiitToken.sol";

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
        uint256 quorum;
        Status status;
    }

    SIITToken public siitToken;
    mapping(uint256 => Proposal) public proposals;
    uint256 public nextProposalId;

    constructor(address siitTokenAddress) {
        siitToken = SIITToken(siitTokenAddress);
    }

    event ProposalCreated(
        uint256 id,
        string title,
        address proposer,
        address beneficiary,
        uint256 amount,
        uint256 quorum
    );

    event ProposalUpdated(
        uint256 id,
        uint256 forVotes,
        uint256 againstVotes,
        bool executed,
        Status status
    );

    modifier onlyTokenHolders() {
        require(
            siitToken.balanceOf(msg.sender) >= 1 ether,
            "Insufficient SIITToken balance"
        );
        _;
    }

    // For Creating Proposal
    function createProposal(
        string calldata title,
        string calldata description,
        address beneficiary,
        uint256 amount,
        uint256 quorum
    ) external onlyTokenHolders returns (uint256) {
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
            amount,
            quorum
        );
        return nextProposalId++;
    }


    // For Retrieving Proposal Details
    function getProposal(uint256 id) external view returns (Proposal memory) {
        require(id < nextProposalId, "Proposal does not exist");
        return proposals[id];
    }

    // For Counting All Proposals
    function getProposalCount() public view returns (uint256) {
        return nextProposalId;
    }

    // For Checking if the quorum is met
    function hasQuorum(uint256 proposalId) public view returns (bool) {
        Proposal storage proposal = proposals[proposalId];
        uint256 totalVotes = proposal.forVotes + proposal.againstVotes;
        return totalVotes >= proposal.quorum;
    }

    // For Updating Votes and Execution status
    function setProposal(
        uint256 id,
        uint256 newForVotes,
        uint256 newAgainstVotes,
        bool newExecuted
    ) external {
        require(id < nextProposalId, "Proposal does not exist");

        Proposal storage proposal = proposals[id];

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

    // For Updating Proposal Status
    function setProposalStatus(uint256 proposalId, Status _status) public {
        Proposal storage proposal = proposals[proposalId];
        proposal.status = _status;
    }
}
