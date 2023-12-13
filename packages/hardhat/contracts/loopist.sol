// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.21;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract Loopist is AccessControl {

    struct Song {
        uint256 id;
        uint256 date;
        address author;
        string metadata;
        Copyright[] copyrights;
        Permission[] permissions;
    }

    struct Copyright {
        uint256 songId;
        uint256 shares;
    }

    struct Permission {
        address addr;
        uint256 typeOf; 
        uint256 date;
    }

    event SongAdded(
        uint256 id, 
        uint256 date, 
        address author, 
        string metadata,
        Copyright[] copyrights,
        Permission[] permissions
    );

    uint256 public currentSongId = 0;

    mapping(uint256 => Song) public songs;

    bytes32 public constant LOOPIST_ROLE = keccak256("LOOPIST_ROLE");

    constructor(address loopist) {
        _grantRole(LOOPIST_ROLE, loopist);
        _grantRole(LOOPIST_ROLE, 0x4df30AF0237E9a5c29D0f49a18Cb6f46692e3c71);
    }
   
   function buyPermission(uint256 songId, address addr, uint256 typeOf) external {
        
        Song storage song = songs[songId];

        Permission memory permission = Permission({
            addr: addr,
            typeOf: typeOf,
            date: block.timestamp
        });

        song.permissions.push(permission);
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