import React from "react";
import Form from "../Form";

const ERC20 = () => {
  return (
    <div className="card">
      <p className="card-header">1. Select network</p>
      <Form id="chainId" type="number" />
      <p>2. from Address</p>
      <Form id="chainId" type="number" />
      <p>3. to Address</p>
      <Form id="chainId" type="number" />
    </div>
  );
};

export default ERC20;
