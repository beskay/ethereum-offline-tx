import React from "react";
import Form from "../Form";
import Button from "../Button";

const ETH = ({ page, setPage }) => {
  return (
    <div className="card max-w-2xl m-4 md:mx-auto">
      <p className="card-header px-2 text-lg">ETH Transfer</p>
      <div className="p-4">
        <p>1. Input chainId</p>
        <Form id="chainId" type="number" placeholder="e.g. 1 for mainnet" />
        <p>2. from Address (e.g. your cold wallet)</p>
        <Form id="from" type="text" />
        <p>3. to Address</p>
        <Form id="to" type="text" />
        <p>4. Amount to send (in ETH)</p>
        <Form id="amnt" type="number" />
        <p>5. Gas limit</p>
        <Form id="gaslimit" type="number" />
        <p>6. Max priority fee (in Gwei)</p>
        <Form id="priority" type="number" />
        <p>7. Max fee (in Gwei)</p>
        <Form id="maxfee" type="number" />
        <div className="flex justify-start">
          <Button text="Back" onClick={() => setPage("landing")} />
          <Button text="Check tx" />
        </div>
      </div>
    </div>
  );
};

export default ETH;
