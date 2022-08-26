"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var abi_1 = require("@ethersproject/abi");
var REVERSE_RECORDS_ABI = [
    'function getNames(address[]) view returns (string[])',
];
exports.reverseRecordsInterface = new abi_1.Interface(REVERSE_RECORDS_ABI);
//# sourceMappingURL=reverseRecords.js.map