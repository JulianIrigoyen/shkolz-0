// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {ShkolDevelopment} from "./ShkolDevelopment.sol";
import {SafeMath32} from "./util/SafeMath32.sol";

contract ShkolHelper is ShkolDevelopment {
    using SafeMath32 for uint32;
    uint levelUpFee = 0.000001 ether;
    //todo think of how to implement validations
    uint shkillValidationFee = 0.0000001 ether;

    modifier aboveLevel(uint _level, uint _shkolId) {
        require(shkolz[_shkolId].level >= _level);
        _;
    }

    function withdraw() external onlyOwner {
        address payable _owner = payable(owner());
        _owner.transfer(address(this).balance);
    }

    function setLevelUpFee(uint _fee) external onlyOwner {
        levelUpFee = _fee;
    }

    function levelUp(uint _shkolId) external payable {
        require(msg.value == levelUpFee);
        shkolz[_shkolId].level = shkolz[_shkolId].level.add(1);
    }

    //todo think of how to implement validations, maybe counting fixed votes
    function validateShkill(uint _shkolId, uint _shkillId) external payable {
        require(msg.value == shkillValidationFee);
        //this would advance the shkill level for that shkoll
        shkolz[_shkolId].level = shkolz[_shkolId].level.add(1);
    }

    function changeName(
        uint _shkolId,
        string calldata _newName
    ) external aboveLevel(2, _shkolId) onlyOwnerOf(_shkolId) {
        shkolz[_shkolId].name = _newName;
    }

    function changeDna(
        uint _shkolId,
        uint _newDna
    ) external aboveLevel(20, _shkolId) onlyOwnerOf(_shkolId) {
        shkolz[_shkolId].dna = _newDna;
    }

    function getShkolzByOwner(
        address _owner
    ) external view returns (uint[] memory) {
        uint[] memory result = new uint[](ownerShkolCount[_owner]);
        uint counter = 0;
        for (uint i = 0; i < shkolz.length; i++) {
            if (shkolToOwner[i] == _owner) {
                result[counter] = i;
                counter++;
            }
        }
        return result;
    }
}
