import React from "react";
import Form from "../Form";
import Button from "../Button";

const ERC721 = ({ page, setPage }) => {
  return (
    <div>
      {" "}
      <p className="text-xl text-center mb-4"> Work in progress</p>
      <Button text="Back" onClick={() => setPage("landing")} />
    </div>
  );
};

export default ERC721;
