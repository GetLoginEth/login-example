// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.7;

contract owned {
    address owner;
    constructor() public {owner = msg.sender;}

    modifier onlyOwner {
        require(msg.sender == owner, "Only owner can call this function.");
        _;
    }
}

abstract contract GetLoginLogic {
    function getUsernameByAddress(address wallet) public virtual view returns (bytes32);
}

abstract contract GetLoginStorage {
    function logicAddress() public virtual view returns (address);
}

contract Notes is owned {
    struct Note
    {
        uint256 id;
        bytes32 usernameHash;
        string text;
        bool isActive;
    }

    address public getLoginStorageAddress = 0xCaC5144CDf47C4e5BB58D572E56234510f818D81;
    mapping(bytes32 => Note[]) public UserNotes;

    function createNote(string memory text) public {
        address getLoginLogicAddress = GetLoginStorage(getLoginStorageAddress).logicAddress();
        bytes32 usernameHash = GetLoginLogic(getLoginLogicAddress).getUsernameByAddress(msg.sender);
        Note memory note = Note({id : 0, usernameHash : usernameHash, text : text, isActive : true});
        UserNotes[usernameHash].push(note);
        uint256 id = UserNotes[usernameHash].length - 1;
        UserNotes[usernameHash][id].id = id;
    }

    function getNotes(bytes32 usernameHash) public view returns (Note[] memory) {
        return UserNotes[usernameHash];
    }

    function getUsername(address wallet) public view returns (bytes32) {
        address getLoginLogicAddress = GetLoginStorage(getLoginStorageAddress).logicAddress();
        return GetLoginLogic(getLoginLogicAddress).getUsernameByAddress(wallet);
    }

    function setGetLoginStorageAddress(address newAddress) public onlyOwner {
        getLoginStorageAddress = newAddress;
    }
}
