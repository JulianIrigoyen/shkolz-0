// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {ShkolDevelopment} from "./ShkolDevelopment.sol";
import {SafeMath32} from "./util/SafeMath32.sol";

contract ShkolHelper is ShkolDevelopment {
    using SafeMath32 for uint32;

    uint levelUpFee = 0.000001 ether;
    uint shkillValidationFee = 0.0000001 ether;

    function getLevelUpFee() external view returns (uint) {
        return levelUpFee;
    }

    function getValidationFee() external view returns (uint) {
        return shkillValidationFee;
    }

    //todo
    modifier aboveLevel(
        uint _level,
        uint _shkolId,
        uint _shkillId
    ) {
        require(shkolz[_shkolId].level >= _level);
        _;
    }

    function withdraw() external payable onlyOwner {
        uint256 balance = address(this).balance;
        address payable _owner = payable(owner());
        _owner.transfer(balance);
    }

    function setLevelUpFee(uint _fee) external onlyOwner {
        levelUpFee = _fee;
    }

    function setValidationFee(uint _fee) external onlyOwner {
        shkillValidationFee = _fee;
    }

    function levelUp(uint _shkolId) external payable {
        require(msg.value == levelUpFee);
        shkolz[_shkolId].level = shkolz[_shkolId].level.add(1);
    }

    function validateShkill(uint _shkolId, uint _shkillId) external payable {
        require(msg.value == shkillValidationFee);
        shkolz[_shkolId].level = shkolz[_shkolId].level.add(1);
    }

    function changeName(
        uint _shkolId,
        string calldata _newName
    ) external onlyOwnerOf(_shkolId) {
        shkolz[_shkolId].name = _newName;
    }

    function changeDna(
        uint _shkolId,
        uint _newDna
    ) external payable onlyOwnerOf(_shkolId) {
        require(
            msg.value >= 1 ether,
            "Changing DNA requires at least 1 ether payment"
        );
        require(
            _newDna >= 1e15 && _newDna < 1e16,
            "DNA must always be 16 digits"
        );
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
