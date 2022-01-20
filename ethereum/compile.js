const path = require("path");
const fs = require("fs-extra");
const solc = require("solc");

const buildPath = path.resolve(__dirname, "build");
fs.removeSync(buildPath);
console.log("Build folder deleted.");

const contractPath = path.resolve(__dirname, "contracts", "Campaign.sol");
const contractContent = fs.readFileSync(contractPath, "utf8");
const output = solc.compile(contractContent, 1).contracts;

fs.ensureDirSync(buildPath);
console.log("Build folder created.");

for (let contract in output) {
  fs.outputJSONSync(
    path.resolve(buildPath, contract.substring(1) + ".json"),
    output[contract]
  );
  console.log(`${contract.substring(1)}.json created in builds folder.`);
}
