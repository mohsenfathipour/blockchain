const Block = require("./block");
const Blockchain = require("./blockchain");

describe("Blockchain", () => {
  let blockchain = new Blockchain();
  let errorMock, logMock;

  beforeEach(() => {
    blockchain = new Blockchain();

    errorMock = jest.fn();
    logMock = jest.fn();

    global.console.error = errorMock;
    global.console.log = logMock;
  });

  it("contains a `chain` Array instance", () => {
    expect(blockchain.chain instanceof Array).toBe(true);
  });
  it("starts with genesis block", () => {
    expect(blockchain.chain[0]).toEqual(Block.genesis());
  });
  it("adds new block to chain", () => {
    const newData = "foo bar";
    blockchain.addBlock({ data: newData });

    expect(blockchain.chain[blockchain.chain.length - 1].data).toEqual(newData);
  });

  describe("isValidCain()", () => {
    describe("When the chain does not start with genesis block", () => {
      it("returns fals", () => {
        blockchain.chain[0] = { data: "fake-genesis" };
        expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
      });
    });

    describe("When the chain does start with genesis block and has multiple blocks", () => {
      beforeEach(() => {
        blockchain.addBlock({ data: "one" });
        blockchain.addBlock({ data: "two" });
        blockchain.addBlock({ data: "three" });
      });

      describe("and the `lastHash` refrence has changed", () => {
        it("returns false", () => {
          blockchain.chain[2].lastHash = "fake-lasthash";
          expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
        });
      });

      describe("and the chain contains a block with an invalid field", () => {
        it("returns false", () => {
          blockchain.chain[2].data = "changed-data";
          expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
        });
      });

      describe("and the chain does not contain invalid blocks", () => {
        it("returns true", () => {
          expect(Blockchain.isValidChain(blockchain.chain)).toBe(true);
        });
      });
    });
  });

  describe("replaceChain()", () => {
    let newBlockchain;

    beforeEach(() => {
      newBlockchain = new Blockchain();
    });

    describe("when the new chain is not longer", () => {
      it("does not replace the chain", () => {
        blockchain.addBlock({ data: "new block" });
        originalChain = blockchain.chain;
        blockchain.replaceChain(newBlockchain.chain);
        expect(blockchain.chain).toEqual(originalChain);
      });

      it('has error log',()=>{
        blockchain.addBlock({ data: "new block" });
        originalChain = blockchain.chain;
        blockchain.replaceChain(newBlockchain.chain);
        expect(errorMock).toHaveBeenCalled();
      });
    });
    describe("when the new chain is longer", () => {
      beforeEach(() => {
        newBlockchain.addBlock({ data: "one" });
        newBlockchain.addBlock({ data: "two" });
        newBlockchain.addBlock({ data: "three" });
      });

      describe("and the chain is invalid", () => {
        it("does not replace the chain", () => {
          newBlockchain.chain[2].hash = "fake-hash";
          originalChain = blockchain.chain;
          blockchain.replaceChain(newBlockchain.chain);
          expect(blockchain.chain).toEqual(originalChain);
        });

        it('has error log',()=>{
          newBlockchain.chain[2].hash = "fake-hash";
          originalChain = blockchain.chain;
          blockchain.replaceChain(newBlockchain.chain);
          expect(errorMock).toHaveBeenCalled();
        });


      });

      describe("and the chain is valid", () => {
        it("does replace the chain", () => {
          newBlockchain.addBlock({ data: "one" });
          newBlockchain.addBlock({ data: "two" });
          newBlockchain.addBlock({ data: "three" });

          originalChain = blockchain.chain;
          blockchain.replaceChain(newBlockchain.chain);
          expect(blockchain.chain).not.toEqual(originalChain);
        });

        it('has console log',()=>{
          newBlockchain.addBlock({ data: "one" });
          newBlockchain.addBlock({ data: "two" });
          newBlockchain.addBlock({ data: "three" });

          originalChain = blockchain.chain;
          blockchain.replaceChain(newBlockchain.chain);

          expect(logMock).toHaveBeenCalled();
        });


      });
    });
  });
});
