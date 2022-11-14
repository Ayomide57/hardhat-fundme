export interface networkConfigItem {
    name?: string;
    ethUsdPriceFeed?: string;
}

export interface networkConfigInfo {
  [key: string]: networkConfigItem
}


const networkConfig: networkConfigInfo = {
    5: {
        name: 'goerli',
        ethUsdPriceFeed: "0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e"
     }
}

export const developmentChains = ['hardhat', 'localhost'];
export const DECIMAL = 8;
export const INITIAL_ANSWER = 200000000000 
 

export default networkConfig;