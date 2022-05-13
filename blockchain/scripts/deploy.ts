import { ethers, run } from "hardhat";

async function main() {
  // const NFToken = await ethers.getContractFactory("NFToken");
  // console.log("Deploying NFToken ERC721 token...");
  // const token = await NFToken.deploy("Vasily Ivanovich", "VI721");

  // await token.deployed();
  // console.log("NFToken deployed to:", token.address);

  // await run("verify", {
  //   address: "0xc57bcFf78d8f5E5c765CBE122da4Cdd206C79D1E",
  //   contract: "contracts/NFToken.sol:NFToken",
  //   constructorArguments: ["Vasily Ivanovich", "VI721"],
  // });

  // const NFTMarketplace = await ethers.getContractFactory("NFTMarketplace");
  // console.log("Deploying NFTMarketplace...");
  // const marketplace = await NFTMarketplace.deploy();

  // await marketplace.deployed();
  // console.log("NFTMarketplace deployed to:", marketplace.address);

  await run("verify", {
    address: "0xB4a9e712394633Abba8CC9F801FE8E363671bb60",
    contract: "contracts/NFTMarketplace.sol:NFTMarketplace",
  });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
