const ShkolHelper = artifacts.require("ShkolHelper");
const BN = web3.utils.BN;

contract("ShkolHelper", (accounts) => {
  let owner = accounts[0];
  let user = accounts[1];
  let contractInstance;

  beforeEach(async () => {
    contractInstance = await ShkolHelper.new(
      web3.utils.toWei("0.000001", "ether"),
      web3.utils.toWei("0.0000001", "ether"),
      { from: owner, gas: 8000000, value: web3.utils.toWei("1", "ether") } // Send 1 ether to the contract during deployment
    );
  });

  it("should allow owner to set the level up fee", async () => {
    const newFee = web3.utils.toWei("0.001", "ether");
    await contractInstance.setLevelUpFee(newFee, { from: owner });
    const feeAfterChange = await contractInstance.getLevelUpFee();
    assert.equal(feeAfterChange.toString(), newFee, "Level up fee not correctly set");
  });

  it("should not allow non-owner to set the level up fee", async () => {
    const newFee = web3.utils.toWei("0.001", "ether");
    try {
      await contractInstance.setLevelUpFee(newFee, { from: user });
      assert.fail("Expected revert not received");
    } catch (error) {
      assert(error.message.includes("revert"), "Expected 'revert' but got : " + error.message);
    }
  });

  it("should not allow owner to change the DNA of Shkol for free", async () => {
    await contractInstance.createRandomShkol("shkolName", { from: owner });
    const dna = "8356281049284737";
    try {
      await contractInstance.changeDna(0, dna, { from: owner });
      assert.fail("Expected revert not received");
    } catch (error) {
      assert(error.message.includes("revert"), "Expected 'revert' but got : " + error.message);
    }
  });
  
  it("should allow owner to change the DNA of Shkol with 1 ether payment", async () => {
    await contractInstance.createRandomShkol("shkolName", { from: owner });
    const dna = "1234567890123456";
    const initialBalance = await web3.eth.getBalance(contractInstance.address);
    await contractInstance.changeDna(0, dna, { from: owner, value: web3.utils.toWei("1", "ether") });
    const finalBalance = await web3.eth.getBalance(contractInstance.address);
    assert.equal(
      new BN(finalBalance).toString(),
      new BN(initialBalance).add(new BN(web3.utils.toWei("1", "ether"))).toString(),
      "Contract balance did not change after changing DNA"
    );
    const shkol = await contractInstance.shkolz(0);
    assert.equal(shkol.dna.toString(), dna, "DNA was not changed correctly");
  });
  
  it("should not allow non-owner to change the DNA of Shkol", async () => {
    await contractInstance.createRandomShkol("shkolName", { from: owner });
    const dna = "1234567890123456";
    try {
      await contractInstance.changeDna(0, dna, { from: user });
      assert.fail("Expected revert not received");
    } catch (error) {
      assert(error.message.includes("revert"), "Expected 'revert' but got : " + error.message);
    }
  });
  
  it("should get Shkolz by owner", async () => {
    await contractInstance.createRandomShkol("shkolName", { from: owner });
    const shkolz = await contractInstance.getShkolzByOwner(owner);
    assert.equal(shkolz.length, 1, "Incorrect number of shkolz for owner");
  });
  
  it("should get 0 Shkolz for address with no Shkolz", async () => {
    const shkolz = await contractInstance.getShkolzByOwner(accounts[2]);
    assert.equal(shkolz.length, 0, "Incorrect number of shkolz for user without any shkol");
  });
  
  it("should allow owner to set the validation fee", async () => {
    const newFee = web3.utils.toWei("0.00001", "ether");
    await contractInstance.setValidationFee(newFee, { from: owner });
    const feeAfterChange = await contractInstance.getValidationFee();
    assert.equal(feeAfterChange.toString(), newFee, "Validation fee not correctly set");
  });
  
});
