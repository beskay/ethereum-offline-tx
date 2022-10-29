import React, { useState } from "react";
import { QrReader } from "react-qr-reader";
import { ethers } from "ethers";
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

interface SignedTransaction {
  signedTx: string;
  initialTx: Transaction;
}

const Import = ({ page, setPage }: pageProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [tx, setTx] = useState<SignedTransaction>();

  const readFileOnUpload = (uploadedFile: any) => {
    const fileReader = new FileReader();
    fileReader.onloadend = () => {
      try {
        setTx(JSON.parse(fileReader.result as string));
        console.log(JSON.parse(fileReader.result as string));
      } catch (e) {
        console.log("**Not valid JSON file!**");
      }
    };
    if (uploadedFile !== undefined) fileReader.readAsText(uploadedFile);
  };

  const handleQRcode = (result: string) => {
    setTx(JSON.parse(result));
    console.log(JSON.parse(result));
  };

  const formatTransaction = (): string => {
    if (tx != undefined) {
      return JSON.stringify(
        {
          from: tx?.initialTx.from,
          to: tx?.initialTx.to,
          nonce: tx?.initialTx.nonce,
          gasLimit: tx?.initialTx.gasLimit,
          data: tx?.initialTx.data,
          "value (in ETH)": ethers.utils.formatEther(tx?.initialTx.value),
          chainId: tx?.initialTx.chainId,
          type: 2,
          "maxPriorityFeePerGas (in Gwei)": ethers.utils.formatUnits(
            tx?.initialTx.maxPriorityFeePerGas,
            "gwei"
          ),
          "maxFeePerGas (in Gwei)": ethers.utils.formatUnits(
            tx?.initialTx.maxFeePerGas,
            "gwei"
          ),
        },
        null,
        2
      );
    } else {
      return "no transaction specified";
    }
  };

  const sendTransaction = async () => {
    if (tx != undefined) {
      let chain = tx?.initialTx.chainId;

      // connect to provider
      const provider = new ethers.providers.AlchemyProvider(Number(chain));

      // send tx
      const sentTransaction = await provider.sendTransaction(`${tx?.signedTx}`);
      console.log(tx);
      alert(`Success! Tx hash: ${sentTransaction.hash}`);
    } else {
      console.log("no tx defined");
    }
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
          <QrReader
            constraints={{}}
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
          <div className="m-2 p-2 border border-gray">
            {formatTransaction()}
          </div>
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
