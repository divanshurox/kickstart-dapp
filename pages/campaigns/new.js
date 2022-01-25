import { useRouter } from "next/router";
import React, { useState } from "react";
import {
  Form,
  Checkbox,
  Button,
  Card,
  Input,
  Message,
} from "semantic-ui-react";
import Layout from "../../components/Layout";
import factory from "../../ethereum/factory";
import web3 from "../../ethereum/web3";

const NewCampaign = () => {
  const router = useRouter();
  const [minContrib, setMinContrib] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const onSubmitForm = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const accounts = await web3.eth.getAccounts();
      await factory.methods.createCampaign(minContrib).send({
        from: accounts[0],
      });
    } catch (e) {
      setError(e.message);
      setInterval(() => {
        setError(null);
      }, 2000);
    }
    setLoading(false);
    router.replace("/");
  };

  return (
    <Layout>
      <Card
        style={{
          padding: "20px 30px",
        }}
        fluid
      >
        <Form error onSubmit={onSubmitForm}>
          <Form.Field>
            <label>Minimum Contribution</label>
            <Input
              placeholder="Minimum Contribution"
              label="Wei"
              labelPosition="right"
              onChange={(e) => setMinContrib(e.target.value)}
            />
          </Form.Field>
          <Form.Field>
            <Checkbox label="I agree to the Terms and Conditions" />
          </Form.Field>
          {error && <Message error header="Oops!" content={error} />}
          <Button loading={loading} type="submit">
            kickSTART
          </Button>
        </Form>
      </Card>
    </Layout>
  );
};

export default NewCampaign;
