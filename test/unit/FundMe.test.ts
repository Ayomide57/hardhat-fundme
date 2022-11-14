
import { deployments, ethers, getNamedAccounts, network } from 'hardhat';
import { assert, expect } from 'chai';
import { FundMe, MockV3Aggregator } from "../../typechain-types"
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { BigNumber } from 'ethers';
import { developmentChains } from '../../helper-hardhat-config'

!developmentChains.includes(network.name)
    ? describe.skip
    :  describe("FundMe", function () {
        let fundMe: FundMe;
        let mockV3Aggregator: MockV3Aggregator;
        let deployer: SignerWithAddress;
        const sendvalue: BigNumber = ethers.utils.parseEther("1") //"1000000000000000000" 1 eth
        let gasCost: BigNumber;
        beforeEach(async () => {
            const accounts = await ethers.getSigners()
            deployer = accounts[0]
            await deployments.fixture(["all"])
            fundMe = await ethers.getContract("FundMe")
            mockV3Aggregator = await ethers.getContract("MockV3Aggregator")
        });

        describe("constructor", async () => {
            it("sets the aggregator addresses correctly", async () => {
                const response = await fundMe.getPriceFeed()
                assert.equal(response, mockV3Aggregator.address);
            });
        });

        describe("fund", async () => {
            it("Fails if you don't send enough Eth", async () => {
                await expect(fundMe.fund()).to.be.revertedWith("Error: Didn't send fund")
            });

            it("updated the amount funded data structure", async () => {
                await fundMe.fund({ value: sendvalue });
                const response = await fundMe.getAddressToFundersAmount(deployer.address);
                assert.equal(response.toString(), sendvalue.toString());
            });

            it("add funders to the array of funders", async () => {
                await fundMe.fund({ value: sendvalue });
                const response = await fundMe.getFunders(0);
                assert.equal(response, deployer.address);
            });
        }); 

        describe("withdrawFund", async () => {
            beforeEach(async () => {
                await fundMe.fund({ value: sendvalue });
            })
            it("withdraw Eth from a single founder", async () => {
                // Arrange
                const startingFundMeBalance = await fundMe.provider.getBalance(fundMe.address)
                const startingDeployerBalance = await fundMe.provider.getBalance(deployer.address);

                // Act
                const transactionResponse = await fundMe.withdrawFund()
                const transactionReceipt = await transactionResponse.wait(1)
                const { gasUsed, effectiveGasPrice } = transactionReceipt;
                gasCost = gasUsed.mul(effectiveGasPrice);

                const endingFundMeBalance = await fundMe.provider.getBalance(fundMe.address)
                const endingDeployerBalance = await fundMe.provider.getBalance(deployer.address);

                // Assert

                assert.equal(endingFundMeBalance.toString(), "0");
                assert.equal(
                    startingFundMeBalance.add(startingDeployerBalance).toString(),
                    endingDeployerBalance.add(gasCost).toString());
            });

            it("Only allows he owner to withdraw", async () => { 
                const accounts = await ethers.getSigners();
                const attackerConnectedContract = await fundMe.connect(accounts[1]);
                await expect(attackerConnectedContract.withdrawFund()).to.be.reverted
            })
        });

        describe("Cheaper Withdraw testing ....", async () => {
            beforeEach(async () => {
                await fundMe.fund({ value: sendvalue });
            })
            it("withdraw Eth from a single founder", async () => {
                // Arrange
                const startingFundMeBalance = await fundMe.provider.getBalance(fundMe.address)
                const startingDeployerBalance = await fundMe.provider.getBalance(deployer.address);

                // Act
                const transactionResponse = await fundMe.cheaperWithrawFund()
                const transactionReceipt = await transactionResponse.wait(1)
                const { gasUsed, effectiveGasPrice } = transactionReceipt;
                gasCost = gasUsed.mul(effectiveGasPrice);

                const endingFundMeBalance = await fundMe.provider.getBalance(fundMe.address)
                const endingDeployerBalance = await fundMe.provider.getBalance(deployer.address);

                // Assert

                assert.equal(endingFundMeBalance.toString(), "0");
                assert.equal(
                    startingFundMeBalance.add(startingDeployerBalance).toString(),
                    endingDeployerBalance.add(gasCost).toString());
            });

            it("Only allows he owner to withdraw", async () => { 
                const accounts = await ethers.getSigners();
                const attackerConnectedContract = await fundMe.connect(accounts[1]);
                await expect(attackerConnectedContract.withdrawFund()).to.be.reverted
            })
        });
    });

// yarn hardhat test --grep "anything"

// yarn hardhat test "
