// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

import "./PriceConverter.sol";

error FundMe__NotOwner();

/**
 * @title A contract for crowd funding
 * @author Ayomide 
 * @notice This contract is to demo a  sample funding contract
 * @dev This implement price feeds  as our library
 */

contract FundMe {

    // Type Declaration
    using PriceConverter for uint256;

    // State variables 
    uint256 public constant MINIMUM_AMOUNT = 50 * 1e18;
    address[] private s_funders;
    mapping(address => uint256) private s_addressToFundersAmount;
    address private immutable i_owner;
    AggregatorV3Interface private s_priceFeed;

    // Modifiers
    modifier onlyOwner {
        if(msg.sender != i_owner){ revert FundMe__NotOwner();}
        _; //
    }

    // Functions format
    /**
     * constructor
     * recieve
     * fallback
     * external
     * public
     * internal
     * private
     * view / pure
     */


    constructor(address priceFeedAddress) {
        i_owner = msg.sender;
        s_priceFeed = AggregatorV3Interface(priceFeedAddress); 
    }

    receive () external  payable {
        fund();
    }

    fallback () external payable {
        fund();   
    }

    /**
     * @notice This functions is use to fund the contract/address
     * @dev This implement price feeds  as our library
    */

    function fund () public payable {
        require(msg.value.getConvertionRate(s_priceFeed) >= MINIMUM_AMOUNT, "Error: Didn't send fund");
        s_addressToFundersAmount[msg.sender] = msg.value;
        s_funders.push(msg.sender);
    }

    function withdrawFund() public payable onlyOwner {
        for(uint256 funderIndex = 0; funderIndex < s_funders.length; funderIndex++){
            address funder = s_funders[funderIndex];
            s_addressToFundersAmount[funder] = 0;
        }
        s_funders = new address[](0);
        (bool callSuccess, ) = payable(msg.sender).call{value: address(this).balance}("");
        require(callSuccess, "call failed");
    }

    // this is cheaper, saving into memory first makes it cheaper so we can easi ly loop through without visiting storage
    function cheaperWithrawFund() public payable onlyOwner {
        address[] memory funders = s_funders;
        // mapping can't be stored in memory

        for(uint256 funderIndex = 0; funderIndex < funders.length; funderIndex++){
            address funder = funders[funderIndex];
            s_addressToFundersAmount[funder] = 0;
        }
        s_funders = new address[](0);
        (bool callSuccess, ) = payable(msg.sender).call{value: address(this).balance}("");
        require(callSuccess, "call failed");
    }

    // pure / view 

    function getOwner() public view returns (address) {
        return i_owner;
    } 

    function getFunders(uint256 index) public view returns (address){
        return s_funders[index]; 
    }

    function getAddressToFundersAmount(address funder) public view returns (uint256){
         return s_addressToFundersAmount[funder];
    }

    function getPriceFeed() public view returns (AggregatorV3Interface){
        return s_priceFeed ; 
    }

}