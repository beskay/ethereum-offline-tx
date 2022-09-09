const fetch = require("node-fetch");
const fs = require("fs").promises;
const readline = require("readline");

async function submitTx(signedTx, endpoint, etherscanApi) {
  // pass the raw transaction hash to the "eth_sendRawTransaction" endpoint
  let gethProxy = await fetch(
    `${endpoint}api?module=proxy&action=eth_sendRawTransaction&hex=${signedTx}&apikey=${etherscanApi}`
  );
  let response = await gethProxy.json();

  // print the API response
  console.log(response);
}

async function main() {
  // import endpoint url and etherscan api key from command line
  let endpoint = process.argv[2];
  let etherscanApi = process.argv[3];

  // read tx from local txt file
  let data = await fs.readFile("./tx.json", "utf8");

  let txObject = JSON.parse(data);
  let signedTx = txObject.signedTx;
  let rawTx = txObject.tx;

  console.log("Sending transaction: \n", rawTx);

  // ask user to continue
  let rl = readline.createInterface(process.stdin, process.stdout);
  rl.question("Continue? (yes / no) ", (data) => {
    if (data == "yes") {
      // continue
      submitTx(signedTx, endpoint, etherscanApi);
      rl.close();
    } else {
      console.log("aborted");
      rl.close();
      return 0;
    }
  });
}

main();
