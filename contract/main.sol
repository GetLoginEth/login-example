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

contract Notes is owned {
    struct Note
    {
        uint64 id;
        bytes32 usernameHash;
        string text;
        bool isActive;
    }

    address public getLoginAddress = 0x9282e5434d22a1FA5f87Cda2498C877D644c334c;
    mapping(bytes32 => Note[]) public UserNotes;
    mapping(bytes32 => uint64) public UserNoteId;

    function createNote(string memory text) public {
        bytes32 usernameHash = GetLogin(getLoginAddress).getUsernameByAddress(msg.sender);
        uint64 noteId = UserNoteId[usernameHash];
        UserNotes[usernameHash][noteId] = Note({id: noteId, usernameHash: usernameHash, text: text, isActive: true});
        UserNoteId[usernameHash]++;
    }

    function getNotes(bytes32 usernameHash) public view returns (Note[] memory) {
        return UserNotes[usernameHash];
    }

    function changeGetLoginAddress(address newAddress) public onlyOwner {
       getLoginAddress = newAddress;
    }
}

abstract contract GetLogin {
    function getUsernameByAddress(address wallet) virtual public view returns (bytes32);
}
