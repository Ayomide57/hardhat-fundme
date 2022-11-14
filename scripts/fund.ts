import { getNamedAccounts, ethers } from "hardhat";

const main = async () => {
    const { deployer } = await getNamedAccounts();
    const fundMe = await ethers.getContract("FundMe", deployer)
    console.log('Funding contract .........');
    const transactionResponse = await fundMe.fund({ value: ethers.utils.parseEther('0.3')}) 
    await transactionResponse.wait(1);
    console.log('Funded .........');
}

main().
    then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1)
    })


// yarn hardhat run scripts/fund.ts --network localhost

// GOERLI_RPC_URL=https://eth-goerli.g.alchemy.com/v2/4foDN7B98TAkoPiJo_8OkZfdpf3ClDB7
