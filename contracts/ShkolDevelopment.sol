// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {ShkolFactory} from "./ShkolFactory.sol";

contract PoapInterface {
    //todo develop poap interface
    //function mintPoap()
}

contract ShkolDevelopment is ShkolFactory {
    event SkillAssigned(uint indexed shkolId, uint indexed shkillId);
    event SkillLeveledUp(
        uint indexed shkolId,
        uint indexed shkillId,
        uint newLevel
    );

    PoapInterface poapContract;

    modifier onlyOwnerOf(uint _shkolId) {
        require(shkolToOwner[_shkolId] == msg.sender);
        _;
    }

    function setPoapContractAddress(address _address) external onlyOwner {
        poapContract = PoapInterface(_address);
    }

    function _triggerShkolCooldown(Shkol storage _shkol) internal {
        _shkol.readyTime = uint32(block.timestamp + cooldownTime);
    }

    function _isReady(Shkol storage _shkol) internal view returns (bool) {
        return (_shkol.readyTime <= block.timestamp);
    }

    //todo think of how to enforce character progression of a shkol
    //todo in terms of the shkills he acquires
    //todo for example network validation:
    // artists? enough people go to your concert and validate you, you can level up.
    // cooks? people validate your food
    // handymans? people validate your handydooers
    // doctor? professor? lawayer? you name it
    // designers
    function advanceShkill(
        uint _shkolId,
        uint shkillId,
        string memory _shkillType
    ) internal onlyOwnerOf(_shkolId) {
        Shkol storage myShkol = shkolz[_shkolId];
        require(_isReady(myShkol));
        uint targetDna = shkillId % dnaModulus;
        uint newDna = (myShkol.dna + targetDna) / 2;

        if (
            // here we'd define handlers for each case
            keccak256(abi.encodePacked(_shkillType)) ==
            keccak256(abi.encodePacked("designer"))
        ) {
            newDna = newDna - (newDna % 100) + 99;
        }
        _createShkol("NoNameShkol", newDna);
        _triggerShkolCooldown(myShkol);
    }

    function assignSkillToShkol(uint _shkolId, uint _shkillId) public {
        require(
            msg.sender == shkolToOwner[_shkolId],
            "Caller must own the Shkol"
        );
        require(_shkolId < shkolz.length, "Shkol does not exist");
        require(_shkillId < shkillz.length, "Shkill does not exist");
        shkolIdToShkillLevel[_shkolId][_shkillId] = 1;
        emit SkillAssigned(_shkolId, _shkillId);
    }

    function levelUpSkill(uint _shkolId, uint _shkillId) public {
        require(
            msg.sender == shkolToOwner[_shkolId],
            "Caller must own the Shkol"
        );
        require(_shkolId < shkolz.length, "Shkol does not exist");
        require(_shkillId < shkillz.length, "Shkill does not exist");
        shkolIdToShkillLevel[_shkolId][_shkillId] += 1;
        emit SkillLeveledUp(
            _shkolId,
            _shkillId,
            shkolIdToShkillLevel[_shkolId][_shkillId]
        );
    }
}
