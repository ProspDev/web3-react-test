// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import './Owned.sol';

contract Faucet is  Owned{
    mapping(address => bool) private funders;
    mapping(uint => address) private lutFunders;
    uint private numberOfFunders;

    constructor() {
        owner = msg.sender;
    }

    receive() external payable {}
    function addFunds() external payable {
        address funder = msg.sender;

        if(!funders[funder]) {
            uint index = numberOfFunders++;
            funders[funder] = true;
            lutFunders[index] = funder;
        }
    }

    modifier limitWithdraw(uint withdrawAmount) {
        require(withdrawAmount <= 1000000000000000000, 'can not withdraw more than 1 ether');
        _;    
    }

    function getAllFunders() external view returns(address[] memory) {
        address[] memory _funders = new address[](numberOfFunders);
        for(uint i = 0; i < numberOfFunders; i++) {
            _funders[i] = lutFunders[i];
        }

        return _funders;
    }

    function getFunderAtIndex(uint _index) external view returns(address) {
        return lutFunders[_index];
    }

    function withdraw(uint withdrawAmount) external limitWithdraw(withdrawAmount) {
        payable(msg.sender).transfer(withdrawAmount);
    }

    function getOwner() external onlyOwner view returns(address) {
        return owner;
    }
}

// const instance = await Faucet.deployed()
// instance.addFunds({value: '10000000000000000', from: accounts[0]})
// instance.addFunds({value: '10000000000000000', from: accounts[1]})
// instance.getFunderAtIndex(0)
// instance.withdraw(50000000000000, {from: ''})