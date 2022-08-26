import { BigNumber } from '@ethersproject/bignumber';
export declare const PERCENTAGE_SCALE: BigNumber;
export declare const SPLIT_MAIN_ADDRESS = "0x2ed6c4B5dA6378c7897AC67Ba9e43102Feb694EE";
export declare const REVERSE_RECORDS_ADDRESS = "0x3671aE578E63FdF66ad4F3E12CC0c0d71Ac7510C";
export declare const ETHEREUM_CHAIN_IDS: number[];
export declare const POLYGON_CHAIN_IDS: number[];
export declare const SPLITS_SUPPORTED_CHAIN_IDS: number[];
export declare const SPLITS_SUBGRAPH_CHAIN_IDS: number[];
export declare const SPLITS_MAX_PRECISION_DECIMALS = 4;
export declare const CHAIN_INFO: {
    [chainId: number]: {
        startBlock: number;
    };
};
