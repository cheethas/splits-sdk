"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var abi_1 = require("@ethersproject/abi");
var IERC20_ABI = [
    'function name() view returns (string name)',
    'function symbol() view returns (string symbol)',
    'function decimals() view returns (uint8 decimals)',
    'function balanceOf(address owner) view returns (uint256)',
    'function transfer(address recipient, uint256 amount) public returns (bool)',
    'function allowance(address owner, address spender) view returns (uint256)',
    'function approve(address spender, uint256 amount) public returns (bool)',
    'event Transfer(address indexed from, address indexed to, uint amount)',
    'event Approval(address indexed owner, address indexed spender, uint256 value)',
];
exports.ierc20Interface = new abi_1.Interface(IERC20_ABI);
//# sourceMappingURL=ierc20.js.map