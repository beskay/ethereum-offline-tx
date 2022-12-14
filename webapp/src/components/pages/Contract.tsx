import React from "react";
import Form from "../Form";
import Button from "../Button";

interface pageProps {
  page: string;
  setPage: React.Dispatch<React.SetStateAction<string>>;
}

const Contract = ({ page, setPage }: pageProps) => {
  return (
    <div>
      {" "}
      <p className="text-xl text-center mb-4"> Work in progress</p>
      <Button text="Back" onClick={() => setPage("landing")} />
    </div>
  );
};

export default Contract;
