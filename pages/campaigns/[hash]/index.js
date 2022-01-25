import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import getCampaign from "../../../ethereum/campaign";
import Layout from "../../../components/Layout";
import { Grid, Card, Button } from "semantic-ui-react";
import ContributeForm from "../../../components/ContributeForm";
import web3 from "../../../ethereum/web3";
import Link from "next/link";

const Campaign = ({ summary, campaignAddress }) => {
  const router = useRouter();
  const [items, setItems] = useState([]);
  const { minContribution, balance, numberRequests, numberApprovers, manager } =
    summary;
  useEffect(() => {
    setItems([
      {
        header: manager,
        meta: "Address of Manager",
        description: "Manager created the campaign in order to get funding",
        style: { overflowWrap: "break-word" },
      },
      {
        header: web3.utils.fromWei(balance, "ether") + " ether",
        meta: "Total Contribution",
        description: "Total contribution towards the project.",
        style: { overflowWrap: "break-word" },
      },
      {
        header: minContribution + " wei",
        meta: "Minimum Contribution",
        description: "Manager has set the min contribution to the project",
        style: { overflowWrap: "break-word" },
      },
      {
        header: numberApprovers,
        meta: "People Contributed",
        description: "People who have already contributed towards the cause",
        style: { overflowWrap: "break-word" },
      },
      {
        header: numberRequests,
        meta: "Number of Active Requests",
        description:
          "Manager has put the following requests in order to move ahead in the project",
        style: { overflowWrap: "break-word" },
      },
    ]);
  }, []);

  return (
    <Layout>
      <h3>Campaign Details</h3>
      <Grid columns={2} divided>
        <Grid.Row>
          <Grid.Column width={10}>
            <Card.Group items={items} />
          </Grid.Column>
          <Grid.Column width={6}>
            <ContributeForm router={router} address={campaignAddress} />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
            <Link href={`/campaigns/${campaignAddress}/requests`}>
              <a>
                <Button color="blue">Pending Requests</Button>
              </a>
            </Link>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Layout>
  );
};

export async function getServerSideProps(context) {
  const campaign = getCampaign(context.params.hash);
  const summary = await campaign.methods.getSummary().call();
  return {
    props: {
      summary: {
        minContribution: summary["0"],
        balance: summary["1"],
        numberRequests: summary["2"],
        numberApprovers: summary["3"],
        manager: summary["4"],
      },
      campaignAddress: context.params.hash,
    },
  };
}

export default Campaign;
