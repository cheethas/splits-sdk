import { GraphQLClient } from 'graphql-request';
import type { Split, TokenBalances } from '../types';
import { GqlSplit, GqlTokenBalance } from './types';
export declare const protectedFormatSplit: (gqlSplit: GqlSplit) => Split;
export declare const formatAccountBalances: (gqlTokenBalances: GqlTokenBalance[]) => TokenBalances;
export declare const SPLIT_QUERY: string;
export declare const RELATED_SPLITS_QUERY: string;
export declare const ACCOUNT_BALANCES_QUERY: string;
export declare const getGraphqlClient: (chainId: number) => GraphQLClient | undefined;
