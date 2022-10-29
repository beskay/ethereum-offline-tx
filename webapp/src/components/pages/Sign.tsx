import React, { useState } from "react";
import { QrReader } from "react-qr-reader";
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

interface SignedTransaction {
  signedTx: string;
  initialTx: Transaction;
}

const Sign = ({ page, setPage }: pageProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  // transaction data
  const [tx, setTx] = useState<Transaction>();
  const [signedTx, setSignedTx] = useState<SignedTransaction>();
  // filename of json transaction
  const [fileName, setFileName] = useState("No file");
  // wallet data
  const [mnemonic, setMnemonic] = useState("");
  const [privKey, setPrivKey] = useState("");
  const [address, setAddress] = useState("");
  const [validKey, setValidKey] = useState(false);
  const [validMnemonic, setValidMnemonic] = useState(false);

  const handleMnemonic = (mnemonic: string) => {
    setMnemonic(mnemonic);
    setValidMnemonic(ethers.utils.isValidMnemonic(mnemonic));
  };

  const handleRadioInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    let wallet = ethers.Wallet.fromMnemonic(
      `${mnemonic}`,
      `m/44'/60'/0'/0/${e.target.value}`
    );
    setPrivKey(wallet.privateKey.toString());
  };

  const handlePrivKey = (privKey: string) => {
    setPrivKey(privKey);

    // verify privkey
    try {
      let wallet = new ethers.Wallet(privKey);
      setValidKey(true);
      setAddress(wallet.address.toString());
    } catch (e: any) {
      console.log(e.message);
      setValidKey(false);
    }
  };

  const readFileOnUpload = (uploadedFile: any) => {
    const fileReader = new FileReader();
    fileReader.onloadend = () => {
      try {
        setTx(JSON.parse(fileReader.result as string));
        console.log(JSON.parse(fileReader.result as string));
      } catch (e) {
        console.log("**Not a valid JSON file!**");
      }
    };
    if (uploadedFile !== undefined) fileReader.readAsText(uploadedFile);

    setFileName(uploadedFile.name.split(".")[0]);
  };

  const handleQRcode = (result: string) => {
    setTx(JSON.parse(result));
    console.log(JSON.parse(result));
  };

  const formatTransaction = (): string => {
    if (tx != undefined) {
      return JSON.stringify(
        {
          from: tx?.from,
          to: tx?.to,
          nonce: tx?.nonce,
          gasLimit: tx?.gasLimit,
          data: tx?.data,
          "value (in ETH)": ethers.utils.formatEther(tx?.value),
          chainId: tx?.chainId,
          type: 2,
          "maxPriorityFeePerGas (in Gwei)": ethers.utils.formatUnits(
            tx?.maxPriorityFeePerGas,
            "gwei"
          ),
          "maxFeePerGas (in Gwei)": ethers.utils.formatUnits(
            tx?.maxFeePerGas,
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

  const signTransaction = async () => {
    if (tx != undefined) {
      let signer = new ethers.Wallet(privKey);

      // sign tx
      let signedTx = await signer.signTransaction(
        tx as ethers.providers.TransactionRequest
      );

      let txobj = {
        signedTx: signedTx,
        initialTx: tx,
      };

      setSignedTx(txobj);
    } else {
      alert("no tx specified!");
    }
  };

  return (
    <div className="card w-full max-w-xl m-4">
      <p className="card-header px-2 text-lg">Signing transaction</p>
      {currentStep === 1 && (
        <div className="p-4">
          <p className="text-center font-bold mb-4">
            Only use on an offline computer!
          </p>
          <p className="mb-2">1. Input your mnemonic OR private key</p>
          <Form
            type="password"
            placeholder="your mnemonic"
            value={mnemonic}
            onChange={handleMnemonic}
          />
          {validMnemonic && (
            <div>
              <p>2. Choose the signer account</p>
              <div>
                <input
                  type="radio"
                  value={0}
                  name="signer"
                  onChange={handleRadioInput}
                />{" "}
                {ethers.Wallet.fromMnemonic(
                  `${mnemonic}`,
                  `m/44'/60'/0'/0/0`
                ).address.toString()}
                <br />
                <input
                  type="radio"
                  value={1}
                  name="signer"
                  onChange={handleRadioInput}
                />{" "}
                {ethers.Wallet.fromMnemonic(
                  `${mnemonic}`,
                  `m/44'/60'/0'/0/1`
                ).address.toString()}
                <br />
                <input
                  type="radio"
                  value={2}
                  name="signer"
                  onChange={handleRadioInput}
                />{" "}
                {ethers.Wallet.fromMnemonic(
                  `${mnemonic}`,
                  `m/44'/60'/0'/0/2`
                ).address.toString()}
              </div>
            </div>
          )}

          <Form
            type="password"
            placeholder="your private key"
            value={privKey}
            onChange={handlePrivKey}
          />
          {validKey && (
            <div>
              <p>2. Signing with address:</p>
              {address}
            </div>
          )}

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
          <p>1. Upload the previously generated .json File</p>
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
            <Button text="Back" onClick={() => setCurrentStep(1)} />
            <Button text="Next" onClick={() => setCurrentStep(3)} />
          </div>
        </div>
      )}

      {currentStep === 3 && (
        <div className="p-4">
          <p>Transaction to sign:</p>
          <div className="m-2 p-2 border border-gray">
            {formatTransaction()}
          </div>
          <p>You are signing with address:</p>
          <div className="m-2">{address}</div>
          <div className="flex justify-start">
            <Button text="Back" onClick={() => setCurrentStep(2)} />
            <Button
              text="Confirm"
              onClick={() => {
                setCurrentStep(4);
                signTransaction();
              }}
            />
          </div>
        </div>
      )}

      {currentStep === 4 && (
        <div className="p-4">
          <p>1. Download the signed transaction</p>
          <a
            id="downloadJson"
            href={`data:text/json;charset=utf-8,${encodeURIComponent(
              JSON.stringify(signedTx)
            )}`}
          >
            <Button
              text="Download json"
              onClick={() => {
                document
                  .getElementById("downloadJson")
                  ?.setAttribute("download", `${fileName}_signed.json`);
              }}
            />
          </a>
          <p className="mt-6">2. Or scan the generated QR code</p>
          <QRCodeSVG value={JSON.stringify(signedTx)} className="m-4" />{" "}
          <div className="flex justify-start">
            <Button text="Back" onClick={() => setCurrentStep(3)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Sign;
