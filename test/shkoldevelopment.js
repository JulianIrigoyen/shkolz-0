const ShkolDevelopment = artifacts.require("ShkolDevelopment");

contract("ShkolDevelopment", (accounts) => {
  let owner = accounts[0];
  let user = accounts[1];
  let contractInstance;

  beforeEach(async () => {
    contractInstance = await ShkolDevelopment.new({ from: owner });
  });

  it("should assign a Shkill to a Shkol", async () => {
    await contractInstance.createRandomShkol("shkolName", { from: owner });

    const shkillId = 1;
    await contractInstance.assignShkillToShkol(0, shkillId, { from: owner });

    const shkillLevel = await contractInstance.shkolIdToShkillLevel(0, shkillId);
    assert.equal(shkillLevel.toString(), "1", "Shkill was not correctly assigned to Shkol");
  });

  it("should not allow to assign a Shkill if shkillId is invalid", async () => {
    await contractInstance.createRandomShkol("shkolName", { from: owner });
    const invalidShkillId = 11;
    try {
      await contractInstance.assignShkillToShkol(0, invalidShkillId, { from: owner });
      assert.fail("Expected revert not received");
    } catch (error) {
      assert(error.message.includes("revert"), "Expected 'revert' but got : " + error.message);
    }
  });

  it("should not allow to reset a Shkill level", async () => {
    await contractInstance.createRandomShkol("shkolName", { from: owner });
    const shkillId = 1;
    await contractInstance.assignShkillToShkol(0, shkillId, { from: owner });
    try {
      await contractInstance.assignShkillToShkol(0, shkillId, { from: owner });
      assert.fail("Expected revert not received");
    } catch (error) {
      assert(error.message.includes("revert"), "Expected 'revert' but got : " + error.message);
    }
  });

  it("should not allow to level up a Shkill if shkillId is invalid", async () => {
    await contractInstance.createRandomShkol("shkolName", { from: owner });
    const invalidShkillId = 11;
    try {
      await contractInstance.levelUpShkill(0, invalidShkillId, { from: owner });
      assert.fail("Expected revert not received");
    } catch (error) {
      assert(error.message.includes("revert"), "Expected 'revert' but got : " + error.message);
    }
  });

  it("should not allow to assign a Shkill if not the owner of the Shkol", async () => {
    await contractInstance.createRandomShkol("shkolName", { from: owner });
    const shkillId = 1;
    try {
      await contractInstance.assignShkillToShkol(0, shkillId, { from: user });
      assert.fail("Expected revert not received");
    } catch (error) {
      assert(error.message.includes("revert"), "Expected 'revert' but got : " + error.message);
    }
  });

  it("should not allow to level up a Shkill if not the owner of the Shkol", async () => {
    await contractInstance.createRandomShkol("shkolName", { from: owner });
    const shkillId = 1;
    try {
      await contractInstance.levelUpShkill(0, shkillId, { from: user });
      assert.fail("Expected revert not received");
    } catch (error) {
      assert(error.message.includes("revert"), "Expected 'revert' but got : " + error.message);
    }
  });

  it("should level up a Shkill of a Shkol", async () => {
    await contractInstance.createRandomShkol("shkolName", { from: owner });
    const shkillId = 1;
    await contractInstance.assignShkillToShkol(0, shkillId, { from: owner });
    await contractInstance.levelUpShkill(0, shkillId, { from: owner });

    const shkillLevel = await contractInstance.shkolIdToShkillLevel(0, shkillId);
    assert.equal(shkillLevel.toString(), "2", "Shkill was not correctly leveled up");
  });
});
