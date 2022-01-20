const HDWalletProvider = require("@truffle/hdwallet-provider");
const Web3 = require("web3");
const campaignFactoryCompiled = require("./build/CampaignFactory.json");

const provider = new HDWalletProvider(
  "evil happy cost tail minimum traffic veteran usual fatal churn child adjust",
  "https://rinkeby.infura.io/v3/bc9645c89d7c408da28a4cd3b84b91c3"
);

const web3 = new Web3(provider);

let accounts;
let campaignFactory;

const deploy = async () => {
  accounts = await web3.eth.getAccounts();

  campaignFactory = await new web3.eth.Contract(
    JSON.parse(campaignFactoryCompiled.interface)
  )
    .deploy({ data: campaignFactoryCompiled.bytecode })
    .send({ from: accounts[0], gas: "1000000" });

  console.log(campaignFactory.options.address);
};
deploy();
