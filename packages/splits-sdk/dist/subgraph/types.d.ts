declare type Scalars = {
    ID: string;
    String: string;
    Boolean: boolean;
    Int: number;
    Float: number;
    DateTime: string;
};
declare type GqlToken = {
    id: Scalars['ID'];
};
export declare type GqlTokenBalance = {
    id: Scalars['ID'];
    amount: Scalars['Int'];
    token: GqlToken;
    account: GqlAccount;
};
export declare type GqlAccountBalances = {
    withdrawals: GqlTokenBalance[];
    internalBalances: GqlTokenBalance[];
};
export declare type GqlRecipient = {
    id: Scalars['ID'];
    split: GqlSplit;
    account: GqlAccount;
    ownership: Scalars['Int'];
};
export declare type GqlSplit = {
    id: Scalars['ID'];
    recipients: GqlRecipient[];
    upstream?: GqlRecipient[];
    distributorFee: Scalars['Int'];
    controller: Scalars['String'];
    newPotentialController: Scalars['String'];
    createdBlock: Scalars['Int'];
};
export declare type GqlUser = {
    id: Scalars['ID'];
    upstream?: GqlRecipient[];
};
export declare type GqlAccount = GqlUser | GqlSplit;
export {};
