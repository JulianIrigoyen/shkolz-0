
/**
 * First, the script tells Truffle that we'd want to interact with the Migrations contract.
 * Next, it exports a function that accepts an object called deployer as a parameter. 
 * This object acts as an interface between you (the developer) and Truffle's deployment engine.
 */

var Shkolz = artifacts.require("./Shkolz.sol");
module.exports = function(deployer) {
  deployer.deploy(Shkolz);
};


