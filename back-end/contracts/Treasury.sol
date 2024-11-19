// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Treasury is Ownable {
    IERC20 public token;
    mapping(address => uint256) public allocations;

    // Events for deposit, fund requests, and withdrawals
    event FundsDeposited(address indexed faculty, uint256 amount);
    event FundsAllocated(address indexed club, uint256 amount);
    event FundsReleased(address indexed club, uint256 amount);

    constructor(IERC20 _token) Ownable(msg.sender) {
        token = _token;
    }

    // Owner deposits funds to the treasury contract
    function depositFunds(uint256 amount) external onlyOwner {
        require(token.transferFrom(msg.sender, address(this), amount), "Deposit failed");
        emit FundsDeposited(msg.sender, amount);
    }

    // Allocates funds to a specific club
    function allocateFunds(address club, uint256 amount) external onlyOwner {
        allocations[club] += amount;
        emit FundsAllocated(club, amount);
    }

    // Releases allocated funds to the club
    function releaseFunds(address club) external {
        uint256 amount = allocations[club];
        require(amount > 0, "No funds allocated");
        allocations[club] = 0;
        require(token.transfer(club, amount), "Transfer failed");
        emit FundsReleased(club, amount);
    }
}
