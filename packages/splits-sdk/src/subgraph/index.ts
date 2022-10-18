import { getAddress } from '@ethersproject/address'
import { BigNumber } from '@ethersproject/bignumber'
import { AddressZero, One } from '@ethersproject/constants'
import { GraphQLClient, gql } from 'graphql-request'

import { SPLITS_SUBGRAPH_CHAIN_IDS } from '../constants'
import type { Split, SplitRecipient, TokenBalances } from '../types'
import { fromBigNumberValue } from '../utils'
import { GqlRecipient, GqlSplit, GqlTokenBalance } from './types'

const GQL_ENDPOINTS: { [chainId: number]: string } = {
  1: '/subgraphs/name/0xsplits/splits-subgraph-ethereum',
  5: '/subgraphs/name/0xsplits/splits-subgraph-goerli-testing',
  137: '/subgraphs/name/0xsplits/splits-subgraph-polygon',
  80001: '/subgraphs/name/0xsplits/splits-subgraph-mumbai',
  10: '/subgraphs/name/0xsplits/splits-subgraph-optimism',
  420: '/subgraphs/name/0xsplits/splits-subgraph-opt-goerli',
  42161: '/subgraphs/name/0xsplits/splits-subgraph-arbitrum',
  421613: '/subgraphs/name/0xsplits/splits-subgraph-arb-goerli',
}

const TOKEN_BALANCE_FIELDS_FRAGMENT = gql`
  fragment TokenBalanceFieldsFragment on TokenBalance {
    amount
    token {
      id
    }
  }
`

const RECIPIENT_FIELDS_FRAGMENT = gql`
  fragment RecipientFieldsFragment on Recipient {
    id
    account {
      id
    }
    split {
      id
    }
    ownership
  }
`

const SPLIT_FIELDS_FRAGMENT = gql`
  fragment SplitFieldsFragment on Split {
    controller
    distributorFee
    newPotentialController
    createdBlock
    latestBlock
    recipients(first: 1000, orderBy: ownership, orderDirection: desc) {
      ...RecipientFieldsFragment
    }
  }

  ${RECIPIENT_FIELDS_FRAGMENT}
`

const ACCOUNT_BALANCES_FRAGMENT = gql`
  fragment AccountBalancesFragment on Account {
    internalBalances(first: 1000, orderBy: amount, orderDirection: desc) {
      ...TokenBalanceFieldsFragment
    }
    withdrawals(first: 1000, orderBy: amount, orderDirection: desc) {
      ...TokenBalanceFieldsFragment
    }
  }

  ${TOKEN_BALANCE_FIELDS_FRAGMENT}
`

const ACCOUNT_FIELDS_FRAGMENT = gql`
  fragment AccountFieldsFragment on Account {
    id
    upstream(first: 1000) {
      ...RecipientFieldsFragment
    }
    ...AccountBalancesFragment
  }

  ${RECIPIENT_FIELDS_FRAGMENT}
  ${ACCOUNT_BALANCES_FRAGMENT}
`

const FULL_SPLIT_FIELDS_FRAGMENT = gql`
  fragment FullSplitFieldsFragment on Split {
    ...AccountFieldsFragment
    ...SplitFieldsFragment
  }

  ${ACCOUNT_FIELDS_FRAGMENT}
  ${SPLIT_FIELDS_FRAGMENT}
`

const formatRecipient = (gqlRecipient: GqlRecipient): SplitRecipient => {
  return {
    address: getAddress(gqlRecipient.account.id),
    percentAllocation: fromBigNumberValue(gqlRecipient.ownership),
  }
}

// Should only be called by _formatSplit on SplitsClient
export const protectedFormatSplit = (gqlSplit: GqlSplit): Split => {
  return {
    id: getAddress(gqlSplit.id),
    controller:
      gqlSplit.controller !== AddressZero
        ? getAddress(gqlSplit.controller)
        : null,
    newPotentialController:
      gqlSplit.newPotentialController !== AddressZero
        ? getAddress(gqlSplit.newPotentialController)
        : null,
    distributorFeePercent: fromBigNumberValue(gqlSplit.distributorFee),
    createdBlock: gqlSplit.createdBlock,
    recipients: gqlSplit.recipients
      .map((gqlRecipient) => formatRecipient(gqlRecipient))
      .sort((a, b) => {
        return b.percentAllocation - a.percentAllocation
      }),
  }
}

export const formatAccountBalances = (
  gqlTokenBalances: GqlTokenBalance[],
): TokenBalances => {
  return gqlTokenBalances.reduce((acc, gqlTokenBalance) => {
    const tokenId = getAddress(gqlTokenBalance.token.id)
    const amount = BigNumber.from(gqlTokenBalance.amount)

    if (amount > One) acc[tokenId] = amount
    return acc
  }, {} as TokenBalances)
}

//--------------------Distribution events query addition--------------//
export const DISTRIBUTION_EVENT_QUERY = gql`
  query distributionEvents($account: String, $skip: Int) {
    distributionEvents(
      orderBy: timestamp
      orderDirection: desc
      first: 200
      skip: $skip
      where: { account: $account }
    ) {
      amount
      timestamp
      account {
        id
      }
      token {
        id
      }
    }
  }
`
//--------------------Distribution events query addition--------------//

export const ALL_SPLITS_QUERY = gql`
  query allSplits($skip: Int, $startBlock: Int, $endBlock: Int) {
    splits(
      first: 200
      skip: $skip
      where: { createdBlock_gte: $startBlock, createdBlock_lte: $endBlock }
    ) {
      id
      recipients(orderBy: ownership, orderDirection: desc) {
        account {
          id
        }
        ownership
      }
      distributorFee
      controller
      createdBlock
    }
  }
`

export const SPLIT_QUERY = gql`
  query split($splitId: ID!) {
    split(id: $splitId) {
      ...FullSplitFieldsFragment
    }
  }

  ${FULL_SPLIT_FIELDS_FRAGMENT}
`

export const RELATED_SPLITS_QUERY = gql`
  query relatedSplits($accountId: String!) {
    receivingFrom: recipients(where: { account: $accountId }) {
      split {
        ...FullSplitFieldsFragment
      }
    }
    controlling: splits(where: { controller: $accountId }) {
      ...FullSplitFieldsFragment
    }
    pendingControl: splits(where: { newPotentialController: $accountId }) {
      ...FullSplitFieldsFragment
    }
  }

  ${FULL_SPLIT_FIELDS_FRAGMENT}
`

export const ACCOUNT_BALANCES_QUERY = gql`
  query accountBalances($accountId: ID!) {
    accountBalances: account(id: $accountId) {
      ...AccountBalancesFragment
    }
  }

  ${ACCOUNT_BALANCES_FRAGMENT}
`

// Allow a custom host to be provided for the subgraph if being indexed in alternative infrastructure
export const getGraphqlClient = (
  chainId: number,
  host: string,
): GraphQLClient | undefined => {
  if (!SPLITS_SUBGRAPH_CHAIN_IDS.includes(chainId)) return

  return new GraphQLClient(host + GQL_ENDPOINTS[chainId])
}
