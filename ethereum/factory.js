import web3 from "./web3";
import factoryCompiled from "./build/CampaignFactory.json";

const contract = new web3.eth.Contract(
  JSON.parse(factoryCompiled.interface),
  "0x9C8A698E94E503AdF642B8A383e303fd91783938"
);

export default contract;
