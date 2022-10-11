import React from "react";
import Button from "./Button";

const Landing = ({ page, setPage }) => {
  return (
    <div className="text-center">
      <h3 className="text-lg">Select an option:</h3>
      <Button text="ETH Transfer" onClick={() => setPage("eth")} />
      <Button text="ERC20 Transfer" onClick={() => setPage("erc20")} />
      <Button text="ERC721 Transfer" onClick={() => setPage("erc721")} />
      <Button text="Contract interaction" onClick={() => setPage("contract")} />
      <h4>or</h4>
      <Button text="Sign generated tx" onClick={() => setPage("sign")} />
      <Button text="Import signed tx" onClick={() => setPage("import")} />
    </div>
  );
};

export default Landing;
