const assert = require("assert");
const mocha = require("mocha");
const ganache = require("ganache-cli");
const Web3 = require("web3");
const { beforeEach } = require("mocha");

const web3 = Web3(ganache.provider());

const {
  campaignFactoryInterface,
  campaignFactoryBytecode,
} = require("../ethereum/build/CampaignFactory.json");
const {
  campaignInterface,
  campaignBytecode,
} = require("../ethereum/build/Campaign.json");

let accounts;
let campaignFactory;
let campaignAddress;
let campaign;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();

  campaignFactory = await web3.eth
    .Contract(JSON.parse(campaignFactoryInterface))
    .deploy({ data: campaignFactoryBytecode })
    .send({ from: accounts[0], gas: "1000000" });

  await campaignFactory.methods.createCampaign("100").send({
    from: accounts[0],
    gas: "1000000",
  });

  [campaignAddress] = await campaignFactory.methods.getCampaigns().call();

  campaign = await new web3.eth.Contract(
    JSON.parse(campaignInterface),
    campaignAddress
  );
});
