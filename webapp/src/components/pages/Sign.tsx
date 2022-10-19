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

const Sign = ({ page, setPage }: pageProps) => {
  const [data, setData] = useState<Transaction>();
  const [clearTx, setClearTx] = useState<Transaction>();
  const [tx, setTx] = useState<SignedTransaction>();
  const [fileName, setFileName] = useState("No file");
  const [currentStep, setCurrentStep] = useState(1);
  const [mnemonic, setMnemonic] = useState("");
  const [privKey, setPrivKey] = useState("");

  const radioHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    let wallet = ethers.Wallet.fromMnemonic(
      `${mnemonic}`,
      `m/44'/60'/0'/0/${e.target.value}`
    );
    setPrivKey(wallet.privateKey.toString());
  };

  function verifyPrivKey(value: string) {
    try {
      new ethers.Wallet(value);
    } catch (e) {
      return false;
    }
    return true;
  }

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

    setFileName(uploadedFile.name.split(".")[0]);
  };

  const handleQRcode = (result: string) => {
    setData(JSON.parse(result));
    console.log(JSON.parse(result));
  };

  const signTransaction = async (data: any) => {
    let signer = new ethers.Wallet(privKey);

    // sign and serialize tx
    let rawTransaction = await signer
      .signTransaction(data)
      // @ts-ignore
      .then(ethers.utils.serializeTransaction(data));

    //setSignedTx(rawTransaction);

    let txobj = {
      signedTx: rawTransaction,
      initialTx: data,
    };

    setTx(txobj);
  };

  return (
    <div className="card w-full max-w-xl m-4">
      <p className="card-header px-2 text-lg">Signing transaction</p>
      {currentStep === 1 && (
        <div className="p-4">
          <p className="text-center font-bold mb-4">Offline computer only!</p>
          <p className="mb-2">1. Input your mnemonic OR private key</p>
          <Form
            type="password"
            placeholder="your mnemonic"
            value={mnemonic}
            onChange={setMnemonic}
          />
          {ethers.utils.isValidMnemonic(mnemonic) && (
            <div>
              <p>2. Choose the signer account</p>
              <div>
                <input
                  type="radio"
                  value={0}
                  name="signer"
                  onChange={radioHandler}
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
                  onChange={radioHandler}
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
                  onChange={radioHandler}
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
            onChange={setPrivKey}
          />

          {verifyPrivKey(privKey) && (
            <div>
              <p>2. Signing with address:</p>
              {new ethers.Wallet(privKey).address.toString()}
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
            <Button text="Back" onClick={() => setCurrentStep(1)} />
            <Button text="Next" onClick={() => setCurrentStep(3)} />
          </div>
        </div>
      )}

      {currentStep === 3 && (
        <div className="p-4">
          <p>Transaction to sign:</p>
          {JSON.stringify(
            {
              from: data?.from,
              to: data?.to,
              "value (in wei)": Number(data?.value.hex),
              data: data?.data,
              gasLimit: data?.gasLimit,
              "maxPriorityFeePerGas (in wei)": Number(
                data?.maxPriorityFeePerGas.hex
              ),
              "maxFeePerGas (in wei)": Number(data?.maxFeePerGas.hex),
              nonce: data?.nonce,
              type: 2,
              chainId: data?.chainId,
            },
            null,
            2
          )}
          <p>You are signing with address:</p>
          {new ethers.Wallet(privKey).address.toString()}
          <div className="flex justify-start">
            <Button text="Back" onClick={() => setCurrentStep(2)} />
            <Button
              text="Confirm"
              onClick={() => {
                setCurrentStep(4);
                signTransaction(data);
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
              JSON.stringify(tx)
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
          <QRCodeSVG value={JSON.stringify(tx)} className="m-4" />{" "}
          <div className="flex justify-start">
            <Button text="Back" onClick={() => setCurrentStep(3)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Sign;
