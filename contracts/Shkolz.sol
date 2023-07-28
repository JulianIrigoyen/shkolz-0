// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Shkolz {
    // Event to be emitted upon receiving Ether
    event Received(address sender, uint amount);

    // Fallback function to accept Ether. This function is called when Ether is sent directly to the contract.
    receive() external payable {
        emit Received(msg.sender, msg.value);  // Emit event with sender address and received amount
    }

    // Function to check the balance of the contract
    function getBalance() public view returns (uint) {
        return address(this).balance;
    }
}
