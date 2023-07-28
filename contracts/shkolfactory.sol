// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {SafeMath} from "@openzeppelin/contracts/utils/math/SafeMath.sol";


contract ShkolFactory is Ownable {
    using SafeMath for uint256;
    
    event NewShkol(uint shkolId, string name, address owner);
    event Deposit(address indexed account, uint256 amount);
    event Withdrawal(address indexed account, uint256 amount);

    constructor() Ownable() {
        initializeCoreShkillz();
    }

    // Mutex-like variable to prevent reentrancy attack
    bool private _isWithdrawing;

    modifier preventReentrancy() {
        require(!_isWithdrawing, "Reentrant call");
        _isWithdrawing = true;
        _;
        _isWithdrawing = false;
    }

    //todo this will be used for NFT generation
    uint dnaDigits = 16;
    uint dnaModulus = 10 ** dnaDigits;

    //todo this can be the min amount of time between minting a new skill
    uint cooldownTime = 1 weeks;

    struct Shkol {
        string name;
        uint dna;
        uint32 level;
        uint32 readyTime;
        uint16 winCount; //challenges won
        uint16 lossCount; //challenges lost
    }

    //todo a Shkol can have Shkillz (set of skillz)
    struct Shkill {
        string name;
        uint level;
        uint complexityIndex; //how hard is it to validate
    }

    Shkol[] public shkolz;
    mapping(uint => address) public shkolToOwner;
    mapping(address => uint) public ownerShkolCount;

    Shkill[] public shkillz;
    mapping(uint => Shkill[]) public shkolToShkills; // This mapping links each shkol to its Shkills
    mapping(uint => Shkill) shkills; // This mapping links each shkillId to a Shkill
    mapping(uint => mapping(uint => uint)) public shkolIdToShkillLevel; //This mapping links each shkol to its shkill and shkill level

    function _createShkol(string memory _name, uint _dna) internal {
        shkolz.push(
            Shkol(_name, _dna, uint32(block.timestamp + cooldownTime), 0, 0, 0)
        );
        uint id = shkolz.length - 1;
        shkolToOwner[id] = msg.sender;
        ownerShkolCount[msg.sender]++;
        emit NewShkol(id, _name, msg.sender);
    }

    function _generateRandomDna(string memory _str) private view returns (uint) {
    uint rand = uint(keccak256(abi.encodePacked(_str)));
    rand = rand % dnaModulus;
    uint requiredDigits = dnaDigits - uint(log10(rand) + 1);
    rand += uint(10**requiredDigits) * rand;
    return rand;
}
function log10(uint x) internal pure returns (uint y){
    while (x >= 10) {
        x /= 10;
        y++;
    }
}



    function createRandomShkol(string memory _name) public {
        require(ownerShkolCount[msg.sender] == 0);
        uint randDna = _generateRandomDna(_name);
        randDna = randDna - (randDna % 100);
        _createShkol(_name, randDna);
    }

    function initializeCoreShkillz() internal {
        _createShkill("Artist", 8);
        _createShkill("Cook", 7);
        _createShkill("Handyman", 7);
        _createShkill("Doctor", 9);
        _createShkill("Professor", 8);
        _createShkill("Lawyer", 7);
        _createShkill("Designer", 7);
        _createShkill("Programmer", 8);
        _createShkill("Musician", 8);
        _createShkill("Athlete", 8);
    }

    function _createShkill(string memory _name, uint _complexity) internal {
        shkillz.push(Shkill(_name, 0, _complexity));
    }

    function clearShkillz() external onlyOwner {
        delete shkillz;
    }

    function getShkillzLength() public view returns (uint) {
        return shkillz.length;
    }

    //adding a skill would require votes
    function addShkill(
        string memory _name,
        uint _complexity
    ) external onlyOwner {
        _createShkill(_name, _complexity);
    }

    function withdraw(uint256 _amount) external onlyOwner preventReentrancy {
        require(_amount > 0, "Withdrawal amount must be greater than 0");
        require(_amount <= address(this).balance, "Insufficient contract balance");
        (bool success, ) = owner().call{value: _amount}("");
        require(success, "Withdrawal failed");
        emit Withdrawal(msg.sender, _amount);
    }
    // Fallback function to receive ether
    receive() external payable {
        emit Deposit(msg.sender, msg.value);
    }
}
