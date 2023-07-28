const ShkolFactory = artifacts.require("ShkolFactory");
const shkolNames = ["July", "Agus"];

contract("ShkolFactory", (accounts) => {
    let [alice, bob] = accounts;
    it("should be able to create a new Shkol", async () => { 
        const contractInstance = await ShkolFactory.new(); 
        const result = await contractInstance.createRandomShkol(shkolNames[0], {from: alice});
        assert.equal(result.receipt.status, true);
        assert.equal(result.logs[0].args.name,shkolNames[0]);

        const result2 = await contractInstance.createRandomShkol(shkolNames[1], {from: bob});
        assert.equal(result2.receipt.status, true);
        assert.equal(result2.logs[0].args.name,shkolNames[1]);

    });
});
