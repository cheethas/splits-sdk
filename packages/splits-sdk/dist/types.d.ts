import type { Provider } from '@ethersproject/abstract-provider';
import type { Signer } from '@ethersproject/abstract-signer';
import { BigNumber } from '@ethersproject/bignumber';
import type { SplitMain as SplitMainEthereumType } from './typechain/SplitMain/ethereum';
import type { SplitMain as SplitMainPolygonType } from './typechain/SplitMain/polygon';
export declare type SplitMainType = SplitMainEthereumType | SplitMainPolygonType;
export declare type SplitsClientConfig = {
    chainId: number;
    provider?: Provider;
    signer?: Signer;
    includeEnsNames?: boolean;
};
export declare type SplitRecipient = {
    address: string;
    percentAllocation: number;
    ensName?: string;
};
export declare type CreateSplitConfig = {
    recipients: SplitRecipient[];
    distributorFeePercent: number;
    controller?: string;
};
export declare type UpdateSplitConfig = {
    splitId: string;
    recipients: SplitRecipient[];
    distributorFeePercent: number;
};
export declare type DistributeTokenConfig = {
    splitId: string;
    token: string;
    distributorAddress?: string;
};
export declare type WithdrawFundsConfig = {
    address: string;
    tokens: string[];
};
export declare type InititateControlTransferConfig = {
    splitId: string;
    newController: string;
};
export declare type CancelControlTransferConfig = {
    splitId: string;
};
export declare type AcceptControlTransferConfig = {
    splitId: string;
};
export declare type MakeSplitImmutableConfig = {
    splitId: string;
};
export declare type GetSplitBalanceConfig = {
    splitId: string;
    token?: string;
};
export declare type UpdateSplitAndDistributeTokenConfig = {
    splitId: string;
    token: string;
    recipients: SplitRecipient[];
    distributorFeePercent: number;
    distributorAddress?: string;
};
export declare type TokenBalances = {
    [token: string]: BigNumber;
};
export declare type Split = {
    id: string;
    controller: string | null;
    newPotentialController: string | null;
    distributorFeePercent: number;
    recipients: SplitRecipient[];
    createdBlock: number;
};
