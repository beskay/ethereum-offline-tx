import React from "react";
import Button from "../Button";
import Header from "../Header";
import Footer from "../Footer";

interface pageProps {
  page: string;
  setPage: React.Dispatch<React.SetStateAction<string>>;
}

const Landing = ({ page, setPage }: pageProps) => {
  return (
    <div className="text-center">
      <Header />
      <h3 className="text-xl mb-2">What do you want to do?</h3>
      <Button text="ETH Transfer" onClick={() => setPage("eth")} />
      <Button text="ERC20 Transfer" onClick={() => setPage("erc20")} />
      <Button text="ERC721 Transfer" onClick={() => setPage("erc721")} />
      <Button text="Contract interaction" onClick={() => setPage("contract")} />
      <h4 className="text-xl my-1">or</h4>
      <Button text="Sign generated tx" onClick={() => setPage("sign")} />
      <Button text="Import signed tx" onClick={() => setPage("import")} />
      <Footer />
    </div>
  );
};

export default Landing;
