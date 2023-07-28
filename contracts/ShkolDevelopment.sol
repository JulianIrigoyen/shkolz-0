// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {ShkolFactory} from "./ShkolFactory.sol";
import {SafeMath} from "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract PoapInterface {
    //todo develop poap interface
    //function mintPoap()
}

contract ShkolDevelopment is ShkolFactory {
    using SafeMath for uint;

    event ShkillAssigned(uint indexed shkolId, uint indexed shkillId);
    event ShkillLeveledUp(
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

    function advanceShkill(
        uint _shkolId,
        uint shkillId,
        string memory _shkillType
    ) public onlyOwnerOf(_shkolId) {
        Shkol storage myShkol = shkolz[_shkolId];
        require(_isReady(myShkol));
        uint targetDna = shkillId % dnaModulus;
        uint newDna = (myShkol.dna.add(targetDna)).div(2);

        if (
            keccak256(abi.encodePacked(_shkillType)) ==
            keccak256(abi.encodePacked("designer"))
        ) {
            newDna = newDna - (newDna % 100) + 99;
        }
        _createShkol("NoNameShkol", newDna);
        _triggerShkolCooldown(myShkol);
    }

    function assignShkillToShkol(
        uint _shkolId,
        uint _shkillId
    ) public onlyOwnerOf(_shkolId) {
        require(_shkillId < shkillz.length, "Shkill does not exist");
        require(
            shkolIdToShkillLevel[_shkolId][_shkillId] == 0,
            "Shkill already assigned"
        );
        shkolIdToShkillLevel[_shkolId][_shkillId] = 1;
        emit ShkillAssigned(_shkolId, _shkillId);
    }

    function levelUpShkill(
        uint _shkolId,
        uint _shkillId
    ) public onlyOwnerOf(_shkolId) {
        require(_shkillId < shkillz.length, "Shkill does not exist");
        shkolIdToShkillLevel[_shkolId][_shkillId] = shkolIdToShkillLevel[
            _shkolId
        ][_shkillId].add(1);
        emit ShkillLeveledUp(
            _shkolId,
            _shkillId,
            shkolIdToShkillLevel[_shkolId][_shkillId]
        );
    }
}
