import { useState } from "react";
import Landing from "./components/pages/Landing";
import ETH from "./components/pages/ETH";
import ERC20 from "./components/pages/ERC20";
import ERC721 from "./components/pages/ERC721";
import Contract from "./components/pages/Contract";
import Sign from "./components/pages/Sign";
import Import from "./components/pages/Import";

function App() {
  const [page, setPage] = useState("landing");

  return (
    <div className="container grid h-screen place-items-center mx-auto text-white">
      {page === "landing" && <Landing page={page} setPage={setPage} />}
      {page === "eth" && <ETH page={page} setPage={setPage} />}
      {page === "erc20" && <ERC20 page={page} setPage={setPage} />}
      {page === "erc721" && <ERC721 page={page} setPage={setPage} />}{" "}
      {page === "contract" && <Contract page={page} setPage={setPage} />}{" "}
      {page === "sign" && <Sign page={page} setPage={setPage} />}{" "}
      {page === "import" && <Import page={page} setPage={setPage} />}
    </div>
  );
}

export default App;
