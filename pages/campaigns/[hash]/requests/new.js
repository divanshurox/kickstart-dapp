import React, { useState } from "react";
import { Form, Input, Card, Button, Message } from "semantic-ui-react";
import Layout from "../../../../components/Layout";
import getCampaign from "../../../../ethereum/campaign";
import web3 from "../../../../ethereum/web3";
import { useRouter } from "next/router";

const NewRequest = ({ hash }) => {
  const [formData, setFormData] = useState({
    desc: "",
    recipient: "",
    amount: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();
  const onFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const campaign = getCampaign(hash);
    const summary = await campaign.methods.getSummary().call();
    const campaignBalance = web3.utils.fromWei(summary["1"], "ether");
    if (campaignBalance < formData.amount) {
      setError({
        msg: "Requested amount more than total campaign balance.",
      });
      return;
    }
    try {
      const accounts = await web3.eth.getAccounts();
      await campaign.methods
        .createRequest(
          formData.desc,
          web3.utils.toWei(formData.amount, "ether"),
          formData.recipient
        )
        .send({
          from: accounts[0],
        });
      setLoading(false);
      router.push(`/campaigns/${hash}/requests`);
    } catch (e) {
      setError(e);
    }
  };
  return (
    <Layout>
      <Card
        style={{
          padding: "20px 30px",
        }}
        fluid
      >
        <Form error onSubmit={onFormSubmit}>
          <Form.Field>
            <label>Description</label>
            <Input
              placeholder="Describe your Request"
              onChange={(e) =>
                setFormData((prev) => {
                  return {
                    ...prev,
                    desc: e.target.value,
                  };
                })
              }
            />
          </Form.Field>
          <Form.Field error={error !== null}>
            <label>Amount</label>
            <Input
              placeholder="Amount"
              label="ether"
              labelPosition="right"
              onChange={(e) =>
                setFormData((prev) => {
                  return {
                    ...prev,
                    amount: e.target.value,
                  };
                })
              }
            />
            {error && <Message error content={error.msg} />}
          </Form.Field>
          <Form.Field>
            <label>Recipient</label>
            <Input
              placeholder="Recipient"
              onChange={(e) =>
                setFormData((prev) => {
                  return {
                    ...prev,
                    recipient: e.target.value,
                  };
                })
              }
            />
          </Form.Field>
          <Button loading={loading} color="blue" type="submit">
            Create Request
          </Button>
        </Form>
      </Card>
    </Layout>
  );
};

export async function getServerSideProps(context) {
  const { hash } = context.query;
  return {
    props: {
      hash,
    },
  };
}

export default NewRequest;
