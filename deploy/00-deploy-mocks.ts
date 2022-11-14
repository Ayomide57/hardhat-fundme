import {HardhatRuntimeEnvironment} from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import { network } from "hardhat";
import {
    developmentChains,
    DECIMAL,
    INITIAL_ANSWER
} from '../helper-hardhat-config';



const deployMocks: DeployFunction = async(hre: HardhatRuntimeEnvironment) => {
    const { getNamedAccounts, deployments } = hre;
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();
 
    if (developmentChains.includes(network.name)) {
        log("Local network detected! Deploying mocks ...");
        await deploy("MockV3Aggregator", {
            contract: "MockV3Aggregator",
            from: deployer,
            args: [DECIMAL, INITIAL_ANSWER],
            log: true
        }); 
        log("Mock Deployed! ...");
        log("============================================================================");
    }
}

export default deployMocks;  

deployMocks.tags = ["all", "mocks"]