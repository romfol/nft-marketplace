import { ethers, run } from "hardhat";

async function main() {
  // const NFToken = await ethers.getContractFactory("NFToken");
  // console.log("Deploying NFToken ERC721 token...");
  // const token = await NFToken.deploy("Vasily Ivanovich", "erc721");

  // await token.deployed();
  // console.log("NFToken deployed to:", token.address);

  // await run("verify", {
  //   address: "0x8c2e0a2A038d071F6b0789cB1730A2D2c97e78AB",
  //   contract: "contracts/NFToken.sol:NFToken",
  //   constructorArguments: ["Vasily Ivanovich", "erc721"],
  // });

  // const NFTMarketplace = await ethers.getContractFactory("NFTMarketplace");
  // console.log("Deploying NFTMarketplace...");
  // const marketplace = await NFTMarketplace.deploy();

  // await marketplace.deployed();
  // console.log("NFTMarketplace deployed to:", marketplace.address);

  await run("verify", {
    address: "0x5226c1f52CB1C147BD404194B6c075A58B7d04C1",
    contract: "contracts/NFTMarketplace.sol:NFTMarketplace",
  });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
