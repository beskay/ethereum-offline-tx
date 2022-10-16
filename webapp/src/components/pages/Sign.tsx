import React, { useState, useEffect } from "react";
import { QrReader } from "react-qr-reader";
import { ethers } from "ethers";
import Form from "../Form";
import Button from "../Button";

interface pageProps {
  page: string;
  setPage: React.Dispatch<React.SetStateAction<string>>;
}

const Sign = ({ page, setPage }: pageProps) => {
  const [data, setData] = useState("No result");
  const [currentStep, setCurrentStep] = useState(1);
  const [mnemonic, setMnemonic] = useState("");
  const [privKey, setPrivKey] = useState("");
  const [signer, setSigner] = useState("");

  const radioHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSigner(
      ethers.Wallet.fromMnemonic(
        `${mnemonic}`,
        `m/44'/60'/0'/0/${e.target.value}`
      ).address.toString()
    );
  };

  return (
    <div className="card w-full max-w-xl m-4">
      <p className="card-header px-2 text-lg">ETH Transfer</p>
      {currentStep === 1 && (
        <div className="p-4">
          <p className="text-center">
            Sensitive information! <br /> Only use on an offline computer!
          </p>
          <p>1. Input your mnemonic OR private key</p>
          <Form
            type="password"
            placeholder="your mnemonic"
            value={mnemonic}
            onChange={setMnemonic}
          />
          <Form
            type="password"
            placeholder="your private key"
            value={privKey}
            onChange={setPrivKey}
          />

          {mnemonic != "" && ethers.utils.isValidMnemonic(mnemonic) && (
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
              {signer}
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
          <p>1. Download the generated .json File</p>
          <Button text="Download json" onClick={() => {}} />
          <p className="mt-6">2. Or scan the generated QR code</p>
          {/* @ts-ignore */}
          <QrReader
            onResult={(result, error) => {
              if (!!result) {
                setData(result.getText());
              }

              if (!!error) {
                console.info(error);
              }
            }}
          />
          <p>{data}</p>
          <div className="flex justify-start">
            <Button text="Back" onClick={() => setCurrentStep(1)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Sign;
