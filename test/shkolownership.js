const ShkolOwnership = artifacts.require("ShkolOwnership");

contract("ShkolOwnership", (accounts) => {
  let owner = accounts[0];
  let user = accounts[1];
  let contractInstance;

  beforeEach(async () => {
    contractInstance = await ShkolOwnership.new({ from: owner });
  });

  it("should mint a new token with given DNA and assign it to the correct owner", async () => {
    const dna = "8356281049284737";
    await contractInstance.mint(owner, "New Shkol", dna, { from: owner });

    const tokenId = await contractInstance.getShkolzCount();
    const tokenOwner = await contractInstance.ownerOf(tokenId.toNumber());
    assert.equal(tokenOwner, owner, "Owner of the minted token is incorrect");
  });

  it("should not mint a new token if the DNA is more than 16 digits", async () => {
    const dna = "83562810492847379999";
    try {
      await contractInstance.mint(owner, "New Shkol", dna, { from: owner });
      assert.fail("Expected revert not received");
    } catch (error) {
      assert(error.message.includes("revert"), "Expected 'revert' but got : " + error.message);
    }
  });

  it("should burn a token if the sender is approved or the owner", async () => {
    const dna = "8356281049284737";
    await contractInstance.mint(owner, "Shkol to be burned", dna, { from: owner });

    const tokenId = await contractInstance.getShkolzCount();
    await contractInstance.burn(tokenId.toNumber(), { from: owner });
    try {
      await contractInstance.ownerOf(tokenId.toNumber());
      assert.fail("Expected revert not received");
    } catch (error) {
      assert(error.message.includes("revert"), "Expected 'revert' but got : " + error.message);
    }
  });

  it("should not burn a token if the sender is not approved and not the owner", async () => {
    const dna = "8356281049284737";
    await contractInstance.mint(owner, "Shkol to be not burned", dna, { from: owner });

    const tokenId = await contractInstance.getShkolzCount();
    try {
      await contractInstance.burn(tokenId.toNumber(), { from: user });
      assert.fail("Expected revert not received");
    } catch (error) {
      assert(error.message.includes("revert"), "Expected 'revert' but got : " + error.message);
    }
  });

  it("should not burn a token that does not exist", async () => {
    try {
      await contractInstance.burn(99999, { from: owner });
      assert.fail("Expected revert not received");
    } catch (error) {
      assert(error.message.includes("revert"), "Expected 'revert' but got : " + error.message);
    }
  });
});
