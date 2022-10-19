import React, { useState } from "react";
import { QrReader } from "react-qr-reader";
import { ethers } from "ethers";
import Button from "../Button";

interface pageProps {
  page: string;
  setPage: React.Dispatch<React.SetStateAction<string>>;
}

interface Transaction {
  from: string;
  to: string;
  value: { type: string; hex: string };
  data: string;
  gasLimit: string;
  maxPriorityFeePerGas: { type: string; hex: string };
  maxFeePerGas: { type: string; hex: string };
  nonce: string;
  type: 2;
  chainId: string;
}

interface SignedTransaction {
  signedTx: string;
  initialTx: Transaction;
}

const Import = ({ page, setPage }: pageProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<SignedTransaction>();

  const readFileOnUpload = (uploadedFile: any) => {
    const fileReader = new FileReader();
    fileReader.onloadend = () => {
      try {
        setData(JSON.parse(fileReader.result as string));
        console.log(JSON.parse(fileReader.result as string));
      } catch (e) {
        console.log("**Not valid JSON file!**");
      }
    };
    if (uploadedFile !== undefined) fileReader.readAsText(uploadedFile);
  };

  const handleQRcode = (result: string) => {
    setData(JSON.parse(result));
    console.log(JSON.parse(result));
  };

  const sendTransaction = async () => {
    let chain = data?.initialTx.chainId;
    // check if supported network
    // 1 = homestead, 5 = goerli, 10 = optimism, 137 = matic, 42161 = arbitrum, 80001 = maticmum
    if (
      !(
        chain === "1" ||
        chain === "5" ||
        chain === "10" ||
        chain === "137" ||
        chain === "42161" ||
        chain === "80001"
      )
    )
      return 0;

    // connect to provider
    const provider = new ethers.providers.AlchemyProvider(Number(chain));

    // send tx
    const tx = await provider.sendTransaction(`${data?.signedTx}`);
    console.log(tx);
    alert(`Success! Tx hash: ${tx.hash}`);
  };

  return (
    <div className="card w-full max-w-xl m-4">
      <p className="card-header px-2 text-lg">Signing transaction</p>{" "}
      {currentStep === 1 && (
        <div className="p-4">
          <p>1. Upload the signed .json File</p>
          <input
            type="file"
            onChange={(e: any) => readFileOnUpload(e.target.files[0])}
          />
          <p className="mt-6">2. Or scan the generated QR code</p>
          {/* @ts-ignore */}
          <QrReader
            onResult={(result, error) => {
              if (!!result) {
                handleQRcode(result.getText());
              }

              if (!!error) {
                //console.info(error);
              }
            }}
          />
          <div className="flex justify-start">
            <Button text="Back" onClick={() => setPage("landing")} />
            <Button text="Next" onClick={() => setCurrentStep(2)} />
          </div>
        </div>
      )}
      {currentStep === 2 && (
        <div className="p-4">
          <p>Transaction to send:</p>
          {JSON.stringify(
            {
              from: data?.initialTx.from,
              to: data?.initialTx.to,
              "value (in wei)": Number(data?.initialTx.value.hex),
              data: data?.initialTx.data,
              gasLimit: data?.initialTx.gasLimit,
              "maxPriorityFeePerGas (in wei)": Number(
                data?.initialTx.maxPriorityFeePerGas.hex
              ),
              "maxFeePerGas (in wei)": Number(data?.initialTx.maxFeePerGas.hex),
              nonce: data?.initialTx.nonce,
              type: 2,
              chainId: data?.initialTx.chainId,
            },
            null,
            2
          )}{" "}
          <div className="flex justify-start">
            <Button text="Back" onClick={() => setCurrentStep(1)} />
            <Button
              text="Confirm"
              onClick={() => {
                //setCurrentStep(3);
                sendTransaction();
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Import;
