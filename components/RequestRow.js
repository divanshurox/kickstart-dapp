import React from "react";
import { Button, Table } from "semantic-ui-react";
import getCampaign from "../ethereum/campaign";
import web3 from "../ethereum/web3";

const RequestColumn = ({ idx, request }) => {
  const { Row, Cell } = Table;
  return (
    <Row textAlign="center">
      <Cell>{idx + 1}.</Cell>
      <Cell>{request.description}</Cell>
      <Cell>{web3.utils.fromWei(request.value, "ether")}</Cell>
      <Cell singleLine textAlign="left">
        {request.recipient}
      </Cell>
      <Cell>{request.approvalCount}</Cell>
      <Cell>
        <Button color="green">Approve</Button>
      </Cell>
      <Cell>
        <Button color="google plus">Finalize</Button>
      </Cell>
    </Row>
  );
};

export default RequestColumn;
