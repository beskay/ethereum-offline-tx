const ethers = require("ethers");

async function main() {
  // import mnemonic from command line
  let mnemonic = process.argv[2];

  for (i = 0; i < 10; i++) {
    let wallet = new ethers.Wallet.fromMnemonic(
      `${mnemonic}`,
      `m/44'/60'/0'/0/${i}`
    );

    console.log(
      `Address ${i}: ${wallet.address}, PrivateKey: ${wallet.privateKey}`
    );
  }
}

main();
