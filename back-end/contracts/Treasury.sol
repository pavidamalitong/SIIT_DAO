// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./SiitToken.sol";

contract Treasury is Ownable {
    SIITToken public token;

    constructor(address tokenAddress) Ownable(msg.sender) {
        token = SIITToken(tokenAddress);
    }

    function transferToClub(address beneficiary, uint256 amount) external {
        // Ensure there are enough tokens to transfer
        require(token.balanceOf(address(this)) >= amount, "Insufficient balance");

        // Transfer tokens from the contract to the beneficiary
        token.transfer(beneficiary, amount);
    }
}
