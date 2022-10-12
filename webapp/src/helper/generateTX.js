import { ethers } from "ethers";

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
  const provider = new ethers.providers.AlchemyProvider(name);
  let block = await provider.getBlock(15733249);
  console.log("block ", block);
}
