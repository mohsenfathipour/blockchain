const Block = require("./block");
const { GENESIS_DATA } = require("./config");
const cryptoHash = require("./crypto-hash");

class Blockchain {
  constructor() {
    this.chain = [Block.genesis()];
  }

  addBlock({ data }) {
    const newBlock = Block.mineBlock({
      lastBlock: this.chain[this.chain.length - 1],
      data,
    });

    this.chain.push(newBlock);
  }

  static isValidChain(chain) {
    // Check genesis
    if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())) {
      return false;
    }

    for (let i = 1; i < chain.length; i++) {
      const { timestamp, hash, lastHash, data, difficulty, nonce } = chain[i];
      const lastBlockhash = chain[i - 1].hash;

      // Check lastHash
      if (lastHash !== lastBlockhash) {
        return false;
      }

      // Check data
      if (hash !== cryptoHash(timestamp, lastHash, data, difficulty, nonce)) {
        return false;
      }
    }

    return true;
  }

  replaceChain(chain) {
    if(this.chain.length >= chain.length) {
      console.error('new chain must be longer');
      return;
    }
    if( ! Blockchain.isValidChain(chain)) {
      console.error('new chain must be valid');
      return
    };
    console.log('chain changed: ', chain);
    this.chain = chain;
  }
}

module.exports = Blockchain;
