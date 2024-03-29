import { readFileSync } from "fs";
import solc from "solc";
import { JsonRpcProvider, ContractFactory } from "ethers";

const provider = new JsonRpcProvider("http://127.0.0.1:8545");
const signer = await provider.getSigner();

const balanceBefore = await provider.getBalance(signer.address);
console.log("Balance Before:", balanceBefore);

const CONTRACT_FILE = "contracts/Storage.sol";

const content = readFileSync(CONTRACT_FILE).toString();

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

const factory = new ContractFactory(abi, bytecode, signer);
const contract = await factory.deploy();

console.log("Contract deployed:", await contract.getAddress());

const trx = await contract.store("Hello, KBA!");
console.log("Transaction Hash:", trx.hash);

const message = await contract.retrieve();
console.log("Message:", message);

const balanceAfter = await provider.getBalance(signer.address);
console.log("Balance After:", balanceAfter);
