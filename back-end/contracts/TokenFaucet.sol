// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./SiitToken.sol";

contract TokenFaucet {
    SIITToken public siitToken;

    constructor(address siitTokenAddress) {
        siitToken = SIITToken(siitTokenAddress);
    }

    function claimTokens() external {
        require(siitToken.balanceOf(msg.sender) == 0, "Already claimed");
        uint256 amount = 10 ether;
        siitToken.transfer(msg.sender, amount);
    }
}
