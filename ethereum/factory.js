import web3 from "./web3";
import factoryCompiled from "./build/CampaignFactory.json";

const contract = new web3.eth.Contract(
  JSON.parse(factoryCompiled.interface),
  "0x96817B1F4f1b2CE1dE5eB12e3B12c393a80420d7"
);

export default contract;
