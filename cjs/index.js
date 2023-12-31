const fs = require("fs");
const solc = require("solc");
const ethers = require("ethers");

async function run() {
  const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
  const signer = await provider.getSigner();

  const CONTRACT_FILE = "contracts/Storage.sol";

  const content = fs.readFileSync(CONTRACT_FILE).toString();

  const input = {
    language: "Solidity",
    sources: {
      [CONTRACT_FILE]: {
        content: content,
      },
    },
    settings: {
      outputSelection: {
        "*": {
          "*": ["*"],
        },
      },
    },
  };

  const compiled = solc.compile(JSON.stringify(input));
  const output = JSON.parse(compiled);

  const abi = output.contracts[CONTRACT_FILE].Storage.abi;
  const bytecode = output.contracts[CONTRACT_FILE].Storage.evm.bytecode.object;

  const factory = new ethers.ContractFactory(abi, bytecode, signer);
  const contract = await factory.deploy();

  const trx = await contract.store("Hello, KBA!");
  console.log("Transaction Hash:", trx.hash);

  const message = await contract.retrieve();
  console.log("Message:", message);
}

run();
