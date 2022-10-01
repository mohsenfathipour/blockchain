const Block = require("./block");
const {GENESIS_DATA} = require('./config');
const cryptoHash = require("./crypto-hash");

describe("Block", () => {
  const timestamp = "a-data";
  const lastHash = "foo-hash";
  const hash = "bar-hash";
  const data = ["blockchain", "data"];

  const block = new Block({
    timestamp,
    lastHash,
    hash,
    data,
  });

  it('has timestamp, lastHash, Hash and data property',()=>{
    expect(block.timestamp).toEqual(timestamp);
    expect(block.lastHash).toEqual(lastHash);
    expect(block.hash).toEqual(hash);
    expect(block.data).toEqual(data);
  });


  describe('genesis()', ()=>{
        const genesisBlock = Block.genesis();

        it('returns a block instans',()=>{
            expect(genesisBlock instanceof Block).toEqual(true);
        });

        it('returns the genesis data from config', ()=> {
            expect(genesisBlock).toEqual(GENESIS_DATA);
        });
  });


  describe('mineblock()',()=>{
        const lastBlock = Block.genesis();
        const data = 'mined data';
        const minedBlock = Block.mineBlock({lastBlock, data});

        it('returns instance of Block', ()=>{
            expect(minedBlock instanceof Block).toEqual(true);
        });

        it('sets `lastHash` to the `hash` of the lastBlock',()=>{
            expect(minedBlock.lastHash).toEqual(lastBlock.hash);
        });

        it('sets the `data` correctly',()=>{
            expect(minedBlock.data).toEqual(data);
        });

        it('sets the `timestamp`',()=>{
            expect(minedBlock.timestamp).not.toBeNull();
        });

        it('creates sha256 `hash` based on the proper inputs',()=>{
            expect(minedBlock.hash).toEqual(cryptoHash(minedBlock.timestamp, lastBlock.hash, data));
        });

        

  });
});
