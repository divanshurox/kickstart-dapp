const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");
const { beforeEach } = require("mocha");

const web3 = new Web3(ganache.provider());

const campaignFactoryCompiled = require("../ethereum/build/CampaignFactory.json");
const campaignCompiled = require("../ethereum/build/Campaign.json");

let accounts;
let campaignFactory;
let campaignAddress;
let campaign;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();

  campaignFactory = await new web3.eth.Contract(
    JSON.parse(campaignFactoryCompiled.interface)
  )
    .deploy({ data: campaignFactoryCompiled.bytecode })
    .send({ from: accounts[0], gas: "1000000" });

  await campaignFactory.methods.createCampaign("100").send({
    from: accounts[0],
    gas: "1000000",
  });

  [campaignAddress] = await campaignFactory.methods.getCampaigns().call();

  campaign = await new web3.eth.Contract(
    JSON.parse(campaignCompiled.interface),
    campaignAddress
  );
});

describe("Campaigns", async () => {
  it("deploys a campaign and factory", () => {
    assert.ok(campaign.options.address);
    assert.ok(campaignFactory.options.address);
  });

  it("should set the manager", async () => {
    const manager = await campaign.methods.manager().call();
    assert.equal(accounts[0], manager);
  });

  it("should add an account as a contributor", async () => {
    await campaign.methods.contribute().send({
      from: accounts[1],
      value: "200",
    });
    const isApprover = await campaign.methods.approvers(accounts[1]).call();
    assert(isApprover);
  });

  it("requires a minimum contribution", async () => {
    try {
      await campaign.methods.contribute().send({
        from: accounts[1],
        value: "50",
      });
      assert(false);
    } catch (e) {
      assert(e);
    }
  });

  it("should let manager create a request", async () => {
    await campaign.methods
      .createRequest("Buy materials", "100", accounts[1])
      .send({
        from: accounts[0],
        gas: "1000000",
      });
    const latestRequest = await campaign.methods.requests(0).call();
    assert.equal("Buy materials", latestRequest.description);
  });

  it("one end-to-end test", async () => {
    let balance = await web3.eth.getBalance(accounts[4]);
    balance = web3.utils.fromWei(balance, "ether");
    balance = parseFloat(balance);
    console.log(balance);

    // contribute to the campaign
    for (let i = 1; i <= 3; i++) {
      await campaign.methods.contribute().send({
        from: accounts[i],
        value: web3.utils.toWei("10", "ether"),
      });
    }
    // create a request by the manager
    await campaign.methods
      .createRequest(
        "Buy materials",
        web3.utils.toWei("5", "ether"),
        accounts[4]
      )
      .send({
        from: accounts[0],
        gas: "1000000",
      });
    let req = await campaign.methods.requests(0).call();
    // approve the request by the contributors
    for (let i = 1; i <= 2; i++) {
      await campaign.methods.approveRequest(0).send({
        from: accounts[i],
        gas: "1000000",
      });
    }
    // finalize the request to transfer the money to the recipient
    await campaign.methods.finalizeRequest(0).send({
      from: accounts[0],
      gas: "1000000",
    });
    // check is the transfer of money takes place
    balance = await web3.eth.getBalance(accounts[4]);
    balance = web3.utils.fromWei(balance, "ether");
    balance = parseFloat(balance);
    console.log(balance);

    req = await campaign.methods.requests(0).call();
    assert.equal(true, req.complete);
  });
});
