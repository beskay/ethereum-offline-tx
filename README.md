# Sign and Send Offline Transactions

A web app and CLI tool to send transactions from an airgapped device. 

Right now the development is halted, there are a few things left on the todo list which have to be implemented at a later date (from me -- or maybe from you if you want to contribute :) )

- The web app is not done yet and doesnt run on an offline computer, need to figure out how to support this
- Rewrite the CLI tool in Golang/Rust/C, basically any compiled language. OR use the recently released [NodeJS single executable](https://nodejs.org/api/single-executable-applications.html) file. The goal is to not requiring NodeJS preinstalled on the airgapped device.

## Web app

A web interface to simplify the process of sending an offline transaction, built with React.js and TypeScript.

Right now only basic Ether transfers are supported, but smart contract interactions will follow soon.

[Demo](https://offlinetx.netlify.app/)

### Getting started

1. Clone this repository on your online computer

```
git clone git@github.com:beskay/ethereum-offline-tx.git
```

2. In a terminal, run `npm install` to install the required dependencies

```
cd ethereum-offline-tx
cd webapp
npm install
```

## CLI-Tool

Simple command-line interface to send transactions from an offline ethereum wallet.

### Prerequisites

- [Node.js](https://nodejs.org/en/) installed
- A valid Etherscan API key -> [Getting an Etherscan API key](https://docs.etherscan.io/getting-started/viewing-api-usage-statistics#creating-an-api-key)

If you dont have Node.js installed on your offline computer, visit the [official download page](https://nodejs.org/en/download/). Its possible to install node without an internet connection.

### Getting Started

1. Clone this repository on your online computer

```
git clone git@github.com:beskay/ethereum-offline-tx.git
```

2. In a terminal, run `npm install` to install the required dependencies

```
cd ethereum-offline-tx
cd CLI
npm install
```

3. Zip and copy the folder to your offline computer

### Creating and sending a transaction

**ON YOUR OFFLINE COMPUTER**

1. Replace the example transaction in `signTx.js` with the actual tx you want to submit, see appendix for a short explanation of the transaction fields.

2. Run `node signTx.js "YOUR_PRIVATE_KEY"`

3. Copy the generated `tx.json` file to a USB drive

**ON YOUR ONLINE COMPUTER**

1. Copy `tx.json` from your USB drive to this directory

2. Run `node sendTx.js "ENDPOINT_URL" "YOUR_ETHERSCAN_API_KEY"`, e.g. `node sendTx.js "https://api.etherscan.io/" "AA456 ... 2E"` for mainnet

3. Double check the tx you want to send, if everything is correct type `yes` and hit enter

4. Done!

### Scripts

- `getPrivatekey.js`

Prints the first 10 addresses + corresponding privatekey from a given mnemonic. Usage:

```
node scripts/getPrivatekey.js "your mnenmonic phrase"
```

- `signMessage.js`

Signs a given message with given private key. Replace `message` in `signMessage.js` and run

```
node scripts/signMessage.js "YOUR_PRIVATE_KEY"
```

### Further info

- [List of endpoint URLs](https://docs.etherscan.io/getting-started/endpoint-urls)
- [List of chain IDs](https://chainlist.org/)

Credits to repository [ethereum-raw-transactions](https://github.com/0xV4L3NT1N3/ethereum-raw-transactions), which was used as a template.

### Appendix

#### Transaction fields

| Parameter            | Description                                                                                                                                                       |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| to                   | the `address` to send Ether to                                                                                                                                    |
| value                | the amount of Ether to send                                                                                                                                       |
| data                 | arbitrary data for contract calls, first four bytes specify which function to call, the rest are the function arguments, set it to `""` for basic Ether transfers |
| gasLimit             | the maximum units of gas to consume, `21000` for basic Ether transfers                                                                                            |
| maxPriorityFeePerGas | tip paid to miners, introduced in EIP-1559                                                                                                                        |
| maxFeePerGas         | maximum price paid per unit of gas, introduced in EIP-1559                                                                                                        |
| nonce                | number of transactions sent from the address, set to `0` for the first tx                                                                                         |
| type                 | set to `0x2`, to denote EIP-1559 type transactions                                                                                                                |
| chainId              | chainId to send the transaction (e.g. `1` for mainnet, `5` for goerli test network, ...)                                                                          |

[More info](https://ethereum.org/en/developers/docs/transactions/) on transactions, especially more in-depth explanation of the data field, see also the [transactions](https://github.com/ethereumbook/ethereumbook/blob/develop/06transactions.asciidoc) chapter of the Ethereum book.
