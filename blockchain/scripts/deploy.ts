import { ethers, run } from "hardhat";

async function main() {
  const NFToken = await ethers.getContractFactory("NFToken");
  console.log("Deploying NFToken ERC721 token...");
  const token = await NFToken.deploy("NFToken", "ERC721");

  await token.deployed();
  console.log("NFToken deployed to:", token.address);

  await run("verify", {
    address: token.address,
    contract: "contracts/NFToken.sol:NFToken",
    constructorArguments: ["NFToken", "ERC721"],
  });

  const NFTMarketplace = await ethers.getContractFactory("NFTMarketplace");
  console.log("Deploying NFTMarketplace...");
  const marketplace = await NFTMarketplace.deploy();

  await marketplace.deployed();
  console.log("NFTMarketplace deployed to:", marketplace.address);

  await run("verify", {
    address: marketplace.address,
    contract: "contracts/NFTMarketplace.sol:NFTMarketplace",
  });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
