// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract SIITToken is ERC20 {
    address public admin;

    constructor() ERC20("SIIT Token", "ORC") {
        admin = msg.sender;
        _mint(msg.sender, 1000000 * 10 ** decimals()); // Mint 1,000,000 SIIT Tokens
    }

    function mint(address to, uint256 amount) external {
        require(msg.sender == admin, "Only admin can mint tokens");
        _mint(to, amount);
    }
}
