import { ethers } from "ethers";

let provider;
export let priorityFee;
export let maxFee;

export async function initProvider(value) {
  let name;

  if (value == 1) name = "homestead";
  else if (value == 5) name = "goerli";
  else if (value == 137) name = "matic";
  else if (value == 80001) name = "maticmum";
  else if (value == 10) name = "optimism";
  else if (value == 42161) name = "arbitrum";
  else return;

  // connect to provider
  provider = new ethers.providers.AlchemyProvider(name);
  let block = await provider.getBlock(15733249);
  console.log("block ", block);

  getFeeData();
}

async function getFeeData() {
  const feeData = await provider.getFeeData();
  console.log(feeData.gasPrice.toNumber());

  priorityFee = feeData.maxPriorityFeePerGas.toNumber();
  maxFee = feeData.maxFeePerGas.toNumber();
}
