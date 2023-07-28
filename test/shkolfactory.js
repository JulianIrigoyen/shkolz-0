const ShkolFactory = artifacts.require("ShkolFactory");
const BN = web3.utils.BN;

contract("ShkolFactory", (accounts) => {
  let owner = accounts[0];
  let user = accounts[1];
  let contractInstance;

  beforeEach(async () => {
    contractInstance = await ShkolFactory.new({ from: owner });
  });

  it("should always create a Shkol with a 16-digit DNA", async () => {
    await contractInstance.createRandomShkol("shkolName", { from: owner });

    const shkol = await contractInstance.shkolz(0);
    const dnaDigits = 16;
    assert.equal(
      shkol.dna.toString().length,
      dnaDigits,
      "Shkol DNA does not have 16 digits"
    );
  });

  it("should create a new Shkol with the correct owner", async () => {
    const shkolName = "New Shkol";
    await contractInstance.createRandomShkol(shkolName, { from: owner });

    const shkolOwner = await contractInstance.shkolToOwner(0);
    assert.equal(shkolOwner, owner, "Shkol was not assigned to the correct owner");
  });

  it("should not allow two Shkols per wallet", async () => {
    await contractInstance.createRandomShkol("shkolName", { from: owner });
    try {
      await contractInstance.createRandomShkol("shkolName2", { from: owner });
      assert.fail("Expected revert not received");
    } catch (error) {
      assert(error.message.includes('revert'), "Expected 'revert' but got : " + error.message);
    }
  });

  it("owner can clear all Shkillz", async () => {
    await contractInstance.clearShkillz({ from: owner });
    const result = await contractInstance.getShkillzLength();
    assert.equal(result.toString(), "0", "Shkillz were not cleared correctly");
  });

  it("owner can add Shkill", async () => {
    await contractInstance.addShkill("Musician", 6, { from: owner });
    const result = await contractInstance.getShkillzLength();
    assert.equal(result.toString(), "11", "Shkill was not added correctly");
  });

  it("should allow owner to withdraw contract balance", async () => {
    // Deposit a significant amount of ether to the contract
    const depositAmount = web3.utils.toWei("0.1", "ether");
    await web3.eth.sendTransaction({ from: owner, to: contractInstance.address, value: depositAmount });

    const initialContractBalance = await web3.eth.getBalance(contractInstance.address);
    const withdrawAmount = web3.utils.toWei("0.05", "ether");
    await contractInstance.withdraw(withdrawAmount, { from: owner });
    const finalContractBalance = await web3.eth.getBalance(contractInstance.address);
    assert.equal(
      new BN(finalContractBalance).toString(),
      new BN(initialContractBalance).sub(new BN(withdrawAmount)).toString(),
      "Contract balance not correctly updated after withdrawal"
    );
  });

  it("should revert when owner tries to withdraw zero amount", async () => {
    try {
      await contractInstance.withdraw("0", { from: owner });
      assert.fail("Expected revert not received");
    } catch (error) {
      assert(error.message.includes('revert'), "Expected 'revert' but got : " + error.message);
    }
  });

  it("should revert when owner tries to withdraw more than contract balance", async () => {
    const contractBalance = await web3.eth.getBalance(contractInstance.address);
    const withdrawalAmount = new BN(contractBalance).add(new BN("1")).toString();
    try {
      await contractInstance.withdraw(withdrawalAmount, { from: owner });
      assert.fail("Expected revert not received");
    } catch (error) {
      assert(error.message.includes('revert'), "Expected 'revert' but got : " + error.message);
    }
  });

  it("should revert when non-owner tries to withdraw contract balance", async () => {
    const contractBalance = await web3.eth.getBalance(contractInstance.address);
    const withdrawAmount = new BN(contractBalance).div(new BN("2")).toString();
    try {
      await contractInstance.withdraw(withdrawAmount, { from: user });
      assert.fail("Expected revert not received");
    } catch (error) {
      assert(error.message.includes('revert'), "Expected 'revert' but got : " + error.message);
    }
  });

  it("should receive ether when someone sends ether to the contract", async () => {
    const amountToSend = web3.utils.toWei("0.0001", "ether");
    const initialContractBalance = await web3.eth.getBalance(contractInstance.address);

    // Send ether to the contract
    await web3.eth.sendTransaction({ from: user, to: contractInstance.address, value: amountToSend });

    const finalContractBalance = await web3.eth.getBalance(contractInstance.address);
    assert.equal(
      new BN(finalContractBalance).toString(),
      new BN(initialContractBalance).add(new BN(amountToSend)).toString(),
      "Contract balance did not update correctly after receiving ether"
    );
  });
});
