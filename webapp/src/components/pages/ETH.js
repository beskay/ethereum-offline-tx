import React from "react";
import Form from "../Form";
import Button from "../Button";

import { initProvider } from "../../helper/generateTX";

const ETH = ({ page, setPage }) => {
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
        <Form id="priority" type="number" />
        <p>7. Max fee (in Gwei)</p>
        <Form id="maxfee" type="number" />
        <div className="flex justify-start">
          <Button text="Back" onClick={() => setPage("landing")} />
          <Button text="Next" />
        </div>
      </div>
    </div>
  );
};

export default ETH;
