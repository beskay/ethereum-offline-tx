const ethers = require("ethers");

async function main() {
  // import privkey from command line and create a new wallet instance
  let privatekey = process.argv[2];
  let wallet = new ethers.Wallet(privatekey);

  console.log("Signing message with wallet address " + wallet.address);

  // define message
  let message = "Hello World";

  let signedMessage = await wallet.signMessage(message);

  console.log(signedMessage);
}

main();
