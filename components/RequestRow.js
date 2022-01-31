import React, { useState } from "react";
import { Button, Table } from "semantic-ui-react";
import getCampaign from "../ethereum/campaign";
import web3 from "../ethereum/web3";

const RequestColumn = ({
  idx,
  request,
  approversCount,
  hash,
  setError,
  account,
  manager,
}) => {
  const { Row, Cell } = Table;
  const [loading, setLoading] = useState(false);
  const onApproveRequest = async () => {
    const campaign = getCampaign(hash);
    const accounts = await web3.eth.getAccounts();
    try {
      setLoading(true);
      await campaign.methods.approveRequest(idx).send({
        from: accounts[0],
      });
    } catch (e) {
      console.log(e);
      setError(true);
    }
    setLoading(false);
  };
  const onFinalizeRequest = async () => {
    const campaign = getCampaign(hash);
    try {
      setLoading(true);
      await campaign.methods.finalizeRequest(idx).send({
        from: account,
      });
    } catch (e) {
      setError(true);
    }
    setLoading(false);
  };
  return (
    <Row textAlign="center">
      <Cell>{idx + 1}.</Cell>
      <Cell>{request.description}</Cell>
      <Cell>{web3.utils.fromWei(request.value, "ether")}</Cell>
      <Cell singleLine textAlign="left">
        {request.recipient}
      </Cell>
      <Cell>
        {request.approvalCount}/{approversCount}
      </Cell>
      {/* {account !== manager && ( */}
      <Cell>
        <Button loading={loading} onClick={onApproveRequest} color="green">
          Approve
        </Button>
      </Cell>
      {/* )} */}
      {account === manager && (
        <Cell>
          <Button
            loading={loading}
            onClick={onFinalizeRequest}
            color="google plus"
          >
            Finalize
          </Button>
        </Cell>
      )}
    </Row>
  );
};

export default RequestColumn;
