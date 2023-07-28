// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";

contract ShkolFactory is Ownable {

    event NewShkol(uint shkolId, string name,  address owner);

    constructor() Ownable() {}

    // this can be something like minimum n of skills
    uint dnaDigits = 16;
    uint dnaModulus = 10 ** dnaDigits;
    // this can be the min amount of time between minting a new skill
    uint cooldownTime = 1 days;

    struct Shkol {
        string name;
        uint dna;
        uint32 level;
        uint32 readyTime;
        // this can track when a shkol passed or failed a challenge
        uint16 winCount;
        uint16 lossCount;
    }

    //TODO A Shkoll can have Shkillz (set of skillz)
    struct Shkill {
        string name;
        uint complexityIndex; //how valuable is this skill 1-10
    }

    Shkol[] public shkolz;

    mapping (uint => address) public shkolToOwner;
    mapping (address => uint) public ownerToShkolCount;

    //todo mapping(uint => Shkill[]) public shkolToShkills;


    function _createShkol(string memory _name, uint _dna) internal {
    shkolz.push(Shkol(_name, _dna, uint32(block.timestamp + cooldownTime), 0, 0, 0));
    uint id = shkolz.length - 1;
    shkolToOwner[id] = msg.sender;
    ownerToShkolCount[msg.sender]++;
    emit NewShkol(id, _name, msg.sender);
}


    function _generateRandomDna(string memory _str) private view returns (uint) {
        uint rand = uint(keccak256(abi.encodePacked(_str)));
        return rand % dnaModulus;
    }

    function createRandomShkol(string memory _name) public {
        require(ownerToShkolCount[msg.sender] == 0);
        uint randDna = _generateRandomDna(_name);
        randDna = randDna - randDna % 100;
        _createShkol(_name, randDna);
    }
}