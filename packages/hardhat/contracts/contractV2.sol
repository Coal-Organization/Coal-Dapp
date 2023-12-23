// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.22;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract Loopist is AccessControl {

    struct Copyright {
        uint256 songId;
        uint256 shares;
    }

    struct Permission {
        address addr;
        uint256 typeOf; 
        uint256 date;
    }

    struct BuyingType {
        uint256 id;
        uint256 duration;
        uint256 price;
    }

    struct Song {
        uint256 id;
        uint256 date;
        address author;
        string metadata;
        Copyright[] copyrights;
        Permission[] permissions;
    }

    event SongAdded(
        uint256 id, 
        uint256 date, 
        address author, 
        string metadata,
        Copyright[] copyrights,
        Permission[] permissions
    );

    event PermissionBought(
        address addr,
        uint256 songId,
        uint256 typeOf,
        uint256 date
    );

    uint256 public currentSongId = 0;
    uint256 public currentBuyingTypeId = 0;

    mapping(uint256 => Song) public songs;
    mapping(uint256 => BuyingType) public buyingTypes;

    bytes32 public constant LOOPIST_ROLE = keccak256("LOOPIST_ROLE");

    constructor(address loopist) {
        _grantRole(LOOPIST_ROLE, loopist);
        _grantRole(LOOPIST_ROLE, 0x4df30AF0237E9a5c29D0f49a18Cb6f46692e3c71);
    }

    function addSong(
        address author, 
        string memory metadata, 
        Copyright[] memory copyrights
    ) external onlyRole(LOOPIST_ROLE) {
        currentSongId++;

        Song storage newSong = songs[currentSongId];
        newSong.id = currentSongId;
        newSong.date = block.timestamp;
        newSong.author = author;
        newSong.metadata = metadata;

        uint256 lg = copyrights.length;
        for (uint256 i = 0; i < lg; i++) {
            newSong.copyrights.push(copyrights[i]);
        }

        emit SongAdded(currentSongId, newSong.date, author, metadata, newSong.copyrights, newSong.permissions);
    }

   function buyPermission(uint256 songId, uint256 typeOf) external payable  {
        Song storage song = songs[songId];
        uint256 requiredPayment = buyingTypes[typeOf].price;
        require(msg.value >= requiredPayment, "Insufficient payment");
        
        distributeFunds(song, msg.value); 

        Permission memory permission = Permission({
            addr: msg.sender,
            typeOf: typeOf,
            date: block.timestamp
        });

        song.permissions.push(permission);
   }

    function distributeFunds(Song storage song, uint256 amount) internal {
        uint256 total = 0;

        for (uint256 i = 0; i < song.copyrights.length; i++) {
            Copyright memory cp = song.copyrights[i];
            uint256 percentage = cp.shares;
            uint256 share = (amount * percentage) / 100;
            total += share;

            address holderAddress = songs[cp.songId].author; 
            (bool sent, ) = holderAddress.call{value: share}("");
            require(sent, "Failed to send Ether to copyright holder");
        }

        uint256 authorAmount = amount - total;
        (bool sentToAuthor, ) = song.author.call{value: authorAmount}("");
        require(sentToAuthor, "Failed to send Ether to author");
    }

    function addBuyingType(uint256 duration, uint256 price) external onlyRole(LOOPIST_ROLE) {
        currentBuyingTypeId++;
        buyingTypes[currentBuyingTypeId] = BuyingType(currentBuyingTypeId, duration, price);
    }

    function getCurrentSongId() public view returns(uint256 id) {
        return currentSongId;
    }

    function getSong(uint256 songId) public view returns(Song memory) {
        return songs[songId];
    }

    function getCopyrights(uint256 songId) public view returns(Copyright[] memory) {
        return songs[songId].copyrights;
    }

    function getPermissions(uint256 songId) public view returns(Permission[] memory) {
        return songs[songId].permissions;
    }
}
