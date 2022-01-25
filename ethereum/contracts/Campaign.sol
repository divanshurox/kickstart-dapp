pragma solidity ^0.4.17;

contract CampaignFactory{
    address[] public campaigns;

    function createCampaign(uint minimum) public {
        address campaign = new Campaign(msg.sender,minimum);
        campaigns.push(campaign);
    }

    function getCampaigns() public view returns (address[]) {
        return campaigns;
    }
}

contract Campaign{
    struct Request {
        string description;
        uint value;
        address recipient;
        bool complete;
        mapping(address => bool) approvals;
        uint approvalCount;
    }

    address public manager;
    uint public minContribution;
    Request[] public requests;
    mapping(address => bool) public approvers;
    uint approversCount;

    modifier restricted() {
        require(msg.sender == manager);
        _;
    }

    modifier approver() {
        require(msg.sender != manager && approvers[msg.sender]);
        _;
    }

    function Campaign(address creator, uint minContrib) public {
        manager = creator;
        minContribution = minContrib;
        approversCount = 0;
    }

    function contribute() public payable {
        require(msg.value >= minContribution);
        approvers[msg.sender] = true;
        approversCount++;
    }

    function createRequest(string des,uint val,address reciever) public restricted {
        Request memory r = Request({
            description: des,
            value: val,
            recipient: reciever,
            complete: false,
            approvalCount: 0
        });
        requests.push(r);
    }

    function approveRequest(uint idx) public approver {
        require(!requests[idx].approvals[msg.sender]);
        Request storage latestRequest = requests[idx];
        latestRequest.approvals[msg.sender]=true;
        latestRequest.approvalCount++;  
    } 

    function finalizeRequest(uint idx) public restricted {
        Request storage req = requests[idx];
        require(!req.complete);
        require(req.approvalCount > (approversCount/2));
        req.recipient.transfer(req.value);
        req.complete = true;
    }

    function getSummary() public view returns (
        uint,
        uint,
        uint,
        uint,
        address
    ) {
        return (
            minContribution,
            this.balance,
            requests.length,
            approversCount,
            manager
        );
    }

    function getRequestsCount() public view returns (uint) {
        return requests.length;
    }
}