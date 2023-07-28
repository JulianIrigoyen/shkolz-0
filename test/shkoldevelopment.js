const utils = require("./helpers/utils");
const ShkolDevelopment = artifacts.require("ShkolDevelopment");
const shkolNames = ["July", "Agus"];
const shkillNames = ["Musician", "Athlete"];

contract("ShkolDevelopment", (accounts) => {
    let [alice, bob] = accounts;
    let contractInstance;

    beforeEach(async () => {
        contractInstance = await ShkolDevelopment.new();
    });

    it("should assign a Shkill to a Shkol", async () => {
        await contractInstance.createRandomShkol(shkolNames[0], {from: alice});
        let result = await contractInstance.assignShkillToShkol(0, 1, {from: alice});
        assert.equal(result.receipt.status, true);
        assert.equal(result.logs[0].args.shkolId.toString(), "0");
        assert.equal(result.logs[0].args.shkillId.toString(), "1");
    });

    
    it("should not allow to assign a Shkill if shkillId is invalid", async () => {
        await contractInstance.createRandomShkol(shkolNames[0], {from: alice});
        await utils.shouldThrow(contractInstance.assignShkillToShkol(0, 11, {from: alice}));
    });
    
    it("should not allow to level up a Shkill if shkillId is invalid", async () => {
        await contractInstance.createRandomShkol(shkolNames[0], {from: alice});
        await utils.shouldThrow(contractInstance.levelUpShkill(0, 11, {from: alice}));
    });
    
    it("should not allow to assign a Shkill if not the owner of the Shkol", async () => {
        await contractInstance.createRandomShkol(shkolNames[0], {from: alice});
        await utils.shouldThrow(contractInstance.assignShkillToShkol(0, 1, {from: bob}));
    });
    
    it("should not allow to level up a Shkill if not the owner of the Shkol", async () => {
        await contractInstance.createRandomShkol(shkolNames[0], {from: alice});
        await utils.shouldThrow(contractInstance.levelUpShkill(0, 1, {from: bob}));
    });

    it("should level up a Shkill of a Shkol", async () => {
        await contractInstance.createRandomShkol(shkolNames[0], {from: alice});
        await contractInstance.assignShkillToShkol(0, 1, {from: alice});
        let result = await contractInstance.levelUpShkill(0, 1, {from: alice});
        assert.equal(result.receipt.status, true);
        assert.equal(result.logs[0].event, "ShkillLeveledUp");
        assert.equal(result.logs[0].args.shkolId.toString(), "0");
        assert.equal(result.logs[0].args.shkillId.toString(), "1");
        assert.equal(result.logs[0].args.newLevel.toString(), "2");
    });
    

    it("should emit the correct event when a Shkill is assigned", async () => {
        await contractInstance.createRandomShkol(shkolNames[0], {from: alice});
        const result = await contractInstance.assignShkillToShkol(0, 0, {from: alice});
        assert.equal(result.logs[0].event, "ShkillAssigned");
        assert.equal(result.logs[0].args.shkolId.toString(), "0");
        assert.equal(result.logs[0].args.shkillId.toString(), "0");
    });
    
    it("should emit the correct event when a Shkill is leveled up", async () => {
        await contractInstance.createRandomShkol(shkolNames[0], {from: alice});
        await contractInstance.assignShkillToShkol(0, 0, {from: alice});
        const result = await contractInstance.levelUpShkill(0, 0, {from: alice});
        assert.equal(result.logs[0].event, "ShkillLeveledUp");
        assert.equal(result.logs[0].args.shkolId.toString(), "0");
        assert.equal(result.logs[0].args.shkillId.toString(), "0");
        assert.equal(result.logs[0].args.newLevel.toString(), "2");
    });

    
    afterEach(async () => {
       console.log("<3<3<3<3<3<3<3<3<3<3<3<3<3<3<3")
    });
    });
    
