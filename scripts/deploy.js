async function main() {
  const SupplyChain = await ethers.getContractFactory("ShifaYousaf_supplychain");

  const contract = await SupplyChain.deploy({
    gasLimit: 2800000,
    maxFeePerGas: ethers.parseUnits("35", "gwei"),
    maxPriorityFeePerGas: ethers.parseUnits("25", "gwei")
  });

  await contract.waitForDeployment();

  console.log("Contract deployed to:", await contract.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});