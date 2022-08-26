"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var bignumber_1 = require("@ethersproject/bignumber");
exports.PERCENTAGE_SCALE = bignumber_1.BigNumber.from(1e6);
exports.SPLIT_MAIN_ADDRESS = '0x2ed6c4B5dA6378c7897AC67Ba9e43102Feb694EE';
exports.REVERSE_RECORDS_ADDRESS = '0x3671aE578E63FdF66ad4F3E12CC0c0d71Ac7510C';
exports.ETHEREUM_CHAIN_IDS = [1, 3, 4, 5, 42];
exports.POLYGON_CHAIN_IDS = [137, 80001];
exports.SPLITS_SUPPORTED_CHAIN_IDS = exports.ETHEREUM_CHAIN_IDS.concat(exports.POLYGON_CHAIN_IDS);
exports.SPLITS_SUBGRAPH_CHAIN_IDS = [1, 5, 137, 80001];
exports.SPLITS_MAX_PRECISION_DECIMALS = 4;
exports.CHAIN_INFO = {
    1: {
        startBlock: 14206768,
    },
    3: {
        startBlock: 11962375,
    },
    4: {
        startBlock: 10163325,
    },
    5: {
        startBlock: 6374540,
    },
    42: {
        startBlock: 29821123,
    },
    137: {
        startBlock: 25303316,
    },
    80001: {
        startBlock: 25258326,
    },
};
//# sourceMappingURL=constants.js.map