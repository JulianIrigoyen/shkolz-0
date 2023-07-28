const utils = require("./helpers/utils");

const ShkolFactory = artifacts.require("ShkolFactory");
const shkolNames = ["July", "Agus"];

contract("ShkolFactory", (accounts) => {
    let [alice, bob] = accounts;
    let contractInstance;

    beforeEach(async () => {
        contractInstance = await ShkolFactory.new();
    });

    it("should create a list of 10 core shkillz when starting", async () => {
        const result = await contractInstance.getShkillzLength();
        assert.equal(result.toString(), "10");
    });

    it("should be able to create a new Shkol", async () => {
        let result = await contractInstance.createRandomShkol(shkolNames[0], {from: alice});
        assert.equal(result.receipt.status, true);
        assert.equal(result.logs[0].args.name, shkolNames[0]);

        result = await contractInstance.createRandomShkol(shkolNames[1], {from: bob});
        assert.equal(result.receipt.status, true);
        assert.equal(result.logs[0].args.name, shkolNames[1]);
    });

    it("should not allow two Shkols per wallet", async () => {
        await contractInstance.createRandomShkol(shkolNames[0], {from: alice});
        await utils.shouldThrow(contractInstance.createRandomShkol(shkolNames[1], {from: alice}));
    });

    it("owner can clear all Shkillz", async () => {
        await contractInstance.clearShkillz({ from: alice });
        const result = await contractInstance.getShkillzLength();
        assert.equal(result.toString(), "0");
    });

    it("owner can add Shkill", async () => {
        await contractInstance.addShkill("Musician", 6, { from: alice });
        const result = await contractInstance.getShkillzLength();
        assert.equal(result.toString(), "11");
    });

    afterEach(async () => {
       console.log("<3<3<3<3<3<3<3<3<3<3<3<3<3<3<3")
    });
});
