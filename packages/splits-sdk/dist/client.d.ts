import { BigNumber } from '@ethersproject/bignumber';
import { Event } from '@ethersproject/contracts';
import type { SplitsClientConfig, CreateSplitConfig, UpdateSplitConfig, DistributeTokenConfig, WithdrawFundsConfig, InititateControlTransferConfig, CancelControlTransferConfig, AcceptControlTransferConfig, MakeSplitImmutableConfig, GetSplitBalanceConfig, UpdateSplitAndDistributeTokenConfig, SplitRecipient, Split, TokenBalances } from './types';
export declare class SplitsClient {
    private readonly _chainId;
    private readonly _signer;
    private readonly _splitMain;
    private readonly _graphqlClient;
    private readonly _includeEnsNames;
    constructor({ chainId, provider, signer, includeEnsNames, }: SplitsClientConfig);
    createSplit({ recipients, distributorFeePercent, controller, }: CreateSplitConfig): Promise<{
        splitId: string;
        event: Event;
    }>;
    estimateSplitDeploymentCost({ recipients, distributorFeePercent, controller, }: CreateSplitConfig): Promise<BigNumber>;
    updateSplit({ splitId, recipients, distributorFeePercent, }: UpdateSplitConfig): Promise<{
        event: Event;
    }>;
    distributeToken({ splitId, token, distributorAddress, }: DistributeTokenConfig): Promise<{
        event: Event;
    }>;
    updateSplitAndDistributeToken({ splitId, token, recipients, distributorFeePercent, distributorAddress, }: UpdateSplitAndDistributeTokenConfig): Promise<{
        event: Event;
    }>;
    withdrawFunds({ address, tokens }: WithdrawFundsConfig): Promise<{
        event: Event;
    }>;
    initiateControlTransfer({ splitId, newController, }: InititateControlTransferConfig): Promise<{
        event: Event;
    }>;
    cancelControlTransfer({ splitId, }: CancelControlTransferConfig): Promise<{
        event: Event;
    }>;
    acceptControlTransfer({ splitId, }: AcceptControlTransferConfig): Promise<{
        event: Event;
    }>;
    makeSplitImmutable({ splitId }: MakeSplitImmutableConfig): Promise<{
        event: Event;
    }>;
    getSplitBalance({ splitId, token, }: GetSplitBalanceConfig): Promise<{
        balance: BigNumber;
    }>;
    predictImmutableSplitAddress({ recipients, distributorFeePercent, }: {
        recipients: SplitRecipient[];
        distributorFeePercent: number;
    }): Promise<{
        splitId: string;
    }>;
    getController({ splitId }: {
        splitId: string;
    }): Promise<{
        controller: string;
    }>;
    getNewPotentialController({ splitId }: {
        splitId: string;
    }): Promise<{
        newPotentialController: string;
    }>;
    getHash({ splitId }: {
        splitId: string;
    }): Promise<{
        hash: string;
    }>;
    getSplitMetadata({ splitId }: {
        splitId: string;
    }): Promise<Split>;
    getRelatedSplits({ address }: {
        address: string;
    }): Promise<{
        receivingFrom: Split[];
        controlling: Split[];
        pendingControl: Split[];
    }>;
    getSplitEarnings({ splitId, includeActiveBalances, }: {
        splitId: string;
        includeActiveBalances?: boolean;
    }): Promise<{
        activeBalances?: TokenBalances;
        distributed: TokenBalances;
    }>;
    getUserEarnings({ userId }: {
        userId: string;
    }): Promise<{
        withdrawn: TokenBalances;
        activeBalances: TokenBalances;
    }>;
    private _requireSplitMain;
    private _requireSigner;
    private _requireController;
    private _requireNewPotentialController;
    private _makeGqlRequest;
    private _formatSplit;
}
