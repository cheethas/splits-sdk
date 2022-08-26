export declare class UnsupportedChainIdError extends Error {
    name: string;
    constructor(invalidChainId: number);
}
export declare class UnsupportedSubgraphChainIdError extends Error {
    name: string;
    constructor();
}
export declare class InvalidRecipientsError extends Error {
    name: string;
    constructor(m?: string);
}
export declare class InvalidDistributorFeePercentError extends Error {
    name: string;
    constructor(m?: string);
}
export declare class InvalidArgumentError extends Error {
    name: string;
    constructor(m?: string);
}
export declare class InvalidAuthError extends Error {
    name: string;
    constructor(m?: string);
}
export declare class TransactionFailedError extends Error {
    name: string;
    constructor(m?: string);
}
export declare class MissingProviderError extends Error {
    name: string;
    constructor(m?: string);
}
export declare class FailedToEstimateGasError extends Error {
    name: string;
    constructor(m?: string);
}
export declare class MissingSignerError extends Error {
    name: string;
    constructor(m?: string);
}
export declare class InvalidConfigError extends Error {
    name: string;
    constructor(m?: string);
}
