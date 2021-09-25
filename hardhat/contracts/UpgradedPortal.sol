// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract UpgradedPortal{
    uint totalSignatures;
    uint256 private seed;

    event NewSignature(address indexed from, uint256 timestamp, string message, string name);

    Signature[] signatures;
    mapping(address => uint256) public lastSigned;

    constructor( ) payable {
        console.log("Sup bitch, i'm a contract");
    }

    struct Signature {
        address signer;
        string name;
        string message;
        uint256 timestamp;
    }

    function sign(string memory _name, string memory _message) public { 

        require(
            lastSigned[msg.sender] + 30 seconds < block.timestamp, // 30 second cooldown
            "Wait 30 seconds"
        );

        lastSigned[msg.sender] = block.timestamp;

        totalSignatures +=1;
        console.log("%s has signed", msg.sender);
        signatures.push(Signature(msg.sender, _name, _message, block.timestamp));

        uint256 randomNumber = (block.difficulty + block.timestamp + seed) % 100;
        console.log("Random # generated: %s", randomNumber);
        seed = randomNumber;

        if (randomNumber < 50) {
            console.log("%s won!", msg.sender);

            uint256 prizeAmount = 0.0001 ether;
            require(
                prizeAmount <= address(this).balance,
                "Trying to withdraw more money than they contract has."
            );
            (bool success, ) = (msg.sender).call{value: prizeAmount}("");
            require(success, "Failed to withdraw money from contract.");
        }

        emit NewSignature(msg.sender, block.timestamp, _message, _name);

    }

    function getAllSignatures() public view returns (Signature[] memory) {
        return signatures;
    }

    function getTotalSignatures() public view returns (uint) {
        return totalSignatures;
    }
}