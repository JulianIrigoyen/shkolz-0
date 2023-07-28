// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import { ShkolHelper } from "./ShkolHelper.sol";

contract ShkolOwnership is ShkolHelper, ERC721 {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    constructor() ERC721("Shkolz", "ITM") {}

    function mint(address to, string memory name, uint256 dna) public returns (uint256) {
        require(dna < 10**16, "DNA has more than 16 digits");
        _tokenIds.increment();

        uint256 newItemId = _tokenIds.current();
        _mint(to, newItemId);
        _createShkol(name, dna);

        return newItemId;
    }

    function mintRandom(address to, string memory name) public returns (uint256) {
        _tokenIds.increment();

        uint256 newItemId = _tokenIds.current();
        _mint(to, newItemId);
        // Call `createRandomShkol` to generate a random DNA
        createRandomShkol(name);

        return newItemId;
    }

    function burn(uint256 tokenId) public {
        require(_isApprovedOrOwner(_msgSender(), tokenId), "ERC721: burn caller is not owner nor approved");
        _burn(tokenId);
    }

    function getShkolzCount() public view returns (uint256) {
    return _tokenIds.current();
}
}
