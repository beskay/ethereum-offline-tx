import React, { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { ethers } from "ethers";
import Form from "../Form";
import Button from "../Button";

interface pageProps {
  page: string;
  setPage: React.Dispatch<React.SetStateAction<string>>;
}

interface Transaction {
  to: string;
  from: string;
  nonce: number;
  gasLimit: number;
  data: ethers.BytesLike;
  value: ethers.BigNumber;
  chainId: number;
  type: 2;
  maxPriorityFeePerGas: ethers.BigNumber;
  maxFeePerGas: ethers.BigNumber;
}

const ETH = ({ page, setPage }: pageProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [provider, setProvider] = useState<ethers.providers.AlchemyProvider>();
  // transaction state
  const [toAddress, setToAddress] = useState("");
  const [fromAddress, setFromAddress] = useState("");
  const [nonce, setNonce] = useState(0);
  const [gasLimit, setGasLimit] = useState(21000);
  const [msgValue, setMsgValue] = useState(0);
  const [chain, setChain] = useState(0);
  const [priorityFee, setPriorityFee] = useState(0);
  const [maxFee, setMaxFee] = useState(0);

  // define transaction
  let transaction: Transaction = {
    to: `${toAddress}`,
    from: `${fromAddress}`,
    nonce: nonce,
    gasLimit: gasLimit,
    data: "",
    value: ethers.utils.parseEther(`${msgValue}`),
    chainId: chain,
    type: 2,
    maxPriorityFeePerGas: ethers.utils.parseUnits(`${priorityFee}`, "gwei"),
    maxFeePerGas: ethers.utils.parseUnits(`${maxFee}`, "gwei"),
  };

  const handleChain = async (chainId: string) => {
    // update state
    setChain(Number(chainId));

    try {
      // connect to provider
      // supported networks: 1 = homestead, 5 = goerli, 10 = optimism, 137 = matic, 42161 = arbitrum, 80001 = maticmum
      const provider = new ethers.providers.AlchemyProvider(
        Number(chainId),
        process.env.REACT_APP_ALCHEMY_API_KEY
      );
      setProvider(provider);

      // set fee data
      const feeData = await provider.getFeeData();

      // divide by 1 000 000 000 to convert to gwei
      setPriorityFee(Number(feeData.maxPriorityFeePerGas) / 1000_000_000);
      setMaxFee(Number(feeData.maxFeePerGas) / 1000_000_000);
    } catch (e: any) {
      console.log("error, ", e.message);
      console.log(
        "supported networks: 1 = homestead, 5 = goerli, 10 = optimism, 137 = matic, 42161 = arbitrum, 80001 = maticmum"
      );
    }
  };

  const handleFromAddress = async (value: string) => {
    // update state
    setFromAddress(value);

    if (provider != undefined) {
      // set nonce
      let nonce: number = await provider.getTransactionCount(value);
      setNonce(nonce);
      console.log("nonce", nonce);
    } else {
      console.log("cant set nonce, provider not set or unsupported");
    }
  };

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
            onChange={handleChain}
          />
          <p>2. from Address (your cold wallet)</p>
          <Form
            type="text"
            placeholder="0x1234...abcd"
            value={fromAddress}
            onChange={handleFromAddress}
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
          <p>5. Nonce</p>
          <Form
            type="number"
            placeholder=""
            value={nonce}
            onChange={setNonce}
          />
          <p>6. Gas limit</p>
          <Form
            type="number"
            placeholder=""
            value={gasLimit}
            onChange={setGasLimit}
          />
          <p>7. Max priority fee (in Gwei)</p>
          <Form
            type="number"
            placeholder=""
            value={priorityFee}
            onChange={setPriorityFee}
          />
          <p>8. Max fee (in Gwei)</p>
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
