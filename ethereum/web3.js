import Web3 from "web3";

let web3;

if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
  window.ethereum.request({ method: "eth_requestAccounts" });
  web3 = new Web3(window.ethereum);
} else {
  const provider = new Web3.providers.HttpProvider(
    "https://rinkeby.infura.io/v3/bc9645c89d7c408da28a4cd3b84b91c3"
  );
  web3 = new Web3(provider);
}

export default web3;
