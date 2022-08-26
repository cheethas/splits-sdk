"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
var address_1 = require("@ethersproject/address");
var bignumber_1 = require("@ethersproject/bignumber");
var constants_1 = require("@ethersproject/constants");
var graphql_request_1 = require("graphql-request");
var constants_2 = require("../constants");
var utils_1 = require("../utils");
var GQL_ENDPOINTS = {
    1: 'https://api.thegraph.com/subgraphs/name/0xsplits/splits-subgraph-ethereum',
    5: 'https://api.thegraph.com/subgraphs/name/0xsplits/splits-subgraph-goerli',
    137: 'https://api.thegraph.com/subgraphs/name/0xsplits/splits-subgraph-polygon',
    80001: 'https://api.thegraph.com/subgraphs/name/0xsplits/splits-subgraph-mumbai',
};
var TOKEN_BALANCE_FIELDS_FRAGMENT = graphql_request_1.gql(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  fragment TokenBalanceFieldsFragment on TokenBalance {\n    amount\n    token {\n      id\n    }\n  }\n"], ["\n  fragment TokenBalanceFieldsFragment on TokenBalance {\n    amount\n    token {\n      id\n    }\n  }\n"])));
var RECIPIENT_FIELDS_FRAGMENT = graphql_request_1.gql(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  fragment RecipientFieldsFragment on Recipient {\n    id\n    account {\n      id\n    }\n    split {\n      id\n    }\n    ownership\n  }\n"], ["\n  fragment RecipientFieldsFragment on Recipient {\n    id\n    account {\n      id\n    }\n    split {\n      id\n    }\n    ownership\n  }\n"])));
var SPLIT_FIELDS_FRAGMENT = graphql_request_1.gql(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  fragment SplitFieldsFragment on Split {\n    controller\n    distributorFee\n    newPotentialController\n    createdBlock\n    latestBlock\n    recipients(first: 1000, orderBy: ownership, orderDirection: desc) {\n      ...RecipientFieldsFragment\n    }\n  }\n\n  ", "\n"], ["\n  fragment SplitFieldsFragment on Split {\n    controller\n    distributorFee\n    newPotentialController\n    createdBlock\n    latestBlock\n    recipients(first: 1000, orderBy: ownership, orderDirection: desc) {\n      ...RecipientFieldsFragment\n    }\n  }\n\n  ", "\n"])), RECIPIENT_FIELDS_FRAGMENT);
var ACCOUNT_BALANCES_FRAGMENT = graphql_request_1.gql(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  fragment AccountBalancesFragment on Account {\n    internalBalances(first: 1000, orderBy: amount, orderDirection: desc) {\n      ...TokenBalanceFieldsFragment\n    }\n    withdrawals(first: 1000, orderBy: amount, orderDirection: desc) {\n      ...TokenBalanceFieldsFragment\n    }\n  }\n\n  ", "\n"], ["\n  fragment AccountBalancesFragment on Account {\n    internalBalances(first: 1000, orderBy: amount, orderDirection: desc) {\n      ...TokenBalanceFieldsFragment\n    }\n    withdrawals(first: 1000, orderBy: amount, orderDirection: desc) {\n      ...TokenBalanceFieldsFragment\n    }\n  }\n\n  ", "\n"])), TOKEN_BALANCE_FIELDS_FRAGMENT);
var ACCOUNT_FIELDS_FRAGMENT = graphql_request_1.gql(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n  fragment AccountFieldsFragment on Account {\n    id\n    upstream(first: 1000) {\n      ...RecipientFieldsFragment\n    }\n    ...AccountBalancesFragment\n  }\n\n  ", "\n  ", "\n"], ["\n  fragment AccountFieldsFragment on Account {\n    id\n    upstream(first: 1000) {\n      ...RecipientFieldsFragment\n    }\n    ...AccountBalancesFragment\n  }\n\n  ", "\n  ", "\n"])), RECIPIENT_FIELDS_FRAGMENT, ACCOUNT_BALANCES_FRAGMENT);
var FULL_SPLIT_FIELDS_FRAGMENT = graphql_request_1.gql(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n  fragment FullSplitFieldsFragment on Split {\n    ...AccountFieldsFragment\n    ...SplitFieldsFragment\n  }\n\n  ", "\n  ", "\n"], ["\n  fragment FullSplitFieldsFragment on Split {\n    ...AccountFieldsFragment\n    ...SplitFieldsFragment\n  }\n\n  ", "\n  ", "\n"])), ACCOUNT_FIELDS_FRAGMENT, SPLIT_FIELDS_FRAGMENT);
var formatRecipient = function (gqlRecipient) {
    return {
        address: address_1.getAddress(gqlRecipient.account.id),
        percentAllocation: utils_1.fromBigNumberValue(gqlRecipient.ownership),
    };
};
// Should only be called by _formatSplit on SplitsClient
exports.protectedFormatSplit = function (gqlSplit) {
    return {
        id: address_1.getAddress(gqlSplit.id),
        controller: gqlSplit.controller !== constants_1.AddressZero
            ? address_1.getAddress(gqlSplit.controller)
            : null,
        newPotentialController: gqlSplit.newPotentialController !== constants_1.AddressZero
            ? address_1.getAddress(gqlSplit.newPotentialController)
            : null,
        distributorFeePercent: utils_1.fromBigNumberValue(gqlSplit.distributorFee),
        createdBlock: gqlSplit.createdBlock,
        recipients: gqlSplit.recipients
            .map(function (gqlRecipient) { return formatRecipient(gqlRecipient); })
            .sort(function (a, b) {
            return b.percentAllocation - a.percentAllocation;
        }),
    };
};
exports.formatAccountBalances = function (gqlTokenBalances) {
    return gqlTokenBalances.reduce(function (acc, gqlTokenBalance) {
        var tokenId = address_1.getAddress(gqlTokenBalance.token.id);
        var amount = bignumber_1.BigNumber.from(gqlTokenBalance.amount);
        if (amount > constants_1.One)
            acc[tokenId] = amount;
        return acc;
    }, {});
};
exports.SPLIT_QUERY = graphql_request_1.gql(templateObject_7 || (templateObject_7 = __makeTemplateObject(["\n  query split($splitId: ID!) {\n    split(id: $splitId) {\n      ...FullSplitFieldsFragment\n    }\n  }\n\n  ", "\n"], ["\n  query split($splitId: ID!) {\n    split(id: $splitId) {\n      ...FullSplitFieldsFragment\n    }\n  }\n\n  ", "\n"])), FULL_SPLIT_FIELDS_FRAGMENT);
exports.RELATED_SPLITS_QUERY = graphql_request_1.gql(templateObject_8 || (templateObject_8 = __makeTemplateObject(["\n  query relatedSplits($accountId: String!) {\n    receivingFrom: recipients(where: { account: $accountId }) {\n      split {\n        ...FullSplitFieldsFragment\n      }\n    }\n    controlling: splits(where: { controller: $accountId }) {\n      ...FullSplitFieldsFragment\n    }\n    pendingControl: splits(where: { newPotentialController: $accountId }) {\n      ...FullSplitFieldsFragment\n    }\n  }\n\n  ", "\n"], ["\n  query relatedSplits($accountId: String!) {\n    receivingFrom: recipients(where: { account: $accountId }) {\n      split {\n        ...FullSplitFieldsFragment\n      }\n    }\n    controlling: splits(where: { controller: $accountId }) {\n      ...FullSplitFieldsFragment\n    }\n    pendingControl: splits(where: { newPotentialController: $accountId }) {\n      ...FullSplitFieldsFragment\n    }\n  }\n\n  ", "\n"])), FULL_SPLIT_FIELDS_FRAGMENT);
exports.ACCOUNT_BALANCES_QUERY = graphql_request_1.gql(templateObject_9 || (templateObject_9 = __makeTemplateObject(["\n  query accountBalances($accountId: ID!) {\n    accountBalances: account(id: $accountId) {\n      ...AccountBalancesFragment\n    }\n  }\n\n  ", "\n"], ["\n  query accountBalances($accountId: ID!) {\n    accountBalances: account(id: $accountId) {\n      ...AccountBalancesFragment\n    }\n  }\n\n  ", "\n"])), ACCOUNT_BALANCES_FRAGMENT);
exports.getGraphqlClient = function (chainId) {
    if (!constants_2.SPLITS_SUBGRAPH_CHAIN_IDS.includes(chainId))
        return;
    return new graphql_request_1.GraphQLClient(GQL_ENDPOINTS[chainId]);
};
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9;
//# sourceMappingURL=index.js.map