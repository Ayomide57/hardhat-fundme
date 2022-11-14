import { getNamedAccounts, ethers } from "hardhat";

const main = async () => {
    const { deployer } = await getNamedAccounts();
    const fundMe = await ethers.getContract("FundMe", deployer)
    console.log('Withdraw contract .........');
    const transactionResponse = await fundMe.withdrawFund()
    await transactionResponse.wait(1);
    console.log('Withdraw contract .........');
}

main().
    then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1)
    })


// yarn hardhat run scripts/withdraw.ts --network localhost

// GOERLI_RPC_URL=https://eth-goerli.g.alchemy.com/v2/4foDN7B98TAkoPiJo_8OkZfdpf3ClDB7
