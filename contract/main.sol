pragma solidity ^0.6.1;
pragma experimental ABIEncoderV2;

contract owned {
    address payable owner;
    constructor() public {owner = msg.sender;}

    // This contract only defines a modifier but does not use
    // it: it will be used in derived contracts.
    // The function body is inserted where the special symbol
    // `_;` in the definition of a modifier appears.
    // This means that if the owner calls this function, the
    // function is executed and otherwise, an exception is
    // thrown.
    modifier onlyOwner {
        require(msg.sender == owner, "Only owner can call this function.");
        _;
    }
}

abstract contract GetLoginLogic {
    function getUsernameByAddress(address wallet) public virtual view returns (bytes32);
}

abstract contract GetLoginStorage {
    function logicAddress() public virtual view returns (bytes32);
}

contract Notes is owned {
    struct Note
    {
        uint256 id;
        bytes32 usernameHash;
        string text;
        bool isActive;
    }

    address public getLoginAddress = 0x36ABeeC598Ed9D080dCbAB4c0F5dB764187d5956;
    mapping(bytes32 => Note[]) public UserNotes;

    function createNote(string memory text) public {
        bytes32 usernameHash = GetLogin(getLoginAddress).getUsernameByAddress(msg.sender);
        Note memory note = Note({id : 0, usernameHash : usernameHash, text : text, isActive : true});
        UserNotes[usernameHash].push(note);
        uint256 id = UserNotes[usernameHash].length - 1;
        UserNotes[usernameHash][id].id = id;
    }

    function getNotes(bytes32 usernameHash) public view returns (Note[] memory) {
        return UserNotes[usernameHash];
    }

    function getUsername(address wallet) public view returns (bytes32) {
        return GetLogin(getLoginAddress).getUsernameByAddress(wallet);
    }

    function setGetLoginAddress(address newAddress) public onlyOwner {
        getLoginAddress = newAddress;
    }
}
