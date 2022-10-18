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
  const [msgValue, setMsgValue] = useState(0);
  const [nonce, setNonce] = useState("");
  const [gasLimit, setGasLimit] = useState(21000);
  const [priorityFee, setPriorityFee] = useState(0);
  const [maxFee, setMaxFee] = useState(0);

  // define transaction
  let transaction = {
    from: `${fromAddress}`,
    to: `${toAddress}`,
    value: ethers.utils.parseEther(`${msgValue}`),
    data: "",
    gasLimit: `${gasLimit}`,
    maxPriorityFeePerGas: ethers.utils.parseUnits(`${priorityFee}`, "gwei"),
    maxFeePerGas: ethers.utils.parseUnits(`${maxFee}`, "gwei"),
    nonce: `${nonce}`,
    type: 2,
    chainId: `${chain}`,
  };

  async function initProvider(value: string) {
    setChain(value);

    // check if supported network
    // 1 = homestead, 5 = goerli, 10 = optimism, 137 = matic, 42161 = arbitrum, 80001 = maticmum
    if (
      !(
        value === "1" ||
        value === "5" ||
        value === "10" ||
        value === "137" ||
        value === "42161" ||
        value === "80001"
      )
    )
      return 0;

    // connect to provider
    const provider = new ethers.providers.AlchemyProvider(Number(value));
    console.log(provider);
    // set fee data
    getFeeData(provider);
  }

  async function getFeeData(provider: any) {
    const feeData = await provider.getFeeData();

    // divide by 1 000 000 000 to convert to gwei
    let factor = 1000000000;

    setPriorityFee(feeData.maxPriorityFeePerGas / factor);
    setMaxFee(feeData.maxFeePerGas / factor);
  }

  async function initFromAddress(value: string) {
    setFromAddress(value);
    console.log(fromAddress);

    // connect to provider
    const provider = new ethers.providers.AlchemyProvider(Number(chain));

    // set nonce
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
            id="downloadJson"
            href={`data:text/json;charset=utf-8,${encodeURIComponent(
              JSON.stringify(transaction)
            )}`}
          >
            <Button
              text="Download json"
              onClick={() => {
                document
                  .getElementById("downloadJson")
                  ?.setAttribute("download", `${Date.now()}.json`);
              }}
            />
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
