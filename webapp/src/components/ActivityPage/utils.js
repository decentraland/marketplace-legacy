import { txUtils } from 'decentraland-eth'

export const hasEtherscanLink = tx => {
  switch (tx.status) {
    case null:
    case txUtils.TRANSACTION_TYPES.dropped:
      return false
    case txUtils.TRANSACTION_TYPES.replaced:
      return tx.replacedBy != null
    default:
      return true
  }
}

export const getHash = tx => (tx.replacedBy ? tx.replacedBy : tx.hash)
