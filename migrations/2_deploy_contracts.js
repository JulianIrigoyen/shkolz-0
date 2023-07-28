// Import all the contracts
const Ownable = artifacts.require("Ownable");
const ShkolFactory = artifacts.require("ShkolFactory");
const ShkolHelper = artifacts.require("ShkolHelper");
const ERC721 = artifacts.require("ERC721");
const ShkolOwnership = artifacts.require("ShkolOwnership");
const Shkolz = artifacts.require("Shkolz");
const PoapInterface = artifacts.require("PoapInterface");
const ShkolDevelopment = artifacts.require("ShkolDevelopment");

module.exports = function(deployer) {
  deployer.deploy(ShkolFactory)
    .then(() => deployer.deploy(ShkolHelper))
    .then(() => deployer.deploy(PoapInterface))
    .then(() => deployer.deploy(ShkolDevelopment)
    .then(() => deployer.deploy(ERC721, "Shkol", "SKL"))
    .then(() => deployer.deploy(ShkolOwnership))
    .then(() => deployer.deploy(Shkolz))
    );
};
