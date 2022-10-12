import { useState } from "react";
import Landing from "./components/pages/Landing";
import ERC20 from "./components/pages/ERC20";
import ETH from "./components/pages/ETH";

function App() {
  const [page, setPage] = useState("landing");

  return (
    <div className="container grid h-screen place-items-center mx-auto text-white">
      {page === "landing" && <Landing page={page} setPage={setPage} />}
      {page === "eth" && <ETH page={page} setPage={setPage} />}
      {page === "erc20" && <ERC20 page={page} setPage={setPage} />}
    </div>
  );
}

export default App;
