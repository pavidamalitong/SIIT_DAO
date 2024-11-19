// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Voting is Ownable {
    uint256 public proposalIdCounter;
    mapping(uint256 => Proposal) public proposals;
    mapping(uint256 => mapping(address => bool)) public votes;

    IERC20 public token; // Token used for voting

    struct Proposal {
        uint256 id;
        string description;
        uint256 voteCount;
        uint256 totalVotes;
        bool isActive;
        bool isPassed;
    }

    event ProposalCreated(uint256 proposalId, string description);
    event Voted(uint256 proposalId, address voter, bool vote);
    event ProposalEnded(uint256 proposalId, bool isPassed);

    constructor(address _token) Ownable(msg.sender) {
        token = IERC20(_token);
        proposalIdCounter = 0;
    }

    function createProposal(string memory _description) external onlyOwner {
        proposalIdCounter++;
        proposals[proposalIdCounter] = Proposal({
            id: proposalIdCounter,
            description: _description,
            voteCount: 0,
            totalVotes: 0,
            isActive: true,
            isPassed: false
        });

        emit ProposalCreated(proposalIdCounter, _description);
    }

    function vote(uint256 _proposalId, bool _vote) external {
        Proposal storage proposal = proposals[_proposalId];
        require(proposal.isActive, "Proposal is not active");
        require(!votes[_proposalId][msg.sender], "Already voted");

        uint256 voterBalance = token.balanceOf(msg.sender);
        require(voterBalance > 0, "No voting power");

        if (_vote) {
            proposal.voteCount += voterBalance;
        }
        proposal.totalVotes += voterBalance;

        votes[_proposalId][msg.sender] = true;
        emit Voted(_proposalId, msg.sender, _vote);
    }

    function endProposal(uint256 _proposalId) external onlyOwner {
        Proposal storage proposal = proposals[_proposalId];
        require(proposal.isActive, "Proposal already ended");

        proposal.isActive = false;
        if (proposal.voteCount > proposal.totalVotes / 2) {
            proposal.isPassed = true;
        }
        emit ProposalEnded(_proposalId, proposal.isPassed);
    }

    function getProposal(uint256 _proposalId) external view returns (Proposal memory) {
        return proposals[_proposalId];
    }
}
