// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title CurseReceiptNFT - 貧乏神押し付けレシートNFT
/// @notice BinbougamiTokenとの連携で、押し付けごとに1枚のNFTレシートを発行
contract CurseReceiptNFT is ERC721Enumerable, Ownable {
    uint256 public nextTokenId;
    address public binbougamiTokenContract;

    // 押し付け実績のトラッキング（送り主 => 受信者 => true）
    mapping(address => mapping(address => bool)) public receiptIssued;

    constructor(address _binbougamiTokenContract) ERC721("Curse Receipt", "CRPT") {
        binbougamiTokenContract = _binbougamiTokenContract;
    }

    /// @notice BinbougamiTokenからのみ呼び出せるレシート発行関数
    /// @param from 押し付けたプレイヤー
    /// @param to 押し付けられたプレイヤー
    function issueReceipt(address from, address to) external {
        require(msg.sender == binbougamiTokenContract, "Only BinbougamiToken can call this");
        require(!receiptIssued[from][to], "Receipt already issued for this curse");

        _mint(from, nextTokenId);
        receiptIssued[from][to] = true;
        nextTokenId++;
    }

    function _baseURI() internal pure override returns (string memory) {
        return "https://example.com/metadata/";
    }
}
