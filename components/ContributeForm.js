import React, { useState, useEffect } from "react";
import { Form, Button, Input, Message } from "semantic-ui-react";
import web3 from "../ethereum/web3";
import getCampaign from "../ethereum/campaign";

const ContributeForm = ({ address, router }) => {
  const [contributeWei, setContributeWei] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const onSubmitForm = async (e) => {
    e.preventDefault();
    const campaign = getCampaign(address);
    setLoading(true);
    try {
      const accounts = await web3.eth.getAccounts();
      await campaign.methods.contribute().send({
        from: accounts[0],
        value: web3.utils.toWei(contributeWei, "ether"),
      });
    } catch (e) {
      setError(e);
      setInterval(() => {
        setError(null);
      }, 2000);
    }
    setLoading(false);
    router.reload();
  };
  return (
    <Form error onSubmit={onSubmitForm}>
      <Form.Field>
        <label>Minimum Contribution</label>
        <Input
          placeholder="Contribution"
          label="ether"
          labelPosition="right"
          onChange={(e) => setContributeWei(e.target.value)}
        />
      </Form.Field>
      {error && <Message error header="Oops!" content={error} />}
      <Button loading={loading} type="submit" color="blue">
        Contribute
      </Button>
    </Form>
  );
};

export default ContributeForm;
