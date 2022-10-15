import React, { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { ethers } from "ethers";
import Form from "../Form";
import Button from "../Button";

interface pageProps {
  page: string;
  setPage: React.Dispatch<React.SetStateAction<string>>;
}

const ETH = ({ page, setPage }: pageProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [chain, setChain] = useState("");
  const [fromAddress, setFromAddress] = useState("");
  const [toAddress, setToAddress] = useState("");
  const [msgValue, setMsgValue] = useState("");
  const [nonce, setNonce] = useState("");
  const [gasLimit, setGasLimit] = useState("21000");
  const [priorityFee, setPriorityFee] = useState("");
  const [maxFee, setMaxFee] = useState("");

  // define transaction
  let transaction = {
    to: { toAddress },
    value: { msgValue },
    data: "",
    gasLimit: { gasLimit },
    maxPriorityFeePerGas: { priorityFee },
    maxFeePerGas: { maxFee },
    nonce: { nonce },
    type: 2,
    chainId: { chain },
  };

  async function initProvider(value: string) {
    setChain(value);

    let name;
    if (value === "1") name = "homestead";
    else if (value === "5") name = "goerli";
    else if (value === "137") name = "matic";
    else if (value === "80001") name = "maticmum";
    else if (value === "10") name = "optimism";
    else if (value === "42161") name = "arbitrum";
    else return;

    // connect to provider
    const provider = new ethers.providers.AlchemyProvider(name);
    console.log(provider);
    //let block = await provider.getBlock(15733249);
    //console.log("block ", block);

    getFeeData(provider);
  }

  async function getFeeData(provider: any) {
    const feeData = await provider.getFeeData();

    setPriorityFee(
      (feeData.maxPriorityFeePerGas.toNumber() / 1000000000).toString()
    );
    setMaxFee((feeData.maxFeePerGas.toNumber() / 1000000000).toString());
  }

  async function initFromAddress(value: string) {
    setFromAddress(value);
    console.log(fromAddress);
    // connect to provider
    const provider = new ethers.providers.AlchemyProvider(Number(chain));

    let nonce = await provider.getTransactionCount(value);
    setNonce(nonce.toString());
    console.log("nonce", nonce);
  }

  return (
    <div className="card w-full max-w-xl m-4">
      <p className="card-header px-2 text-lg">ETH Transfer</p>
      {currentStep === 1 && (
        <div className="p-4">
          <p>1. Input chainId (e.g. 1 for mainnet)</p>
          <Form
            type="number"
            placeholder="1"
            value={chain}
            onChange={initProvider}
          />
          <p>2. from Address (your cold wallet)</p>
          <Form
            type="text"
            placeholder="0x1234...abcd"
            value={fromAddress}
            onChange={initFromAddress}
          />
          <p>3. to Address</p>
          <Form
            type="text"
            placeholder="0x5678...efgh"
            value={toAddress}
            onChange={setToAddress}
          />
          <p>4. Amount to send (in ETH)</p>
          <Form
            type="number"
            placeholder="0.01"
            value={msgValue}
            onChange={setMsgValue}
          />
          <p>5. Gas limit</p>
          <Form
            type="number"
            placeholder=""
            value={gasLimit}
            onChange={setGasLimit}
          />
          <p>6. Max priority fee (in Gwei)</p>
          <Form
            type="number"
            placeholder=""
            value={priorityFee}
            onChange={setPriorityFee}
          />
          <p>7. Max fee (in Gwei)</p>
          <Form
            type="number"
            placeholder=""
            value={maxFee}
            onChange={setMaxFee}
          />
          <div className="flex justify-start">
            <Button text="Back" onClick={() => setPage("landing")} />
            <Button
              text="Next"
              onClick={() => {
                setCurrentStep(2);
              }}
            />
          </div>
        </div>
      )}

      {currentStep === 2 && (
        <div className="p-4">
          <p>1. Download the generated .json File</p>
          <a
            href={`data:text/json;charset=utf-8,${encodeURIComponent(
              JSON.stringify(transaction)
            )}`}
            download="tx.json"
          >
            <Button text="Download json" onClick={() => {}} />
          </a>
          <p className="mt-6">2. Or scan the generated QR code</p>
          <QRCodeSVG value={JSON.stringify(transaction)} className="m-4" />
          <div className="flex justify-start">
            <Button text="Back" onClick={() => setCurrentStep(1)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ETH;
