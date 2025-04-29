// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

// OK: 同じファイル内の上部に書いておく
interface ICurseReceiptNFT {
    function issueReceipt(address from, address to) external;
}

/// @title 貧乏神トークン（Binbougami Token）
/// @notice マイナス価値のERC20トークン。自分だけが自分にmint可能。
contract PovertyGod is ERC20 {

    constructor() ERC20("PovertyGod", "PVTG") {}
    ICurseReceiptNFT public receiptNFT;

    constructor(address _receiptNFT) {
        receiptNFT = ICurseReceiptNFT(_receiptNFT);
    }
    /// @notice 誰でも貧乏神を自分自身にだけmintできる（他人には不可）
    /// @param to ミント先アドレス（呼び出し者と一致している必要あり）
    /// @param amount ミントする量（通常は1単位）
    function mint(address to, uint256 amount) external {
        require(to == msg.sender, "You can only mint to your own address.");
        _mint(to, amount);
    }

    function curse(address to, uint256 amount) external {
    ...
    _transfer(msg.sender, to, amount);

    hasSentTo[msg.sender][to] = true;
    hasReceivedFrom[to][msg.sender] = true;

    emit Cursed(msg.sender, to, amount);

    // レシートNFT発行呼び出し
    receiptNFT.issueReceipt(msg.sender, to);
}
}
