import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import 'dotenv/config';
import 'hardhat-gas-reporter';
import 'solidity-coverage';
import "@nomiclabs/hardhat-ethers";
import "@typechain/hardhat"; 
import "hardhat-deploy";


const GOERLI_RPC_URL = process.env.GOERLI_RPC_URL || "https//eth-goerli/"
const PRIVATE_KEY = process.env.PRIVATE_KEY || '0xkey'
const chainID = 5;
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || 'key'; 
const COIN_MARKET_CAP = process.env.COIN_MARKET_CAP || 'key ';



const config: HardhatUserConfig = {
  solidity: {
    compilers: [
        { version: '0.8.17' },
        { version: '0.6.6' }
      ],
  },
    defaultNetwork: "hardhat",
    networks: {
        goerli: {
            url: GOERLI_RPC_URL,
            accounts: [PRIVATE_KEY],
        chainId: chainID
        },
        localhost: {
            url: "http://127.0.0.1:8545/",
          chainId: 31337,
        },
    },
    etherscan: {
        apiKey: ETHERSCAN_API_KEY,
    },
    gasReporter: {
        enabled: false,
        //outputFile: "gas-report.txt",
        noColors: true,
        currency: "USD",
        //coinmarketcap: COIN_MARKET_CAP, 
    },
    namedAccounts: {
      deployer: {
        default: 0
      }
    },
    mocha: {
      timeout: 50000
    },
};

export default config;
