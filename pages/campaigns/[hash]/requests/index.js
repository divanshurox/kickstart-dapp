import React, { useEffect, useState } from "react";
import Layout from "../../../../components/Layout";
import getCampaign from "../../../../ethereum/campaign";
import { Table, Button } from "semantic-ui-react";
import RequestRow from "../../../../components/RequestRow";
import Link from "next/link";
import web3 from "../../../../ethereum/web3";
const requests = ({ hash, req: requests, manager }) => {
  const [account, setAccount] = useState(null);
  useEffect(() => {
    const init = async () => {
      try {
        const accounts = await web3.eth.getAccounts();
        setAccount(accounts[0]);
      } catch (e) {
        console.log(e);
      }
    };
    init();
  }, []);
  const { Header, HeaderCell, Row, Body } = Table;
  return (
    <Layout>
      {account === manager && (
        <Link href={`/campaigns/${hash}/requests/new`}>
          <a>
            <Button color="blue">Create Request</Button>
          </a>
        </Link>
      )}
      <Table celled>
        <Header>
          <Row>
            <HeaderCell>SNo.</HeaderCell>
            <HeaderCell>Description</HeaderCell>
            <HeaderCell>Amount</HeaderCell>
            <HeaderCell>Recipient</HeaderCell>
            <HeaderCell>Approval Count</HeaderCell>
            <HeaderCell>Approve</HeaderCell>
            <HeaderCell>Finalize</HeaderCell>
          </Row>
        </Header>
        <Body>
          {requests.map((request, i) => {
            return <RequestRow key={i} idx={i} request={request} />;
          })}
        </Body>
      </Table>
    </Layout>
  );
};

export async function getServerSideProps(context) {
  const { hash } = context.query;
  const campaign = getCampaign(hash);
  // cannot get appprovers count as of now
  // const approversCount = await campaign.methods.approversCount().call();
  const requestCount = parseInt(
    await campaign.methods.getRequestsCount().call()
  );
  const manager = await campaign.methods.manager().call();
  const requests = await Promise.all(
    Array(requestCount)
      .fill(1)
      .map((_, idx) => {
        return campaign.methods.requests(parseInt(idx)).call();
      })
  );
  const req = requests.map((ele) => {
    return {
      ...ele,
    };
  });
  return {
    props: {
      hash,
      req,
      manager,
    },
  };
}

export default requests;
