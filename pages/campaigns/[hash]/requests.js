import React, { useEffect, useState } from "react";
import Layout from "../../../components/Layout";
import getCampaign from "../../../ethereum/campaign";

const requests = ({ hash }) => {
  const [requests, setRequests] = useState(null);
  //   useEffect(() => {
  //     const fetchRequests = async () => {};
  //     fetchRequests();
  //   }, []);
  console.log(requests);
  return <Layout></Layout>;
};

export async function getServerSideProps(context) {
  const { hash } = context.query;
  const campaign = getCampaign(hash);
  const requestCount = await campaign.methods.getRequestsCount().call();
  const requests = await Promise.all(
    Array(requestCount)
      .fill()
      .map((_, idx) => {
        return campaign.methods.requests(parseInt(idx)).call();
      })
  );
  console.log(requests);
  return {
    props: {
      hash,
      requests,
    },
  };
}

export default requests;
