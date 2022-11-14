import {HardhatRuntimeEnvironment} from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import { network } from "hardhat";
import networkConfig, { developmentChains } from '../helper-hardhat-config';
import 'dotenv/config';
import verify from '../utils/verify';

const ETHERSCAN_API_KEY = "HYWQ57YCUT87FVZ8AM54RMWAYKSS3AP8F1"; 


const deployFundMe: DeployFunction = async(hre: HardhatRuntimeEnvironment) => {
    const { getNamedAccounts, deployments } = hre;
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();
    const chainId: number = network.config.chainId!;


    // const ethUsdPriceFeedAddress = networkConfig[chainId]['ethUsdPriceFeed'];
    let ethUsdPriceFeedAddress;

        log(`${network.name}-------------------------------------------------------------------------------------`);
    if (developmentChains.includes(network.name)) {
        const ethUsdAggregator = await deployments.get("MockV3Aggregator");
        ethUsdPriceFeedAddress = ethUsdAggregator.address;
    } else {
        ethUsdPriceFeedAddress = networkConfig[chainId]['ethUsdPriceFeed']!;
    }

    const args = [ethUsdPriceFeedAddress] // price feed address i.e goerli, eth, polygon  network

    const fundMe = await deploy("FundMe", {
        from: deployer,
        args: [ethUsdPriceFeedAddress],
        log: true,
        waitConfirmations: 1
    }); 

    if (!developmentChains.includes(network.name) && ETHERSCAN_API_KEY) {
        await verify(fundMe.address, args)
    }

    log('-------------------------------------------------------------------------------------');
}

// yarn hardhat deploy --network goerli 

// with tags
// yarn hardhat deploy --network goerli --tags fundme  

export default deployFundMe;
deployFundMe.tags = ["all", "fundme"]  