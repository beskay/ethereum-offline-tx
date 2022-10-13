import { ethers } from "ethers";

import React, { useState } from "react";
import Form from "../Form";
import Button from "../Button";

const ETH = ({ page, setPage }) => {
  const [chain, setChain] = useState();
  const [fromAddress, setFromAddress] = useState();
  const [toAddress, setToAddress] = useState();
  const [msgValue, setMsgValue] = useState();
  const [gasLimit, setGasLimit] = useState(21000);
  const [priorityFee, setPriorityFee] = useState();
  const [maxFee, setMaxFee] = useState();

  let provider;
  async function initProvider(value) {
    let name;

    if (value == 1) name = "homestead";
    else if (value == 5) name = "goerli";
    else if (value == 137) name = "matic";
    else if (value == 80001) name = "maticmum";
    else if (value == 10) name = "optimism";
    else if (value == 42161) name = "arbitrum";
    else return;

    // connect to provider
    provider = new ethers.providers.AlchemyProvider(name);
    //let block = await provider.getBlock(15733249);
    //console.log("block ", block);

    getFeeData();
  }

  async function getFeeData() {
    const feeData = await provider.getFeeData();

    setPriorityFee(feeData.maxPriorityFeePerGas.toNumber() / 1000000000);
    setMaxFee(feeData.maxFeePerGas.toNumber() / 1000000000);
  }

  return (
    <div className="card w-full max-w-xl m-4">
      <p className="card-header px-2 text-lg">ETH Transfer</p>
      <div className="p-4">
        <p>1. Input chainId (e.g. 1 for mainnet)</p>
        <Form
          id="chainId"
          type="number"
          placeholder="1"
          onChange={initProvider}
        />
        <p>2. from Address (your cold wallet)</p>
        <Form id="from" type="text" placeholder="0x1234...abcd" />
        <p>3. to Address</p>
        <Form id="to" type="text" placeholder="0x5678...efgh" />
        <p>4. Amount to send (in ETH)</p>
        <Form id="amnt" type="number" placeholder="0.01" />
        <p>5. Gas limit</p>
        <Form id="gaslimit" type="number" value="21000" />
        <p>6. Max priority fee (in Gwei)</p>
        <Form id="priority" type="number" value={priorityFee} />
        <p>7. Max fee (in Gwei)</p>
        <Form id="maxfee" type="number" value={maxFee} />
        <div className="flex justify-start">
          <Button text="Back" onClick={() => setPage("landing")} />
          <Button text="Next" />
        </div>
      </div>
    </div>
  );
};

export default ETH;
