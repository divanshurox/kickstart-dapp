import { loadGetInitialProps } from "next/dist/shared/lib/utils";
import React, { useState, useEffect } from "react";
import factory from "../ethereum/factory";
import { Button, Container, Card } from "semantic-ui-react";
import Layout from "../components/Layout";
import { useRouter } from "next/router";
import Link from "next/link";

const Index = ({ campaigns }) => {
  const router = useRouter();
  const [items, setItems] = useState(null);
  useEffect(() => {
    setItems(
      campaigns.map((ele) => {
        return {
          header: ele,
          description: (
            <Link href={`/campaigns/${ele}`}>
              <a>View Campaign</a>
            </Link>
          ),
          fluid: true,
        };
      })
    );
  }, []);
  console.log(items);
  return (
    <Layout>
      <h3>Open Campaigns</h3>
      <Button
        floated="right"
        content="Create Campaign"
        icon="add"
        primary
        onClick={() => {
          router.push("/campaigns/new");
        }}
      />
      <Card.Group items={items} />
    </Layout>
  );
};

export async function getServerSideProps() {
  const campaigns = await factory.methods.getCampaigns().call();
  return {
    props: {
      campaigns,
    },
  };
}

export default Index;
