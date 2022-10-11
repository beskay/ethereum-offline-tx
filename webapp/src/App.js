import { useState } from "react";
import Landing from "./components/Landing";
import ERC20 from "./components/pages/ERC20";
import ETH from "./components/pages/ETH";

function App() {
  const [page, setPage] = useState("landing");

  return (
    <div className="container mx-auto text-white mt-40">
      <h1 className="text-4xl text-center">Ethereum Offline TX</h1>
      {page === "landing" && <Landing page={page} setPage={setPage} />}
      {page === "eth" && <ETH page={page} setPage={setPage} />}
      {page === "erc20" && <ERC20 page={page} setPage={setPage} />}
    </div>
  );
}

export default App;
