// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import "@openzeppelin/contracts/access/Ownable.sol";

contract ProposalContract is Ownable {
    uint256 public proposalIdCounter;
    mapping(uint256 => Proposal) public proposals;

    struct Proposal {
        uint256 id;
        string description;
        uint256 amount;
        address proposer;
        bool isActive;
        bool isApproved;
    }

    event ProposalCreated(uint256 proposalId, string description, uint256 amount);
    event ProposalApproved(uint256 proposalId);
    event ProposalRejected(uint256 proposalId);

    constructor() Ownable(msg.sender) {
        proposalIdCounter = 0;
    }

    function createProposal(string memory _description, uint256 _amount) external onlyOwner {
        proposalIdCounter++;
        proposals[proposalIdCounter] = Proposal({
            id: proposalIdCounter,
            description: _description,
            amount: _amount,
            proposer: msg.sender,
            isActive: true,
            isApproved: false
        });

        emit ProposalCreated(proposalIdCounter, _description, _amount);
    }

    function approveProposal(uint256 _proposalId) external onlyOwner {
        Proposal storage proposal = proposals[_proposalId];
        require(proposal.isActive, "Proposal is not active");
        proposal.isApproved = true;
        proposal.isActive = false;
        emit ProposalApproved(_proposalId);
    }

    function rejectProposal(uint256 _proposalId) external onlyOwner {
        Proposal storage proposal = proposals[_proposalId];
        require(proposal.isActive, "Proposal is not active");
        proposal.isActive = false;
        emit ProposalRejected(_proposalId);
    }

    function getProposal(uint256 _proposalId) external view returns (Proposal memory) {
        return proposals[_proposalId];
    }
}
