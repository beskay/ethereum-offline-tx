const ethers = require("ethers");
const fs = require("fs");

async function main() {
  // import privkey from command line and create a new wallet instance
  let privatekey = process.argv[2];
  let wallet = new ethers.Wallet(privatekey);

  console.log("Using wallet address " + wallet.address);

  // define transaction
  let transaction = {
    to: "0x72185924FF9c68f1E02F7b7Ec16A898c02d54510",
    value: ethers.utils.parseEther("0.1"),
    data: "",
    gasLimit: "21000",
    maxPriorityFeePerGas: ethers.utils.parseUnits("5", "gwei"),
    maxFeePerGas: ethers.utils.parseUnits("20", "gwei"),
    nonce: 0,
    type: 2,
    chainId: 1,
  };

  // sign and serialize tx
  let rawTransaction = await wallet
    .signTransaction(transaction)
    .then(ethers.utils.serializeTransaction(transaction));

  // log and save data to local txt file
  let txObject = {
    signedTx: rawTransaction,
    tx: transaction,
  };

  console.log(txObject);
  fs.writeFile("./tx.json", JSON.stringify(txObject), "utf8", (err) => {
    if (err) {
      console.log("error writing file: ${err}");
    }
  });
}

main();
