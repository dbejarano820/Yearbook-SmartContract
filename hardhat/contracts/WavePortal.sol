// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract WavePortal{
    uint totalSignatures;
    string public nameOwner;
    mapping (address => message) public messages;
    address[] public signers;

    constructor( ) {
        console.log("Sup bitch, i'm a contract");
    }

    struct message {
        string text;
        string nameSender;
        bool signed;
    }

    function sign(string calldata nameSender, string calldata text) public { 
        message storage s = messages[msg.sender];
        require(!s.signed, "Already signed");
        signers.push(msg.sender);
        s.signed = true;
        s.text = text;
        s.nameSender = nameSender;
        totalSignatures += 1;
        console.log("%s has signed the yearbook", msg.sender);
    }

    function getTotalSignatures() view public returns (uint) {

        for (uint256 index = 0; index < signers.length; index++) {
            address addy = signers[index];
            message storage msgTmp = messages[addy];
            console.log("%s with the address %s signed the yearbook and left the message: %s", msgTmp.nameSender, addy, msgTmp.text); 
        }
        console.log("We have had %d total signatures on the yearbook", totalSignatures);
        return totalSignatures;
    }
}